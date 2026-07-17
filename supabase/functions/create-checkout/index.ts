import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import {
  isValidUuid,
  parsePositiveInt,
  sanitizeClientError,
} from "../_shared/security.ts";

type CheckoutBody = {
  idempotencyKey: string;
  sourceId: string;
  customerName: string;
  customerEmail?: string;
  contactNumber: string;
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
  corsHeaders: Record<string, string>
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

function validateCheckoutBody(body: CheckoutBody): string | null {
  if (!body?.idempotencyKey || !isValidUuid(body.idempotencyKey)) {
    return "A valid checkout idempotency key is required.";
  }
  if (!body?.sourceId || typeof body.sourceId !== "string" || body.sourceId.length > 512) {
    return "Invalid payment token.";
  }
  if (!body.shippingAddress || typeof body.shippingAddress !== "object") {
    return "Shipping address is required.";
  }

  const addr = body.shippingAddress;
  const requiredFields: Array<[string, string | undefined, number]> = [
    ["address line 1", addr.address_line_1, 200],
    ["city", addr.city, 100],
    ["state", addr.state, 100],
    ["postal code", addr.postal_code, 20],
    ["country", addr.country, 100],
  ];

  for (const [label, value, max] of requiredFields) {
    if (!value || typeof value !== "string" || value.trim().length < 2 || value.length > max) {
      return `A valid ${label} is required.`;
    }
  }

  if (addr.address_line_2 && addr.address_line_2.length > 200) {
    return "Address line 2 is too long.";
  }

  if (!body.customerName?.trim() || body.customerName.trim().length > 200) {
    return "Customer name is required.";
  }

  const contact = body.contactNumber?.trim();
  if (!contact || contact.length < 7 || contact.length > 32) {
    return "A valid contact number is required.";
  }

  return null;
}

async function updateAttempt(
  admin: ReturnType<typeof createClient>,
  userId: string,
  idempotencyKey: string,
  patch: Record<string, unknown>
) {
  await admin
    .from("checkout_attempts")
    .update(patch)
    .eq("user_id", userId)
    .eq("idempotency_key", idempotencyKey);
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
    const shippingAmount = parsePositiveInt(
      Deno.env.get("SHIPPING_AMOUNT_CENTS"),
      0
    );
    const taxRateBps = parsePositiveInt(Deno.env.get("TAX_RATE_BPS"), 0);

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
      return json(401, { error: "Invalid session." }, corsHeaders);
    }

    const body = (await req.json()) as CheckoutBody;
    const validationError = validateCheckoutBody(body);
    if (validationError) {
      return json(400, { error: validationError }, corsHeaders);
    }

    const customerEmail = (user.email || "").trim().toLowerCase();
    if (!customerEmail) {
      return json(400, { error: "Your account must have a verified email." }, corsHeaders);
    }

    const { data: existingAttempt } = await admin
      .from("checkout_attempts")
      .select("order_id, status, user_id")
      .eq("user_id", user.id)
      .eq("idempotency_key", body.idempotencyKey)
      .maybeSingle();

    if (existingAttempt?.order_id) {
      return json(200, { orderId: existingAttempt.order_id, reused: true }, corsHeaders);
    }

    await admin.from("checkout_attempts").upsert(
      {
        user_id: user.id,
        idempotency_key: body.idempotencyKey,
        status: "started",
        request_payload: {
          customerName: body.customerName.trim(),
          customerEmail,
          contactNumber: body.contactNumber.trim(),
          shippingAddress: body.shippingAddress,
        },
      },
      { onConflict: "user_id,idempotency_key" }
    );

    const { data: priced, error: priceError } = await admin.rpc("lock_and_price_cart", {
      p_user_id: user.id,
    });
    if (priceError) {
      await updateAttempt(admin, user.id, body.idempotencyKey, {
        status: "failed",
        error_message: priceError.message,
      });
      return json(
        400,
        {
          error: sanitizeClientError(
            "Unable to process your cart. Please review your items and try again.",
            priceError.message
          ),
        },
        corsHeaders
      );
    }

    const subtotal = Number(priced.subtotal_cents || 0);
    const discount = 0;
    const tax = Math.round(Math.max(0, subtotal - discount) * (taxRateBps / 10000));
    const items = priced.items as Array<Record<string, unknown>>;

    const squareOrderPayload = {
      idempotency_key: `${body.idempotencyKey}-order`,
      order: {
        location_id: locationId,
        reference_id: body.idempotencyKey.slice(0, 40),
        line_items: items.map((item) => ({
          name: String(item.product_name),
          quantity: String(item.quantity),
          base_price_money: {
            amount: Number(item.unit_price_cents),
            currency: "USD",
          },
          note: `Size: ${String((item.selected_options as { size?: string })?.size || "")}`,
        })),
        // Fixed-amount service charges avoid percentage tax rounding mismatches with CreatePayment.
        ...(tax > 0 || shippingAmount > 0
          ? {
              service_charges: [
                ...(tax > 0
                  ? [
                      {
                        name: "Sales Tax",
                        amount_money: { amount: tax, currency: "USD" },
                        calculation_phase: "TOTAL_PHASE",
                      },
                    ]
                  : []),
                ...(shippingAmount > 0
                  ? [
                      {
                        name: "Shipping",
                        amount_money: { amount: shippingAmount, currency: "USD" },
                        calculation_phase: "TOTAL_PHASE",
                      },
                    ]
                  : []),
              ],
            }
          : {}),
        fulfillments: [
          {
            type: "SHIPMENT",
            state: "PROPOSED",
            shipment_details: {
              recipient: {
                display_name: body.customerName.trim(),
                email_address: customerEmail,
                phone_number: body.contactNumber.trim(),
                address: {
                  address_line_1: body.shippingAddress.address_line_1.trim(),
                  address_line_2: body.shippingAddress.address_line_2?.trim() || undefined,
                  locality: body.shippingAddress.city.trim(),
                  administrative_district_level_1: body.shippingAddress.state.trim(),
                  postal_code: body.shippingAddress.postal_code.trim(),
                  country: body.shippingAddress.country.trim() || "US",
                },
              },
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
      await updateAttempt(admin, user.id, body.idempotencyKey, {
        status: "failed",
        error_message: "Square order creation failed",
        response_payload: orderJson,
      });
      return json(400, { error: "Unable to create your order. Please try again." }, corsHeaders);
    }

    const squareOrderId = orderJson.order?.id as string;
    const squareOrderTotal = Number(orderJson.order?.total_money?.amount);
    if (!squareOrderId || !Number.isFinite(squareOrderTotal)) {
      return json(400, { error: "Payment provider returned an invalid order." }, corsHeaders);
    }

    // Charge exactly what Square calculated for the order (required when order_id is set).
    const chargeAmount = squareOrderTotal;

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
        amount_money: { amount: chargeAmount, currency: "USD" },
        location_id: locationId,
        order_id: squareOrderId,
        autocomplete: true,
        buyer_email_address: customerEmail,
      }),
    });
    const paymentJson = await paymentRes.json();
    if (!paymentRes.ok) {
      const squareDetail =
        paymentJson?.errors?.[0]?.detail ||
        paymentJson?.errors?.[0]?.code ||
        "Square payment failed";
      console.error("Square payment failed:", paymentJson);
      await updateAttempt(admin, user.id, body.idempotencyKey, {
        status: "failed",
        error_message: String(squareDetail),
        response_payload: paymentJson,
      });
      return json(
        400,
        {
          error: "Payment was declined. Please check your card and try again.",
          squareCode: paymentJson?.errors?.[0]?.code || null,
        },
        corsHeaders
      );
    }

    const payment = paymentJson.payment;
    const squarePaymentId = payment?.id as string | undefined;
    const paymentStatus = payment?.status as string | undefined;
    const chargedAmount = payment?.amount_money?.amount as number | undefined;

    if (!squarePaymentId || paymentStatus !== "COMPLETED") {
      await updateAttempt(admin, user.id, body.idempotencyKey, {
        status: "failed",
        error_message: `Unexpected payment status: ${paymentStatus || "unknown"}`,
        response_payload: paymentJson,
      });
      return json(400, { error: "Payment could not be completed. Please try again." }, corsHeaders);
    }

    if (chargedAmount !== chargeAmount) {
      await updateAttempt(admin, user.id, body.idempotencyKey, {
        status: "failed",
        error_message: "Charged amount mismatch",
        response_payload: paymentJson,
      });
      return json(400, { error: "Payment amount mismatch. Please contact support." }, corsHeaders);
    }

    const { data: orderId, error: finalizeError } = await admin.rpc("finalize_paid_order", {
      p_user_id: user.id,
      p_idempotency_key: body.idempotencyKey,
      p_customer_name: body.customerName.trim(),
      p_customer_email: customerEmail,
      p_contact_number: body.contactNumber.trim(),
      p_shipping_address: body.shippingAddress,
      p_payment_method: "square_card",
      p_square_order_id: squareOrderId,
      p_square_payment_id: squarePaymentId,
      p_shipping_amount_cents: shippingAmount,
      p_tax_amount_cents: tax,
      p_discount_amount_cents: discount,
      p_save_contact: body.saveContact !== false,
    });

    if (finalizeError) {
      await updateAttempt(admin, user.id, body.idempotencyKey, {
        status: "failed",
        error_message: finalizeError.message,
      });
      return json(
        500,
        {
          error:
            "Payment succeeded but order finalization failed. Support will reconcile using your payment reference.",
          squarePaymentId,
        },
        corsHeaders
      );
    }

    await updateAttempt(admin, user.id, body.idempotencyKey, {
      status: "completed",
      order_id: orderId,
      response_payload: { squareOrderId, squarePaymentId, total: chargeAmount },
    });

    return json(
      200,
      { orderId, squareOrderId, squarePaymentId, totalCents: chargeAmount },
      corsHeaders
    );
  } catch (error) {
    console.error(error);
    return json(500, { error: "An unexpected checkout error occurred." }, corsHeaders);
  }
});
