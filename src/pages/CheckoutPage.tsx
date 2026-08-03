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
import { useCart } from "@/features/cart/CartProvider";
import {
  AccountPromoCard,
  CartCheckoutHeader,
  Field,
  OrderSidebar,
  OrderTypePills,
  fieldInputClass,
} from "@/features/cart/components/CartCheckoutShell";
import { SquareCardField } from "@/features/checkout/SquareCardField";
import { useSquareCard } from "@/features/checkout/useSquareCard";
import { contactNumberSchema, normalizePhone } from "@/lib/validation";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { clearCheckoutIdempotencyKey, getOrCreateCheckoutIdempotencyKey } from "@/lib/checkout";
import { formatMoney } from "@/lib/money";
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

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const STORE_ADDRESS = {
  address_line_1: "9534 Liberia Ave",
  address_line_2: "",
  city: "Manassas",
  state: "VA",
  postal_code: "20110",
  country: "US",
};

export default function CheckoutPage() {
  const { user, profile, refreshProfile } = useAuth();
  const { items, subtotalCents, taxCents, totalCents, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const draft = (location.state as CartDraft | null) ?? {};
  const { ready: squareReady, error: squareError, tokenize } = useSquareCard();

  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [orderType, setOrderType] = useState<"asap" | "later">(draft.orderType ?? "asap");
  const [accountMode, setAccountMode] = useState<"guest" | "account">("guest");
  const [marketingOptIn, setMarketingOptIn] = useState(draft.marketingOptIn ?? true);
  const [promo, setPromo] = useState(draft.promo ?? "");

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
    if (items.length === 0) {
      setFormError("Your cart is empty.");
      return;
    }
    if (items.some((i) => i.stock_quantity < i.quantity)) {
      setFormError("One or more items are out of stock. Update your cart and try again.");
      return;
    }

    const fullName = `${values.first_name} ${values.last_name}`.trim();
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

    const checkoutItems = items.map((item) => ({
      menuItemId: item.product_id,
      quantity: item.quantity,
      size: item.selected_options.size,
      toppingIds: (item.selected_options.toppings ?? []).map((topping) => topping.id),
      sweetness: item.selected_options.sweetness,
      ice: item.selected_options.ice,
      milk: item.selected_options.milk,
    }));

    if (checkoutItems.some((item) => !UUID_PATTERN.test(item.menuItemId))) {
      setFormError(
        "One or more cart items came from the old menu. Remove them and add them again.",
      );
      return;
    }

    setSubmitting(true);
    try {
      const tokenResult = await tokenize({
        amount: (totalCents / 100).toFixed(2),
        currencyCode: "USD",
        intent: "CHARGE",
        customerInitiated: true,
        sellerKeyedIn: false,
        billingContact: {
          givenName: values.first_name,
          familyName: values.last_name,
          email: values.email,
          phone: contact,
          addressLines: [STORE_ADDRESS.address_line_1],
          city: STORE_ADDRESS.city,
          state: STORE_ADDRESS.state,
          postalCode: STORE_ADDRESS.postal_code,
          countryCode: "US",
        },
      });

      if (tokenResult.status !== "OK" || !tokenResult.token) {
        const message =
          tokenResult.errors?.map((e) => e.message).join(", ") || "Card tokenization failed";
        throw new Error(message);
      }

      const idempotencyKey = getOrCreateCheckoutIdempotencyKey();
      const supabase = getSupabase();
      if (!supabase) throw new Error("Supabase is not configured");

      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          idempotencyKey,
          sourceId: tokenResult.token,
          customerName: fullName,
          customerEmail: values.email,
          contactNumber: contact,
          items: checkoutItems,
          shippingAddress: STORE_ADDRESS,
          saveContact: !profile?.contact_number,
          marketingOptIn,
          orderType,
          promoCode: promo || undefined,
        },
      });

      if (error) {
        let message = error.message;
        const response = (error as { context?: Response }).context;
        if (response) {
          try {
            const payload = (await response.clone().json()) as { error?: string };
            if (payload.error) message = payload.error;
          } catch {
            // keep client error
          }
        }
        throw new Error(message);
      }
      if (data?.error) throw new Error(data.error);
      const orderId = data?.orderId ?? data?.order?.id;
      if (!orderId) throw new Error("Checkout did not return an order id");

      clearCheckoutIdempotencyKey();
      await refreshProfile();
      await clearCart();
      toast.success("Order placed successfully");
      navigate(`/order-confirmation/${orderId}`);
    } catch (error) {
      clearCheckoutIdempotencyKey();
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
              <SquareCardField ready={squareReady} error={squareError} />
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
              <button
                type="submit"
                disabled={submitting || !squareReady}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-[15px] text-[14.5px] font-semibold text-white transition-colors hover:bg-accent-hover active:bg-accent-active disabled:cursor-not-allowed disabled:opacity-45"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Place order · {formatMoney(totalCents)}
              </button>
            }
          />
        </form>
      </main>
    </div>
  );
}
