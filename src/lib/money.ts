export function formatMoney(cents: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format((cents || 0) / 100);
}

export function formatDateTime(iso: string): { date: string; time: string; full: string } {
  const d = new Date(iso);
  const date = d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const time = d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  return { date, time, full: `${date} at ${time}` };
}

export function calcLineTotal(unitPriceCents: number, quantity: number): number {
  return Math.max(0, unitPriceCents) * Math.max(0, quantity);
}

export function calcCartSubtotal(
  items: Array<{ unit_price_cents: number; quantity: number }>
): number {
  return items.reduce((sum, item) => sum + calcLineTotal(item.unit_price_cents, item.quantity), 0);
}

export const DEFAULT_SHIPPING_CENTS = 0;
export const DEFAULT_TAX_RATE = 0;
export const DEFAULT_DISCOUNT_CENTS = 0;

export function calcOrderTotals(subtotalCents: number, options?: {
  shippingCents?: number;
  taxRate?: number;
  discountCents?: number;
}) {
  const shipping = options?.shippingCents ?? DEFAULT_SHIPPING_CENTS;
  const discount = options?.discountCents ?? DEFAULT_DISCOUNT_CENTS;
  const taxRate = options?.taxRate ?? DEFAULT_TAX_RATE;
  const taxable = Math.max(0, subtotalCents - discount);
  const tax = Math.round(taxable * taxRate);
  const total = Math.max(0, taxable + tax + shipping);
  return {
    subtotalCents,
    shippingCents: shipping,
    discountCents: discount,
    taxCents: tax,
    totalCents: total,
  };
}
