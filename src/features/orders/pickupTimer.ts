/** Prep window shown on the confirmation page (matches store ASAP estimate). */
export const PICKUP_PREP_MINUTES = 15;
export const PICKUP_PREP_MS = PICKUP_PREP_MINUTES * 60 * 1000;

export const STORE_PICKUP = {
  name: "Totea — Manassas",
  addressLine1: "9534 Liberia Ave",
  cityLine: "Manassas, VA 20110",
  shortCity: "Manassas, VA",
  hoursToday: "10:00 AM – 9:00 PM",
  phoneDisplay: "(703) 555-0100",
  phoneHref: "tel:+17035550100",
  mapsUrl: "https://maps.google.com/?q=9534+Liberia+Ave+Manassas+VA+20110",
} as const;

export function pickupCodeFromOrderNumber(orderNumber: string) {
  const cleaned = orderNumber.replace(/^TO-?/i, "").replace(/[^A-Za-z0-9]/g, "");
  if (cleaned.length >= 5) return cleaned.slice(-5).toUpperCase();
  return (orderNumber.slice(-5) || orderNumber).toUpperCase();
}

export function pickupReadyAt(createdAt: string, prepMs = PICKUP_PREP_MS) {
  return new Date(createdAt).getTime() + prepMs;
}

export function formatCountdown(totalSeconds: number) {
  const clamped = Math.max(0, totalSeconds);
  const minutes = Math.floor(clamped / 60);
  const seconds = clamped % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
