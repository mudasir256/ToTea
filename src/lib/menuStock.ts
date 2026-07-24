import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  Database,
  MenuStockAvailability,
} from "@/types/database";

export async function fetchMenuStock(
  supabase: SupabaseClient<Database>,
  menuItemId: string | null = null,
) {
  const { data, error } = await supabase.rpc("get_public_menu_stock", {
    p_menu_item_id: menuItemId,
  });

  if (error) throw error;
  return (data ?? []) as MenuStockAvailability[];
}

export function availableQuantity(
  stock: MenuStockAvailability[],
  menuItemId: string,
  size: string,
) {
  return (
    stock.find(
      (entry) =>
        entry.menu_item_id === menuItemId &&
        entry.size.trim().toLowerCase() === size.trim().toLowerCase(),
    )?.available_quantity ?? 0
  );
}

export function menuItemHasStock(
  stock: MenuStockAvailability[],
  menuItemId: string,
) {
  return stock.some(
    (entry) =>
      entry.menu_item_id === menuItemId &&
      entry.available_quantity > 0,
  );
}
