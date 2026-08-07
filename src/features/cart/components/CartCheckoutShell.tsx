import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import type { LocalCartItem } from "@/features/cart/CartProvider";
import { formatMoney } from "@/lib/money";

export function CartCheckoutHeader({
  step,
}: {
  step: "cart" | "payment" | "confirmation";
}) {
  return (
    <header className="sticky top-0 z-50 flex w-full items-center justify-between border-b border-border bg-background px-5 py-4 md:px-8 md:py-[22px]">
      <Link to="/">
        <div className="font-serif text-[23px] font-semibold leading-none text-foreground">
          Totea
        </div>
        <div className="mt-[2px] text-[9.5px] uppercase tracking-[0.14em] text-muted-foreground">
          Bubble tea &amp; more
        </div>
      </Link>
      <div className="text-[12.5px] text-muted-foreground">
        {step === "cart" ? (
          <>
            <b className="text-foreground">Cart</b>
            {" → Details & Payment → Confirmation"}
          </>
        ) : step === "payment" ? (
          <>
            <Link to="/cart" className="hover:text-foreground">
              Cart
            </Link>
            {" → "}
            <b className="text-foreground">Details &amp; Payment</b>
            {" → Confirmation"}
          </>
        ) : (
          <>
            Cart → Details &amp; Payment → <b className="text-foreground">Confirmation</b>
          </>
        )}
      </div>
    </header>
  );
}

export function OrderTypePills({
  value,
  onChange,
}: {
  value: "asap" | "later";
  onChange: (value: "asap" | "later") => void;
}) {
  return (
    <section className="mb-8">
      <h2 className="mb-3.5 font-serif text-[17px] font-semibold text-foreground">
        Order type
      </h2>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange("asap")}
          className={`rounded-full border px-4 py-2.5 text-[13px] font-medium ${
            value === "asap"
              ? "border-accent bg-accent text-white"
              : "border-foreground/25 bg-transparent text-foreground"
          }`}
        >
          Pickup — ASAP (~15 min)
        </button>
        <button
          type="button"
          onClick={() => onChange("later")}
          className={`rounded-full border px-4 py-2.5 text-[13px] font-medium ${
            value === "later"
              ? "border-accent bg-accent text-white"
              : "border-foreground/25 bg-transparent text-foreground"
          }`}
        >
          Schedule for later
        </button>
      </div>
    </section>
  );
}

