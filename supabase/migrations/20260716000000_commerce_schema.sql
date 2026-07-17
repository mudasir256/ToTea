-- ToTea commerce schema: profiles, catalog, cart, orders, checkout idempotency
-- Prices stored in integer cents (USD).

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
CREATE TYPE public.order_status AS ENUM (
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'refunded'
);

CREATE TYPE public.payment_status AS ENUM (
  'pending',
  'authorized',
  'paid',
  'failed',
  'refunded',
  'cancelled'
);

CREATE TYPE public.payment_method AS ENUM (
  'square_card',
  'cash_on_delivery'
);

-- ---------------------------------------------------------------------------
-- Profiles
-- ---------------------------------------------------------------------------
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL,
  profile_image_url TEXT,
  contact_number TEXT,
  address_line_1 TEXT,
  address_line_2 TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'US',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT profiles_email_length CHECK (char_length(email) <= 320),
  CONSTRAINT profiles_full_name_length CHECK (char_length(full_name) <= 200),
  CONSTRAINT profiles_contact_number_length CHECK (
    contact_number IS NULL OR char_length(contact_number) BETWEEN 7 AND 32
  ),
  CONSTRAINT profiles_address_line_1_length CHECK (
    address_line_1 IS NULL OR char_length(address_line_1) <= 200
  ),
  CONSTRAINT profiles_city_length CHECK (city IS NULL OR char_length(city) <= 100),
  CONSTRAINT profiles_postal_code_length CHECK (
    postal_code IS NULL OR char_length(postal_code) <= 20
  )
);

CREATE INDEX profiles_auth_user_id_idx ON public.profiles(auth_user_id);

-- ---------------------------------------------------------------------------
-- Catalog
-- ---------------------------------------------------------------------------
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  ingredients TEXT[] NOT NULL DEFAULT '{}',
  allergens TEXT[] NOT NULL DEFAULT '{}',
  calories TEXT,
  image_url TEXT,
  is_hero BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  size_label TEXT NOT NULL,
  sku TEXT NOT NULL UNIQUE,
  unit_price_cents INT NOT NULL CHECK (unit_price_cents >= 0),
  stock_quantity INT NOT NULL DEFAULT 100 CHECK (stock_quantity >= 0),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (product_id, size_label)
);

CREATE INDEX product_variants_product_id_idx ON public.product_variants(product_id);

