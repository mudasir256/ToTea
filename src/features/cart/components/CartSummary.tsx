import { formatMoney } from "@/lib/money";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

type Props = {
  subtotalCents: number;
  shippingCents: number;
  discountCents: number;
  taxCents: number;
  totalCents: number;
  checkoutHref?: string;
  showCheckout?: boolean;
  disabled?: boolean;
};

export function CartSummary({
  subtotalCents,
  shippingCents,
  discountCents,
  taxCents,
  totalCents,
  checkoutHref = "/checkout",
  showCheckout = true,
  disabled,
}: Props) {
  return (
    <div className="rounded border border-border bg-card p-6">
      <h2 className="mb-5 font-serif text-lg font-medium">Order summary</h2>
      <dl className="space-y-3 text-sm tabular-nums">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Subtotal</dt>
          <dd>{formatMoney(subtotalCents)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Shipping</dt>
          <dd>{shippingCents === 0 ? "Free" : formatMoney(shippingCents)}</dd>
        </div>
        {discountCents > 0 ? (
          <div className="flex justify-between text-accent">
            <dt>Discount</dt>
            <dd>-{formatMoney(discountCents)}</dd>
          </div>
        ) : null}
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Tax</dt>
          <dd>{formatMoney(taxCents)}</dd>
        </div>
        <div className="flex items-baseline justify-between border-t border-border pt-3.5">
          <dt className="text-base font-medium">Total</dt>
          <dd className="font-serif text-xl font-medium text-accent">
            {formatMoney(totalCents)}
          </dd>
        </div>
      </dl>
      {showCheckout ? (
        <>
          <Button asChild className="btn-accent mt-6 h-12 w-full !rounded-full" disabled={disabled}>
            <Link to={checkoutHref}>Proceed to checkout</Link>
          </Button>
        </>
      ) : null}
    </div>
  );
}
