/**
 * Authoritative local catalog used for seeding Supabase and offline/demo fallback.
 * Prices: USD cents derived from current display ranges (Regular = low, Large = high).
 */

export type CatalogVariant = {
  sizeLabel: "Regular" | "Large";
  unitPriceCents: number;
  stockQuantity: number;
};

export type CatalogProduct = {
  slug: string;
  name: string;
  category: string;
  description: string;
  ingredients: string[];
  allergens: string[];
  calories?: string;
  isHero?: boolean;
  sortOrder: number;
  variants: CatalogVariant[];
};

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function range(lowDollars: number, highDollars: number): CatalogVariant[] {
  return [
    { sizeLabel: "Regular", unitPriceCents: Math.round(lowDollars * 100), stockQuantity: 100 },
    { sizeLabel: "Large", unitPriceCents: Math.round(highDollars * 100), stockQuantity: 100 },
  ];
}

type SeedInput = {
  name: string;
  category: string;
  description: string;
  ingredients: string[];
  allergens?: string[];
  calories?: string;
  isHero?: boolean;
  low: number;
  high: number;
};

const seeds: SeedInput[] = [
  {
    name: "Vietnamese Sea Salt Coffee",
    category: "Vietnamese Coffee",
    description:
      "A unique twist on traditional Vietnamese coffee, featuring our signature sea salt cream that creates a perfect balance of sweet and savory.",
    ingredients: ["Vietnamese Coffee", "Sea Salt Cream", "Condensed Milk", "Ice"],
    allergens: ["Dairy"],
    calories: "180-250 cal",
    isHero: true,
    low: 25,
    high: 35,
  },
  {
    name: "Ube Vietnamese Coffee",
    category: "Vietnamese Coffee",
    description:
      "Experience the fusion of Filipino and Vietnamese flavors with our Ube Vietnamese Coffee.",
    ingredients: ["Vietnamese Coffee", "Ube Extract", "Condensed Milk", "Ube Cream", "Ice"],
    allergens: ["Dairy"],
    calories: "200-280 cal",
    low: 28,
    high: 38,
  },
  {
    name: "Egg Vietnamese Coffee",
    category: "Vietnamese Coffee",
    description:
      "A traditional Vietnamese favorite with a rich, custard-like egg cream topping.",
    ingredients: ["Vietnamese Coffee", "Egg Cream", "Condensed Milk", "Sugar", "Ice"],
    allergens: ["Eggs", "Dairy"],
    calories: "220-300 cal",
    low: 26,
    high: 36,
  },
  {
    name: "Brown Sugar Milk",
    category: "Brown Sugar & Crème Brûlée",
    description: "An indulgent drink featuring our signature brown sugar syrup mixed with fresh milk.",
    ingredients: ["Brown Sugar Syrup", "Fresh Milk", "Ice"],
    allergens: ["Dairy"],
    calories: "150-220 cal",
    low: 20,
    high: 28,
  },
  {
    name: "Brown Sugar Milk Tea",
    category: "Brown Sugar & Crème Brûlée",
    description: "Premium tea leaves with signature brown sugar syrup and fresh milk.",
    ingredients: ["Premium Tea", "Brown Sugar Syrup", "Fresh Milk", "Ice"],
    allergens: ["Dairy"],
    calories: "180-250 cal",
    low: 22,
    high: 30,
  },
  {
    name: "Crème Brûlée Brown Sugar Milk",
    category: "Brown Sugar & Crème Brûlée",
    description: "Dessert-inspired drink featuring crème brûlée with brown sugar milk.",
    ingredients: ["Brown Sugar Syrup", "Crème Brûlée Cream", "Fresh Milk", "Caramel Drizzle", "Ice"],
    allergens: ["Dairy"],
    calories: "250-350 cal",
    low: 28,
    high: 38,
  },
  {
    name: "Classic Milk Tea",
    category: "Classic & Flavored Milk Teas",
    description: "Signature classic milk tea made with premium tea leaves and fresh milk.",
    ingredients: ["Premium Black Tea", "Fresh Milk", "Sugar", "Ice"],
    allergens: ["Dairy"],
    calories: "140-200 cal",
    low: 18,
    high: 26,
  },
  {
    name: "Thai Milk Tea",
    category: "Classic & Flavored Milk Teas",
    description: "Authentic Thai milk tea with its distinctive orange color and bold, spiced flavor.",
    ingredients: ["Thai Tea Leaves", "Condensed Milk", "Sugar", "Spices", "Ice"],
    allergens: ["Dairy"],
    calories: "200-280 cal",
    low: 22,
    high: 30,
  },
  {
    name: "Roasted Oolong Milk Tea",
    category: "Classic & Flavored Milk Teas",
    description: "Premium roasted oolong tea with fresh milk and toasty, nutty flavors.",
    ingredients: ["Roasted Oolong Tea", "Fresh Milk", "Sugar", "Ice"],
    allergens: ["Dairy"],
    calories: "160-230 cal",
    low: 24,
    high: 32,
  },
  {
    name: "Ube Milk Tea",
    category: "Classic & Flavored Milk Teas",
    description: "Purple-hued milk tea featuring the sweet, earthy flavor of ube.",
    ingredients: ["Premium Tea", "Ube Extract", "Fresh Milk", "Ube Cream", "Ice"],
    allergens: ["Dairy"],
    calories: "220-300 cal",
    low: 26,
    high: 34,
  },
  {
    name: "Pistachio Milk Tea",
    category: "Classic & Flavored Milk Teas",
    description: "Nutty and creamy milk tea featuring real pistachio flavor.",
    ingredients: ["Premium Tea", "Pistachio Syrup", "Fresh Milk", "Pistachio Cream", "Ice"],
    allergens: ["Dairy", "Tree Nuts"],
    calories: "240-320 cal",
    low: 28,
    high: 36,
  },
  {
    name: "Horchata Milk Tea",
    category: "Classic & Flavored Milk Teas",
    description: "Latin and Asian fusion milk tea with cinnamon and rice notes.",
    ingredients: ["Premium Tea", "Horchata Base", "Cinnamon", "Fresh Milk", "Ice"],
    allergens: ["Dairy"],
    calories: "200-280 cal",
    low: 24,
    high: 32,
  },
  {
    name: "Mango Milk Tea",
    category: "Classic & Flavored Milk Teas",
    description: "Tropical milk tea featuring real mango puree with premium tea.",
    ingredients: ["Premium Tea", "Mango Puree", "Fresh Milk", "Sugar", "Ice"],
    allergens: ["Dairy"],
    calories: "220-300 cal",
    low: 24,
    high: 32,
  },
  {
    name: "Honeydew Milk Tea",
    category: "Classic & Flavored Milk Teas",
    description: "Subtly sweet milk tea featuring delicate honeydew melon flavor.",
    ingredients: ["Premium Tea", "Honeydew Syrup", "Fresh Milk", "Ice"],
    allergens: ["Dairy"],
    calories: "180-250 cal",
    low: 22,
    high: 30,
  },
  {
    name: "Matcha Latte",
    category: "Matcha Collection",
    description: "Creamy matcha latte made with premium Japanese matcha powder.",
    ingredients: ["Premium Matcha Powder", "Fresh Milk", "Sugar", "Ice"],
    allergens: ["Dairy"],
    calories: "160-230 cal",
    low: 26,
    high: 34,
  },
  {
    name: "Strawberry Matcha Latte",
    category: "Matcha Collection",
    description: "Layered strawberry puree with creamy matcha and fresh milk.",
    ingredients: ["Premium Matcha Powder", "Strawberry Puree", "Fresh Milk", "Sugar", "Ice"],
    allergens: ["Dairy"],
    calories: "200-280 cal",
    low: 28,
    high: 36,
  },
  {
    name: "Mango Matcha Latte",
    category: "Matcha Collection",
    description: "Tropical twist on matcha featuring sweet mango puree.",
    ingredients: ["Premium Matcha Powder", "Mango Puree", "Fresh Milk", "Sugar", "Ice"],
    allergens: ["Dairy"],
    calories: "220-300 cal",
    low: 28,
    high: 36,
  },
  {
    name: "Coconut Matcha",
    category: "Matcha Collection",
    description: "Tropical matcha with coconut milk — a dairy-free option.",
    ingredients: ["Premium Matcha Powder", "Coconut Milk", "Sugar", "Ice"],
    allergens: [],
    calories: "180-250 cal",
    low: 26,
    high: 34,
  },
  {
    name: "Sea Salt Jasmine Tea",
    category: "Fruit & Refreshing Teas",
    description: "Refreshing jasmine tea topped with signature sea salt cream.",
    ingredients: ["Jasmine Tea", "Sea Salt Cream", "Sugar", "Ice"],
    allergens: ["Dairy"],
    calories: "120-180 cal",
    low: 22,
    high: 30,
  },
  {
    name: "Peach Oolong Tea",
    category: "Fruit & Refreshing Teas",
    description: "Light oolong tea infused with natural peach flavor.",
    ingredients: ["Oolong Tea", "Peach Syrup", "Sugar", "Ice"],
    allergens: [],
    calories: "100-160 cal",
    low: 20,
    high: 28,
  },
  {
    name: "Strawberry Passionfruit Tea",
    category: "Fruit & Refreshing Teas",
    description: "Sweet strawberry and exotic passionfruit tea.",
    ingredients: ["Premium Tea", "Strawberry Puree", "Passionfruit Syrup", "Sugar", "Ice"],
    allergens: [],
    calories: "140-200 cal",
    low: 24,
    high: 32,
  },
  {
    name: "Grapefruit Tea",
    category: "Fruit & Refreshing Teas",
    description: "Zesty tea featuring tangy grapefruit flavor.",
    ingredients: ["Premium Tea", "Grapefruit Juice", "Sugar", "Ice"],
    allergens: [],
    calories: "110-170 cal",
    low: 20,
    high: 28,
  },
  {
    name: "Mango Sago Coconut Milk",
    category: "Specialty Dessert Drink",
    description: "Dessert drink with mango chunks, sago pearls, and coconut milk.",
    ingredients: ["Fresh Mango", "Sago Pearls", "Coconut Milk", "Sugar", "Ice"],
    allergens: [],
    calories: "280-380 cal",
    isHero: true,
    low: 32,
    high: 42,
  },
  {
    name: "Avocado Smoothie",
    category: "Smoothies",
    description: "Rich creamy smoothie made with fresh avocado and milk.",
    ingredients: ["Fresh Avocado", "Fresh Milk", "Condensed Milk", "Ice"],
    allergens: ["Dairy"],
    calories: "300-400 cal",
    low: 26,
    high: 34,
  },
  {
    name: "Ube Smoothie",
    category: "Smoothies",
    description: "Vibrant purple smoothie featuring sweet ube flavor.",
    ingredients: ["Ube Extract", "Fresh Milk", "Condensed Milk", "Ice"],
    allergens: ["Dairy"],
    calories: "320-420 cal",
    low: 28,
    high: 36,
  },
  {
    name: "Matcha Smoothie",
    category: "Smoothies",
    description: "Creamy energizing smoothie with premium matcha powder.",
    ingredients: ["Premium Matcha Powder", "Fresh Milk", "Sugar", "Ice"],
    allergens: ["Dairy"],
    calories: "240-320 cal",
    low: 26,
    high: 34,
  },
];

export const catalogProducts: CatalogProduct[] = seeds.map((item, index) => ({
  slug: slugify(item.name),
  name: item.name,
  category: item.category,
  description: item.description,
  ingredients: item.ingredients,
  allergens: item.allergens ?? [],
  calories: item.calories,
  isHero: item.isHero,
  sortOrder: index + 1,
  variants: range(item.low, item.high),
}));

export function getCatalogProductByName(name: string): CatalogProduct | undefined {
  return catalogProducts.find((p) => p.name === name);
}

export function getCatalogProductBySlug(slug: string): CatalogProduct | undefined {
  return catalogProducts.find((p) => p.slug === slug);
}

export function formatUsd(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}
