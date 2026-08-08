/**
 * Same-origin optimized card images under /public/menu and /public/toppings.
 * Served by Vite/nginx — much faster than remote Supabase storage from AP.
 */

export const menuImageMap: Record<string, string> = {
  "Vietnamese Sea Salt Coffee": "/menu/vietnamese-sea-salt-coffee.webp",
  "Ube Vietnamese Coffee": "/menu/ube-vietnamese-coffee.webp",
  "Egg Vietnamese Coffee": "/menu/egg-vietnamese-coffee.webp",
  "Brown Sugar Milk": "/menu/brown-sugar-milk.webp",
  "Brown Sugar Milk Tea": "/menu/brown-sugar-milk-tea.webp",
  "Crème Brûlée Brown Sugar Milk": "/menu/creme-brulee-brown-sugar-milk.webp",
  "Classic Milk Tea": "/menu/classic-milk-tea.webp",
  "Thai Milk Tea": "/menu/thai-milk-tea.webp",
  "Roasted Oolong Milk Tea": "/menu/roasted-oolong-milk-tea.webp",
  "Ube Milk Tea": "/menu/ube-milk-tea.webp",
  "Pistachio Milk Tea": "/menu/pistachio-milk-tea.webp",
  "Horchata Milk Tea": "/menu/horchata-milk-tea.webp",
  "Mango Milk Tea": "/menu/mango-milk-tea.webp",
  "Honeydew Milk Tea": "/menu/honeydew-milk-tea.webp",
  "Matcha Latte": "/menu/matcha-latte.webp",
  "Strawberry Matcha Latte": "/menu/strawberry-matcha-latte.webp",
  "Mango Matcha Latte": "/menu/mango-matcha-latte.webp",
  "Coconut Matcha": "/menu/coconut-matcha.webp",
  "Sea Salt Jasmine Tea": "/menu/sea-salt-jasmine-tea.webp",
  "Peach Oolong Tea": "/menu/peach-oolong-tea.webp",
  "Strawberry Passionfruit Tea": "/menu/strawberry-passionfruit-tea.webp",
  "Grapefruit Tea": "/menu/grapefruit-tea.webp",
  "Mango Sago Coconut Milk": "/menu/mango-sago-coconut-milk.webp",
  "Avocado Smoothie": "/menu/avocado-smoothie.webp",
  "Ube Smoothie": "/menu/ube-smoothie.webp",
  "Matcha Smoothie": "/menu/matcha-smoothie.webp",
};

export const toppingImageMap: Record<string, string> = {
  "Honey Boba": "/toppings/honey-boba.webp",
  "Jelly": "/toppings/jelly.webp",
  "Sea Salt Cream": "/toppings/sea-salt-cream.webp",
  "Ube Cream": "/toppings/ube-cream.webp",
  "Matcha Cream": "/toppings/matcha-cream.webp",
  "Egg Cream": "/toppings/egg-cream.webp",
};

export const DEFAULT_MENU_IMAGE = "/menu/classic-milk-tea.webp";
export const DEFAULT_TOPPING_IMAGE = "/toppings/honey-boba.webp";

export const getMenuImage = (itemName: string): string | undefined => {
  if (!itemName) return DEFAULT_MENU_IMAGE;
  if (menuImageMap[itemName]) return menuImageMap[itemName];

  const lower = itemName.toLowerCase();
  
  if (lower.includes("vietnamese") || lower.includes("coffee") || lower.includes("salt")) {
    if (lower.includes("ube")) return menuImageMap["Ube Vietnamese Coffee"];
    if (lower.includes("egg")) return menuImageMap["Egg Vietnamese Coffee"];
    return menuImageMap["Vietnamese Sea Salt Coffee"];
  }
  if (lower.includes("brown sugar")) {
    if (lower.includes("crème") || lower.includes("creme") || lower.includes("brulee")) return menuImageMap["Crème Brûlée Brown Sugar Milk"];
    if (lower.includes("tea")) return menuImageMap["Brown Sugar Milk Tea"];
    return menuImageMap["Brown Sugar Milk"];
  }
  if (lower.includes("thai")) return menuImageMap["Thai Milk Tea"];
  if (lower.includes("ube")) return lower.includes("smoothie") ? menuImageMap["Ube Smoothie"] : menuImageMap["Ube Milk Tea"];
  if (lower.includes("matcha")) {
    if (lower.includes("strawberry")) return menuImageMap["Strawberry Matcha Latte"];
    if (lower.includes("mango")) return menuImageMap["Mango Matcha Latte"];
    if (lower.includes("coconut")) return menuImageMap["Coconut Matcha"];
    if (lower.includes("smoothie")) return menuImageMap["Matcha Smoothie"];
    return menuImageMap["Matcha Latte"];
  }
  if (lower.includes("mango")) {
    if (lower.includes("sago") || lower.includes("coconut")) return menuImageMap["Mango Sago Coconut Milk"];
    return menuImageMap["Mango Milk Tea"];
  }
  if (lower.includes("smoothie") || lower.includes("avocado")) return menuImageMap["Avocado Smoothie"];
  if (lower.includes("jasmine")) return menuImageMap["Sea Salt Jasmine Tea"];
  if (lower.includes("oolong")) return lower.includes("peach") ? menuImageMap["Peach Oolong Tea"] : menuImageMap["Roasted Oolong Milk Tea"];
  if (lower.includes("strawberry") || lower.includes("passion")) return menuImageMap["Strawberry Passionfruit Tea"];
  if (lower.includes("grapefruit")) return menuImageMap["Grapefruit Tea"];
  if (lower.includes("honeydew")) return menuImageMap["Honeydew Milk Tea"];
  if (lower.includes("horchata")) return menuImageMap["Horchata Milk Tea"];
  if (lower.includes("pistachio")) return menuImageMap["Pistachio Milk Tea"];
  if (lower.includes("milk tea") || lower.includes("classic")) return menuImageMap["Classic Milk Tea"];

  return DEFAULT_MENU_IMAGE;
};

export const getToppingImage = (toppingName: string): string | undefined => {
  if (!toppingName) return DEFAULT_TOPPING_IMAGE;
  if (toppingImageMap[toppingName]) return toppingImageMap[toppingName];

  const lower = toppingName.toLowerCase();
  if (lower.includes("boba") || lower.includes("tapioca") || lower.includes("pearl")) return toppingImageMap["Honey Boba"];
  if (lower.includes("jelly") || lower.includes("aloe") || lower.includes("pudding")) return toppingImageMap["Jelly"];
  if (lower.includes("ube")) return toppingImageMap["Ube Cream"];
  if (lower.includes("matcha")) return toppingImageMap["Matcha Cream"];
  if (lower.includes("egg")) return toppingImageMap["Egg Cream"];
  if (lower.includes("salt") || lower.includes("cream") || lower.includes("foam")) return toppingImageMap["Sea Salt Cream"];

  return DEFAULT_TOPPING_IMAGE;
};

/** Prefer local optimized card image; fall back to Supabase URL or default boba image. */
export function resolveMenuCardImage(
  name: string,
  remoteUrl?: string | null,
): string {
  const remote = (remoteUrl ?? "").trim();
  if (remote) return remote;
  return getMenuImage(name) || DEFAULT_MENU_IMAGE;
}

export function resolveToppingCardImage(
  name: string,
  remoteUrl?: string | null,
): string {
  const remote = (remoteUrl ?? "").trim();
  if (remote) return remote;
  return getToppingImage(name) || DEFAULT_TOPPING_IMAGE;
}
