import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/features/auth/AuthProvider";
import { OrderPickupPanel } from "@/features/orders/OrderPickupPanel";
import { getSupabase } from "@/lib/supabase";
import type { Order } from "@/types/database";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { Button } from "@/components/ui/button";

const ORDER_SELECT =
  "id, order_number, items, shipping_address, subtotal, tax, tip, total, order_status, payment_status, created_at, customer_details";

type HistoryOrder = Pick<
  Order,
  "id" | "order_number" | "items" | "total" | "created_at" | "order_status"
>;

export default function OrderDetailsPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [historyOrders, setHistoryOrders] = useState<HistoryOrder[]>([]);
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
        .select(ORDER_SELECT)
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
        const current = data as Order;
        setOrder(current);

        const { data: history } = await supabase
          .from("orders")
          .select("id, order_number, items, total, created_at, order_status")
          .eq("user_id", user.id)
          .neq("id", orderId)
          .order("created_at", { ascending: false })
          .limit(3);

        setHistoryOrders((history as HistoryOrder[] | null) ?? []);
      }
      setLoading(false);
    };

    void load();
  }, [user, orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F6EFE2]">
        <Header />
        <LoadingSpinner label="Loading order..." />
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#F6EFE2]">
        <Header />
        <main className="px-5 pb-16 pt-28 md:px-8">
          <div className="mx-auto max-w-xl">
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

  return (
    <div className="min-h-screen bg-[#F6EFE2]">
      <Header />
      <main className="relative overflow-hidden px-5 pb-16 pt-28 md:px-8 md:pt-36">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(200,135,61,0.06),transparent_40%),radial-gradient(circle_at_90%_90%,rgba(92,110,78,0.06),transparent_40%)]"
        />
        <div className="relative mx-auto max-w-[900px]">
          <OrderPickupPanel order={order} historyOrders={historyOrders} />
          <div className="mt-6 text-center">
            <Link
              to="/account/orders"
              className="text-[13px] font-semibold text-[#6B4A2E] underline-offset-2 hover:underline"
            >
              Back to order history
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
