/**
 * Menu card badges.
 *
 * "Bestseller" is controlled from the admin dashboard (`menu_items.is_bestseller`).
 * "House Specialty" remains a small curated list until that flag is added in admin.
 */

const HOUSE_SPECIALTIES = [
  "Egg Vietnamese Coffee",
  "Matcha Latte",
  "Crème Brûlée Brown Sugar Milk",
];

const HOUSE_SPECIALTY_BY_NAME = new Map(
  HOUSE_SPECIALTIES.map((name) => [name.toLowerCase(), "House Specialty"] as const),
);

export function badgeFor(item: {
  name: string;
  is_bestseller?: boolean | null;
}): string | null {
  if (item.is_bestseller) return "Bestseller";
  return HOUSE_SPECIALTY_BY_NAME.get(item.name.trim().toLowerCase()) ?? null;
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
