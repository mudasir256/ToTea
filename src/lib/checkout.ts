const CHECKOUT_IDEM_KEY = "totea_checkout_idempotency";

export function getOrCreateCheckoutIdempotencyKey(): string {
  const existing = sessionStorage.getItem(CHECKOUT_IDEM_KEY);
  if (existing) return existing;
  const key = crypto.randomUUID();
  sessionStorage.setItem(CHECKOUT_IDEM_KEY, key);
  return key;
}

export function clearCheckoutIdempotencyKey(): void {
  sessionStorage.removeItem(CHECKOUT_IDEM_KEY);
}
