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
    <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Order summary</h2>
      <dl className="space-y-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Subtotal</dt>
          <dd>{formatMoney(subtotalCents)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Shipping</dt>
          <dd>{shippingCents === 0 ? "Free" : formatMoney(shippingCents)}</dd>
        </div>
        {discountCents > 0 ? (
          <div className="flex justify-between text-emerald-700">
            <dt>Discount</dt>
            <dd>-{formatMoney(discountCents)}</dd>
          </div>
        ) : null}
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Tax</dt>
          <dd>{formatMoney(taxCents)}</dd>
        </div>
        <div className="flex justify-between border-t border-border pt-3 text-base font-semibold">
          <dt>Total</dt>
          <dd>{formatMoney(totalCents)}</dd>
        </div>
      </dl>
      {showCheckout ? (
        <>
          <Button asChild className="btn-accent mt-6 w-full h-12" disabled={disabled}>
            <Link to={checkoutHref}>Proceed to checkout</Link>
          </Button>
        </>
      ) : null}
    </div>
  );
}
