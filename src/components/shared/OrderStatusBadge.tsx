import type { OrderStatus, PaymentStatus } from "@/types/database";
import { cn } from "@/lib/utils";

const orderStyles: Record<OrderStatus, string> = {
  pending: "border-amber-200 bg-amber-100 text-amber-900",
  confirmed: "border-sky-200 bg-sky-100 text-sky-900",
  processing: "border-indigo-200 bg-indigo-100 text-indigo-900",
  ready: "border-violet-200 bg-violet-100 text-violet-900",
  completed: "border-emerald-200 bg-emerald-100 text-emerald-900",
  cancelled: "border-rose-200 bg-rose-100 text-rose-900",
  refunded: "border-slate-200 bg-slate-100 text-slate-900",
};

const orderLabels: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "Processing",
  ready: "Ready",
  completed: "Completed",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

const orderDescriptions: Record<OrderStatus, string> = {
  pending: "We received your order and are awaiting confirmation.",
  confirmed: "Your payment is confirmed and your order is in the queue.",
  processing: "Your order is being prepared.",
  ready: "Your order is ready.",
  completed: "Your order has been completed.",
  cancelled: "This order was cancelled.",
  refunded: "This order was refunded.",
};

const paymentLabels: Record<PaymentStatus, string> = {
  pending: "Payment pending",
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
