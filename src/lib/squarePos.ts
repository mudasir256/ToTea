const POS_PENDING_KEY = "totea_pos_pending_v1";
const POS_SDK_VERSION = "v2.0";

export type PosPendingCheckout = {
  idempotencyKey: string;
  totalCents: number;
  customerName: string;
  contactNumber: string;
  createdAt: number;
};

export type PosCallbackResult =
  | {
      ok: true;
      clientTransactionId: string | null;
      serverTransactionId: string | null;
    }
  | {
      ok: false;
      errorCode: string;
      errorDescription?: string;
    };

function getApplicationId(): string {
  const id = (import.meta.env.VITE_SQUARE_APPLICATION_ID as string | undefined)?.trim();
  if (!id || id.includes("xxxxxxxx")) {
    throw new Error("Square Application ID is not configured.");
  }
  return id;
}

export function getPosCallbackUrl(): string {
  const origin =
    typeof window !== "undefined" && window.location?.origin
      ? window.location.origin
      : (import.meta.env.VITE_APP_URL as string | undefined)?.replace(/\/$/, "") ||
        "http://localhost:8080";
  return `${origin}/pos/callback`;
}

export function savePosPending(pending: PosPendingCheckout): void {
  sessionStorage.setItem(POS_PENDING_KEY, JSON.stringify(pending));
}

export function loadPosPending(): PosPendingCheckout | null {
  try {
    const raw = sessionStorage.getItem(POS_PENDING_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PosPendingCheckout;
  } catch {
    return null;
  }
}

export function clearPosPending(): void {
  sessionStorage.removeItem(POS_PENDING_KEY);
}

export function isMobilePosDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export function isAndroidDevice(): boolean {
  return /Android/i.test(navigator.userAgent);
}

export function isIosDevice(): boolean {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

/** Build Square POS deep-link for the current mobile OS. */
export function buildSquarePosChargeUrl(input: {
  totalCents: number;
  note?: string;
}): string {
  const applicationId = getApplicationId();
  const callbackUrl = getPosCallbackUrl();
  const amount = Math.max(0, Math.round(input.totalCents));

  if (isAndroidDevice()) {
    const tenderTypes = [
      "com.squareup.pos.TENDER_CARD",
      "com.squareup.pos.TENDER_CARD_ON_FILE",
      "com.squareup.pos.TENDER_CASH",
      "com.squareup.pos.TENDER_OTHER",
    ].join(",");

    return (
      "intent:#Intent;" +
      "action=com.squareup.pos.action.CHARGE;" +
      "package=com.squareup;" +
      `S.browser_fallback_url=${encodeURIComponent(callbackUrl)};` +
      `S.com.squareup.pos.WEB_CALLBACK_URI=${callbackUrl};` +
      `S.com.squareup.pos.CLIENT_ID=${applicationId};` +
      `S.com.squareup.pos.API_VERSION=${POS_SDK_VERSION};` +
      `i.com.squareup.pos.TOTAL_AMOUNT=${amount};` +
      "S.com.squareup.pos.CURRENCY_CODE=USD;" +
      `S.com.squareup.pos.TENDER_TYPES=${tenderTypes};` +
      (input.note ? `S.com.squareup.pos.NOTE=${encodeURIComponent(input.note)};` : "") +
      "end"
    );
  }

  // iOS (and default for non-Android mobile)
  const dataParameter = {
    amount_money: {
      amount: String(amount),
      currency_code: "USD",
    },
    callback_url: callbackUrl,
    client_id: applicationId,
    version: "1.3",
    notes: input.note || "ToTea in-store order",
    options: {
      supported_tender_types: [
        "CREDIT_CARD",
        "CASH",
        "OTHER",
        "SQUARE_GIFT_CARD",
        "CARD_ON_FILE",
      ],
    },
  };

  return (
    "square-commerce-v1://payment/create?data=" +
    encodeURIComponent(JSON.stringify(dataParameter))
  );
}

export function parsePosCallback(search: string, hash: string): PosCallbackResult {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);

  // Android returns flat query params
  const androidError = params.get("com.squareup.pos.ERROR_CODE");
  if (androidError) {
    return {
      ok: false,
      errorCode: androidError,
      errorDescription: params.get("com.squareup.pos.ERROR_DESCRIPTION") || undefined,
    };
  }

  const androidServerId = params.get("com.squareup.pos.SERVER_TRANSACTION_ID");
  const androidClientId = params.get("com.squareup.pos.CLIENT_TRANSACTION_ID");
  if (androidServerId || androidClientId) {
    return {
      ok: true,
      clientTransactionId: androidClientId,
      serverTransactionId: androidServerId,
    };
  }

  // iOS returns ?data=<json> (sometimes in hash)
  const dataRaw =
    params.get("data") ||
    new URLSearchParams(hash.startsWith("#") ? hash.slice(1) : hash).get("data");

  if (!dataRaw) {
    return { ok: false, errorCode: "missing_callback_data" };
  }

  try {
    const decoded = decodeURIComponent(dataRaw);
    const info = JSON.parse(decoded) as Record<string, unknown>;

    if (typeof info.error_code === "string") {
      return {
        ok: false,
        errorCode: info.error_code,
        errorDescription:
          typeof info.error_description === "string" ? info.error_description : undefined,
      };
    }

    return {
      ok: true,
      clientTransactionId:
        typeof info.client_transaction_id === "string" ? info.client_transaction_id : null,
      serverTransactionId:
        typeof info.transaction_id === "string" ? info.transaction_id : null,
    };
  } catch {
    return { ok: false, errorCode: "invalid_callback_data" };
  }
}
