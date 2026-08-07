import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { createHmac } from "node:crypto";
import { timingSafeEqual } from "../_shared/security.ts";

function json(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function verifySignature(
  body: string,
  signature: string | null,
  url: string,
  key: string
): boolean {
  if (!signature) return false;
  const payload = url + body;
  const hmac = createHmac("sha256", key).update(payload).digest("base64");
  return timingSafeEqual(hmac, signature);
}

const TERMINAL_PAYMENT_STATUSES = new Set(["paid", "refunded", "cancelled"]);
const TERMINAL_ORDER_STATUSES = new Set(["cancelled", "refunded", "delivered"]);

serve(async (req) => {
  if (req.method !== "POST") {
    return json(405, { error: "Method not allowed" });
  }

  try {
    const signatureKey = Deno.env.get("SQUARE_WEBHOOK_SIGNATURE_KEY");
    const notificationUrl = Deno.env.get("SQUARE_WEBHOOK_NOTIFICATION_URL");

    if (!signatureKey || !notificationUrl) {
      return json(500, { error: "Webhook not configured" });
    }

    const bodyText = await req.text();
    const signature = req.headers.get("x-square-hmacsha256-signature");

    if (!verifySignature(bodyText, signature, notificationUrl, signatureKey)) {
      return json(401, { error: "Invalid signature" });
    }

    const event = JSON.parse(bodyText) as {
      event_id?: string;
      type?: string;
      data?: { object?: { payment?: { id?: string; status?: string; order_id?: string } } };
    };

    const eventId = event.event_id;
    if (!eventId) {
      return json(400, { error: "Missing event id" });
    }

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { error: dedupError } = await admin.from("webhook_events").insert({
      provider: "square",
      event_id: eventId,
      event_type: event.type || null,
    });

    if (dedupError?.code === "23505") {
      return json(200, { ok: true, duplicate: true });
    }
    if (dedupError) {
      console.error("Webhook dedup failed:", dedupError);
      return json(500, { error: "Failed to record webhook event" });
    }

    const payment = event.data?.object?.payment;
    if (!payment?.id) {
      return json(200, { ok: true, ignored: true });
    }

    const status = payment.status;
    let paymentStatus: string | null = null;
    let orderStatus: string | null = null;

    if (status === "COMPLETED") {
      paymentStatus = "paid";
      orderStatus = "confirmed";
    } else if (status === "FAILED" || status === "CANCELED") {
      paymentStatus = status === "FAILED" ? "failed" : "cancelled";
      orderStatus = "cancelled";
    } else if (status === "PENDING") {
      paymentStatus = "pending";
    }

    if (!paymentStatus) {
      return json(200, { ok: true, ignored: true });
    }

    const { data: order, error: orderError } = await admin
      .from("orders")
      .select("id, payment_status, order_status")
      .eq("square_payment_id", payment.id)
      .maybeSingle();

    if (orderError) {
      console.error("Order lookup failed:", orderError);
      return json(500, { error: "Order lookup failed" });
    }

    if (!order) {
      return json(200, { ok: true, unmatched: true });
    }

    if (
      TERMINAL_PAYMENT_STATUSES.has(order.payment_status) &&
      paymentStatus !== "paid"
    ) {
      return json(200, { ok: true, skipped: "terminal_status" });
    }

    if (
      orderStatus &&
      TERMINAL_ORDER_STATUSES.has(order.order_status) &&
      orderStatus === "cancelled"
    ) {
      return json(200, { ok: true, skipped: "terminal_order_status" });
    }

    const { error: updateError } = await admin
      .from("orders")
      .update({
        payment_status: paymentStatus,
        ...(orderStatus ? { order_status: orderStatus } : {}),
      })
      .eq("id", order.id);

    if (updateError) {
      console.error("Order update failed:", updateError);
      return json(500, { error: "Order update failed" });
    }

    if (orderStatus) {
      const { error: historyError } = await admin.from("order_status_history").insert({
        order_id: order.id,
        status: orderStatus,
        note: `Square webhook: ${status}`,
        updated_by: "square-webhook",
      });
      if (historyError) {
        console.error("Status history insert failed:", historyError);
      }
    }

    if (paymentStatus === "paid") {
      const { data: inventoryResult, error: inventoryError } = await admin.rpc(
        "deduct_inventory_for_paid_order",
        { p_order_id: order.id },
      );
      if (inventoryError) {
        console.error("Square inventory deduction failed", inventoryError);
        return json(500, { error: "Inventory deduction failed" });
      }
      if (
        inventoryResult?.status !== "deducted" &&
        inventoryResult?.status !== "already_deducted"
      ) {
        console.warn("Square payment needs inventory review", inventoryResult);
      }
    }

    return json(200, { ok: true });
  } catch (error) {
    console.error(error);
    return json(500, { error: "Webhook processing failed" });
  }
});
