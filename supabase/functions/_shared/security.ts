/** Constant-time string comparison to prevent timing attacks on HMAC signatures. */
export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

export function parsePositiveInt(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0 || !Number.isInteger(parsed)) {
    return fallback;
  }
  return parsed;
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isValidUuid(value: string): boolean {
  return UUID_RE.test(value);
}

export function sanitizeClientError(
  fallback: string,
  detail?: string | null
): string {
  if (!detail) return fallback;
  const lower = detail.toLowerCase();
  if (
    lower.includes("insufficient stock") ||
    lower.includes("cart is empty") ||
    lower.includes("cart not found")
  ) {
    return detail;
  }
  return fallback;
}
