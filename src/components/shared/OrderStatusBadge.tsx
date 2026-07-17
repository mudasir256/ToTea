import type { OrderStatus, PaymentStatus } from "@/types/database";
import { cn } from "@/lib/utils";

const orderStyles: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-900 border-amber-200",
  confirmed: "bg-sky-100 text-sky-900 border-sky-200",
  processing: "bg-indigo-100 text-indigo-900 border-indigo-200",
  shipped: "bg-violet-100 text-violet-900 border-violet-200",
  delivered: "bg-emerald-100 text-emerald-900 border-emerald-200",
  cancelled: "bg-rose-100 text-rose-900 border-rose-200",
  refunded: "bg-slate-100 text-slate-900 border-slate-200",
};

const orderLabels: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

const orderDescriptions: Record<OrderStatus, string> = {
  pending: "We received your order and are awaiting confirmation.",
  confirmed: "Your payment is confirmed and we are preparing your drinks.",
  processing: "Your order is being prepared.",
  shipped: "Your order is on the way.",
  delivered: "Your order has been delivered.",
  cancelled: "This order was cancelled.",
  refunded: "This order was refunded.",
};

const paymentLabels: Record<PaymentStatus, string> = {
  pending: "Payment pending",
  authorized: "Authorized",
  paid: "Paid",
  failed: "Payment failed",
  refunded: "Refunded",
  cancelled: "Cancelled",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide",
        orderStyles[status]
      )}
    >
      {orderLabels[status]}
    </span>
  );
}

export function getOrderStatusDescription(status: OrderStatus): string {
  return orderDescriptions[status];
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return (
    <span className="inline-flex items-center rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium">
      {paymentLabels[status]}
    </span>
  );
}
