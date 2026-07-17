import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/features/auth/AuthProvider";
import { useCart } from "@/features/cart/CartProvider";
import { CartSummary } from "@/features/cart/components/CartSummary";
import { formatMoney } from "@/lib/money";
import { normalizePhone } from "@/lib/validation";
import {
  buildSquarePosChargeUrl,
  isMobilePosDevice,
  savePosPending,
} from "@/lib/squarePos";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { EmptyState } from "@/components/shared/EmptyState";

export default function PosCheckoutPage() {
  const { user, profile } = useAuth();
  const { items, subtotalCents, discountCents, taxCents } = useCart();
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [starting, setStarting] = useState(false);

  const appIdConfigured = Boolean(
    import.meta.env.VITE_SQUARE_APPLICATION_ID &&
      !String(import.meta.env.VITE_SQUARE_APPLICATION_ID).includes("xxxxxxxx")
  );

  useEffect(() => {
    setCustomerName(profile?.full_name || "");
    setContactNumber(profile?.contact_number || "");
  }, [profile]);

  // In-store: charge cart subtotal + tax only (no shipping)
  const posTotalCents = Math.max(0, subtotalCents - discountCents + taxCents);

  const onStartPos = () => {
    setFormError(null);

    if (!appIdConfigured) {
      setFormError("Square Application ID is not configured in .env.");
      return;
    }
    if (items.length === 0) {
      setFormError("Add items to the cart before starting a POS charge.");
      return;
    }
    if (!isMobilePosDevice()) {
      setFormError(
        "Square POS handoff only works on an iPhone or Android device with the Square Point of Sale app installed."
      );
      return;
    }

    const name = customerName.trim();
    const contact = normalizePhone(contactNumber);
    if (name.length < 2) {
      setFormError("Enter the customer name.");
      return;
    }
    if (contact.length < 7) {
      setFormError("Enter a valid contact number.");
      return;
    }

    setStarting(true);
    try {
      const idempotencyKey = crypto.randomUUID();
      savePosPending({
        idempotencyKey,
        totalCents: posTotalCents,
        customerName: name,
        contactNumber: contact,
        createdAt: Date.now(),
      });

      const url = buildSquarePosChargeUrl({
        totalCents: posTotalCents,
        note: `ToTea POS ${idempotencyKey.slice(0, 8)}`,
      });

      toast.message("Opening Square Point of Sale…");
      window.location.href = url;
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Unable to open Square POS");
      setStarting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="section-padding pt-28">
          <div className="container mx-auto max-w-xl px-6">
            <EmptyState
              title="Cart is empty"
              description="Add drinks to the cart, then charge with Square POS on a phone or tablet."
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
        <div className="container mx-auto max-w-3xl px-6">
          <h1 className="heading-lg mb-2">In-store Square POS</h1>
          <p className="mb-8 text-muted-foreground">
            Charge this cart on a phone or tablet with the Square Point of Sale app and a reader.
            Online card checkout stays at{" "}
            <Link to="/checkout" className="text-accent hover:underline">
              /checkout
            </Link>
            .
          </p>

          {formError ? <div className="mb-6"><ErrorAlert message={formError} /></div> : null}

          <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
            <div className="space-y-6">
              <section className="rounded-3xl border border-border bg-card p-6 space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Customer
                </h2>
                <div className="space-y-2">
                  <Label htmlFor="pos_name">Name</Label>
                  <Input
                    id="pos_name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pos_contact">Contact number</Label>
                  <Input
                    id="pos_contact"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Signed in as</Label>
                  <Input value={profile?.email || user?.email || ""} disabled readOnly />
                </div>
              </section>

              <section className="rounded-3xl border border-border bg-card p-6 space-y-3">
                <h2 className="text-lg font-semibold">Items</h2>
                <ul className="space-y-2 text-sm">
                  {items.map((item) => (
                    <li key={item.id} className="flex justify-between gap-3">
                      <span>
                        {item.product_name} ({item.selected_options.size}) × {item.quantity}
                      </span>
                      <span>{formatMoney(item.unit_price_cents * item.quantity)}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-muted-foreground pt-2">
                  POS charge amount (no shipping): <strong>{formatMoney(posTotalCents)}</strong>
                </p>
              </section>

              <Button
                type="button"
                className="btn-accent w-full h-12"
                disabled={starting || !appIdConfigured}
                onClick={onStartPos}
              >
                {starting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Open Square POS to charge
              </Button>

              {!isMobilePosDevice() ? (
                <p className="text-sm text-amber-700">
                  Open this page on a mobile device with Square Point of Sale installed. Desktop
                  browsers cannot launch the POS app.
                </p>
              ) : null}
            </div>

            <CartSummary
              subtotalCents={subtotalCents}
              shippingCents={0}
              discountCents={discountCents}
              taxCents={taxCents}
              totalCents={posTotalCents}
              showCheckout={false}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
