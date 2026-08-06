import type { MenuOptionLevel } from "@/types/database";

/** Fallback if option levels fail to load from Supabase. */
export const FALLBACK_SUGAR_LEVELS = [
  "Less Sugar",
  "Light Sugar",
  "Minimal Sugar",
  "No Added",
  "Super Sweet",
  "normal",
] as const;

export const FALLBACK_ICE_LEVELS = [
  "No Ice",
  "Less Ice",
  "Normal Ice",
  "More Ice",
] as const;

export const DEFAULT_SWEETNESS = "Less Sugar";
export const DEFAULT_ICE = "Normal Ice";

/** Milk tea includes 1 free standard topping; other categories charge for all. */
export function drinkIncludesFreeTopping(itemName: string): boolean {
  return /milk\s*tea|boba\s*milk|brown\s*sugar/i.test(itemName);
}

export const MAX_STANDARD_TOPPINGS_MILK_TEA = 3; // 1 free + 2 additional
export const MAX_STANDARD_TOPPINGS_DEFAULT = 2;

export function levelsOfKind(
  levels: MenuOptionLevel[],
  kind: "sugar" | "ice",
): MenuOptionLevel[] {
  return levels
    .filter((level) => level.kind === kind && level.is_active)
    .sort((left, right) => left.sort_order - right.sort_order);
}

export function defaultLevelName(
  levels: MenuOptionLevel[],
  kind: "sugar" | "ice",
  preferredId?: string | null,
): string {
  const active = levelsOfKind(levels, kind);
  if (preferredId) {
    const preferred = active.find((level) => level.id === preferredId);
    if (preferred) return preferred.name;
  }
  const markedDefault = active.find((level) => level.is_default);
  if (markedDefault) return markedDefault.name;
  if (active[0]) return active[0].name;
  return kind === "sugar" ? DEFAULT_SWEETNESS : DEFAULT_ICE;
}

export function sugarLevelNames(levels: MenuOptionLevel[]): string[] {
  const names = levelsOfKind(levels, "sugar").map((level) => level.name);
  return names.length > 0 ? names : [...FALLBACK_SUGAR_LEVELS];
}

export function iceLevelNames(levels: MenuOptionLevel[]): string[] {
  const names = levelsOfKind(levels, "ice").map((level) => level.name);
  return names.length > 0 ? names : [...FALLBACK_ICE_LEVELS];
}

/** Admin section toggles: only an explicit `false` hides the section on the storefront. */
export function isToppingSectionEnabled(
  settings: { standard_toppings_enabled?: boolean; cream_toppings_enabled?: boolean } | null | undefined,
  category: "standard" | "cream",
): boolean {
  if (!settings) return true;
  if (category === "standard") return settings.standard_toppings_enabled !== false;
  return settings.cream_toppings_enabled !== false;
}
