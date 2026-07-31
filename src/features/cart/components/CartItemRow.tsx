import { Minus, Plus, Trash2 } from "lucide-react";
import type { LocalCartItem } from "@/features/cart/CartProvider";
import { formatMoney } from "@/lib/money";
import { Button } from "@/components/ui/button";

type Props = {
  item: LocalCartItem;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
};

export function CartItemRow({ item, onUpdateQuantity, onRemove }: Props) {
  const outOfStock = item.stock_quantity < 1;
  const atMax = item.quantity >= item.stock_quantity;

  return (
    <div className="flex flex-col gap-4 rounded border border-border bg-card p-4 sm:flex-row sm:items-center">
      <div className="h-24 w-24 overflow-hidden rounded bg-secondary shrink-0">
        {item.product_image ? (
          <img src={item.product_image} alt="" className="h-full w-full object-cover" />
        ) : null}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-foreground truncate">{item.product_name}</h3>
        <p className="text-sm text-muted-foreground">Size: {item.selected_options.size}</p>
        {item.selected_options.toppings && item.selected_options.toppings.length > 0 ? (
          <p className="text-sm text-muted-foreground">
            Toppings:{" "}
            {item.selected_options.toppings
              .map((topping) =>
                topping.price_cents > 0
                  ? `${topping.name} (+${formatMoney(topping.price_cents)})`
                  : topping.name,
              )
              .join(", ")}
          </p>
        ) : null}
        <p className="mt-1 font-medium tabular-nums text-accent">
          {formatMoney(item.unit_price_cents)}
        </p>
        {outOfStock ? (
          <p className="mt-1 text-sm text-destructive">Out of stock</p>
        ) : atMax ? (
          <p className="mt-1 text-sm text-accent">Maximum available quantity selected</p>
        ) : null}
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-full border border-border bg-background">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Decrease quantity"
            disabled={item.quantity <= 1}
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Increase quantity"
            disabled={atMax || outOfStock}
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <p className="w-20 text-right font-semibold">
          {formatMoney(item.unit_price_cents * item.quantity)}
        </p>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Remove item"
          onClick={() => onRemove(item.id)}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    </div>
  );
}
