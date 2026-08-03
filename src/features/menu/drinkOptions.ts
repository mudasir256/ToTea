/** Matches the paper menu / design-spec customization levels. */
export const SWEETNESS_LEVELS = ["0%", "30%", "50%", "70%", "100%"] as const;
export const ICE_LEVELS = ["No ice", "Less ice", "Normal ice", "More ice"] as const;
export const MILK_OPTIONS = ["Fresh whole milk", "Condensed milk"] as const;

export const DEFAULT_SWEETNESS = "100%";
export const DEFAULT_ICE = "Normal ice";
export const DEFAULT_MILK = "Fresh whole milk";

/** Milk tea includes 1 free standard topping; other categories charge for all. */
export function drinkIncludesFreeTopping(itemName: string): boolean {
  return /milk\s*tea|boba\s*milk|brown\s*sugar/i.test(itemName);
}

export const MAX_STANDARD_TOPPINGS_MILK_TEA = 3; // 1 free + 2 additional
export const MAX_STANDARD_TOPPINGS_DEFAULT = 2;
