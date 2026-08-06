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

export const getMenuImage = (itemName: string): string | undefined => {
  return menuImageMap[itemName];
};

export const getToppingImage = (toppingName: string): string | undefined => {
  return toppingImageMap[toppingName];
};

/** Prefer local optimized card image; fall back to Supabase URL. */
export function resolveMenuCardImage(
  name: string,
  remoteUrl?: string | null,
): string {
  return getMenuImage(name) || (remoteUrl ?? "").trim();
}

export function resolveToppingCardImage(
  name: string,
  remoteUrl?: string | null,
): string {
  return getToppingImage(name) || (remoteUrl ?? "").trim();
}
