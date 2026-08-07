import { Minus, Plus } from "lucide-react";
import type { LocalCartItem } from "@/features/cart/CartProvider";
import { formatMoney } from "@/lib/money";

type Props = {
  item: LocalCartItem;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  onEdit?: (item: LocalCartItem) => void;
  compact?: boolean;
};

function itemMeta(item: LocalCartItem) {
  const toppings = item.selected_options.toppings ?? [];
  return [
    item.selected_options.sweetness,
    item.selected_options.ice,
    ...toppings.map((topping) => topping.name),
    item.quantity > 1 ? `×${item.quantity}` : null,
  ]
    .filter(Boolean)
    .join(" · ");
}

export function CartItemRow({
  item,
  onUpdateQuantity,
  onRemove,
  onEdit,
  compact = false,
}: Props) {
  const outOfStock = item.stock_quantity < 1;
  const atMax = item.quantity >= item.stock_quantity;
  const meta = itemMeta(item);

  return (
    <div className="flex gap-3 border-b border-border py-3">
      <div
        className="h-12 w-12 shrink-0 rounded-lg bg-cover bg-center"
        style={{
          backgroundImage: item.product_image
            ? `url(${item.product_image})`
            : "linear-gradient(160deg,#8fa06a,#48542f)",
        }}
      />
      <div className="min-w-0 flex-1">
        <div className="text-[13px] font-semibold text-foreground">{item.product_name}</div>
        {meta ? (
          <div className="mt-0.5 text-[11px] leading-[1.5] text-muted-foreground">{meta}</div>
        ) : null}
        {outOfStock ? (
          <div className="mt-1 text-[11px] text-destructive">Out of stock</div>
        ) : null}

        {!compact ? (
          <div className="mt-2 flex items-center gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Decrease quantity"
                disabled={item.quantity <= 1}
                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-foreground disabled:opacity-35"
              >
                <Minus size={12} />
              </button>
              <span className="w-4 text-center text-[12.5px] font-medium tabular-nums">
                {item.quantity}
              </span>
              <button
                type="button"
                aria-label="Increase quantity"
                disabled={atMax || outOfStock}
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-foreground disabled:opacity-35"
              >
                <Plus size={12} />
              </button>
            </div>
            <button
              type="button"
              onClick={() => onRemove(item.id)}
              className="text-[11px] text-muted-foreground hover:text-destructive"
            >
              Remove
            </button>
          </div>
        ) : onEdit ? (
          <button
            type="button"
            onClick={() => onEdit(item)}
            className="mt-1 inline-block text-[11px] text-accent-hover"
          >
            Edit
          </button>
        ) : null}
      </div>
      <div className="text-[13px] font-semibold tabular-nums text-foreground">
        {formatMoney(item.unit_price_cents * item.quantity)}
      </div>
    </div>
  );
}