-- ---------------------------------------------------------------------------
-- Cart
-- ---------------------------------------------------------------------------
CREATE TABLE public.carts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cart_id UUID NOT NULL REFERENCES public.carts(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  product_variant_id UUID NOT NULL REFERENCES public.product_variants(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  product_image TEXT,
  selected_options JSONB NOT NULL DEFAULT '{}'::jsonb,
  quantity INT NOT NULL CHECK (quantity >= 1),
  unit_price_cents INT NOT NULL CHECK (unit_price_cents >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (cart_id, product_variant_id)
);

CREATE INDEX cart_items_cart_id_idx ON public.cart_items(cart_id);

-- ---------------------------------------------------------------------------
-- Orders
-- ---------------------------------------------------------------------------
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  contact_number TEXT NOT NULL,
  shipping_address JSONB NOT NULL,
  subtotal_cents INT NOT NULL CHECK (subtotal_cents >= 0),
  discount_amount_cents INT NOT NULL DEFAULT 0 CHECK (discount_amount_cents >= 0),
  tax_amount_cents INT NOT NULL DEFAULT 0 CHECK (tax_amount_cents >= 0),
  shipping_amount_cents INT NOT NULL DEFAULT 0 CHECK (shipping_amount_cents >= 0),
  total_amount_cents INT NOT NULL CHECK (total_amount_cents >= 0),
  currency TEXT NOT NULL DEFAULT 'USD',
  order_status public.order_status NOT NULL DEFAULT 'pending',
  payment_method public.payment_method NOT NULL DEFAULT 'square_card',
  payment_status public.payment_status NOT NULL DEFAULT 'pending',
  square_order_id TEXT,
  square_payment_id TEXT,
  idempotency_key TEXT NOT NULL UNIQUE,
  tracking_number TEXT,
  estimated_delivery_at TIMESTAMPTZ,
  item_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX orders_user_id_created_at_idx ON public.orders(user_id, created_at DESC);
CREATE INDEX orders_square_payment_id_idx ON public.orders(square_payment_id);

CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_image TEXT,
  selected_options JSONB NOT NULL DEFAULT '{}'::jsonb,
  quantity INT NOT NULL CHECK (quantity >= 1),
  unit_price_cents INT NOT NULL CHECK (unit_price_cents >= 0),
  line_total_cents INT NOT NULL CHECK (line_total_cents >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX order_items_order_id_idx ON public.order_items(order_id);

CREATE TABLE public.order_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  status public.order_status NOT NULL,
  note TEXT,
  updated_by TEXT NOT NULL DEFAULT 'system',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX order_status_history_order_id_idx ON public.order_status_history(order_id, created_at);

CREATE TABLE public.checkout_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  idempotency_key TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'started',
  request_payload JSONB,
  response_payload JSONB,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX checkout_attempts_user_id_idx ON public.checkout_attempts(user_id);

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER products_set_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER product_variants_set_updated_at
  BEFORE UPDATE ON public.product_variants
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER carts_set_updated_at
  BEFORE UPDATE ON public.carts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER cart_items_set_updated_at
  BEFORE UPDATE ON public.cart_items
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER orders_set_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER checkout_attempts_set_updated_at
  BEFORE UPDATE ON public.checkout_attempts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (auth_user_id, email, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', '')
  );

  INSERT INTO public.carts (user_id)
  VALUES (NEW.id);

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  candidate TEXT;
BEGIN
  LOOP
    candidate := 'TT-' || to_char(now(), 'YYMMDD') || '-' || upper(substr(encode(gen_random_bytes(4), 'hex'), 1, 8));
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.orders WHERE order_number = candidate);
  END LOOP;
  RETURN candidate;
END;
$$;

-- Authoritative checkout pricing/stock check used by Edge Function (service role)
CREATE OR REPLACE FUNCTION public.lock_and_price_cart(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_cart_id UUID;
  v_items JSONB;
  v_subtotal INT := 0;
  v_item JSONB;
BEGIN
  SELECT id INTO v_cart_id FROM public.carts WHERE user_id = p_user_id FOR UPDATE;
  IF v_cart_id IS NULL THEN
    RAISE EXCEPTION 'Cart not found';
  END IF;

  SELECT COALESCE(jsonb_agg(row_to_json(x)::jsonb), '[]'::jsonb)
  INTO v_items
  FROM (
    SELECT
      ci.id AS cart_item_id,
      ci.product_id,
      ci.product_variant_id,
      p.name AS product_name,
      p.image_url AS product_image,
      pv.size_label,
      pv.sku,
      pv.unit_price_cents,
      pv.stock_quantity,
      ci.quantity,
      (pv.unit_price_cents * ci.quantity) AS line_total_cents,
      jsonb_build_object('size', pv.size_label) AS selected_options
    FROM public.cart_items ci
    JOIN public.product_variants pv ON pv.id = ci.product_variant_id
    JOIN public.products p ON p.id = ci.product_id
    WHERE ci.cart_id = v_cart_id
      AND p.is_active = true
      AND pv.is_active = true
    FOR UPDATE OF pv, ci
  ) x;

  IF jsonb_array_length(v_items) = 0 THEN
    RAISE EXCEPTION 'Cart is empty';
  END IF;

  FOR v_item IN SELECT * FROM jsonb_array_elements(v_items)
  LOOP
    IF (v_item->>'quantity')::INT > (v_item->>'stock_quantity')::INT THEN
      RAISE EXCEPTION 'Insufficient stock for %', v_item->>'product_name';
    END IF;
    v_subtotal := v_subtotal + (v_item->>'line_total_cents')::INT;
  END LOOP;

  RETURN jsonb_build_object(
    'cart_id', v_cart_id,
    'items', v_items,
    'subtotal_cents', v_subtotal
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.finalize_paid_order(
  p_user_id UUID,
  p_idempotency_key TEXT,
  p_customer_name TEXT,
  p_customer_email TEXT,
  p_contact_number TEXT,
  p_shipping_address JSONB,
  p_payment_method public.payment_method,
  p_square_order_id TEXT,
  p_square_payment_id TEXT,
  p_shipping_amount_cents INT,
  p_tax_amount_cents INT,
  p_discount_amount_cents INT,
  p_save_contact BOOLEAN DEFAULT true
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  priced JSONB;
  v_order_id UUID;
  v_order_number TEXT;
  v_total INT;
  v_item_count INT;
  v_cart_id UUID;
  item JSONB;
BEGIN
  IF EXISTS (SELECT 1 FROM public.orders WHERE idempotency_key = p_idempotency_key) THEN
    SELECT id INTO v_order_id FROM public.orders WHERE idempotency_key = p_idempotency_key;
    RETURN v_order_id;
  END IF;

  priced := public.lock_and_price_cart(p_user_id);
  v_cart_id := (priced->>'cart_id')::UUID;
  v_total := (priced->>'subtotal_cents')::INT
    + COALESCE(p_shipping_amount_cents, 0)
    + COALESCE(p_tax_amount_cents, 0)
    - COALESCE(p_discount_amount_cents, 0);
  IF v_total < 0 THEN
    RAISE EXCEPTION 'Invalid order total';
  END IF;

  SELECT COALESCE(SUM((i->>'quantity')::INT), 0)
  INTO v_item_count
  FROM jsonb_array_elements(priced->'items') i;

  v_order_number := public.generate_order_number();

  INSERT INTO public.orders (
    order_number, user_id, customer_name, customer_email, contact_number,
    shipping_address, subtotal_cents, discount_amount_cents, tax_amount_cents,
    shipping_amount_cents, total_amount_cents, currency, order_status,
    payment_method, payment_status, square_order_id, square_payment_id,
    idempotency_key, item_count
  ) VALUES (
    v_order_number, p_user_id, p_customer_name, p_customer_email, p_contact_number,
    p_shipping_address, (priced->>'subtotal_cents')::INT,
    COALESCE(p_discount_amount_cents, 0), COALESCE(p_tax_amount_cents, 0),
    COALESCE(p_shipping_amount_cents, 0), v_total, 'USD', 'confirmed',
    p_payment_method, 'paid', p_square_order_id, p_square_payment_id,
    p_idempotency_key, v_item_count
  )
  RETURNING id INTO v_order_id;

  FOR item IN SELECT * FROM jsonb_array_elements(priced->'items')
  LOOP
    INSERT INTO public.order_items (
      order_id, product_id, product_variant_id, product_name, product_image,
      selected_options, quantity, unit_price_cents, line_total_cents
    ) VALUES (
      v_order_id,
      (item->>'product_id')::UUID,
      (item->>'product_variant_id')::UUID,
      item->>'product_name',
      item->>'product_image',
      COALESCE(item->'selected_options', '{}'::jsonb),
      (item->>'quantity')::INT,
      (item->>'unit_price_cents')::INT,
      (item->>'line_total_cents')::INT
    );

    UPDATE public.product_variants
    SET stock_quantity = stock_quantity - (item->>'quantity')::INT
    WHERE id = (item->>'product_variant_id')::UUID
      AND stock_quantity >= (item->>'quantity')::INT;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Stock changed during checkout for %', item->>'product_name';
    END IF;
  END LOOP;

  INSERT INTO public.order_status_history (order_id, status, note, updated_by)
  VALUES (v_order_id, 'confirmed', 'Order paid and confirmed', 'checkout');

  IF p_save_contact THEN
    UPDATE public.profiles
    SET
      contact_number = COALESCE(NULLIF(contact_number, ''), p_contact_number),
      full_name = CASE WHEN COALESCE(full_name, '') = '' THEN p_customer_name ELSE full_name END,
      address_line_1 = COALESCE(NULLIF(address_line_1, ''), p_shipping_address->>'address_line_1'),
      address_line_2 = COALESCE(address_line_2, p_shipping_address->>'address_line_2'),
      city = COALESCE(NULLIF(city, ''), p_shipping_address->>'city'),
      state = COALESCE(NULLIF(state, ''), p_shipping_address->>'state'),
      postal_code = COALESCE(NULLIF(postal_code, ''), p_shipping_address->>'postal_code'),
      country = COALESCE(NULLIF(country, ''), p_shipping_address->>'country', 'US')
    WHERE auth_user_id = p_user_id;
  END IF;

  DELETE FROM public.cart_items WHERE cart_id = v_cart_id;

  RETURN v_order_id;
END;
$$;

REVOKE ALL ON FUNCTION public.lock_and_price_cart(UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.finalize_paid_order(UUID, TEXT, TEXT, TEXT, TEXT, JSONB, public.payment_method, TEXT, TEXT, INT, INT, INT, BOOLEAN) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.lock_and_price_cart(UUID) TO service_role;
GRANT EXECUTE ON FUNCTION public.finalize_paid_order(UUID, TEXT, TEXT, TEXT, TEXT, JSONB, public.payment_method, TEXT, TEXT, INT, INT, INT, BOOLEAN) TO service_role;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkout_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active products"
  ON public.products FOR SELECT
  USING (is_active = true);

CREATE POLICY "Public can read active variants"
  ON public.product_variants FOR SELECT
  USING (
    is_active = true
    AND EXISTS (
      SELECT 1 FROM public.products p
      WHERE p.id = product_id AND p.is_active = true
    )
  );

CREATE POLICY "Users read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = auth_user_id);

CREATE POLICY "Users update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = auth_user_id)
  WITH CHECK (auth.uid() = auth_user_id);

CREATE POLICY "Users read own cart"
  ON public.carts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users update own cart"
  ON public.carts FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage own cart items"
  ON public.cart_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.carts c
      WHERE c.id = cart_id AND c.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.carts c
      WHERE c.id = cart_id AND c.user_id = auth.uid()
    )
  );

CREATE POLICY "Users read own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users read own order items"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_id AND o.user_id = auth.uid()
    )
  );

CREATE POLICY "Users read own order status history"
  ON public.order_status_history FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_id AND o.user_id = auth.uid()
    )
  );

CREATE POLICY "Users read own checkout attempts"
  ON public.checkout_attempts FOR SELECT
  USING (auth.uid() = user_id);

-- Profile images bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-images', 'profile-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Avatar images are publicly readable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'profile-images');

CREATE POLICY "Users can upload own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'profile-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'profile-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own avatar"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'profile-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
