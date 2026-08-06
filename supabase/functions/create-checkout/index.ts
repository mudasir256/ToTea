import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

type CheckoutItem = {
  menuItemId: string;
  quantity: number;
  size: string;
  toppingIds?: string[];
  sweetness?: string;
  ice?: string;
};

type CheckoutBody = {
  idempotencyKey: string;
  sourceId: string;
  customerName: string;
  customerEmail?: string;
  contactNumber: string;
  items: CheckoutItem[];
  shippingAddress: {
    address_line_1: string;
    address_line_2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  saveContact?: boolean;
};

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function getCorsHeaders(origin: string | null): Record<string, string> {
  const allowed = (Deno.env.get("ALLOWED_ORIGINS") || "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

  const allowOrigin =
    allowed.length === 0
      ? "*"
      : origin && allowed.includes(origin)
        ? origin
        : allowed[0];

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
  };
}

function json(
  status: number,
  body: Record<string, unknown>,
  corsHeaders: Record<string, string>,
) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function squareBaseUrl() {
  return Deno.env.get("SQUARE_ENVIRONMENT") === "production"
    ? "https://connect.squareup.com"
    : "https://connect.squareupsandbox.com";
}

function dollarsFromCents(cents: number) {
  return Math.round(cents) / 100;
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req.headers.get("Origin"));

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json(405, { error: "Method not allowed." }, corsHeaders);
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const squareToken = Deno.env.get("SQUARE_ACCESS_TOKEN");
    const locationId = Deno.env.get("SQUARE_LOCATION_ID");
    const taxRateBps = Number(Deno.env.get("TAX_RATE_BPS") || "0");

    if (!squareToken || !locationId) {
      return json(500, { error: "Checkout is temporarily unavailable." }, corsHeaders);
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return json(401, { error: "Authentication required." }, corsHeaders);
    }

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const admin = createClient(supabaseUrl, serviceKey);

    const {
      data: { user },
      error: userError,
    } = await userClient.auth.getUser();
    if (userError || !user) {
      return json(401, { error: "Invalid session. Please sign in again." }, corsHeaders);
    }

    const body = (await req.json()) as CheckoutBody;

    if (!body?.idempotencyKey || !UUID_RE.test(body.idempotencyKey)) {
      return json(400, { error: "A valid checkout idempotency key is required." }, corsHeaders);
    }
    if (!body?.sourceId || typeof body.sourceId !== "string") {
      return json(400, { error: "Invalid payment token." }, corsHeaders);
    }
    if (!body.customerName?.trim()) {
      return json(400, { error: "Customer name is required." }, corsHeaders);
    }
    const contact = body.contactNumber?.trim();
    if (!contact || contact.length < 7) {
      return json(400, { error: "A valid contact number is required." }, corsHeaders);
    }
    if (!Array.isArray(body.items) || body.items.length === 0) {
      return json(400, { error: "Your cart is empty." }, corsHeaders);
    }
    if (!body.shippingAddress?.address_line_1 || !body.shippingAddress?.city) {
      return json(400, { error: "Pickup / shipping address is required." }, corsHeaders);
    }

    // Idempotent replay
    const { data: existingOrder } = await admin
      .from("orders")
      .select("id")
      .eq("idempotency_key", body.idempotencyKey)
      .maybeSingle();
    if (existingOrder?.id) {
      return json(200, { orderId: existingOrder.id, reused: true }, corsHeaders);
    }

    const customerEmail = (
      body.customerEmail ||
      user.email ||
      ""
    )
      .trim()
      .toLowerCase();
    if (!customerEmail) {
      return json(400, { error: "A valid email is required." }, corsHeaders);
    }

    // Authoritative pricing from menu tables
    const menuItemIds = [...new Set(body.items.map((item) => item.menuItemId))];
    if (menuItemIds.some((id) => !UUID_RE.test(id))) {
      return json(400, { error: "One or more cart items are invalid." }, corsHeaders);
    }

    const { data: menuItems, error: menuError } = await admin
      .from("menu_items")
      .select("id, name, image_url, is_available, menu_item_variants(id, size, price)")
      .in("id", menuItemIds)
      .eq("is_available", true);

    if (menuError || !menuItems?.length) {
      return json(400, { error: "Unable to load menu items for checkout." }, corsHeaders);
    }

    const allToppingIds = [
      ...new Set(body.items.flatMap((item) => item.toppingIds ?? [])),
    ];
    let toppingsById = new Map<
      string,
      { id: string; name: string; category: string; price: number }
    >();
    if (allToppingIds.length > 0) {
      const { data: toppings, error: toppingError } = await admin
        .from("menu_toppings")
        .select("id, name, category, price, is_available")
        .in("id", allToppingIds)
        .eq("is_available", true);
      if (toppingError) {
        return json(400, { error: "Unable to load toppings for checkout." }, corsHeaders);
      }
      toppingsById = new Map((toppings ?? []).map((t) => [t.id, t]));
    }

    const { data: stockRows, error: stockError } = await admin.rpc(
      "get_public_menu_stock",
      { p_menu_item_id: null },
    );
    if (stockError) {
      console.error("stock lookup failed", stockError);
      return json(
        503,
        { error: "Unable to confirm stock right now. Please try again shortly." },
        corsHeaders,
      );
    }
    const stock = (stockRows ?? []) as Array<{
      menu_item_id: string;
      size: string;
      available_quantity: number;
    }>;

    const pricedItems: Array<{
      menu_item_id: string;
      name: string;
      image_url: string;
      size: string;
      sweetness?: string;
      ice?: string;
      base_price: number;
      toppings: Array<{ id: string; name: string; category: string; price: number }>;
      topping_total: number;
      quantity: number;
      unit_price: number;
      line_total: number;
      unit_price_cents: number;
      line_total_cents: number;
    }> = [];

    let subtotalCents = 0;

    for (const line of body.items) {
      const qty = Math.floor(Number(line.quantity));
      if (!Number.isFinite(qty) || qty < 1 || qty > 25) {
        return json(400, { error: "Invalid item quantity." }, corsHeaders);
      }

      const menuItem = menuItems.find((item) => item.id === line.menuItemId);
      if (!menuItem) {
        return json(400, { error: "An item in your cart is no longer available." }, corsHeaders);
      }

      const variants = (menuItem.menu_item_variants ?? []) as Array<{
        id: string;
        size: string;
        price: number;
      }>;
      const variant = variants.find(
        (entry) => entry.size.trim().toLowerCase() === String(line.size).trim().toLowerCase(),
      );
      if (!variant) {
        return json(
          400,
          { error: `Size "${line.size}" is unavailable for ${menuItem.name}.` },
          corsHeaders,
        );
      }

      const available =
        stock.find(
          (entry) =>
            entry.menu_item_id === menuItem.id &&
            entry.size.trim().toLowerCase() === variant.size.trim().toLowerCase(),
        )?.available_quantity ?? 0;

      if (available < qty) {
        return json(
          400,
          { error: `Insufficient stock for ${menuItem.name} (${variant.size}).` },
          corsHeaders,
        );
      }

      const selectedToppings = (line.toppingIds ?? [])
        .map((id) => toppingsById.get(id))
        .filter(Boolean) as Array<{
        id: string;
        name: string;
        category: string;
        price: number;
      }>;

      // Match storefront: milk tea / brown sugar drinks include 1 free standard topping.
      const includesFreeTopping =
        /milk\s*tea|boba\s*milk|brown\s*sugar/i.test(menuItem.name);
      let freeStandardApplied = false;
      const pricedToppings = selectedToppings.map((topping) => {
        const isStandard = String(topping.category).toLowerCase() === "standard";
        if (includesFreeTopping && isStandard && !freeStandardApplied) {
          freeStandardApplied = true;
          return { ...topping, price: 0 };
        }
        return topping;
      });

      const baseCents = Math.round(Number(variant.price) * 100);
      const toppingCents = pricedToppings.reduce(
        (sum, topping) => sum + Math.round(Number(topping.price) * 100),
        0,
      );
      const unitCents = baseCents + toppingCents;
      const lineCents = unitCents * qty;
      subtotalCents += lineCents;

      pricedItems.push({
        menu_item_id: menuItem.id,
        name: menuItem.name,
        image_url: menuItem.image_url,
        size: variant.size,
        sweetness: line.sweetness?.trim() || undefined,
        ice: line.ice?.trim() || undefined,
        base_price: dollarsFromCents(baseCents),
        toppings: pricedToppings.map((topping) => ({
          id: topping.id,
          name: topping.name,
          category: topping.category,
          price: Number(topping.price),
        })),
        topping_total: dollarsFromCents(toppingCents),
        quantity: qty,
        unit_price: dollarsFromCents(unitCents),
        line_total: dollarsFromCents(lineCents),
        unit_price_cents: unitCents,
        line_total_cents: lineCents,
      });
    }

    const taxCents = Math.round(
      Math.max(0, subtotalCents) * (Number.isFinite(taxRateBps) ? taxRateBps / 10000 : 0),
    );
    const totalCents = subtotalCents + taxCents;

    if (totalCents < 1) {
      return json(400, { error: "Order total is invalid." }, corsHeaders);
    }

    const squareOrderPayload = {
      idempotency_key: `${body.idempotencyKey}-order`,
      order: {
        location_id: locationId,
        reference_id: body.idempotencyKey.slice(0, 40),
        line_items: pricedItems.map((item) => ({
          name: item.name,
          quantity: String(item.quantity),
          base_price_money: {
            amount: item.unit_price_cents,
            currency: "USD",
          },
          note: [
            item.size,
            item.sweetness ? `Sweet ${item.sweetness}` : null,
            item.ice,
            ...item.toppings.map((topping) => topping.name),
          ]
            .filter(Boolean)
            .join(" · "),
        })),
        ...(taxCents > 0
          ? {
              service_charges: [
                {
                  name: "Sales Tax",
                  amount_money: { amount: taxCents, currency: "USD" },
                  calculation_phase: "TOTAL_PHASE",
                },
              ],
            }
          : {}),
        fulfillments: [
          {
            type: "PICKUP",
            state: "PROPOSED",
            pickup_details: {
              recipient: {
                display_name: body.customerName.trim(),
                email_address: customerEmail,
                phone_number: contact,
              },
              schedule_type: "ASAP",
            },
          },
        ],
      },
    };

    const orderRes = await fetch(`${squareBaseUrl()}/v2/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${squareToken}`,
        "Content-Type": "application/json",
        "Square-Version": "2025-01-23",
      },
      body: JSON.stringify(squareOrderPayload),
    });
    const orderJson = await orderRes.json();
    if (!orderRes.ok) {
      console.error("Square order failed", orderJson);
      return json(400, { error: "Unable to create your order. Please try again." }, corsHeaders);
    }

    const squareOrderId = orderJson.order?.id as string;
    const squareOrderTotal = Number(orderJson.order?.total_money?.amount);
    if (!squareOrderId || !Number.isFinite(squareOrderTotal)) {
      return json(400, { error: "Payment provider returned an invalid order." }, corsHeaders);
    }

    const paymentRes = await fetch(`${squareBaseUrl()}/v2/payments`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${squareToken}`,
        "Content-Type": "application/json",
        "Square-Version": "2025-01-23",
      },
      body: JSON.stringify({
        idempotency_key: `${body.idempotencyKey}-payment`,
        source_id: body.sourceId,
        amount_money: { amount: squareOrderTotal, currency: "USD" },
        location_id: locationId,
        order_id: squareOrderId,
        autocomplete: true,
        buyer_email_address: customerEmail,
      }),
    });
    const paymentJson = await paymentRes.json();
    if (!paymentRes.ok) {
      console.error("Square payment failed", paymentJson);
      return json(
        400,
        {
          error: "Payment was declined. Please check your card and try again.",
          squareCode: paymentJson?.errors?.[0]?.code || null,
        },
        corsHeaders,
      );
    }

    const payment = paymentJson.payment;
    const squarePaymentId = payment?.id as string | undefined;
    const paymentStatus = payment?.status as string | undefined;
    if (!squarePaymentId || paymentStatus !== "COMPLETED") {
      return json(400, { error: "Payment could not be completed. Please try again." }, corsHeaders);
    }

    const orderNumber = `TO-${Date.now().toString(36).toUpperCase()}`;
    const orderPayload = {
      order_number: orderNumber,
      user_id: user.id,
      customer_details: {
        name: body.customerName.trim(),
        email: customerEmail,
        contact_number: contact,
      },
      items: pricedItems.map((item) => ({
        menu_item_id: item.menu_item_id,
        name: item.name,
        image_url: item.image_url,
        size: item.size,
        sweetness: item.sweetness || null,
        ice: item.ice || null,
        base_price: item.base_price,
        toppings: item.toppings,
        topping_total: item.topping_total,
        quantity: item.quantity,
        unit_price: item.unit_price,
        line_total: item.line_total,
      })),
      shipping_address: {
        address_line_1: body.shippingAddress.address_line_1.trim(),
        address_line_2: body.shippingAddress.address_line_2?.trim() || "",
        city: body.shippingAddress.city.trim(),
        state: body.shippingAddress.state.trim(),
        postal_code: body.shippingAddress.postal_code.trim(),
        country: body.shippingAddress.country.trim() || "US",
      },
      total: dollarsFromCents(squareOrderTotal),
      order_status: "confirmed",
      payment_status: "paid",
      payment_method: "square_card",
      square_order_id: squareOrderId,
      square_payment_id: squarePaymentId,
      idempotency_key: body.idempotencyKey,
    };

    const { data: inserted, error: insertError } = await admin
      .from("orders")
      .insert(orderPayload)
      .select("id")
      .single();

    if (insertError || !inserted?.id) {
      console.error("Order insert failed after payment", insertError);
      return json(
        500,
        {
          error:
            "Payment succeeded but order saving failed. Support will reconcile using your payment reference.",
          squarePaymentId,
        },
        corsHeaders,
      );
    }

    if (body.saveContact !== false) {
      await admin
        .from("profiles")
        .update({
          contact_number: contact,
          full_name: body.customerName.trim(),
          address_line_1: body.shippingAddress.address_line_1.trim(),
          city: body.shippingAddress.city.trim(),
          state: body.shippingAddress.state.trim(),
          postal_code: body.shippingAddress.postal_code.trim(),
          country: body.shippingAddress.country.trim() || "US",
        })
        .eq("id", user.id);
    }

    return json(
      200,
      {
        orderId: inserted.id,
        squareOrderId,
        squarePaymentId,
        totalCents: squareOrderTotal,
      },
      corsHeaders,
    );
  } catch (error) {
    console.error(error);
    return json(500, { error: "An unexpected checkout error occurred." }, corsHeaders);
  }
});
