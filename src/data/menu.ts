export interface MenuItem {
  name: string;
  isHero?: boolean;
}

export interface MenuCategory {
  title: string;
  items: MenuItem[];
  icon: string;
}

export interface Topping {
  name: string;
  isHero?: boolean;
  category: 'standard' | 'cream';
}

export const menuCategories: MenuCategory[] = [
  {
    title: "Vietnamese Coffee",
    icon: "☕",
    items: [
      { name: "Vietnamese Sea Salt Coffee", isHero: true },
      { name: "Ube Vietnamese Coffee" },
      { name: "Egg Vietnamese Coffee" },
    ],
  },
  {
    title: "Brown Sugar & Crème Brûlée",
    icon: "🍮",
    items: [
      { name: "Brown Sugar Milk" },
      { name: "Brown Sugar Milk Tea" },
      { name: "Crème Brûlée Brown Sugar Milk" },
    ],
  },
  {
    title: "Classic & Flavored Milk Teas",
    icon: "🧋",
    items: [
      { name: "Classic Milk Tea" },
      { name: "Thai Milk Tea" },
      { name: "Roasted Oolong Milk Tea" },
      { name: "Ube Milk Tea" },
      { name: "Pistachio Milk Tea" },
      { name: "Horchata Milk Tea" },
      { name: "Mango Milk Tea" },
      { name: "Honeydew Milk Tea" },
    ],
  },
  {
    title: "Matcha Collection",
    icon: "🍵",
    items: [
      { name: "Matcha Latte" },
      { name: "Strawberry Matcha Latte" },
      { name: "Mango Matcha Latte" },
      { name: "Coconut Matcha" },
    ],
  },
  {
    title: "Fruit & Refreshing Teas",
    icon: "🍑",
    items: [
      { name: "Sea Salt Jasmine Tea" },
      { name: "Peach Oolong Tea" },
      { name: "Strawberry Passionfruit Tea" },
      { name: "Grapefruit Tea" },
    ],
  },
  {
    title: "Specialty Dessert Drink",
    icon: "🥭",
    items: [
      { name: "Mango Sago Coconut Milk", isHero: true },
    ],
  },
  {
    title: "Smoothies",
    icon: "🥤",
    items: [
      { name: "Avocado Smoothie" },
      { name: "Ube Smoothie" },
      { name: "Matcha Smoothie" },
    ],
  },
];

export const toppings: Topping[] = [
  { name: "Honey Boba", isHero: true, category: 'standard' },
  { name: "Jelly", category: 'standard' },
  { name: "Sea Salt Cream", category: 'cream' },
  { name: "Ube Cream", category: 'cream' },
  { name: "Matcha Cream", category: 'cream' },
  { name: "Egg Cream", category: 'cream' },
];

export interface Location {
  city: string;
  address: string;
  hours: {
    weekday: string;
    sunday: string;
  };
  phone: string;
}

export const locations: Location[] = [
  {
    city: "Manassas, VA",
    address: "9534 Liberia Ave, Manassas, VA 20110",
    hours: {
      weekday: "Mon - Sat: 9:00 AM - 12:00 AM",
      sunday: "Sunday: 9:00 AM - 9:00 PM",
    },
    phone: "(703) 555-0100",
  },
  {
    city: "Falls Church, VA",
    address: "123 Main Street, Falls Church, VA 22046",
    hours: {
      weekday: "Mon - Sat: 7:00 AM - 12:00 AM",
      sunday: "Sunday: 7:00 AM - 9:00 PM",
    },
    phone: "(703) 555-0101",
  },
  {
    city: "Fairfax, VA",
    address: "456 University Drive, Fairfax, VA 22030",
    hours: {
      weekday: "Mon - Sat: 9:00 AM - 12:00 AM",
      sunday: "Sunday: 9:00 AM - 9:00 PM",
    },
    phone: "(703) 555-0102",
  },
  {
    city: "Vienna, VA",
    address: "789 Maple Avenue, Vienna, VA 22180",
    hours: {
      weekday: "Mon - Sun: 9:00 AM - 10:00 PM",
      sunday: "",
    },
    phone: "(703) 555-0103",
  },
  {
    city: "Sterling, VA",
    address: "321 Commerce Street, Sterling, VA 20164",
    hours: {
      weekday: "Mon - Sat: 9:00 AM - 12:00 AM",
      sunday: "Sunday: 9:00 AM - 9:00 PM",
    },
    phone: "(703) 555-0104",
  },
];
