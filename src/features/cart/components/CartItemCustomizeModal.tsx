import { useEffect, useMemo } from "react";
import { toast } from "sonner";
import { DrinkCustomizeModal } from "@/features/menu/components/DrinkCustomizeModal";
import { useMenuCatalog } from "@/features/menu/useMenuCatalog";
import type { LocalCartItem } from "@/features/cart/CartProvider";

type Props = {
  cartItem: LocalCartItem | null;
  onClose: () => void;
};

/** Opens the drink customize modal prefilled from a cart line for editing. */
export function CartItemCustomizeModal({ cartItem, onClose }: Props) {
  const { data: catalog, isPending } = useMenuCatalog();

  const menuItem = useMemo(() => {
    if (!cartItem || !catalog) return null;
    return (
      catalog.categories
        .flatMap((category) => category.items)
        .find((item) => item.id === cartItem.product_id) ?? null
    );
  }, [cartItem, catalog]);

  const initialSelection = useMemo(() => {
    if (!cartItem) return null;
    return {
      size: cartItem.selected_options.size,
      sweetness: cartItem.selected_options.sweetness,
      ice: cartItem.selected_options.ice,
      toppingIds: (cartItem.selected_options.toppings ?? []).map((topping) => topping.id),
      quantity: cartItem.quantity,
    };
  }, [cartItem]);

  useEffect(() => {
    if (!cartItem || isPending || !catalog || menuItem) return;
    toast.error("This drink is no longer on the menu.");
    onClose();
    // onClose is intentionally omitted — parent passes an inline setter.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartItem, catalog, isPending, menuItem]);

  if (!cartItem || !menuItem || !catalog) return null;

  return (
    <DrinkCustomizeModal
      item={menuItem}
      toppings={catalog.toppings}
      stock={catalog.stock}
      optionLevels={catalog.optionLevels}
      itemSettings={catalog.itemOptionSettings[menuItem.id] ?? null}
      allowedToppingIds={
        menuItem.id in catalog.itemToppingIds ? catalog.itemToppingIds[menuItem.id] : null
      }
      initialSelection={initialSelection}
      replaceCartItemId={cartItem.id}
      onClose={onClose}
    />
  );
}
