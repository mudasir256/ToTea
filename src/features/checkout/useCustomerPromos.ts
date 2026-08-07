import { useQuery } from "@tanstack/react-query";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";

export const FIRST_ORDER_DISCOUNT_CENTS = 200;

export type CustomerPromo = {
  id: string;
  code: string;
  discountType: "fixed" | "percent";
  discountValue: number;
};

type PromoRow = {
  id: string;
  promo_codes:
    | {
        code: string;
        discount_type: "fixed" | "percent";
        discount_value: number | string;
        is_active: boolean;
      }
    | Array<{
        code: string;
        discount_type: "fixed" | "percent";
        discount_value: number | string;
        is_active: boolean;
      }>
    | null;
};

export function formatPromoDiscountLabel(
  discountType: "fixed" | "percent",
  discountValue: number,
): string {
  if (discountType === "percent") {
    const pct = Number.isInteger(discountValue)
      ? String(discountValue)
      : discountValue.toFixed(1).replace(/\.0$/, "");
    return `${pct}% off`;
  }
  const dollars = Number(discountValue);
  const formatted = Number.isInteger(dollars)
    ? String(dollars)
    : dollars.toFixed(2).replace(/\.?0+$/, "");
  return `$${formatted} off`;
}

export function computePromoDiscountCents(
  discountType: "fixed" | "percent",
  discountValue: number,
  subtotalCents: number,
): number {
  const raw =
    discountType === "percent"
      ? Math.round(subtotalCents * (Number(discountValue) / 100))
      : Math.round(Number(discountValue) * 100);
  return Math.max(0, Math.min(subtotalCents, raw));
}

async function fetchCustomerPromoState(userId: string): Promise<{
  promos: CustomerPromo[];
  firstOrderEligible: boolean;
}> {
  const supabase = getSupabase();
  if (!supabase) {
    return { promos: [], firstOrderEligible: false };
  }

  // Promo tables are applied via migration; generated Database types may lag.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any;

  const [promoResult, paidResult] = await Promise.all([
    db
      .from("customer_promo_codes")
      .select(
        "id, status, promo_codes!inner(code, discount_type, discount_value, is_active)",
      )
      .eq("user_id", userId)
      .eq("status", "available")
      .eq("promo_codes.is_active", true),
    supabase
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("payment_status", "paid"),
  ]);

  if (promoResult.error) {
    throw promoResult.error;
  }

  const rows = (promoResult.data ?? []) as PromoRow[];
  const promos: CustomerPromo[] = rows
    .map((row) => {
      const promo = Array.isArray(row.promo_codes) ? row.promo_codes[0] : row.promo_codes;
      if (!promo || promo.is_active === false) return null;
      return {
        id: row.id,
        code: String(promo.code).toUpperCase(),
        discountType: promo.discount_type,
        discountValue: Number(promo.discount_value),
      };
    })
    .filter((row): row is CustomerPromo => Boolean(row));

  return {
    promos,
    firstOrderEligible: (paidResult.count ?? 0) === 0,
  };
}

export function useCustomerPromos(userId: string | undefined) {
  const query = useQuery({
    queryKey: ["customer-promos", userId],
    enabled: Boolean(userId) && isSupabaseConfigured,
    queryFn: () => fetchCustomerPromoState(userId as string),
    staleTime: 30_000,
  });

  return {
    promos: query.data?.promos ?? [],
    firstOrderEligible: query.data?.firstOrderEligible ?? false,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
