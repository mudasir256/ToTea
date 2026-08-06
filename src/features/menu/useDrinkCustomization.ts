import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { availableQuantity, fetchMenuStock } from "@/lib/menuStock";
import { getSupabase } from "@/lib/supabase";
import {
  buildCartVariantId,
  useCart,
  type CartToppingSelection,
} from "@/features/cart/CartProvider";
import {
  DEFAULT_ICE,
  DEFAULT_SWEETNESS,
  defaultLevelName,
  drinkIncludesFreeTopping,
  iceLevelNames,
  MAX_STANDARD_TOPPINGS_DEFAULT,
  MAX_STANDARD_TOPPINGS_MILK_TEA,
  sugarLevelNames,
} from "@/features/menu/drinkOptions";
import type {
  MenuItemOptionSettings,
  MenuItemVariant,
  MenuItemWithVariants,
  MenuOptionLevel,
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

function defaultsForItem(
  item: MenuItemWithVariants,
  optionLevels: MenuOptionLevel[],
  itemSettings?: MenuItemOptionSettings | null,
) {
  return {
    sweetness: defaultLevelName(
      optionLevels,
      "sugar",
      itemSettings?.default_sugar_level_id,
    ),
    ice: defaultLevelName(optionLevels, "ice", itemSettings?.default_ice_level_id),
  };
}

/**
 * Quick "+ Add" path: cheapest available size, default sweetness/ice, no toppings.
 */
export async function addDefaultToCart(
  item: MenuItemWithVariants,
  addItem: AddItem,
  optionLevels: MenuOptionLevel[] = [],
  itemSettings?: MenuItemOptionSettings | null,
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

    const defaults = defaultsForItem(item, optionLevels, itemSettings);

    await addItem({
      product_id: item.id,
      product_variant_id: buildCartVariantId(item.id, variant.size, [], defaults),
      product_name: item.name,
      product_image: item.image_url,
      selected_options: {
        size: variant.size,
        sweetness: defaults.sweetness,
        ice: defaults.ice,
        toppings: [],
      },
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
 * Size, sweetness, ice, and topping selection with live pricing + stock check.
 */
export function useDrinkCustomization(
  item: MenuItemWithVariants | null,
  toppings: MenuTopping[],
  initialStock: MenuStockAvailability[],
  optionLevels: MenuOptionLevel[] = [],
  itemSettings?: MenuItemOptionSettings | null,
) {
  const { addItem } = useCart();
  const [stock, setStock] = useState<MenuStockAvailability[]>(initialStock);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedSweetness, setSelectedSweetness] = useState(DEFAULT_SWEETNESS);
  const [selectedIce, setSelectedIce] = useState(DEFAULT_ICE);
  const [selectedCreamId, setSelectedCreamId] = useState<string | null>(null);
  const [selectedStandardIds, setSelectedStandardIds] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  const variants = useMemo(() => (item ? variantsFor(item) : []), [item]);
  const sizes = useMemo(() => variants.map((variant) => variant.size), [variants]);
  const sugarLevels = useMemo(() => sugarLevelNames(optionLevels), [optionLevels]);
  const iceLevels = useMemo(() => iceLevelNames(optionLevels), [optionLevels]);

  const creamToppings = useMemo(
    () =>
      itemSettings?.cream_toppings_enabled === false
        ? []
        : toppings.filter((topping) => topping.category === "cream"),
    [toppings, itemSettings?.cream_toppings_enabled],
  );
  const standardToppings = useMemo(
    () =>
      itemSettings?.standard_toppings_enabled === false
        ? []
        : toppings.filter((topping) => topping.category === "standard"),
    [toppings, itemSettings?.standard_toppings_enabled],
  );

  const toppingGroups = useMemo(
    () =>
      [
        { title: "Standard toppings", category: "standard" as const, items: standardToppings },
        { title: "Cream toppings", category: "cream" as const, items: creamToppings },
      ].filter((group) => group.items.length > 0),
    [standardToppings, creamToppings],
  );

  useEffect(() => {
    setStock(initialStock);
    setSelectedCreamId(null);
    setSelectedStandardIds([]);
    setQuantity(1);
    if (!item) {
      setSelectedSize("");
      setSelectedSweetness(DEFAULT_SWEETNESS);
      setSelectedIce(DEFAULT_ICE);
      return;
    }
    const defaults = defaultsForItem(item, optionLevels, itemSettings);
    setSelectedSweetness(defaults.sweetness);
    setSelectedIce(defaults.ice);
    setSelectedSize(
      variantsFor(item)
        .map((variant) => variant.size)
        .find((size) => availableQuantity(initialStock, item.id, size) > 0) ?? "",
    );
  }, [item, initialStock, optionLevels, itemSettings]);

  const includesFreeTopping = Boolean(item && drinkIncludesFreeTopping(item.name));
  const maxStandardToppings = includesFreeTopping
    ? MAX_STANDARD_TOPPINGS_MILK_TEA
    : MAX_STANDARD_TOPPINGS_DEFAULT;
  /** First selected standard topping is free on milk tea. */
  const freeStandardToppingId = includesFreeTopping
    ? (selectedStandardIds[0] ?? null)
    : null;

  const selectedToppings: CartToppingSelection[] = useMemo(() => {
    const cream = creamToppings.find((topping) => topping.id === selectedCreamId);
    const standards = standardToppings.filter((topping) =>
      selectedStandardIds.includes(topping.id),
    );
    return [...(cream ? [cream] : []), ...standards].map((topping) => {
      const selection = toSelection(topping);
      if (topping.id === freeStandardToppingId) {
        return { ...selection, price_cents: 0 };
      }
      return selection;
    });
  }, [
    creamToppings,
    standardToppings,
    selectedCreamId,
    selectedStandardIds,
    freeStandardToppingId,
  ]);

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

  const toggleStandardTopping = (toppingId: string) => {
    setSelectedStandardIds((current) => {
      if (current.includes(toppingId)) {
        return current.filter((id) => id !== toppingId);
      }
      if (current.length >= maxStandardToppings) {
        toast.error(
          includesFreeTopping
            ? "You can add up to 2 toppings beyond the 1 included free."
            : `Choose up to ${maxStandardToppings} toppings.`,
        );
        return current;
      }
      return [...current, toppingId];
    });
  };

  /** Cream tops are single-select (None or one cream). */
  const selectCream = (toppingId: string | null) => {
    setSelectedCreamId(toppingId);
  };

  /** Back-compat for ProductDetail which still calls toggleTopping. */
  const toggleTopping = (toppingId: string) => {
    const cream = creamToppings.find((topping) => topping.id === toppingId);
    if (cream) {
      setSelectedCreamId((current) => (current === toppingId ? null : toppingId));
      return;
    }
    toggleStandardTopping(toppingId);
  };

  const selectedToppingIds = useMemo(
    () => [
      ...(selectedCreamId ? [selectedCreamId] : []),
      ...selectedStandardIds,
    ],
    [selectedCreamId, selectedStandardIds],
  );

  const priceForSize = (size: string) =>
    Math.round(Number(variants.find((variant) => variant.size === size)?.price ?? 0) * 100);

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
        product_variant_id: buildCartVariantId(item.id, selectedSize, selectedToppings, {
          sweetness: selectedSweetness,
          ice: selectedIce,
        }),
        product_name: item.name,
        product_image: item.image_url,
        selected_options: {
          size: selectedSize,
          sweetness: selectedSweetness,
          ice: selectedIce,
          toppings: selectedToppings,
        },
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
    sugarLevels,
    iceLevels,
    selectedSize,
    setSelectedSize,
    selectedSweetness,
    setSelectedSweetness,
    selectedIce,
    setSelectedIce,
    selectedCreamId,
    selectCream,
    selectedStandardIds,
    toggleStandardTopping,
    selectedToppingIds,
    toggleTopping,
    creamToppings,
    standardToppings,
    toppingGroups,
    includesFreeTopping,
    freeStandardToppingId,
    maxStandardToppings,
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