export function AccountPromoCard({
  mode,
  onGuest,
  signedIn,
  firstOrderEligible,
  firstOrderApplied,
  promoApplied,
}: {
  mode: "guest" | "account";
  onGuest: () => void;
  signedIn?: boolean;
  firstOrderEligible?: boolean;
  /** True when the $2 first-order discount is currently in totals (no promo code applied). */
  firstOrderApplied?: boolean;
  /** True when a promo code discount is active (hides first-order applied state). */
  promoApplied?: boolean;
}) {
  if (signedIn) {
    if (!firstOrderEligible) return null;
    if (promoApplied) {
      return (
        <div className="mb-4 rounded-xl border border-border bg-white px-[18px] py-4">
          <div className="mb-1 text-[13.5px] font-semibold text-foreground">
            $2 off your first order
          </div>
          <div className="text-[12px] leading-relaxed text-muted-foreground">
            Available when no other promo code is applied.
          </div>
        </div>
      );
    }
    return (
      <div className="mb-4 rounded-xl border border-border bg-white px-[18px] py-4">
        <div className="mb-1 text-[13.5px] font-semibold text-foreground">
          $2 off your first order
        </div>
        <div className="text-[12px] leading-relaxed text-muted-foreground">
          {firstOrderApplied
            ? "Applied to this order automatically."
            : "Will apply automatically at checkout."}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4 rounded-xl border border-border bg-white px-[18px] py-4">
      <div className="mb-1 text-[13.5px] font-semibold text-foreground">
        Create an account &amp; get $2 off this order
      </div>
      <div className="mb-3 text-[12px] leading-relaxed text-muted-foreground">
        Save your details for faster checkout next time, and start earning loyalty points.
      </div>
      <div className="flex flex-wrap gap-2.5">
        <button
          type="button"
          onClick={onGuest}
          className={`rounded-md border px-3.5 py-2 text-[12.5px] font-semibold ${
            mode === "guest"
              ? "border-foreground bg-foreground text-background"
              : "border-border bg-background text-foreground"
          }`}
        >
          Continue as guest
        </button>
        <Link
          to="/signup"
          className={`rounded-md border px-3.5 py-2 text-[12.5px] font-semibold ${
            mode === "account"
              ? "border-foreground bg-foreground text-background"
              : "border-border bg-background text-foreground"
          }`}
        >
          Create account
        </Link>
      </div>
    </div>
  );
}

export function AssignedPromoCard({
  code,
  discountLabel,
  applied,
  onApply,
}: {
  code: string;
  discountLabel: string;
  applied: boolean;
  onApply: () => void;
}) {
  return (
    <div className="mb-4 rounded-xl border border-border bg-white px-[18px] py-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-1 text-[13.5px] font-semibold text-foreground">
            {code} · {discountLabel}
          </div>
          <div className="text-[12px] leading-relaxed text-muted-foreground">
            {applied ? "Applied to this order." : "A promo assigned to your account."}
          </div>
        </div>
        <button
          type="button"
          onClick={onApply}
          disabled={applied}
          className={`shrink-0 rounded-md border px-3.5 py-2 text-[12.5px] font-semibold ${
            applied
              ? "cursor-default border-foreground bg-foreground text-background"
              : "border-border bg-background text-foreground hover:border-foreground"
          }`}
        >
          {applied ? "Applied" : "Apply"}
        </button>
      </div>
    </div>
  );
}

export function OrderSidebar({
  items,
  subtotalCents,
  discountCents = 0,
  discountLabel,
  taxCents,
  tipInput,
  onTipChange,
  totalCents,
  promo,
  onPromoChange,
  onPromoApply,
  promoError,
  onEditItem,
  onRemoveItem,
  action,
}: {
  items: LocalCartItem[];
  subtotalCents: number;
  discountCents?: number;
  discountLabel?: string | null;
  taxCents: number;
  tipInput: string;
  onTipChange: (value: string) => void;
  totalCents: number;
  promo: string;
  onPromoChange: (value: string) => void;
  onPromoApply?: () => void;
  promoError?: string | null;
  onEditItem?: (item: LocalCartItem) => void;
  onRemoveItem?: (item: LocalCartItem) => void;
  action: React.ReactNode;
}) {
  return (
    <aside className="md:pl-9">
      <h2 className="mb-3.5 font-serif text-[17px] font-semibold text-foreground">
        Your order
      </h2>

      {items.map((item) => {
        const toppings = item.selected_options.toppings ?? [];
        const meta = [
          item.selected_options.size,
          item.selected_options.sweetness,
          item.selected_options.ice,
          ...toppings.map((topping) => topping.name),
        ]
          .filter(Boolean)
          .join(" · ");

        return (
          <div key={item.id} className="flex gap-3 border-b border-border py-3">
            <div
              className="h-12 w-12 shrink-0 rounded-lg bg-cover bg-center"
              style={{
                backgroundImage: item.product_image
                  ? `url(${item.product_image})`
                  : "linear-gradient(160deg,#8fa06a,#48542f)",
              }}
            />
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-semibold text-foreground">
                {item.product_name}
              </div>
              {meta ? (
                <div className="mt-0.5 text-[11px] leading-[1.5] text-muted-foreground">
                  {meta}
                </div>
              ) : null}
              {onEditItem ? (
                <button
                  type="button"
                  onClick={() => onEditItem(item)}
                  className="mt-1 inline-block text-[11px] text-accent-hover"
                >
                  Edit
                </button>
              ) : (
                <Link to="/menu" className="mt-1 inline-block text-[11px] text-accent-hover">
                  Edit
                </Link>
              )}
            </div>
            <div className="flex shrink-0 flex-col items-end gap-2">
              <div className="text-[13px] font-semibold tabular-nums text-foreground">
                {formatMoney(item.unit_price_cents * item.quantity)}
              </div>
              {onRemoveItem ? (
                <button
                  type="button"
                  aria-label={`Remove ${item.product_name} from cart`}
                  onClick={() => onRemoveItem(item)}
                  className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 size={15} strokeWidth={1.75} />
                </button>
              ) : null}
            </div>
          </div>
        );
      })}

      <div className="mt-3.5 flex gap-2">
        <input
          type="text"
          value={promo}
          onChange={(event) => onPromoChange(event.target.value)}
          placeholder="Promo code"
          className="min-w-0 flex-1 rounded-[7px] border border-border bg-white px-3 py-2 text-[12.5px] text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              onPromoApply?.();
            }
          }}
        />
        <button
          type="button"
          onClick={() => onPromoApply?.()}
          className="rounded-[7px] border border-foreground bg-white px-3.5 py-2 text-[12px] font-semibold text-foreground"
        >
          Apply
        </button>
      </div>
      {promoError ? (
        <p className="mt-1.5 text-[12px] text-destructive">{promoError}</p>
      ) : null}

      <div className="mt-1.5 flex justify-between py-2 text-[13px]">
        <span className="text-muted-foreground">Subtotal</span>
        <span className="tabular-nums">{formatMoney(subtotalCents)}</span>
      </div>
      {discountCents > 0 ? (
        <div className="flex justify-between py-2 text-[13px]">
          <span className="text-muted-foreground">
            Discount{discountLabel ? ` (${discountLabel})` : ""}
          </span>
          <span className="tabular-nums">−{formatMoney(discountCents)}</span>
        </div>
      ) : null}
      <div className="flex justify-between py-2 text-[13px]">
        <span className="text-muted-foreground">Tax</span>
        <span className="tabular-nums">{formatMoney(taxCents)}</span>
      </div>
      <div className="flex items-center justify-between gap-3 py-2 text-[13px]">
        <label htmlFor="order-tip" className="text-muted-foreground">
          Tip
        </label>
        <div className="flex items-center gap-1.5">
          <span className="text-muted-foreground">$</span>
          <input
            id="order-tip"
            type="text"
            inputMode="decimal"
            value={tipInput}
            onChange={(event) => onTipChange(event.target.value)}
            placeholder="0.00"
            className="w-[5.5rem] rounded-[7px] border border-border bg-white px-2.5 py-1.5 text-right text-[13px] tabular-nums text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
          />
        </div>
      </div>
      <div className="mt-1.5 flex justify-between border-t border-border pt-3 text-[14.5px] font-bold">
        <span>Total</span>
        <span className="tabular-nums">{formatMoney(totalCents)}</span>
      </div>

      <div className="mt-2">{action}</div>
    </aside>
  );
}

export function Field({
  id,
  label,
  children,
  error,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-[11.5px] uppercase tracking-[0.04em] text-muted-foreground"
      >
        {label}
      </label>
      {children}
      {error ? <p className="mt-1 text-sm text-destructive">{error}</p> : null}
    </div>
  );
}

export const fieldInputClass =
  "w-full rounded-[7px] border border-border bg-white px-[13px] py-[11px] text-[13.5px] text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none";
