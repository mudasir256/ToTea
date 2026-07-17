import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/features/auth/AuthProvider";
import { getSupabase } from "@/lib/supabase";
import type { OrderWithDetails, ShippingAddress } from "@/types/database";
import { formatDateTime, formatMoney } from "@/lib/money";
import {
  OrderStatusBadge,
  PaymentStatusBadge,
  getOrderStatusDescription,
} from "@/components/shared/OrderStatusBadge";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { Button } from "@/components/ui/button";

export default function OrderDetailsPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { user } = useAuth();
  const [order, setOrder] = useState<OrderWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!user || !orderId) return;
      setLoading(true);
      setError(null);
      const supabase = getSupabase();
      if (!supabase) {
        setError("Supabase is not configured");
        setLoading(false);
        return;
      }

      const { data, error: queryError } = await supabase
        .from("orders")
        .select("*, order_items(*), order_status_history(*)")
        .eq("id", orderId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (queryError) {
        setError(queryError.message);
        setOrder(null);
        setLoading(false);
        return;
      }

      if (!data) {
        setError("Order not found, or you do not have access to this order.");
        setOrder(null);
        setLoading(false);
        return;
      }

      const normalized = {
        ...(data as OrderWithDetails),
        order_items: [...((data as OrderWithDetails).order_items || [])],
        order_status_history: [...((data as OrderWithDetails).order_status_history || [])].sort(
          (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        ),
      };
      setOrder(normalized);
      setLoading(false);
    };

    void load();
  }, [user, orderId]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <LoadingSpinner label="Loading order..." />
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="section-padding pt-28">
          <div className="container mx-auto max-w-xl px-6">
            <ErrorAlert message={error || "Order not found"} />
            <Button asChild className="mt-6 rounded-2xl">
              <Link to="/account/orders">Back to order history</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const { date, time } = formatDateTime(order.created_at);
  const address = order.shipping_address as ShippingAddress;

  return (
    <div className="min-h-screen">
      <Header />
      <main className="section-padding pt-28 md:pt-36">
        <div className="container mx-auto max-w-4xl px-6 md:px-12 space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="heading-lg">{order.order_number}</h1>
              <p className="mt-2 text-muted-foreground">
                Placed on {date} at {time}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <OrderStatusBadge status={order.order_status} />
              <PaymentStatusBadge status={order.payment_status} />
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            {getOrderStatusDescription(order.order_status)}
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            <section className="rounded-3xl border border-border bg-card p-6 space-y-2 text-sm">
              <h2 className="text-lg font-semibold mb-2">Customer</h2>
              <p>{order.customer_name}</p>
              <p>{order.customer_email}</p>
              <p>Contact used for this order: {order.contact_number}</p>
              <p className="text-muted-foreground">
                Payment:{" "}
                {order.payment_method === "square_card"
                  ? "Card (Square online)"
                  : order.payment_method === "square_pos"
                    ? "Square Point of Sale"
                    : order.payment_method}
              </p>
            </section>
            <section className="rounded-3xl border border-border bg-card p-6 space-y-2 text-sm">
              <h2 className="text-lg font-semibold mb-2">Shipping address</h2>
              <p>{address.address_line_1}</p>
              {address.address_line_2 ? <p>{address.address_line_2}</p> : null}
              <p>
                {address.city}, {address.state} {address.postal_code}
              </p>
              <p>{address.country}</p>
              {order.tracking_number ? <p>Tracking: {order.tracking_number}</p> : null}
              {order.estimated_delivery_at ? (
                <p>Estimated delivery: {formatDateTime(order.estimated_delivery_at).full}</p>
              ) : null}
            </section>
          </div>

          <section className="rounded-3xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Items</h2>
            <div className="space-y-4">
              {order.order_items.map((item) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <div className="h-16 w-16 overflow-hidden rounded-2xl bg-secondary shrink-0">
                    {item.product_image ? (
                      <img src={item.product_image} alt="" className="h-full w-full object-cover" />
                    ) : null}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{item.product_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(item.selected_options as { size?: string })?.size
                        ? `Size: ${(item.selected_options as { size?: string }).size}`
                        : null}{" "}
                      · Qty {item.quantity} · {formatMoney(item.unit_price_cents)} each
                    </p>
                  </div>
                  <p className="font-semibold">{formatMoney(item.line_total_cents)}</p>
                </div>
              ))}
            </div>
            <dl className="mt-6 space-y-2 border-t border-border pt-4 text-sm">
              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd>{formatMoney(order.subtotal_cents)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Discount</dt>
                <dd>-{formatMoney(order.discount_amount_cents)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Tax</dt>
                <dd>{formatMoney(order.tax_amount_cents)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Shipping</dt>
                <dd>{formatMoney(order.shipping_amount_cents)}</dd>
              </div>
              <div className="flex justify-between text-base font-semibold">
                <dt>Grand total</dt>
                <dd>{formatMoney(order.total_amount_cents, order.currency)}</dd>
              </div>
            </dl>
          </section>

          {order.order_status_history?.length ? (
            <section className="rounded-3xl border border-border bg-card p-6">
              <h2 className="text-lg font-semibold mb-4">Status history</h2>
              <ol className="space-y-3">
                {order.order_status_history.map((entry) => {
                  const stamp = formatDateTime(entry.created_at);
                  return (
                    <li key={entry.id} className="flex flex-wrap items-center gap-3 text-sm">
                      <OrderStatusBadge status={entry.status} />
                      <span>
                        {stamp.date} · {stamp.time}
                      </span>
                      <span className="text-muted-foreground">by {entry.updated_by}</span>
                      {entry.note ? (
                        <span className="text-muted-foreground">— {entry.note}</span>
                      ) : null}
                    </li>
                  );
                })}
              </ol>
            </section>
          ) : null}

          <Button asChild variant="outline" className="rounded-2xl">
            <Link to="/account/orders">Back to order history</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
