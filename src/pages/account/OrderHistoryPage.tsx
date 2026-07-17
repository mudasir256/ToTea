import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/features/auth/AuthProvider";
import { getSupabase } from "@/lib/supabase";
import type { Order } from "@/types/database";
import { formatDateTime, formatMoney } from "@/lib/money";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/shared/OrderStatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 10;

export default function OrderHistoryPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      setLoading(true);
      setError(null);
      const supabase = getSupabase();
      if (!supabase) {
        setError("Supabase is not configured");
        setLoading(false);
        return;
      }

      const from = page * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      const { data, error: queryError } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .range(from, to);

      if (queryError) {
        setError(queryError.message);
        setLoading(false);
        return;
      }

      const rows = (data ?? []) as Order[];
      setOrders((prev) => (page === 0 ? rows : [...prev, ...rows]));
      setHasMore(rows.length === PAGE_SIZE);
      setLoading(false);
    };

    void load();
  }, [user, page]);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="section-padding pt-28 md:pt-36">
        <div className="container mx-auto max-w-4xl px-6 md:px-12">
          <div className="mb-8 flex items-center justify-between gap-4">
            <div>
              <h1 className="heading-lg">Order history</h1>
              <p className="mt-2 text-muted-foreground">Newest orders appear first.</p>
            </div>
            <Button asChild variant="outline" className="rounded-2xl">
              <Link to="/account/profile">Back to profile</Link>
            </Button>
          </div>

          {error ? <ErrorAlert message={error} className="mb-6" /> : null}

          {loading && orders.length === 0 ? (
            <LoadingSpinner label="Loading orders..." />
          ) : orders.length === 0 ? (
            <EmptyState
              title="You have not placed any orders yet."
              description="When you complete checkout, your orders will show up here."
              action={
                <Button asChild className="btn-accent">
                  <Link to="/menu">Browse menu</Link>
                </Button>
              }
            />
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const { date, time } = formatDateTime(order.created_at);
                return (
                  <article
                    key={order.id}
                    className="rounded-3xl border border-border bg-card p-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h2 className="font-semibold">{order.order_number}</h2>
                        <OrderStatusBadge status={order.order_status} />
                        <PaymentStatusBadge status={order.payment_status} />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {date} · {time}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {order.item_count} item{order.item_count === 1 ? "" : "s"} ·{" "}
                        {formatMoney(order.total_amount_cents, order.currency)}
                      </p>
                    </div>
                    <Button asChild className="rounded-2xl">
                      <Link to={`/account/orders/${order.id}`}>View details</Link>
                    </Button>
                  </article>
                );
              })}
              {hasMore ? (
                <Button
                  variant="outline"
                  className="rounded-2xl"
                  disabled={loading}
                  onClick={() => setPage((p) => p + 1)}
                >
                  {loading ? "Loading..." : "Load more"}
                </Button>
              ) : null}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
