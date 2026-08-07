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
  isToppingSectionEnabled,
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
  /** Per-item topping ids from admin. `null` = no restriction; `[]` = none allowed. */
  allowedToppingIds: string[] | null = null,
) {
  const { addItem } = useCart();
  const [stock, setStock] = useState<MenuStockAvailability[]>(initialStock);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedSweetness, setSelectedSweetness] = useState(DEFAULT_SWEETNESS);
  const [selectedIce, setSelectedIce] = useState(DEFAULT_ICE);
  const [selectedCreamIds, setSelectedCreamIds] = useState<string[]>([]);
  const [selectedStandardIds, setSelectedStandardIds] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  const variants = useMemo(() => (item ? variantsFor(item) : []), [item]);
  const sizes = useMemo(() => variants.map((variant) => variant.size), [variants]);
  const sugarLevels = useMemo(() => sugarLevelNames(optionLevels), [optionLevels]);
  const iceLevels = useMemo(() => iceLevelNames(optionLevels), [optionLevels]);

  const allowedToppingIdSet = useMemo(
    () => (allowedToppingIds ? new Set(allowedToppingIds) : null),
    [allowedToppingIds],
  );

  const creamToppings = useMemo(() => {
    if (!isToppingSectionEnabled(itemSettings, "cream")) return [];
    return toppings.filter((topping) => {
      if (topping.category !== "cream") return false;
      if (allowedToppingIdSet && !allowedToppingIdSet.has(topping.id)) return false;
      return true;
    });
  }, [toppings, itemSettings, allowedToppingIdSet]);

  const standardToppings = useMemo(() => {
    if (!isToppingSectionEnabled(itemSettings, "standard")) return [];
    return toppings.filter((topping) => {
      if (topping.category !== "standard") return false;
      if (allowedToppingIdSet && !allowedToppingIdSet.has(topping.id)) return false;
      return true;
    });
  }, [toppings, itemSettings, allowedToppingIdSet]);

  const toppingGroups = useMemo(
    () =>
      [
        { title: "Standard toppings", category: "standard" as const, items: standardToppings },
        { title: "Cream toppings", category: "cream" as const, items: creamToppings },
      ].filter((group) => group.items.length > 0),
    [standardToppings, creamToppings],
  );

  const includedCreamToppingId = itemSettings?.included_cream_topping_id ?? null;
  const includedCreamTopping = useMemo(
    () => creamToppings.find((topping) => topping.id === includedCreamToppingId) ?? null,
    [creamToppings, includedCreamToppingId],
  );
  const includedStandardToppingId = itemSettings?.included_standard_topping_id ?? null;
  const includedStandardTopping = useMemo(
    () => standardToppings.find((topping) => topping.id === includedStandardToppingId) ?? null,
    [standardToppings, includedStandardToppingId],
  );
  /** Included cream + one paid cream, or a single paid cream when none is included. */
  const maxCreamToppings = includedCreamToppingId ? 2 : 1;

  useEffect(() => {
    setStock(initialStock);
    setQuantity(1);
    if (!item) {
      setSelectedCreamIds([]);
      setSelectedStandardIds([]);
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
    const includedCreamId = itemSettings?.included_cream_topping_id ?? null;
    const creamAllowed =
      includedCreamId &&
      (!allowedToppingIdSet || allowedToppingIdSet.has(includedCreamId)) &&
      toppings.some((topping) => topping.id === includedCreamId && topping.category === "cream");
    setSelectedCreamIds(creamAllowed && includedCreamId ? [includedCreamId] : []);

    const includedStandardId = itemSettings?.included_standard_topping_id ?? null;
    const standardAllowed =
      includedStandardId &&
      (!allowedToppingIdSet || allowedToppingIdSet.has(includedStandardId)) &&
      toppings.some(
        (topping) => topping.id === includedStandardId && topping.category === "standard",
      );
    setSelectedStandardIds(
      standardAllowed && includedStandardId ? [includedStandardId] : [],
    );
  }, [item, initialStock, optionLevels, itemSettings, allowedToppingIdSet, toppings]);

  const includesFreeTopping = Boolean(
    includedStandardToppingId || (item && drinkIncludesFreeTopping(item.name)),
  );
  const maxStandardToppings = includesFreeTopping
    ? MAX_STANDARD_TOPPINGS_MILK_TEA
    : MAX_STANDARD_TOPPINGS_DEFAULT;
  /** Admin-included standard topping, else first selected free on milk tea. */
  const freeStandardToppingId = includedStandardToppingId
    ? includedStandardToppingId
    : includesFreeTopping
      ? (selectedStandardIds[0] ?? null)
      : null;

  const selectedToppings: CartToppingSelection[] = useMemo(() => {
    const creams = creamToppings.filter((topping) => selectedCreamIds.includes(topping.id));
    const standards = standardToppings.filter((topping) =>
      selectedStandardIds.includes(topping.id),
    );
    return [...creams, ...standards].map((topping) => {
      const selection = toSelection(topping);
      if (
        topping.id === freeStandardToppingId ||
        topping.id === includedCreamToppingId ||
        topping.id === includedStandardToppingId
      ) {
        return { ...selection, price_cents: 0 };
      }
      return selection;
    });
  }, [
    creamToppings,
    standardToppings,
    selectedCreamIds,
    selectedStandardIds,
    freeStandardToppingId,
    includedCreamToppingId,
    includedStandardToppingId,
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

  const clearCream = () => setSelectedCreamIds([]);

  const toggleCream = (toppingId: string) => {
    setSelectedCreamIds((current) => {
      if (current.includes(toppingId)) {
        return current.filter((id) => id !== toppingId);
      }
      if (current.length >= maxCreamToppings) {
        toast.error(
          includedCreamTopping
            ? `Choose up to 2 creams. ${includedCreamTopping.name} comes with this drink — add one more, swap it, or remove it.`
            : "Choose up to 1 cream top.",
        );
        return current;
      }
      return [...current, toppingId];
    });
  };

  /** Back-compat for ProductDetail which still calls toggleTopping. */
  const toggleTopping = (toppingId: string) => {
    const cream = creamToppings.find((topping) => topping.id === toppingId);
    if (cream) {
      toggleCream(toppingId);
      return;
    }
    toggleStandardTopping(toppingId);
  };

  const selectedToppingIds = useMemo(
    () => [...selectedCreamIds, ...selectedStandardIds],
    [selectedCreamIds, selectedStandardIds],
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
    selectedCreamIds,
    toggleCream,
    clearCream,
    includedCreamToppingId,
    includedCreamTopping,
    includedStandardToppingId,
    includedStandardTopping,
    maxCreamToppings,
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
