-- Security hardening: user-scoped idempotency, cart integrity, profile immutability, webhook dedup

-- ---------------------------------------------------------------------------
-- Checkout idempotency scoped per user
-- ---------------------------------------------------------------------------
ALTER TABLE public.checkout_attempts
  DROP CONSTRAINT IF EXISTS checkout_attempts_idempotency_key_key;

ALTER TABLE public.checkout_attempts
  ADD CONSTRAINT checkout_attempts_user_idempotency_unique
  UNIQUE (user_id, idempotency_key);

CREATE UNIQUE INDEX IF NOT EXISTS orders_square_payment_id_unique_idx
  ON public.orders (square_payment_id)
  WHERE square_payment_id IS NOT NULL;

-- ---------------------------------------------------------------------------
-- Cart: variant must belong to product
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.validate_cart_item_variant()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM public.product_variants pv
    WHERE pv.id = NEW.product_variant_id
      AND pv.product_id = NEW.product_id
  ) THEN
    RAISE EXCEPTION 'Product variant does not belong to the selected product';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER cart_items_validate_variant
  BEFORE INSERT OR UPDATE ON public.cart_items
  FOR EACH ROW EXECUTE FUNCTION public.validate_cart_item_variant();

-- ---------------------------------------------------------------------------
-- Profile: prevent mutation of immutable columns via API
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.protect_profile_immutable_columns()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.id := OLD.id;
  NEW.auth_user_id := OLD.auth_user_id;
  NEW.email := OLD.email;
  NEW.created_at := OLD.created_at;
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_protect_immutable_columns
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.protect_profile_immutable_columns();

-- ---------------------------------------------------------------------------
-- Webhook event deduplication (service role only)
-- ---------------------------------------------------------------------------
CREATE TABLE public.webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL,
  event_id TEXT NOT NULL,
  event_type TEXT,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (provider, event_id)
);

ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;

-- No policies: only service_role (bypasses RLS) can access

-- ---------------------------------------------------------------------------
-- lock_and_price_cart: enforce variant/product relationship
-- ---------------------------------------------------------------------------
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
      AND pv.product_id = ci.product_id
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

-- ---------------------------------------------------------------------------
-- finalize_paid_order: verify idempotency belongs to the same user
-- ---------------------------------------------------------------------------
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
  SELECT id INTO v_order_id
  FROM public.orders
  WHERE idempotency_key = p_idempotency_key
    AND user_id = p_user_id;

  IF v_order_id IS NOT NULL THEN
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
-- Avatar uploads: restrict file extensions
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can upload own avatar" ON storage.objects;

CREATE POLICY "Users can upload own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'profile-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
    AND lower(storage.extension(name)) IN ('jpg', 'jpeg', 'png', 'webp', 'gif')
  );
