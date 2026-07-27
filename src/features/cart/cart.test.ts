import { describe, expect, it } from "vitest";
import { calcCartSubtotal, calcLineTotal, calcOrderTotals, formatMoney } from "@/lib/money";
import { isSafeReturnPath, normalizePhone, contactNumberSchema, signupSchema } from "@/lib/validation";
import {
  buildCartVariantId,
  mergeItems,
  type LocalCartItem,
} from "@/features/cart/CartProvider";
import { catalogProducts, getCatalogProductByName } from "@/data/catalog";

describe("money helpers", () => {
  it("formats USD cents", () => {
    expect(formatMoney(2599)).toBe("$25.99");
  });

  it("calculates line and cart totals", () => {
    expect(calcLineTotal(2500, 2)).toBe(5000);
    expect(
      calcCartSubtotal([
        { unit_price_cents: 2500, quantity: 2 },
        { unit_price_cents: 1800, quantity: 1 },
      ])
    ).toBe(6800);
  });

  it("calculates order totals with shipping tax discount", () => {
    const totals = calcOrderTotals(10000, {
      shippingCents: 500,
      discountCents: 1000,
      taxRate: 0.1,
    });
    expect(totals.taxCents).toBe(900);
    expect(totals.totalCents).toBe(10400);
  });
});

describe("validation helpers", () => {
  it("accepts valid signup data", () => {
    const result = signupSchema.safeParse({
      fullName: "Ada Lovelace",
      email: "ada@gmail.com",
      password: "password123",
      confirmPassword: "password123",
    });
    expect(result.success).toBe(true);
  });

  it("validates contact numbers and normalizes whitespace", () => {
    expect(contactNumberSchema.safeParse("(703) 555-0100").success).toBe(true);
    expect(normalizePhone("  703   555 0100 ")).toBe("703 555 0100");
  });

  it("only allows safe same-origin return paths", () => {
    expect(isSafeReturnPath("/checkout")).toBe(true);
    expect(isSafeReturnPath("//evil.com")).toBe(false);
    expect(isSafeReturnPath("https://evil.com")).toBe(false);
  });
});

describe("catalog", () => {
  it("seeds all menu drinks with Regular and Large USD prices", () => {
    expect(catalogProducts).toHaveLength(26);
    const classic = getCatalogProductByName("Classic Milk Tea");
    expect(classic?.variants).toHaveLength(2);
    expect(classic?.variants[0].unitPriceCents).toBe(1800);
    expect(classic?.variants[1].unitPriceCents).toBe(2600);
  });
});

describe("cart merge", () => {
  it("deduplicates by variant and caps at stock", () => {
    const existing: LocalCartItem[] = [
      {
        id: "1",
        product_id: "p1",
        product_variant_id: "v1",
        product_name: "Classic Milk Tea",
        product_image: null,
        selected_options: { size: "Regular" },
        quantity: 2,
        unit_price_cents: 1800,
        stock_quantity: 3,
      },
    ];
    const incoming: LocalCartItem[] = [
      {
        id: "2",
        product_id: "p1",
        product_variant_id: "v1",
        product_name: "Classic Milk Tea",
        product_image: null,
        selected_options: { size: "Regular" },
        quantity: 5,
        unit_price_cents: 1800,
        stock_quantity: 3,
      },
    ];
    const merged = mergeItems(existing, incoming);
    expect(merged).toHaveLength(1);
    expect(merged[0].quantity).toBe(3);
  });

  it("keeps same size with different toppings as separate lines", () => {
    const existing: LocalCartItem[] = [
      {
        id: "1",
        product_id: "p1",
        product_variant_id: "p1:regular:toppings:t1",
        product_name: "Salt Coffee",
        product_image: null,
        selected_options: {
          size: "Regular",
          toppings: [{ id: "t1", name: "Honey Boba", price_cents: 75 }],
        },
        quantity: 1,
        unit_price_cents: 2575,
        stock_quantity: 5,
      },
    ];
    const incoming: LocalCartItem[] = [
      {
        id: "2",
        product_id: "p1",
        product_variant_id: "p1:regular:toppings:t2",
        product_name: "Salt Coffee",
        product_image: null,
        selected_options: {
          size: "Regular",
          toppings: [{ id: "t2", name: "Sea Salt Cream", price_cents: 150 }],
        },
        quantity: 1,
        unit_price_cents: 2650,
        stock_quantity: 5,
      },
    ];
    const merged = mergeItems(existing, incoming);
    expect(merged).toHaveLength(2);
  });
});

describe("buildCartVariantId", () => {
  it("includes sorted topping ids when present", () => {
    expect(buildCartVariantId("p1", "Regular")).toBe("p1:regular");
    expect(
      buildCartVariantId("p1", "Regular", [
        { id: "b", name: "Jelly", price_cents: 0 },
        { id: "a", name: "Honey Boba", price_cents: 75 },
      ]),
    ).toBe("p1:regular:toppings:a,b");
  });
});
