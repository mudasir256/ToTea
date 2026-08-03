import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/features/cart/CartProvider";
import {
  AccountPromoCard,
  CartCheckoutHeader,
  Field,
  OrderSidebar,
  OrderTypePills,
  fieldInputClass,
} from "@/features/cart/components/CartCheckoutShell";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/money";

export default function CartPage() {
  const { items, loading, subtotalCents, taxCents, totalCents } = useCart();
  const [orderType, setOrderType] = useState<"asap" | "later">("asap");
  const [accountMode, setAccountMode] = useState<"guest" | "account">("guest");
  const [promo, setPromo] = useState("");
  const [marketingOptIn, setMarketingOptIn] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <CartCheckoutHeader step="payment" />
        <div className="py-20">
          <LoadingSpinner label="Loading cart..." />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <CartCheckoutHeader step="cart" />
        <main className="mx-auto max-w-[1100px] px-5 py-16 md:px-8">
          <EmptyState
            title="Your cart is empty"
            description="Browse the menu and add your favorite drinks."
            action={
              <Button asChild className="btn-accent">
                <Link to="/menu">Continue shopping</Link>
              </Button>
            }
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <CartCheckoutHeader step="payment" />

      <main className="mx-auto max-w-[1100px] px-5 py-9 md:px-8 md:py-9">
        <div className="grid gap-8 md:grid-cols-[1fr_380px] md:gap-0">
          <div className="md:border-r md:border-border md:pr-11">
            <OrderTypePills value={orderType} onChange={setOrderType} />

            <section className="mb-8">
              <h2 className="mb-3.5 font-serif text-[17px] font-semibold text-foreground">
                Your details
              </h2>
              <AccountPromoCard
                mode={accountMode}
                onGuest={() => setAccountMode("guest")}
              />

              <div className="grid gap-3 sm:grid-cols-2">
                <Field id="first_name" label="First name">
                  <input
                    id="first_name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Jane"
                    className={fieldInputClass}
                  />
                </Field>
                <Field id="last_name" label="Last name">
                  <input
                    id="last_name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    className={fieldInputClass}
                  />
                </Field>
                <Field id="phone" label="Phone number">
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(555) 123-4567"
                    className={fieldInputClass}
                  />
                </Field>
                <Field id="email" label="Email">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@email.com"
                    className={fieldInputClass}
                  />
                </Field>
              </div>

              <div className="mt-2.5 flex gap-2.5 rounded-lg border border-border bg-white px-3.5 py-3">
                <input
                  type="checkbox"
                  id="marketing-opt-in"
                  checked={marketingOptIn}
                  onChange={(e) => setMarketingOptIn(e.target.checked)}
                  className="mt-0.5 h-[17px] w-[17px] shrink-0 rounded-[4px] accent-[hsl(var(--accent))]"
                />
                <label
                  htmlFor="marketing-opt-in"
                  className="text-[11.5px] leading-[1.6] text-muted-foreground"
                >
                  Send me order updates and promo offers by text &amp; email. Msg &amp; data
                  rates may apply. Reply STOP to unsubscribe anytime. This is how we&apos;ll
                  notify you about new drinks and seasonal deals.
                </label>
              </div>
            </section>

            <section className="mb-2">
              <h2 className="mb-3.5 font-serif text-[17px] font-semibold text-foreground">
                Payment
              </h2>
              <p className="mb-3 text-[11.5px] text-muted-foreground">
                Secure checkout powered by Square — your card details never touch our servers.
              </p>
              <div className="rounded-lg border border-border bg-white px-3.5 py-3.5 text-[13px] text-muted-foreground">
                💳 Card number, expiry, CVV — enter your card on the next step to pay securely
              </div>
              <p className="mt-2.5 text-[11px] text-muted-foreground">
                🔒 Payments processed securely by Square
              </p>
            </section>
          </div>

          <OrderSidebar
            items={items}
            subtotalCents={subtotalCents}
            taxCents={taxCents}
            totalCents={totalCents}
            promo={promo}
            onPromoChange={setPromo}
            action={
              <Link
                to="/checkout"
                state={{
                  orderType,
                  firstName,
                  lastName,
                  phone,
                  email,
                  marketingOptIn,
                  promo,
                }}
                className="block w-full rounded-lg bg-accent py-[15px] text-center text-[14.5px] font-semibold text-white transition-colors hover:bg-accent-hover active:bg-accent-active"
              >
                Place order · {formatMoney(totalCents)}
              </Link>
            }
          />
        </div>
      </main>
    </div>
  );
}
