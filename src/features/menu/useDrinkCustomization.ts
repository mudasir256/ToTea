import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { availableQuantity, fetchMenuStock } from "@/lib/menuStock";
import { getSupabase } from "@/lib/supabase";
import {
  buildCartVariantId,
  useCart,
  type CartToppingSelection,
} from "@/features/cart/CartProvider";
import type {
  MenuItemVariant,
  MenuItemWithVariants,
  MenuStockAvailability,
  MenuTopping,
} from "@/types/database";

export function variantsFor(item: MenuItemWithVariants): MenuItemVariant[] {
  const variants = [...(item.menu_item_variants ?? [])].sort(
    (left, right) => left.sort_order - right.sort_order,
  );
  if (variants.length > 0) return variants;

  return item.sizes
    .split(",")
    .map((size) => size.trim())
    .filter(Boolean)
    .map((size, index) => ({
      id: `legacy-${index}-${size}`,
      menu_item_id: item.id,
      size,
      price: item.price,
      sort_order: index,
      created_at: item.created_at,
      updated_at: item.updated_at,
    }));
}

const toSelection = (topping: MenuTopping): CartToppingSelection => ({
  id: topping.id,
  name: topping.name,
  price_cents: Math.round(Number(topping.price) * 100),
});

type AddItem = ReturnType<typeof useCart>["addItem"];

/**
 * Quick "+ Add" path: cheapest available size, no toppings.
 * Still re-checks live stock so it cannot outrun the customization flow.
 */
export async function addDefaultToCart(
  item: MenuItemWithVariants,
  addItem: AddItem,
): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) {
    toast.error("We could not confirm live stock. Please try again.");
    return;
  }

  try {
    const currentStock = await fetchMenuStock(supabase, item.id);
    const variant = variantsFor(item).find(
      (candidate) => availableQuantity(currentStock, item.id, candidate.size) > 0,
    );

    if (!variant) {
      toast.error("This drink is currently unavailable.");
      return;
    }

    await addItem({
      product_id: item.id,
      product_variant_id: buildCartVariantId(item.id, variant.size),
      product_name: item.name,
      product_image: item.image_url,
      selected_options: { size: variant.size, toppings: [] },
      unit_price_cents: Math.round(Number(variant.price) * 100),
      stock_quantity: availableQuantity(currentStock, item.id, variant.size),
      quantity: 1,
    });
  } catch (stockError) {
    console.error("Unable to confirm live menu stock", stockError);
    toast.error("We could not confirm live stock. Please try again.");
  }
}

/**
 * Size and topping selection, live pricing, and the stock-checked add-to-cart call.
 * Shared by the product page and the customization modal so both behave identically.
 * `initialStock` must be referentially stable (component state, not an inline array).
 */
export function useDrinkCustomization(
  item: MenuItemWithVariants | null,
  toppings: MenuTopping[],
  initialStock: MenuStockAvailability[],
) {
  const { addItem } = useCart();
  const [stock, setStock] = useState<MenuStockAvailability[]>(initialStock);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedToppingIds, setSelectedToppingIds] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  const variants = useMemo(() => (item ? variantsFor(item) : []), [item]);
  const sizes = useMemo(() => variants.map((variant) => variant.size), [variants]);

  const toppingGroups = useMemo(
    () =>
      [
        { title: "Standard toppings", category: "standard" as const },
        { title: "Cream toppings", category: "cream" as const },
      ]
        .map((group) => ({
          ...group,
          items: toppings.filter((topping) => topping.category === group.category),
        }))
        .filter((group) => group.items.length > 0),
    [toppings],
  );

  useEffect(() => {
    setStock(initialStock);
    setSelectedToppingIds([]);
    setQuantity(1);
    if (!item) {
      setSelectedSize("");
      return;
    }
    setSelectedSize(
      variantsFor(item)
        .map((variant) => variant.size)
        .find((size) => availableQuantity(initialStock, item.id, size) > 0) ?? "",
    );
  }, [item, initialStock]);

  const selectedToppings: CartToppingSelection[] = useMemo(
    () =>
      toppings.filter((topping) => selectedToppingIds.includes(topping.id)).map(toSelection),
    [toppings, selectedToppingIds],
  );

  const toppingsPriceCents = useMemo(
    () => selectedToppings.reduce((sum, topping) => sum + topping.price_cents, 0),
    [selectedToppings],
  );

  const selectedVariant = variants.find(
    (variant) => variant.size.toLowerCase() === selectedSize.toLowerCase(),
  );
  const basePriceCents = selectedVariant
    ? Math.round(Number(selectedVariant.price) * 100)
    : 0;
  const totalUnitPriceCents = basePriceCents + toppingsPriceCents;

  const selectedQuantity =
    item && selectedSize ? availableQuantity(stock, item.id, selectedSize) : 0;
  const hasAvailableSize = Boolean(
    item && sizes.some((size) => availableQuantity(stock, item.id, size) > 0),
  );

  const toggleTopping = (toppingId: string) => {
    setSelectedToppingIds((current) =>
      current.includes(toppingId)
        ? current.filter((id) => id !== toppingId)
        : [...current, toppingId],
    );
  };

  const priceForSize = (size: string) =>
    Math.round(Number(variants.find((variant) => variant.size === size)?.price ?? 0) * 100);

  /** Resolves true when the drink reached the cart, so callers can close a modal. */
  const addToCart = async (): Promise<boolean> => {
    if (!item || !selectedSize) {
      toast.error("This item is currently unavailable.");
      return false;
    }

    const supabase = getSupabase();
    if (!supabase) {
      toast.error("We could not confirm live stock. Please try again.");
      return false;
    }

    setAdding(true);
    try {
      const currentStock = await fetchMenuStock(supabase, item.id);
      setStock(currentStock);
      const currentQuantity = availableQuantity(currentStock, item.id, selectedSize);

      if (currentQuantity < quantity) {
        const nextAvailableSize =
          sizes.find((size) => availableQuantity(currentStock, item.id, size) > 0) ?? "";
        setSelectedSize(nextAvailableSize);
        toast.error(
          nextAvailableSize
            ? `${selectedSize} is no longer available. Choose another size.`
            : "This item is currently unavailable.",
        );
        return false;
      }

      await addItem({
        product_id: item.id,
        product_variant_id: buildCartVariantId(item.id, selectedSize, selectedToppings),
        product_name: item.name,
        product_image: item.image_url,
        selected_options: { size: selectedSize, toppings: selectedToppings },
        unit_price_cents: totalUnitPriceCents,
        stock_quantity: currentQuantity,
        quantity,
      });
      return true;
    } catch (stockError) {
      console.error("Unable to confirm live menu stock", stockError);
      toast.error("We could not confirm live stock. Please try again.");
      return false;
    } finally {
      setAdding(false);
    }
  };

  return {
    stock,
    sizes,
    selectedSize,
    setSelectedSize,
    selectedToppingIds,
    toggleTopping,
    toppingGroups,
    quantity,
    setQuantity,
    adding,
    toppingsPriceCents,
    totalUnitPriceCents,
    selectedQuantity,
    hasAvailableSize,
    priceForSize,
    addToCart,
  };
}
