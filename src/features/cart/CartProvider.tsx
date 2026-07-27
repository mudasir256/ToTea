import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { calcCartSubtotal, calcOrderTotals } from "@/lib/money";
import { catalogProducts } from "@/data/catalog";
import { getMenuImage } from "@/lib/menuImages";
import { toast } from "sonner";

const LOCAL_CART_KEY = "totea-guest-cart-v1";
const MAX_ITEM_QUANTITY = 25;

export type CartToppingSelection = {
  id: string;
  name: string;
  price_cents: number;
};

export type LocalCartItem = {
  id: string;
  product_id: string;
  product_variant_id: string;
  product_name: string;
  product_image: string | null;
  selected_options: { size: string; toppings?: CartToppingSelection[] };
  quantity: number;
  unit_price_cents: number;
  stock_quantity: number;
};

/** Stable cart line key so same size + same toppings merge, different toppings do not. */
export function buildCartVariantId(
  productId: string,
  sizeLabel: string,
  toppings: CartToppingSelection[] = [],
): string {
  const sizeKey = sizeLabel.toLowerCase();
  if (toppings.length === 0) return `${productId}:${sizeKey}`;
  const toppingKey = [...toppings]
    .map((topping) => topping.id)
    .sort()
    .join(",");
  return `${productId}:${sizeKey}:toppings:${toppingKey}`;
}

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

function readLocalCart(): LocalCartItem[] {
  try {
    const raw = localStorage.getItem(LOCAL_CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as LocalCartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocalCart(items: LocalCartItem[]) {
  localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(items));
}

function makeLocalId() {
  return crypto.randomUUID();
}

function itemLimit(stockQuantity: number) {
  const normalizedStock = Number.isFinite(stockQuantity)
    ? Math.max(0, Math.floor(stockQuantity))
    : MAX_ITEM_QUANTITY;
  return Math.min(MAX_ITEM_QUANTITY, normalizedStock);
}

export function mergeItems(existing: LocalCartItem[], incoming: LocalCartItem[]): LocalCartItem[] {
  const map = new Map<string, LocalCartItem>();
  for (const item of existing) {
    map.set(item.product_variant_id, { ...item });
  }
  for (const item of incoming) {
    const current = map.get(item.product_variant_id);
    if (current) {
      const quantity = Math.min(
        itemLimit(current.stock_quantity),
        current.quantity + item.quantity
      );
      map.set(item.product_variant_id, { ...current, ...item, id: current.id, quantity });
    } else {
      map.set(item.product_variant_id, {
        ...item,
        quantity: Math.min(itemLimit(item.stock_quantity), item.quantity),
      });
    }
  }
  return Array.from(map.values());
}

/** Catalog fallback used only when Supabase has not been configured. */
export function resolveLocalVariant(productName: string, sizeLabel: string) {
  const product = catalogProducts.find((item) => item.name === productName);
  if (!product) return null;
  const variant = product.variants.find((item) => item.sizeLabel === sizeLabel);
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
  const [items, setItems] = useState<LocalCartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const persistCart = useCallback((next: LocalCartItem[]) => {
    setItems(next);
    writeLocalCart(next);
  }, []);

  const refreshCart = useCallback(async () => {
    setItems(readLocalCart());
    setLoading(false);
  }, []);

  useEffect(() => {
    void refreshCart();
  }, [refreshCart]);

  const addItem = useCallback<CartContextValue["addItem"]>(
    async (input) => {
      const quantity = Math.max(1, Math.floor(input.quantity ?? 1));
      const limit = itemLimit(input.stock_quantity);
      if (limit < 1 || quantity > limit) {
        toast.error("This quantity is not available");
        return;
      }

      const incoming: LocalCartItem = {
        id: makeLocalId(),
        ...input,
        quantity,
      };
      persistCart(mergeItems(readLocalCart(), [incoming]));
      toast.success("Added to cart");
    },
    [persistCart]
  );

  const updateQuantity = useCallback<CartContextValue["updateQuantity"]>(
    async (itemId, quantity) => {
      const item = items.find((entry) => entry.id === itemId);
      if (!item || quantity < 1) return;
      if (quantity > itemLimit(item.stock_quantity)) {
        toast.error("This quantity is not available");
        return;
      }
      persistCart(items.map((entry) => (entry.id === itemId ? { ...entry, quantity } : entry)));
    },
    [items, persistCart]
  );

  const removeItem = useCallback<CartContextValue["removeItem"]>(
    async (itemId) => {
      persistCart(items.filter((item) => item.id !== itemId));
    },
    [items, persistCart]
  );

  const clearCart = useCallback<CartContextValue["clearCart"]>(async () => {
    persistCart([]);
  }, [persistCart]);

  const totals = calcOrderTotals(calcCartSubtotal(items));
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
    [
      addItem,
      clearCart,
      itemCount,
      items,
      loading,
      refreshCart,
      removeItem,
      totals.discountCents,
      totals.shippingCents,
      totals.subtotalCents,
      totals.taxCents,
      totals.totalCents,
      updateQuantity,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
