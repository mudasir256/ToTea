import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/AuthProvider";
import { useCart, type LocalCartItem } from "@/features/cart/CartProvider";
import {
  AccountPromoCard,
  CartCheckoutHeader,
  Field,
  OrderSidebar,
  OrderTypePills,
  fieldInputClass,
} from "@/features/cart/components/CartCheckoutShell";
import { CartItemCustomizeModal } from "@/features/cart/components/CartItemCustomizeModal";
import { SquareCardField } from "@/features/checkout/SquareCardField";
import { placeSquareOrder } from "@/features/checkout/placeOrder";
import { useSquareCard } from "@/features/checkout/useSquareCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/money";
import { isSupabaseConfigured } from "@/lib/supabase";
import { normalizePhone } from "@/lib/validation";

export default function CartPage() {
  const { user, profile, refreshProfile } = useAuth();
  const { items, loading, subtotalCents, taxCents, totalCents, clearCart, removeItem } =
    useCart();
  const navigate = useNavigate();
  const { ready: squareReady, error: squareError, tokenize } = useSquareCard(
    "square-card-container-cart",
  );

  const [orderType, setOrderType] = useState<"asap" | "later">("asap");
  const [accountMode, setAccountMode] = useState<"guest" | "account">("guest");
  const [promo, setPromo] = useState("");
  const [marketingOptIn, setMarketingOptIn] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [editingItem, setEditingItem] = useState<LocalCartItem | null>(null);

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

  const onPlaceOrder = async () => {
    setFormError(null);

    if (!firstName.trim() || !lastName.trim()) {
      setFormError("Enter your first and last name.");
      return;
    }
    const contact = normalizePhone(phone);
    if (!contact) {
      setFormError("A valid contact number is required.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setFormError("Enter a valid email.");
      return;
    }
    if (!isSupabaseConfigured) {
      setFormError("Checkout requires Supabase configuration.");
      return;
    }
    if (!user) {
      toast.message("Sign in to complete payment");
      navigate("/login", { state: { from: "/cart" } });
      return;
    }
    if (!squareReady) {
      setFormError(squareError || "Payment form is not ready yet.");
      return;
    }

    setSubmitting(true);
    try {
      const orderId = await placeSquareOrder({
        items,
        totalCents,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        contactNumber: contact,
        tokenize,
        saveContact: !profile?.contact_number,
        marketingOptIn,
        orderType,
        promoCode: promo,
      });
      await refreshProfile();
      await clearCart();
      toast.success("Order placed successfully");
      navigate(`/order-confirmation/${orderId}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Checkout failed";
      setFormError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

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
                    autoComplete="given-name"
                  />
                </Field>
                <Field id="last_name" label="Last name">
                  <input
                    id="last_name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    className={fieldInputClass}
                    autoComplete="family-name"
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
                    autoComplete="tel"
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
                    autoComplete="email"
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
                Enter your card below. Card details are secured by Square and never touch our
                servers.
              </p>
              <SquareCardField
                containerId="square-card-container-cart"
                ready={squareReady}
                error={squareError}
              />
              {formError ? (
                <div className="mt-3">
                  <ErrorAlert title="Checkout" message={formError} />
                </div>
              ) : null}
            </section>
          </div>

          <OrderSidebar
            items={items}
            subtotalCents={subtotalCents}
            taxCents={taxCents}
            totalCents={totalCents}
            promo={promo}
            onPromoChange={setPromo}
            onEditItem={setEditingItem}
            onRemoveItem={(item) => void removeItem(item.id)}
            action={
              <button
                type="button"
                onClick={() => void onPlaceOrder()}
                disabled={submitting || !squareReady}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-[15px] text-[14.5px] font-semibold text-white transition-colors hover:bg-accent-hover active:bg-accent-active disabled:cursor-not-allowed disabled:opacity-45"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Place order · {formatMoney(totalCents)}
              </button>
            }
          />
        </div>
      </main>

      <CartItemCustomizeModal cartItem={editingItem} onClose={() => setEditingItem(null)} />
    </div>
  );
}
