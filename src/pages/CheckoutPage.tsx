import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/features/auth/AuthProvider";
import { useCart } from "@/features/cart/CartProvider";
import { CartSummary } from "@/features/cart/components/CartSummary";
import { addressSchema, contactNumberSchema, fullNameSchema, normalizePhone } from "@/lib/validation";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { clearCheckoutIdempotencyKey, getOrCreateCheckoutIdempotencyKey } from "@/lib/checkout";
import { formatMoney } from "@/lib/money";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { EmptyState } from "@/components/shared/EmptyState";

const checkoutSchema = addressSchema.extend({
  full_name: fullNameSchema,
  contact_number: contactNumberSchema.optional().or(z.literal("")),
});

type FormValues = z.infer<typeof checkoutSchema>;

declare global {
  interface Window {
    Square?: {
      payments: (
        applicationId: string,
        locationId: string
      ) => Promise<{
        card: () => Promise<{
          attach: (selector: string) => Promise<void>;
          tokenize: (details?: unknown) => Promise<{
            status: string;
            token?: string;
            errors?: Array<{ message: string }>;
          }>;
          destroy?: () => Promise<void>;
        }>;
      }>;
    };
  }
}

function loadSquareSdk(environment: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.Square) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src =
      environment === "production"
        ? "https://web.squarecdn.com/v1/square.js"
        : "https://sandbox.web.squarecdn.com/v1/square.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Square Web Payments SDK"));
    document.body.appendChild(script);
  });
}

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default function CheckoutPage() {
  const { user, profile, refreshProfile } = useAuth();
  const { items, subtotalCents, shippingCents, discountCents, taxCents, totalCents, clearCart } =
    useCart();
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [squareReady, setSquareReady] = useState(false);
  const cardRef = useRef<{
    tokenize: (details?: unknown) => Promise<{
      status: string;
      token?: string;
      errors?: Array<{ message: string }>;
    }>;
    destroy?: () => Promise<void>;
  } | null>(null);
  const needsContact = !profile?.contact_number;

  const form = useForm<FormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      full_name: "",
      contact_number: "",
      address_line_1: "",
      address_line_2: "",
      city: "",
      state: "",
      postal_code: "",
      country: "US",
    },
  });

  useEffect(() => {
    if (!profile) return;
    form.reset({
      full_name: profile.full_name || "",
      contact_number: profile.contact_number || "",
      address_line_1: profile.address_line_1 || "",
      address_line_2: profile.address_line_2 || "",
      city: profile.city || "",
      state: profile.state || "",
      postal_code: profile.postal_code || "",
      country: "US",
    });
  }, [profile, form]);

  useEffect(() => {
    let cancelled = false;
    const appId = import.meta.env.VITE_SQUARE_APPLICATION_ID as string | undefined;
    const locationId = import.meta.env.VITE_SQUARE_LOCATION_ID as string | undefined;
    const environment = (import.meta.env.VITE_SQUARE_ENVIRONMENT as string | undefined) || "sandbox";

    async function init() {
      if (!appId || !locationId || appId.includes("xxxxxxxx")) {
        setSquareReady(false);
        return;
      }
      try {
        await loadSquareSdk(environment);
        if (cancelled || !window.Square) return;
        const payments = await window.Square.payments(appId, locationId);
        const card = await payments.card();
        await card.attach("#square-card-container");
        if (cancelled) {
          await card.destroy?.();
          return;
        }
        cardRef.current = card;
        setSquareReady(true);
      } catch (error) {
        console.error(error);
        setSquareReady(false);
      }
    }

    void init();
    return () => {
      cancelled = true;
      void cardRef.current?.destroy?.();
      cardRef.current = null;
    };
  }, []);

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

    const contact = needsContact
      ? normalizePhone(values.contact_number || "")
      : normalizePhone(profile?.contact_number || values.contact_number || "");

    if (!contact) {
      setFormError("A contact number is required to place your first order.");
      return;
    }

    if (!isSupabaseConfigured) {
      setFormError(
        "Checkout requires Supabase and Square configuration. See README for setup instructions."
      );
      return;
    }

    if (!cardRef.current || !squareReady) {
      setFormError("Payment form is not ready. Check your Square configuration.");
      return;
    }

    const checkoutItems = items.map((item) => ({
      menuItemId: item.product_id,
      quantity: item.quantity,
      size: item.selected_options.size,
    }));

    if (checkoutItems.some((item) => !UUID_PATTERN.test(item.menuItemId))) {
      setFormError(
        "One or more cart items came from the old menu. Remove them and add them again."
      );
      return;
    }

    setSubmitting(true);
    try {
      const nameParts = values.full_name.trim().split(/\s+/);
      const givenName = nameParts[0] || values.full_name;
      const familyName = nameParts.slice(1).join(" ") || givenName;

      const tokenResult = await cardRef.current.tokenize({
        amount: (totalCents / 100).toFixed(2),
        currencyCode: "USD",
        intent: "CHARGE",
        customerInitiated: true,
        sellerKeyedIn: false,
        billingContact: {
          givenName,
          familyName,
          email: profile?.email || user?.email || "",
          phone: contact,
          addressLines: [values.address_line_1, values.address_line_2].filter(Boolean) as string[],
          city: values.city,
          state: values.state,
          postalCode: values.postal_code,
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
          customerName: values.full_name,
          customerEmail: profile?.email || user?.email,
          contactNumber: contact,
          items: checkoutItems,
          shippingAddress: {
            address_line_1: values.address_line_1,
            address_line_2: values.address_line_2 || "",
            city: values.city,
            state: values.state,
            postal_code: values.postal_code,
            country: "US",
          },
          saveContact: needsContact || !profile?.contact_number,
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
            // Keep the Supabase client error when the response is not JSON.
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
      // Allow a fresh Square payment attempt after any failure (do not reuse a failed idempotency key).
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
      <div className="min-h-screen">
        <Header />
        <main className="section-padding pt-28">
          <div className="container mx-auto max-w-xl px-6">
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
    <div className="min-h-screen">
      <Header />
      <main className="section-padding pt-28 md:pt-36">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <h1 className="heading-lg mb-2">Checkout</h1>
          <p className="mb-8 text-muted-foreground">Confirm your details and complete payment securely.</p>

          <form onSubmit={onSubmit} className="grid gap-8 lg:grid-cols-[1fr_340px]" noValidate>
            <div className="space-y-6">
              {formError ? <ErrorAlert message={formError} /> : null}

              <section className="rounded-3xl border border-border bg-card p-6 space-y-4">
                <h2 className="text-lg font-semibold">Customer information</h2>
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full name</Label>
                  <Input id="full_name" {...form.register("full_name")} />
                  {form.formState.errors.full_name ? (
                    <p className="text-sm text-destructive">{form.formState.errors.full_name.message}</p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={profile?.email || user?.email || ""} disabled readOnly />
                </div>
                {needsContact ? (
                  <div className="space-y-2">
                    <Label htmlFor="contact_number">Contact number (required once)</Label>
                    <Input id="contact_number" {...form.register("contact_number")} />
                    <p className="text-xs text-muted-foreground">
                      We save this to your profile and reuse it for future orders.
                    </p>
                    {form.formState.errors.contact_number ? (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.contact_number.message}
                      </p>
                    ) : null}
                  </div>
                ) : (
                  <div className="rounded-2xl bg-secondary p-4 text-sm">
                    Contact number on file: <strong>{profile?.contact_number}</strong>
                    <div>
                      <Link to="/account/profile" className="text-accent hover:underline">
                        Change in profile
                      </Link>
                    </div>
                  </div>
                )}
              </section>

              <section className="rounded-3xl border border-border bg-card p-6 space-y-4">
                <h2 className="text-lg font-semibold">Shipping address</h2>
                <div className="space-y-2">
                  <Label htmlFor="address_line_1">Address line 1</Label>
                  <Input id="address_line_1" {...form.register("address_line_1")} />
                  {form.formState.errors.address_line_1 ? (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.address_line_1.message}
                    </p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address_line_2">Address line 2</Label>
                  <Input id="address_line_2" {...form.register("address_line_2")} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" {...form.register("city")} />
                    {form.formState.errors.city ? (
                      <p className="text-sm text-destructive">{form.formState.errors.city.message}</p>
                    ) : null}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input id="state" {...form.register("state")} />
                    {form.formState.errors.state ? (
                      <p className="text-sm text-destructive">{form.formState.errors.state.message}</p>
                    ) : null}
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="postal_code">Postal code</Label>
                    <Input id="postal_code" {...form.register("postal_code")} />
                    {form.formState.errors.postal_code ? (
                      <p className="text-sm text-destructive">
                        {form.formState.errors.postal_code.message}
                      </p>
                    ) : null}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" {...form.register("country")} readOnly />
                    <p className="text-xs text-muted-foreground">United States (ISO code: US)</p>
                  </div>
                </div>
              </section>

              <section className="rounded-3xl border border-border bg-card p-6 space-y-4">
                <h2 className="text-lg font-semibold">Payment method</h2>
                <p className="text-sm text-muted-foreground">Pay securely with Square (card).</p>
                <div id="square-card-container" className="min-h-[90px] rounded-2xl border border-border p-3" />
                {!squareReady ? (
                  <p className="text-sm text-amber-700">
                    Square payment form unavailable until application ID and location ID are configured.
                  </p>
                ) : null}
              </section>
            </div>

            <div className="space-y-4">
              <div className="rounded-3xl border border-border bg-card p-6">
                <h2 className="mb-4 text-lg font-semibold">Products</h2>
                <ul className="space-y-3 text-sm">
                  {items.map((item) => (
                    <li key={item.id} className="flex justify-between gap-3">
                      <span>
                        {item.product_name} ({item.selected_options.size}) × {item.quantity}
                      </span>
                      <span>{formatMoney(item.unit_price_cents * item.quantity)}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <CartSummary
                subtotalCents={subtotalCents}
                shippingCents={shippingCents}
                discountCents={discountCents}
                taxCents={taxCents}
                totalCents={totalCents}
                showCheckout={false}
              />
              <Button
                type="submit"
                className="btn-accent w-full h-12"
                disabled={submitting || !squareReady}
              >
                {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Place order
              </Button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
