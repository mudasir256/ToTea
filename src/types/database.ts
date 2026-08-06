export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "ready"
  | "completed"
  | "cancelled"
  | "refunded";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded" | "cancelled";

export type PaymentMethod = "square_card";

export type ShippingAddress = {
  address_line_1: string;
  address_line_2?: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
};

export type CustomerDetails = {
  name: string;
  email: string;
  contact_number: string;
};

export type Profile = {
  id: string;
  full_name: string;
  email: string;
  profile_image_url: string | null;
  contact_number: string | null;
  address_line_1: string | null;
  address_line_2: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string;
  role: "admin" | "customer";
  created_at: string;
  updated_at: string;
};

export type MenuCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type MenuItem = {
  id: string;
  category_id: string;
  name: string;
  slug?: string;
  description: string;
  image_url: string;
  price: number;
  sizes: string;
  ingredients: string;
  calories: string;
  allergens: string;
  is_available: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type MenuItemVariant = {
  id: string;
  menu_item_id: string;
  size: string;
  price: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type MenuItemWithVariants = MenuItem & {
  menu_item_variants: MenuItemVariant[];
};

export type MenuTopping = {
  id: string;
  name: string;
  category: "standard" | "cream";
  image_url: string;
  price: number;
  is_available: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type MenuOptionLevel = {
  id: string;
  kind: "sugar" | "ice";
  name: string;
  sort_order: number;
  is_default: boolean;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

export type MenuItemOptionSettings = {
  menu_item_id: string;
  sugar_enabled: boolean;
  ice_enabled: boolean;
  standard_toppings_enabled: boolean;
  cream_toppings_enabled: boolean;
  default_sugar_level_id: string | null;
  default_ice_level_id: string | null;
};

export type Review = {
  id: string;
  reviewer_name: string;
  rating: number;
  description: string;
  created_at?: string;
};

export type OrderItemSnapshot = {
  menu_item_id: string;
  name: string;
  image_url: string;
  size: string;
  sweetness?: string | null;
  ice?: string | null;
  base_price?: number;
  toppings?: Array<{
    id: string;
    name: string;
    category: "standard" | "cream";
    price: number;
  }>;
  topping_total?: number;
  quantity: number;
  unit_price: number;
  line_total: number;
};

export type Order = {
  id: string;
  order_number: string;
  user_id: string | null;
  customer_details: CustomerDetails;
  items: OrderItemSnapshot[];
  shipping_address: ShippingAddress;
  total: number;
  order_status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  square_order_id: string | null;
  square_payment_id: string | null;
  idempotency_key: string;
  created_at: string;
  updated_at: string;
};

export type MenuStockAvailability = {
  menu_item_id: string;
  size: string;
  available_quantity: number;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Profile>;
        Update: Partial<Profile>;
        Relationships: [];
      };
      menu_categories: {
        Row: MenuCategory;
        Insert: Partial<MenuCategory>;
        Update: Partial<MenuCategory>;
        Relationships: [];
      };
      menu_items: {
        Row: MenuItem;
        Insert: Partial<MenuItem>;
        Update: Partial<MenuItem>;
        Relationships: [
          {
            foreignKeyName: "menu_items_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "menu_categories";
            referencedColumns: ["id"];
          },
        ];
      };
      menu_item_variants: {
        Row: MenuItemVariant;
        Insert: Partial<MenuItemVariant>;
        Update: Partial<MenuItemVariant>;
        Relationships: [
          {
            foreignKeyName: "menu_item_variants_menu_item_id_fkey";
            columns: ["menu_item_id"];
            isOneToOne: false;
            referencedRelation: "menu_items";
            referencedColumns: ["id"];
          },
        ];
      };
      menu_toppings: {
        Row: MenuTopping;
        Insert: Partial<MenuTopping>;
        Update: Partial<MenuTopping>;
        Relationships: [];
      };
      reviews: {
        Row: Review;
        Insert: Partial<Review>;
        Update: Partial<Review>;
        Relationships: [];
      };
      orders: {
        Row: Order;
        Insert: Partial<Order>;
        Update: Partial<Order>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      get_public_menu_stock: {
        Args: {
          p_menu_item_id?: string | null;
        };
        Returns: MenuStockAvailability[];
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
