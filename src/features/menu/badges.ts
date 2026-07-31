/**
 * "Bestseller" / "House Specialty" badges from the design spec.
 *
 * There is no badge column on `menu_items`, so the picks live here. Edit the two
 * lists below (drink names, case-insensitive) to change which cards get a badge.
 * Move this to the database if the team needs to change it without a deploy.
 */
const BESTSELLERS = [
  "Brown Sugar Milk Tea",
  "Vietnamese Sea Salt Coffee",
  "Classic Milk Tea",
];

const HOUSE_SPECIALTIES = [
  "Egg Vietnamese Coffee",
  "Matcha Latte",
  "Crème Brûlée Brown Sugar Milk",
];

const BADGE_BY_NAME = new Map<string, string>([
  ...BESTSELLERS.map((name) => [name.toLowerCase(), "Bestseller"] as const),
  ...HOUSE_SPECIALTIES.map((name) => [name.toLowerCase(), "House Specialty"] as const),
]);

export function badgeFor(itemName: string): string | null {
  return BADGE_BY_NAME.get(itemName.trim().toLowerCase()) ?? null;
}

/** Short at-a-glance chips under the card description. */
export function chipsFor(allergens: string, sizeCount: number): string[] {
  const chips = allergens
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => `Contains ${entry.toLowerCase()}`);

  if (sizeCount > 1) chips.push("Customizable");
  return chips;
}
