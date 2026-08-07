import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/features/auth/AuthProvider";
import { getSupabase } from "@/lib/supabase";
import type { Order } from "@/types/database";
import { formatDateTime, formatMoney } from "@/lib/money";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "@/components/shared/OrderStatusBadge";

function formatOrderMoney(amount: number) {
  return formatMoney(Math.round(Number(amount) * 100));
}

export default function OrderConfirmationPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!user || !orderId) return;
      const supabase = getSupabase();
      if (!supabase) {
        setError("Supabase is not configured");
        setLoading(false);
        return;
      }
      const { data, error: queryError } = await supabase
        .from("orders")
        .select("id, order_number, items, total, order_status, payment_status, created_at")
        .eq("id", orderId)
        .eq("user_id", user.id)
        .maybeSingle();
      if (queryError || !data) {
        setError(queryError?.message || "Order not found");
        setLoading(false);
        return;
      }
      setOrder(data as Order);
      setLoading(false);
    };
    void load();
  }, [user, orderId]);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="section-padding pt-28 md:pt-36">
        <div className="container mx-auto max-w-xl px-6">
          {loading ? (
            <LoadingSpinner label="Confirming your order..." />
          ) : error || !order ? (
            <ErrorAlert message={error || "Order not found"} />
          ) : (
            <div className="rounded-4xl border border-border bg-card p-8 text-center shadow-elevated">
              <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-600" />
              <h1 className="mt-4 text-3xl font-semibold">Thank you!</h1>
              <p className="mt-2 text-muted-foreground">
                Your order {order.order_number} was placed successfully.
              </p>
              <div className="mt-6 space-y-2 text-sm">
                <div className="flex justify-center">
                  <OrderStatusBadge status={order.order_status} />
                </div>
                <p>{formatDateTime(order.created_at).full}</p>
                <p className="text-lg font-semibold">{formatOrderMoney(order.total)}</p>
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Button asChild className="btn-accent">
                  <Link to={`/account/orders/${order.id}`}>View order details</Link>
                </Button>
                <Button asChild variant="outline" className="rounded-2xl">
                  <Link to="/menu">Continue shopping</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
