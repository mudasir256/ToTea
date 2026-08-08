/**
 * Marketing badges & Dietary flags.
 *
 * Marketing Badges (Filled background, max 2 per card):
 * - Bestseller⚡, Signature, House special, New, Staff pick, Seasonal, Limited, Last call⚡, Back in stock⚡, Sold out⚡
 *
 * Dietary Flags (Outlined, unlimited):
 * - Dairy-free, Vegan, Vegetarian, Gluten-free, Sugar-free, Decaf, Contains nuts, Iced, Hot, Single origin
 */

export type MarketingBadgeType =
  | "Bestseller⚡"
  | "Signature"
  | "House special"
  | "New"
  | "Staff pick"
  | "Seasonal"
  | "Limited"
  | "Last call⚡"
  | "Back in stock⚡"
  | "Sold out⚡";

export const MARKETING_BADGE_STYLES: Record<string, string> = {
  "Bestseller⚡": "bg-[#e0edff] text-[#1d5ec4] border-transparent font-medium",
  Bestseller: "bg-[#e0edff] text-[#1d5ec4] border-transparent font-medium",
  Signature: "bg-[#fef3d6] text-[#8c591b] border-transparent font-medium",
  "House special": "bg-[#ffe8d6] text-[#b85614] border-transparent font-medium",
  "House Specialty": "bg-[#ffe8d6] text-[#b85614] border-transparent font-medium",
  New: "bg-[#e0f2fe] text-[#0369a1] border-transparent font-medium",
  "Staff pick": "bg-[#e0e7ff] text-[#4338ca] border-transparent font-medium",
  Seasonal: "bg-[#dcfce7] text-[#15803d] border-transparent font-medium",
  Limited: "bg-[#ffe4e6] text-[#be123c] border-transparent font-medium",
  "Last call⚡": "bg-[#fee2e2] text-[#b91c1c] border-transparent font-medium",
  "Back in stock⚡": "bg-[#dcfce7] text-[#166534] border-transparent font-medium",
  "Sold out⚡": "bg-[#f3f4f6] text-[#4b5563] border-transparent font-medium",
};

const HOUSE_SPECIALTIES = [
  "Egg Vietnamese Coffee",
  "Matcha Latte",
  "Crème Brûlée Brown Sugar Milk",
];

const HOUSE_SPECIALTY_BY_NAME = new Map(
  HOUSE_SPECIALTIES.map((name) => [name.toLowerCase(), "House special"] as const),
);

export function badgeFor(item: {
  name: string;
  is_bestseller?: boolean | null;
}): string | null {
  if (item.is_bestseller) return "Bestseller⚡";
  return HOUSE_SPECIALTY_BY_NAME.get(item.name.trim().toLowerCase()) ?? null;
}

/** Short at-a-glance dietary flags under the card description. */
export function chipsFor(allergens: string, sizeCount: number): string[] {
  const chips = allergens
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);

  if (chips.length === 0 && sizeCount > 1) {
    chips.push("Customizable");
  }
  return chips;
}
