import { useQuery } from "@tanstack/react-query";

import { getSupabase } from "@/lib/supabase";
import type {
  MenuCategory,
  MenuItemOptionSettings,
  MenuItemWithVariants,
  MenuOptionLevel,
  MenuStockAvailability,
  MenuTopping,
} from "@/types/database";

export type MenuCategoryWithItems = MenuCategory & {
  items: MenuItemWithVariants[];
};

export type MenuCatalog = {
  categories: MenuCategoryWithItems[];
  toppings: MenuTopping[];
  stock: MenuStockAvailability[];
  optionLevels: MenuOptionLevel[];
  itemOptionSettings: Record<string, MenuItemOptionSettings>;
  itemToppingIds: Record<string, string[]>;
};

export const MENU_CATALOG_QUERY_KEY = ["menu-catalog"] as const;

const CATEGORY_COLUMNS =
  "id, name, slug, description, sort_order, is_active, created_at, updated_at";
const ITEM_COLUMNS =
  "id, category_id, name, slug, description, image_url, price, sizes, ingredients, calories, allergens, is_available, is_bestseller, sort_order, created_at, updated_at, menu_item_variants(id, menu_item_id, size, price, sort_order, created_at, updated_at)";
const TOPPING_COLUMNS =
  "id, name, category, image_url, price, is_available, sort_order, created_at, updated_at";

export async function fetchMenuCatalog(): Promise<MenuCatalog> {
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error("The menu is temporarily unavailable.");
  }

  const [
    categoryResult,
    itemResult,
    toppingResult,
    stockResult,
    levelResult,
    settingsResult,
    itemToppingsResult,
  ] = await Promise.all([
    supabase
      .from("menu_categories")
      .select(CATEGORY_COLUMNS)
      .eq("is_active", true)
      .order("sort_order", { ascending: true }),
    supabase
      .from("menu_items")
      .select(ITEM_COLUMNS)
      .eq("is_available", true)
      .order("sort_order", { ascending: true }),
    supabase
      .from("menu_toppings")
      .select(TOPPING_COLUMNS)
      .eq("is_available", true)
      .order("sort_order", { ascending: true }),
    supabase.rpc("get_public_menu_stock", {
      p_menu_item_id: null,
    }),
    supabase
      .from("menu_option_levels")
      .select("id, kind, name, sort_order, is_default, is_active")
      .eq("is_active", true)
      .order("sort_order", { ascending: true }),
    supabase
      .from("menu_item_option_settings")
      .select(
        "menu_item_id, sugar_enabled, ice_enabled, standard_toppings_enabled, cream_toppings_enabled, default_sugar_level_id, default_ice_level_id, included_cream_topping_id, included_standard_topping_id",
      ),
    supabase.from("menu_item_toppings").select("menu_item_id, topping_id"),
  ]);

  if (
    categoryResult.error ||
    itemResult.error ||
    toppingResult.error ||
    stockResult.error
  ) {
    console.error(
      categoryResult.error ?? itemResult.error ?? toppingResult.error ?? stockResult.error,
    );
    throw new Error("We could not load the menu. Please try again.");
  }

  if (levelResult.error) {
    console.error("Unable to load sugar/ice levels", levelResult.error);
  }
  if (settingsResult.error) {
    console.error("Unable to load item option settings", settingsResult.error);
  }
  if (itemToppingsResult.error) {
    console.error("Unable to load item topping links", itemToppingsResult.error);
  }

  const items = (itemResult.data ?? []) as MenuItemWithVariants[];
  const categories = ((categoryResult.data ?? []) as MenuCategory[])
    .map((category) => ({
      ...category,
      items: items.filter((item) => item.category_id === category.id),
    }))
    .filter((category) => category.items.length > 0);

  const itemOptionSettings: Record<string, MenuItemOptionSettings> = {};
  for (const row of (settingsResult.data ?? []) as MenuItemOptionSettings[]) {
    itemOptionSettings[row.menu_item_id] = row;
  }

  const itemToppingIds: Record<string, string[]> = {};
  for (const row of (itemToppingsResult.data ?? []) as Array<{
    menu_item_id: string;
    topping_id: string;
  }>) {
    (itemToppingIds[row.menu_item_id] ??= []).push(row.topping_id);
  }

  return {
    categories,
    toppings: (toppingResult.data ?? []) as MenuTopping[],
    stock: (stockResult.data ?? []) as MenuStockAvailability[],
    optionLevels: (levelResult.data ?? []) as MenuOptionLevel[],
    itemOptionSettings,
    itemToppingIds,
  };
}

/** Shared menu catalog — cached so leaving/returning to /menu does not re-hit Supabase. */
export function useMenuCatalog() {
  return useQuery({
    queryKey: MENU_CATALOG_QUERY_KEY,
    queryFn: fetchMenuCatalog,
    staleTime: 5 * 60_000,
    gcTime: 30 * 60_000,
  });
}
