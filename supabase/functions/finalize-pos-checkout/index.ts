import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import {
  isValidUuid,
  parsePositiveInt,
  sanitizeClientError,
} from "../_shared/security.ts";

type PosBody = {
  idempotencyKey: string;
  clientTransactionId?: string | null;
  serverTransactionId?: string | null;
  customerName: string;
  contactNumber: string;
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

async function lookupSquarePayment(
  squareToken: string,
  locationId: string,
  serverTransactionId: string | null | undefined,
  clientTransactionId: string | null | undefined
): Promise<{ paymentId: string; orderId: string | null; amount: number; status: string } | null> {
  const headers = {
    Authorization: `Bearer ${squareToken}`,
    "Content-Type": "application/json",
    "Square-Version": "2025-01-23",
  };

  // Prefer server transaction id as a payment id when available
  if (serverTransactionId) {
    const paymentRes = await fetch(`${squareBaseUrl()}/v2/payments/${serverTransactionId}`, {
      headers,
    });
    if (paymentRes.ok) {
      const paymentJson = await paymentRes.json();
      const payment = paymentJson.payment;
      if (payment?.id) {
        return {
          paymentId: payment.id,
          orderId: payment.order_id || null,
          amount: Number(payment.amount_money?.amount || 0),
          status: String(payment.status || ""),
        };
      }
    }
  }

  // Fallback: search recent payments at this location and match note/reference
  const searchRes = await fetch(`${squareBaseUrl()}/v2/payments`, {
    method: "GET",
    headers,
  });

  // List endpoint needs query params — use SearchPayments instead
  const body: Record<string, unknown> = {
    location_ids: [locationId],
    sort_order: "DESC",
    limit: 25,
  };

  const searchPost = await fetch(`${squareBaseUrl()}/v2/payments/search`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (!searchPost.ok) return null;
  const searchJson = await searchPost.json();
  const payments = (searchJson.payments || []) as Array<Record<string, unknown>>;

  for (const payment of payments) {
    const id = String(payment.id || "");
    const orderId = payment.order_id ? String(payment.order_id) : null;
    const note = String(payment.note || "");
    const matchesServer = serverTransactionId && (id === serverTransactionId || orderId === serverTransactionId);
    const matchesClient =
      clientTransactionId &&
      (note.includes(clientTransactionId) || id === clientTransactionId);

    if (matchesServer || matchesClient) {
      return {
        paymentId: id,
        orderId,
        amount: Number((payment.amount_money as { amount?: number })?.amount || 0),
        status: String(payment.status || ""),
      };
    }
  }

  // If we only have a client id (cash / offline), allow finalize with synthetic ids
  if (clientTransactionId && !serverTransactionId) {
    return {
      paymentId: `pos-client-${clientTransactionId}`,
      orderId: null,
      amount: -1, // signal: skip amount check, trust lock_and_price_cart total
      status: "COMPLETED",
    };
  }

  return null;
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
    const taxRateBps = parsePositiveInt(Deno.env.get("TAX_RATE_BPS"), 0);
    const posShipping = 0;

    if (!squareToken || !locationId) {
      return json(500, { error: "POS checkout is temporarily unavailable." }, corsHeaders);
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

    const body = (await req.json()) as PosBody;
    if (!body?.idempotencyKey || !isValidUuid(body.idempotencyKey)) {
      return json(400, { error: "A valid idempotency key is required." }, corsHeaders);
    }
    if (!body.customerName?.trim() || body.customerName.trim().length > 200) {
      return json(400, { error: "Customer name is required." }, corsHeaders);
    }
    const contact = body.contactNumber?.trim();
    if (!contact || contact.length < 7 || contact.length > 32) {
      return json(400, { error: "A valid contact number is required." }, corsHeaders);
    }
    if (!body.clientTransactionId && !body.serverTransactionId) {
      return json(400, { error: "Missing Square POS transaction identifiers." }, corsHeaders);
    }

    const customerEmail = (user.email || "").trim().toLowerCase();
    if (!customerEmail) {
      return json(400, { error: "Your account must have an email." }, corsHeaders);
    }

    const { data: existingAttempt } = await admin
      .from("checkout_attempts")
      .select("order_id")
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
          channel: "square_pos",
          customerName: body.customerName.trim(),
          contactNumber: contact,
          clientTransactionId: body.clientTransactionId,
          serverTransactionId: body.serverTransactionId,
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
            "Unable to process your cart. Please review items and try again.",
            priceError.message
          ),
        },
        corsHeaders
      );
    }

    const subtotal = Number(priced.subtotal_cents || 0);
    const discount = 0;
    const tax = Math.round(Math.max(0, subtotal - discount) * (taxRateBps / 10000));
    const total = Math.max(0, subtotal - discount + tax + posShipping);

    const squarePayment = await lookupSquarePayment(
      squareToken,
      locationId,
      body.serverTransactionId,
      body.clientTransactionId
    );

    if (!squarePayment) {
      await updateAttempt(admin, user.id, body.idempotencyKey, {
        status: "failed",
        error_message: "Could not verify Square POS payment",
      });
      return json(
        400,
        { error: "Could not verify the Square POS payment. Try again or contact support." },
        corsHeaders
      );
    }

    if (squarePayment.status && squarePayment.status !== "COMPLETED" && squarePayment.amount >= 0) {
      await updateAttempt(admin, user.id, body.idempotencyKey, {
        status: "failed",
        error_message: `Unexpected POS payment status: ${squarePayment.status}`,
      });
      return json(400, { error: "POS payment was not completed." }, corsHeaders);
    }

    if (squarePayment.amount >= 0 && squarePayment.amount !== total) {
      await updateAttempt(admin, user.id, body.idempotencyKey, {
        status: "failed",
        error_message: `POS amount mismatch: charged ${squarePayment.amount}, expected ${total}`,
      });
      return json(400, { error: "Payment amount does not match the cart total." }, corsHeaders);
    }

    // In-store pickup address snapshot
    const shippingAddress = {
      address_line_1: "In-store pickup",
      address_line_2: "",
      city: "Local",
      state: "NA",
      postal_code: "00000",
      country: "US",
    };

    const { data: orderId, error: finalizeError } = await admin.rpc("finalize_paid_order", {
      p_user_id: user.id,
      p_idempotency_key: body.idempotencyKey,
      p_customer_name: body.customerName.trim(),
      p_customer_email: customerEmail,
      p_contact_number: contact,
      p_shipping_address: shippingAddress,
      p_payment_method: "square_pos",
      p_square_order_id: squarePayment.orderId,
      p_square_payment_id: squarePayment.paymentId,
      p_shipping_amount_cents: posShipping,
      p_tax_amount_cents: tax,
      p_discount_amount_cents: discount,
      p_save_contact: true,
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
            "POS payment succeeded but order finalization failed. Support will reconcile using the transaction id.",
          squarePaymentId: squarePayment.paymentId,
        },
        corsHeaders
      );
    }

    await updateAttempt(admin, user.id, body.idempotencyKey, {
      status: "completed",
      order_id: orderId,
      response_payload: {
        channel: "square_pos",
        squarePaymentId: squarePayment.paymentId,
        squareOrderId: squarePayment.orderId,
        total,
      },
    });

    return json(
      200,
      {
        orderId,
        squarePaymentId: squarePayment.paymentId,
        totalCents: total,
      },
      corsHeaders
    );
  } catch (error) {
    console.error(error);
    return json(500, { error: "An unexpected POS checkout error occurred." }, corsHeaders);
  }
});
