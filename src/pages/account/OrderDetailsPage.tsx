import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/features/auth/AuthProvider";
import { getSupabase } from "@/lib/supabase";
import type { Order } from "@/types/database";
import { formatDateTime, formatMoney } from "@/lib/money";
import {
  OrderStatusBadge,
  PaymentStatusBadge,
  getOrderStatusDescription,
} from "@/components/shared/OrderStatusBadge";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { Button } from "@/components/ui/button";

function formatOrderMoney(amount: number) {
  return formatMoney(Math.round(Number(amount) * 100));
}

export default function OrderDetailsPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
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
        .select("*")
        .eq("id", orderId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (queryError) {
        setError(queryError.message);
        setOrder(null);
      } else if (!data) {
        setError("Order not found, or you do not have access to this order.");
        setOrder(null);
      } else {
        setOrder(data as Order);
      }
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
  const address = order.shipping_address;
  const customer = order.customer_details;

  return (
    <div className="min-h-screen">
      <Header />
      <main className="section-padding pt-28 md:pt-36">
        <div className="container mx-auto max-w-4xl space-y-6 px-6 md:px-12">
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
            <section className="space-y-2 rounded-3xl border border-border bg-card p-6 text-sm">
              <h2 className="mb-2 text-lg font-semibold">Customer</h2>
              <p>{customer.name}</p>
              <p>{customer.email}</p>
              <p>Contact used for this order: {customer.contact_number}</p>
              <p className="text-muted-foreground">Payment: Card (Square online)</p>
            </section>
            <section className="space-y-2 rounded-3xl border border-border bg-card p-6 text-sm">
              <h2 className="mb-2 text-lg font-semibold">Shipping address</h2>
              <p>{address.address_line_1}</p>
              {address.address_line_2 ? <p>{address.address_line_2}</p> : null}
              <p>
                {address.city}, {address.state} {address.postal_code}
              </p>
              <p>{address.country}</p>
            </section>
          </div>

          <section className="rounded-3xl border border-border bg-card p-6">
            <h2 className="mb-4 text-lg font-semibold">Items</h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div
                  key={`${item.menu_item_id}:${item.size}:${index}`}
                  className="flex items-center gap-4"
                >
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-secondary">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {[
                        `Size: ${item.size}`,
                        item.sweetness ? `Sugar: ${item.sweetness}` : null,
                        item.ice ? `Ice: ${item.ice}` : null,
                        `Qty ${item.quantity}`,
                        `${formatOrderMoney(item.unit_price)} each`,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                    {item.toppings && item.toppings.length > 0 ? (
                      <p className="mt-1 text-sm text-muted-foreground">
                        Toppings: {item.toppings.map((topping) => topping.name).join(", ")}
                      </p>
                    ) : null}
                  </div>
                  <p className="font-semibold">{formatOrderMoney(item.line_total)}</p>
                </div>
              ))}
            </div>
            <dl className="mt-6 border-t border-border pt-4">
              <div className="flex justify-between text-base font-semibold">
                <dt>Total</dt>
                <dd>{formatOrderMoney(order.total)}</dd>
              </div>
            </dl>
          </section>

          <Button asChild variant="outline" className="rounded-2xl">
            <Link to="/account/orders">Back to order history</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
