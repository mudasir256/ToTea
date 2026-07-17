import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/features/auth/AuthProvider";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { calcCartSubtotal, calcOrderTotals } from "@/lib/money";
import { catalogProducts } from "@/data/catalog";
import { getMenuImage } from "@/lib/menuImages";
import { toast } from "sonner";

const GUEST_CART_KEY = "totea-guest-cart-v1";

export type LocalCartItem = {
  id: string;
  product_id: string;
  product_variant_id: string;
  product_name: string;
  product_image: string | null;
  selected_options: { size: string };
  quantity: number;
  unit_price_cents: number;
  stock_quantity: number;
};

type CartContextValue = {
  items: LocalCartItem[];
  itemCount: number;
  subtotalCents: number;
  shippingCents: number;
  discountCents: number;
  taxCents: number;
  totalCents: number;
  loading: boolean;
  addItem: (input: Omit<LocalCartItem, "id" | "quantity"> & { quantity?: number }) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

function readGuestCart(): LocalCartItem[] {
  try {
    const raw = localStorage.getItem(GUEST_CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as LocalCartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeGuestCart(items: LocalCartItem[]) {
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
}

function makeLocalId() {
  return crypto.randomUUID();
}

function mergeItems(existing: LocalCartItem[], incoming: LocalCartItem[]): LocalCartItem[] {
  const map = new Map<string, LocalCartItem>();
  for (const item of existing) {
    map.set(item.product_variant_id, { ...item });
  }
  for (const item of incoming) {
    const current = map.get(item.product_variant_id);
    if (current) {
      const quantity = Math.min(current.stock_quantity, current.quantity + item.quantity);
      map.set(item.product_variant_id, { ...current, quantity });
    } else {
      map.set(item.product_variant_id, item);
    }
  }
  return Array.from(map.values());
}

/** Resolve local/demo product + variant identifiers for catalog fallback mode. */
export function resolveLocalVariant(productName: string, sizeLabel: string) {
  const product = catalogProducts.find((p) => p.name === productName);
  if (!product) return null;
  const variant = product.variants.find((v) => v.sizeLabel === sizeLabel);
  if (!variant) return null;
  return {
    product_id: `local:${product.slug}`,
    product_variant_id: `local:${product.slug}:${sizeLabel.toLowerCase()}`,
    product_name: product.name,
    product_image: getMenuImage(product.name) ?? null,
    selected_options: { size: sizeLabel },
    unit_price_cents: variant.unitPriceCents,
    stock_quantity: variant.stockQuantity,
  };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<LocalCartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshCart = useCallback(async () => {
    if (!user || !isSupabaseConfigured) {
      setItems(readGuestCart());
      setLoading(false);
      return;
    }

    const supabase = getSupabase();
    if (!supabase) {
      setItems(readGuestCart());
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data: cart, error: cartError } = await supabase
      .from("carts")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (cartError || !cart) {
      console.error(cartError);
      setItems([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("cart_items")
      .select("*, product_variants(stock_quantity)")
      .eq("cart_id", cart.id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error(error);
      setItems([]);
      setLoading(false);
      return;
    }

    const mapped: LocalCartItem[] = (data ?? []).map((row: Record<string, unknown>) => {
      const variant = row.product_variants as { stock_quantity?: number } | null;
      return {
        id: row.id as string,
        product_id: row.product_id as string,
        product_variant_id: row.product_variant_id as string,
        product_name: row.product_name as string,
        product_image: (row.product_image as string | null) ?? null,
        selected_options: (row.selected_options as { size: string }) ?? { size: "Regular" },
        quantity: row.quantity as number,
        unit_price_cents: row.unit_price_cents as number,
        stock_quantity: variant?.stock_quantity ?? 100,
      };
    });

    setItems(mapped);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    void refreshCart();
  }, [refreshCart]);

  // Merge guest cart into user cart after login
  useEffect(() => {
    const mergeGuest = async () => {
      if (!user || !isSupabaseConfigured) return;
      const guest = readGuestCart();
      if (guest.length === 0) return;

      const supabase = getSupabase();
      if (!supabase) return;

      const { data: cart } = await supabase
        .from("carts")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();
      if (!cart) return;

      for (const item of guest) {
        let productId = item.product_id;
        let variantId = item.product_variant_id;
        let unitPrice = item.unit_price_cents;
        let stock = item.stock_quantity;
        let productName = item.product_name;
        let productImage = item.product_image;
        let size = item.selected_options.size;

        if (variantId.startsWith("local:")) {
          // local:slug:regular → resolve against seeded catalog
          const { data: dbProduct } = await supabase
            .from("products")
            .select("id, name, image_url, product_variants(id, size_label, unit_price_cents, stock_quantity, is_active)")
            .eq("name", productName)
            .maybeSingle();
          const variants = (dbProduct?.product_variants || []) as Array<{
            id: string;
            size_label: string;
            unit_price_cents: number;
            stock_quantity: number;
            is_active: boolean;
          }>;
          const match = variants.find((v) => v.size_label === size && v.is_active);
          if (!dbProduct || !match) continue;
          productId = dbProduct.id as string;
          variantId = match.id;
          unitPrice = match.unit_price_cents;
          stock = match.stock_quantity;
          productName = dbProduct.name as string;
          productImage = (dbProduct.image_url as string | null) || productImage;
        }

        const { data: existing } = await supabase
          .from("cart_items")
          .select("id, quantity")
          .eq("cart_id", cart.id)
          .eq("product_variant_id", variantId)
          .maybeSingle();

        if (existing) {
          await supabase
            .from("cart_items")
            .update({
              quantity: Math.min(stock, (existing.quantity as number) + item.quantity),
              unit_price_cents: unitPrice,
            })
            .eq("id", existing.id);
        } else {
          await supabase.from("cart_items").insert({
            cart_id: cart.id,
            product_id: productId,
            product_variant_id: variantId,
            product_name: productName,
            product_image: productImage,
            selected_options: { size },
            quantity: Math.min(stock, item.quantity),
            unit_price_cents: unitPrice,
          });
        }
      }

      writeGuestCart([]);
      await refreshCart();
      toast.success("Your cart was restored");
    };

    void mergeGuest();
  }, [user, refreshCart]);

  const persistGuest = (next: LocalCartItem[]) => {
    setItems(next);
    writeGuestCart(next);
  };

  const addItem: CartContextValue["addItem"] = async (input) => {
    const quantity = Math.max(1, input.quantity ?? 1);
    if (quantity > input.stock_quantity) {
      toast.error("Not enough stock available");
      return;
    }

    if (!user || !isSupabaseConfigured || input.product_variant_id.startsWith("local:")) {
      const current = readGuestCart();
      const existing = current.find((i) => i.product_variant_id === input.product_variant_id);
      if (existing) {
        const nextQty = Math.min(input.stock_quantity, existing.quantity + quantity);
        persistGuest(
          current.map((i) =>
            i.product_variant_id === input.product_variant_id
              ? { ...i, quantity: nextQty, unit_price_cents: input.unit_price_cents, stock_quantity: input.stock_quantity }
              : i
          )
        );
      } else {
        persistGuest([
          ...current,
          {
            id: makeLocalId(),
            ...input,
            quantity,
          },
        ]);
      }
      toast.success("Added to cart");
      return;
    }

    const supabase = getSupabase();
    if (!supabase) return;
    const { data: cart } = await supabase.from("carts").select("id").eq("user_id", user.id).maybeSingle();
    if (!cart) {
      toast.error("Could not find your cart");
      return;
    }

    const { data: existing } = await supabase
      .from("cart_items")
      .select("id, quantity")
      .eq("cart_id", cart.id)
      .eq("product_variant_id", input.product_variant_id)
      .maybeSingle();

    if (existing) {
      const nextQty = Math.min(input.stock_quantity, (existing.quantity as number) + quantity);
      const { error } = await supabase
        .from("cart_items")
        .update({ quantity: nextQty, unit_price_cents: input.unit_price_cents })
        .eq("id", existing.id);
      if (error) {
        toast.error(error.message);
        return;
      }
    } else {
      const { error } = await supabase.from("cart_items").insert({
        cart_id: cart.id,
        product_id: input.product_id,
        product_variant_id: input.product_variant_id,
        product_name: input.product_name,
        product_image: input.product_image,
        selected_options: input.selected_options,
        quantity,
        unit_price_cents: input.unit_price_cents,
      });
      if (error) {
        toast.error(error.message);
        return;
      }
    }

    await refreshCart();
    toast.success("Added to cart");
  };

  const updateQuantity: CartContextValue["updateQuantity"] = async (itemId, quantity) => {
    if (quantity < 1) return;
    const item = items.find((i) => i.id === itemId);
    if (!item) return;
    if (quantity > item.stock_quantity) {
      toast.error("Not enough stock available");
      return;
    }

    if (!user || !isSupabaseConfigured || item.product_variant_id.startsWith("local:")) {
      persistGuest(items.map((i) => (i.id === itemId ? { ...i, quantity } : i)));
      return;
    }

    const supabase = getSupabase();
    if (!supabase) return;
    const { error } = await supabase.from("cart_items").update({ quantity }).eq("id", itemId);
    if (error) {
      toast.error(error.message);
      return;
    }
    await refreshCart();
  };

  const removeItem: CartContextValue["removeItem"] = async (itemId) => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;

    if (!user || !isSupabaseConfigured || item.product_variant_id.startsWith("local:")) {
      persistGuest(items.filter((i) => i.id !== itemId));
      return;
    }

    const supabase = getSupabase();
    if (!supabase) return;
    const { error } = await supabase.from("cart_items").delete().eq("id", itemId);
    if (error) {
      toast.error(error.message);
      return;
    }
    await refreshCart();
  };

  const clearCart: CartContextValue["clearCart"] = async () => {
    if (!user || !isSupabaseConfigured || items.some((i) => i.product_variant_id.startsWith("local:"))) {
      persistGuest([]);
      return;
    }
    const supabase = getSupabase();
    if (!supabase) return;
    const { data: cart } = await supabase.from("carts").select("id").eq("user_id", user.id).maybeSingle();
    if (!cart) return;
    await supabase.from("cart_items").delete().eq("cart_id", cart.id);
    await refreshCart();
  };

  const subtotalCents = calcCartSubtotal(items);
  const totals = calcOrderTotals(subtotalCents);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const value = useMemo(
    () => ({
      items,
      itemCount,
      subtotalCents: totals.subtotalCents,
      shippingCents: totals.shippingCents,
      discountCents: totals.discountCents,
      taxCents: totals.taxCents,
      totalCents: totals.totalCents,
      loading,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      refreshCart,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items, loading, totals.subtotalCents, totals.totalCents, user]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export { mergeItems };
