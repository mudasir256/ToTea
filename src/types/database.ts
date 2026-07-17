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
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type PaymentStatus =
  | "pending"
  | "authorized"
  | "paid"
  | "failed"
  | "refunded"
  | "cancelled";

export type PaymentMethod = "square_card" | "square_pos" | "cash_on_delivery";

export type ShippingAddress = {
  address_line_1: string;
  address_line_2?: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
};

export type Profile = {
  id: string;
  auth_user_id: string;
  full_name: string;
  email: string;
  profile_image_url: string | null;
  contact_number: string | null;
  address_line_1: string | null;
  address_line_2: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  created_at: string;
  updated_at: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  ingredients: string[];
  allergens: string[];
  calories: string | null;
  image_url: string | null;
  is_hero: boolean;
  is_active: boolean;
  sort_order: number;
};

export type ProductVariant = {
  id: string;
  product_id: string;
  size_label: string;
  sku: string;
  unit_price_cents: number;
  stock_quantity: number;
  is_active: boolean;
};

export type ProductWithVariants = Product & {
  product_variants: ProductVariant[];
};

export type Cart = {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
};

export type CartItem = {
  id: string;
  cart_id: string;
  product_id: string;
  product_variant_id: string;
  product_name: string;
  product_image: string | null;
  selected_options: { size?: string; [key: string]: unknown };
  quantity: number;
  unit_price_cents: number;
  created_at: string;
  updated_at: string;
  stock_quantity?: number;
};

export type Order = {
  id: string;
  order_number: string;
  user_id: string;
  customer_name: string;
  customer_email: string;
  contact_number: string;
  shipping_address: ShippingAddress;
  subtotal_cents: number;
  discount_amount_cents: number;
  tax_amount_cents: number;
  shipping_amount_cents: number;
  total_amount_cents: number;
  currency: string;
  order_status: OrderStatus;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  square_order_id: string | null;
  square_payment_id: string | null;
  tracking_number: string | null;
  estimated_delivery_at: string | null;
  item_count: number;
  created_at: string;
  updated_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_variant_id: string | null;
  product_name: string;
  product_image: string | null;
  selected_options: { size?: string; [key: string]: unknown };
  quantity: number;
  unit_price_cents: number;
  line_total_cents: number;
};

export type OrderStatusHistory = {
  id: string;
  order_id: string;
  status: OrderStatus;
  note: string | null;
  updated_by: string;
  created_at: string;
};

export type OrderWithDetails = Order & {
  order_items: OrderItem[];
  order_status_history: OrderStatusHistory[];
};

export type Database = {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Partial<Profile>; Update: Partial<Profile> };
      products: { Row: Product; Insert: Partial<Product>; Update: Partial<Product> };
      product_variants: {
        Row: ProductVariant;
        Insert: Partial<ProductVariant>;
        Update: Partial<ProductVariant>;
      };
      carts: { Row: Cart; Insert: Partial<Cart>; Update: Partial<Cart> };
      cart_items: { Row: CartItem; Insert: Partial<CartItem>; Update: Partial<CartItem> };
      orders: { Row: Order; Insert: Partial<Order>; Update: Partial<Order> };
      order_items: { Row: OrderItem; Insert: Partial<OrderItem>; Update: Partial<OrderItem> };
      order_status_history: {
        Row: OrderStatusHistory;
        Insert: Partial<OrderStatusHistory>;
        Update: Partial<OrderStatusHistory>;
      };
    };
  };
};
