import { useState } from "react";
import { formatMoney } from "@/lib/money";
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
  checkoutLabel?: string;
  showPromo?: boolean;
  showTip?: boolean;
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
  checkoutLabel,
  showPromo = true,
  showTip = true,
}: Props) {
  const [promo, setPromo] = useState("");

  return (
    <div>
      {showPromo ? (
        <div className="mb-1.5 mt-3.5 flex gap-2">
          <input
            type="text"
            value={promo}
            onChange={(event) => setPromo(event.target.value)}
            placeholder="Promo code"
            className="min-w-0 flex-1 rounded-[7px] border border-border bg-white px-3 py-2 text-[12.5px] text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
          />
          <button
            type="button"
            className="rounded-[7px] border border-foreground bg-white px-3.5 py-2 text-[12px] font-semibold text-foreground"
          >
            Apply
          </button>
        </div>
      ) : null}

      <div className="flex justify-between py-2 text-[13px]">
        <span className="text-muted-foreground">Subtotal</span>
        <span className="tabular-nums">{formatMoney(subtotalCents)}</span>
      </div>
      {shippingCents > 0 ? (
        <div className="flex justify-between py-2 text-[13px]">
          <span className="text-muted-foreground">Shipping</span>
          <span className="tabular-nums">{formatMoney(shippingCents)}</span>
        </div>
      ) : null}
      {discountCents > 0 ? (
        <div className="flex justify-between py-2 text-[13px] text-accent">
          <span>Discount</span>
          <span className="tabular-nums">-{formatMoney(discountCents)}</span>
        </div>
      ) : null}
      <div className="flex justify-between py-2 text-[13px]">
        <span className="text-muted-foreground">Tax</span>
        <span className="tabular-nums">{formatMoney(taxCents)}</span>
      </div>
      {showTip ? (
        <div className="flex justify-between py-2 text-[13px]">
          <span className="text-muted-foreground">Tip</span>
          <span>—</span>
        </div>
      ) : null}
      <div className="mt-1.5 flex justify-between border-t border-border pt-3 text-[14.5px] font-bold">
        <span>Total</span>
        <span className="tabular-nums">{formatMoney(totalCents)}</span>
      </div>

      {showCheckout ? (
        <Link
          to={checkoutHref}
          aria-disabled={disabled}
          className={`mt-2 block w-full rounded-lg bg-accent py-[15px] text-center text-[14.5px] font-semibold text-white transition-colors hover:bg-accent-hover active:bg-accent-active ${
            disabled ? "pointer-events-none opacity-45" : ""
          }`}
        >
          {checkoutLabel ?? `Continue to payment · ${formatMoney(totalCents)}`}
        </Link>
      ) : null}
    </div>
  );
}
