import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
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
import { contactNumberSchema, normalizePhone } from "@/lib/validation";
import { isSupabaseConfigured } from "@/lib/supabase";
import { calcOrderTotals, formatMoney, parseTipInputToCents } from "@/lib/money";
import { Button } from "@/components/ui/button";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { EmptyState } from "@/components/shared/EmptyState";

const checkoutSchema = z.object({
  first_name: z.string().trim().min(1, "First name is required").max(100),
  last_name: z.string().trim().min(1, "Last name is required").max(100),
  contact_number: contactNumberSchema,
  email: z.string().trim().email("Enter a valid email"),
});

type FormValues = z.infer<typeof checkoutSchema>;

type CartDraft = {
  orderType?: "asap" | "later";
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  marketingOptIn?: boolean;
  promo?: string;
};

export default function CheckoutPage() {
  const { user, profile, refreshProfile } = useAuth();
  const { items, subtotalCents, taxCents, totalCents, clearCart, removeItem } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const draft = (location.state as CartDraft | null) ?? {};
  const { ready: squareReady, error: squareError, tokenize } = useSquareCard(
    "square-card-container-checkout",
  );

  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [orderType, setOrderType] = useState<"asap" | "later">(draft.orderType ?? "asap");
  const [accountMode, setAccountMode] = useState<"guest" | "account">("guest");
  const [marketingOptIn, setMarketingOptIn] = useState(draft.marketingOptIn ?? true);
  const [promo, setPromo] = useState(draft.promo ?? "");
  const [tipInput, setTipInput] = useState("");
  const [editingItem, setEditingItem] = useState<LocalCartItem | null>(null);
  const tipCents = parseTipInputToCents(tipInput);
  const payTotalCents = calcOrderTotals(subtotalCents, { tipCents }).totalCents;

  const form = useForm<FormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      first_name: draft.firstName || "",
      last_name: draft.lastName || "",
      contact_number: draft.phone || "",
      email: draft.email || "",
    },
  });

  useEffect(() => {
    if (!profile && !user) return;
    const parts = (profile?.full_name || "").trim().split(/\s+/);
    form.reset({
      first_name: draft.firstName || parts[0] || "",
      last_name: draft.lastName || parts.slice(1).join(" ") || "",
      contact_number: draft.phone || profile?.contact_number || "",
      email: draft.email || profile?.email || user?.email || "",
    });
  }, [profile, user, form, draft.firstName, draft.lastName, draft.phone, draft.email]);

  const onSubmit = form.handleSubmit(async (values) => {
    setFormError(null);
    const contact = normalizePhone(values.contact_number || "");
    if (!contact) {
      setFormError("A contact number is required.");
      return;
    }
    if (!isSupabaseConfigured) {
      setFormError("Checkout requires Supabase configuration.");
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
        totalCents: payTotalCents,
        tipCents,
        firstName: values.first_name,
        lastName: values.last_name,
        email: values.email,
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
  });

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-16">
          <div className="mx-auto max-w-xl px-6">
            <EmptyState
              title="Nothing to checkout"
              description="Add drinks to your cart before placing an order."
              action={
                <Button asChild className="btn-accent">
                  <Link to="/menu">Browse menu</Link>
                </Button>
              }
            />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <CartCheckoutHeader step="payment" />

      <main className="mx-auto max-w-[1100px] px-5 py-9 md:px-8 md:py-9">
        <form
          onSubmit={onSubmit}
          className="grid gap-8 md:grid-cols-[1fr_380px] md:gap-0"
          noValidate
        >
          <div className="md:border-r md:border-border md:pr-11">
            {formError ? (
              <div className="mb-6">
                <ErrorAlert message={formError} />
              </div>
            ) : null}

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
                <Field
                  id="first_name"
                  label="First name"
                  error={form.formState.errors.first_name?.message}
                >
                  <input
                    id="first_name"
                    placeholder="Jane"
                    className={fieldInputClass}
                    {...form.register("first_name")}
                  />
                </Field>
                <Field
                  id="last_name"
                  label="Last name"
                  error={form.formState.errors.last_name?.message}
                >
                  <input
                    id="last_name"
                    placeholder="Doe"
                    className={fieldInputClass}
                    {...form.register("last_name")}
                  />
                </Field>
                <Field
                  id="contact_number"
                  label="Phone number"
                  error={form.formState.errors.contact_number?.message}
                >
                  <input
                    id="contact_number"
                    type="tel"
                    placeholder="(555) 123-4567"
                    className={fieldInputClass}
                    {...form.register("contact_number")}
                  />
                </Field>
                <Field
                  id="email"
                  label="Email"
                  error={form.formState.errors.email?.message}
                >
                  <input
                    id="email"
                    type="email"
                    placeholder="name@email.com"
                    className={fieldInputClass}
                    {...form.register("email")}
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
              <SquareCardField
                containerId="square-card-container-checkout"
                ready={squareReady}
                error={squareError}
              />
            </section>
          </div>

          <OrderSidebar
            items={items}
            subtotalCents={subtotalCents}
            taxCents={taxCents}
            tipInput={tipInput}
            onTipChange={setTipInput}
            totalCents={payTotalCents}
            promo={promo}
            onPromoChange={setPromo}
            onEditItem={setEditingItem}
            onRemoveItem={(item) => void removeItem(item.id)}
            action={
              <button
                type="submit"
                disabled={submitting || !squareReady}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-[15px] text-[14.5px] font-semibold text-white transition-colors hover:bg-accent-hover active:bg-accent-active disabled:cursor-not-allowed disabled:opacity-45"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Place order · {formatMoney(payTotalCents)}
              </button>
            }
          />
        </form>
      </main>

      <CartItemCustomizeModal cartItem={editingItem} onClose={() => setEditingItem(null)} />
    </div>
  );
}
