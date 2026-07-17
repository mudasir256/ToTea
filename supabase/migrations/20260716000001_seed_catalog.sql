-- Seed catalog from existing menu (USD cents)
BEGIN;

INSERT INTO public.products (slug, name, category, description, ingredients, allergens, calories, is_hero, sort_order)
VALUES ('vietnamese-sea-salt-coffee', 'Vietnamese Sea Salt Coffee', 'Vietnamese Coffee', 'A unique twist on traditional Vietnamese coffee, featuring our signature sea salt cream that creates a perfect balance of sweet and savory.', ARRAY['Vietnamese Coffee', 'Sea Salt Cream', 'Condensed Milk', 'Ice']::text[], ARRAY['Dairy']::text[], '180-250 cal', true, 1)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  ingredients = EXCLUDED.ingredients,
  allergens = EXCLUDED.allergens,
  calories = EXCLUDED.calories,
  is_hero = EXCLUDED.is_hero,
  sort_order = EXCLUDED.sort_order;

INSERT INTO public.product_variants (product_id, size_label, sku, unit_price_cents, stock_quantity)
SELECT id, 'Regular', 'vietnamese-sea-salt-coffee-regular', 2500, 100
FROM public.products WHERE slug = 'vietnamese-sea-salt-coffee'
ON CONFLICT (sku) DO UPDATE SET
  unit_price_cents = EXCLUDED.unit_price_cents,
  stock_quantity = EXCLUDED.stock_quantity,
  size_label = EXCLUDED.size_label;

INSERT INTO public.product_variants (product_id, size_label, sku, unit_price_cents, stock_quantity)
SELECT id, 'Large', 'vietnamese-sea-salt-coffee-large', 3500, 100
FROM public.products WHERE slug = 'vietnamese-sea-salt-coffee'
ON CONFLICT (sku) DO UPDATE SET
  unit_price_cents = EXCLUDED.unit_price_cents,
  stock_quantity = EXCLUDED.stock_quantity,
  size_label = EXCLUDED.size_label;

INSERT INTO public.products (slug, name, category, description, ingredients, allergens, calories, is_hero, sort_order)
VALUES ('ube-vietnamese-coffee', 'Ube Vietnamese Coffee', 'Vietnamese Coffee', 'Experience the fusion of Filipino and Vietnamese flavors with our Ube Vietnamese Coffee.', ARRAY['Vietnamese Coffee', 'Ube Extract', 'Condensed Milk', 'Ube Cream', 'Ice']::text[], ARRAY['Dairy']::text[], '200-280 cal', false, 2)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  ingredients = EXCLUDED.ingredients,
  allergens = EXCLUDED.allergens,
  calories = EXCLUDED.calories,
  is_hero = EXCLUDED.is_hero,
  sort_order = EXCLUDED.sort_order;

INSERT INTO public.product_variants (product_id, size_label, sku, unit_price_cents, stock_quantity)
SELECT id, 'Regular', 'ube-vietnamese-coffee-regular', 2800, 100
FROM public.products WHERE slug = 'ube-vietnamese-coffee'
ON CONFLICT (sku) DO UPDATE SET
  unit_price_cents = EXCLUDED.unit_price_cents,
  stock_quantity = EXCLUDED.stock_quantity,
  size_label = EXCLUDED.size_label;

INSERT INTO public.product_variants (product_id, size_label, sku, unit_price_cents, stock_quantity)
SELECT id, 'Large', 'ube-vietnamese-coffee-large', 3800, 100
FROM public.products WHERE slug = 'ube-vietnamese-coffee'
ON CONFLICT (sku) DO UPDATE SET
  unit_price_cents = EXCLUDED.unit_price_cents,
  stock_quantity = EXCLUDED.stock_quantity,
  size_label = EXCLUDED.size_label;

INSERT INTO public.products (slug, name, category, description, ingredients, allergens, calories, is_hero, sort_order)
VALUES ('egg-vietnamese-coffee', 'Egg Vietnamese Coffee', 'Vietnamese Coffee', 'A traditional Vietnamese favorite with a rich, custard-like egg cream topping.', ARRAY['Vietnamese Coffee', 'Egg Cream', 'Condensed Milk', 'Sugar', 'Ice']::text[], ARRAY['Eggs', 'Dairy']::text[], '220-300 cal', false, 3)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  ingredients = EXCLUDED.ingredients,
  allergens = EXCLUDED.allergens,
  calories = EXCLUDED.calories,
  is_hero = EXCLUDED.is_hero,
  sort_order = EXCLUDED.sort_order;

INSERT INTO public.product_variants (product_id, size_label, sku, unit_price_cents, stock_quantity)
SELECT id, 'Regular', 'egg-vietnamese-coffee-regular', 2600, 100
FROM public.products WHERE slug = 'egg-vietnamese-coffee'
ON CONFLICT (sku) DO UPDATE SET
  unit_price_cents = EXCLUDED.unit_price_cents,
  stock_quantity = EXCLUDED.stock_quantity,
  size_label = EXCLUDED.size_label;

INSERT INTO public.product_variants (product_id, size_label, sku, unit_price_cents, stock_quantity)
SELECT id, 'Large', 'egg-vietnamese-coffee-large', 3600, 100
FROM public.products WHERE slug = 'egg-vietnamese-coffee'
ON CONFLICT (sku) DO UPDATE SET
  unit_price_cents = EXCLUDED.unit_price_cents,
  stock_quantity = EXCLUDED.stock_quantity,
  size_label = EXCLUDED.size_label;

INSERT INTO public.products (slug, name, category, description, ingredients, allergens, calories, is_hero, sort_order)
VALUES ('brown-sugar-milk', 'Brown Sugar Milk', 'Brown Sugar & Crème Brûlée', 'An indulgent drink featuring our signature brown sugar syrup mixed with fresh milk.', ARRAY['Brown Sugar Syrup', 'Fresh Milk', 'Ice']::text[], ARRAY['Dairy']::text[], '150-220 cal', false, 4)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  ingredients = EXCLUDED.ingredients,
  allergens = EXCLUDED.allergens,
  calories = EXCLUDED.calories,
  is_hero = EXCLUDED.is_hero,
  sort_order = EXCLUDED.sort_order;

INSERT INTO public.product_variants (product_id, size_label, sku, unit_price_cents, stock_quantity)
SELECT id, 'Regular', 'brown-sugar-milk-regular', 2000, 100
FROM public.products WHERE slug = 'brown-sugar-milk'
ON CONFLICT (sku) DO UPDATE SET
  unit_price_cents = EXCLUDED.unit_price_cents,
  stock_quantity = EXCLUDED.stock_quantity,
  size_label = EXCLUDED.size_label;

INSERT INTO public.product_variants (product_id, size_label, sku, unit_price_cents, stock_quantity)
SELECT id, 'Large', 'brown-sugar-milk-large', 2800, 100
FROM public.products WHERE slug = 'brown-sugar-milk'
ON CONFLICT (sku) DO UPDATE SET
  unit_price_cents = EXCLUDED.unit_price_cents,
  stock_quantity = EXCLUDED.stock_quantity,
  size_label = EXCLUDED.size_label;

INSERT INTO public.products (slug, name, category, description, ingredients, allergens, calories, is_hero, sort_order)
VALUES ('brown-sugar-milk-tea', 'Brown Sugar Milk Tea', 'Brown Sugar & Crème Brûlée', 'Premium tea leaves with signature brown sugar syrup and fresh milk.', ARRAY['Premium Tea', 'Brown Sugar Syrup', 'Fresh Milk', 'Ice']::text[], ARRAY['Dairy']::text[], '180-250 cal', false, 5)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  ingredients = EXCLUDED.ingredients,
  allergens = EXCLUDED.allergens,
  calories = EXCLUDED.calories,
  is_hero = EXCLUDED.is_hero,
  sort_order = EXCLUDED.sort_order;

INSERT INTO public.product_variants (product_id, size_label, sku, unit_price_cents, stock_quantity)
SELECT id, 'Regular', 'brown-sugar-milk-tea-regular', 2200, 100
FROM public.products WHERE slug = 'brown-sugar-milk-tea'
ON CONFLICT (sku) DO UPDATE SET
  unit_price_cents = EXCLUDED.unit_price_cents,
  stock_quantity = EXCLUDED.stock_quantity,
  size_label = EXCLUDED.size_label;

INSERT INTO public.product_variants (product_id, size_label, sku, unit_price_cents, stock_quantity)
SELECT id, 'Large', 'brown-sugar-milk-tea-large', 3000, 100
FROM public.products WHERE slug = 'brown-sugar-milk-tea'
ON CONFLICT (sku) DO UPDATE SET
  unit_price_cents = EXCLUDED.unit_price_cents,
  stock_quantity = EXCLUDED.stock_quantity,
  size_label = EXCLUDED.size_label;

INSERT INTO public.products (slug, name, category, description, ingredients, allergens, calories, is_hero, sort_order)
VALUES ('cr-me-br-l-e-brown-sugar-milk', 'Crème Brûlée Brown Sugar Milk', 'Brown Sugar & Crème Brûlée', 'Dessert-inspired drink featuring crème brûlée with brown sugar milk.', ARRAY['Brown Sugar Syrup', 'Crème Brûlée Cream', 'Fresh Milk', 'Caramel Drizzle', 'Ice']::text[], ARRAY['Dairy']::text[], '250-350 cal', false, 6)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  ingredients = EXCLUDED.ingredients,
  allergens = EXCLUDED.allergens,
  calories = EXCLUDED.calories,
  is_hero = EXCLUDED.is_hero,
  sort_order = EXCLUDED.sort_order;

INSERT INTO public.product_variants (product_id, size_label, sku, unit_price_cents, stock_quantity)
SELECT id, 'Regular', 'cr-me-br-l-e-brown-sugar-milk-regular', 2800, 100
FROM public.products WHERE slug = 'cr-me-br-l-e-brown-sugar-milk'
ON CONFLICT (sku) DO UPDATE SET
  unit_price_cents = EXCLUDED.unit_price_cents,
  stock_quantity = EXCLUDED.stock_quantity,
  size_label = EXCLUDED.size_label;

INSERT INTO public.product_variants (product_id, size_label, sku, unit_price_cents, stock_quantity)
SELECT id, 'Large', 'cr-me-br-l-e-brown-sugar-milk-large', 3800, 100
FROM public.products WHERE slug = 'cr-me-br-l-e-brown-sugar-milk'
ON CONFLICT (sku) DO UPDATE SET
  unit_price_cents = EXCLUDED.unit_price_cents,
  stock_quantity = EXCLUDED.stock_quantity,
  size_label = EXCLUDED.size_label;

INSERT INTO public.products (slug, name, category, description, ingredients, allergens, calories, is_hero, sort_order)
VALUES ('classic-milk-tea', 'Classic Milk Tea', 'Classic & Flavored Milk Teas', 'Signature classic milk tea made with premium tea leaves and fresh milk.', ARRAY['Premium Black Tea', 'Fresh Milk', 'Sugar', 'Ice']::text[], ARRAY['Dairy']::text[], '140-200 cal', false, 7)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  ingredients = EXCLUDED.ingredients,
  allergens = EXCLUDED.allergens,
  calories = EXCLUDED.calories,
  is_hero = EXCLUDED.is_hero,
  sort_order = EXCLUDED.sort_order;

INSERT INTO public.product_variants (product_id, size_label, sku, unit_price_cents, stock_quantity)
SELECT id, 'Regular', 'classic-milk-tea-regular', 1800, 100
FROM public.products WHERE slug = 'classic-milk-tea'
ON CONFLICT (sku) DO UPDATE SET
  unit_price_cents = EXCLUDED.unit_price_cents,
  stock_quantity = EXCLUDED.stock_quantity,
  size_label = EXCLUDED.size_label;

INSERT INTO public.product_variants (product_id, size_label, sku, unit_price_cents, stock_quantity)
SELECT id, 'Large', 'classic-milk-tea-large', 2600, 100
FROM public.products WHERE slug = 'classic-milk-tea'
ON CONFLICT (sku) DO UPDATE SET
  unit_price_cents = EXCLUDED.unit_price_cents,
  stock_quantity = EXCLUDED.stock_quantity,
  size_label = EXCLUDED.size_label;

INSERT INTO public.products (slug, name, category, description, ingredients, allergens, calories, is_hero, sort_order)
VALUES ('thai-milk-tea', 'Thai Milk Tea', 'Classic & Flavored Milk Teas', 'Authentic Thai milk tea with its distinctive orange color and bold, spiced flavor.', ARRAY['Thai Tea Leaves', 'Condensed Milk', 'Sugar', 'Spices', 'Ice']::text[], ARRAY['Dairy']::text[], '200-280 cal', false, 8)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  ingredients = EXCLUDED.ingredients,
  allergens = EXCLUDED.allergens,
  calories = EXCLUDED.calories,
  is_hero = EXCLUDED.is_hero,
  sort_order = EXCLUDED.sort_order;

INSERT INTO public.product_variants (product_id, size_label, sku, unit_price_cents, stock_quantity)
SELECT id, 'Regular', 'thai-milk-tea-regular', 2200, 100
FROM public.products WHERE slug = 'thai-milk-tea'
ON CONFLICT (sku) DO UPDATE SET
  unit_price_cents = EXCLUDED.unit_price_cents,
  stock_quantity = EXCLUDED.stock_quantity,
  size_label = EXCLUDED.size_label;

INSERT INTO public.product_variants (product_id, size_label, sku, unit_price_cents, stock_quantity)
SELECT id, 'Large', 'thai-milk-tea-large', 3000, 100
FROM public.products WHERE slug = 'thai-milk-tea'
ON CONFLICT (sku) DO UPDATE SET
  unit_price_cents = EXCLUDED.unit_price_cents,
  stock_quantity = EXCLUDED.stock_quantity,
  size_label = EXCLUDED.size_label;

INSERT INTO public.products (slug, name, category, description, ingredients, allergens, calories, is_hero, sort_order)
VALUES ('roasted-oolong-milk-tea', 'Roasted Oolong Milk Tea', 'Classic & Flavored Milk Teas', 'Premium roasted oolong tea with fresh milk and toasty, nutty flavors.', ARRAY['Roasted Oolong Tea', 'Fresh Milk', 'Sugar', 'Ice']::text[], ARRAY['Dairy']::text[], '160-230 cal', false, 9)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  ingredients = EXCLUDED.ingredients,
  allergens = EXCLUDED.allergens,
  calories = EXCLUDED.calories,
  is_hero = EXCLUDED.is_hero,
  sort_order = EXCLUDED.sort_order;

INSERT INTO public.product_variants (product_id, size_label, sku, unit_price_cents, stock_quantity)
SELECT id, 'Regular', 'roasted-oolong-milk-tea-regular', 2400, 100
FROM public.products WHERE slug = 'roasted-oolong-milk-tea'
ON CONFLICT (sku) DO UPDATE SET
  unit_price_cents = EXCLUDED.unit_price_cents,
  stock_quantity = EXCLUDED.stock_quantity,
  size_label = EXCLUDED.size_label;

INSERT INTO public.product_variants (product_id, size_label, sku, unit_price_cents, stock_quantity)
SELECT id, 'Large', 'roasted-oolong-milk-tea-large', 3200, 100
FROM public.products WHERE slug = 'roasted-oolong-milk-tea'
ON CONFLICT (sku) DO UPDATE SET
  unit_price_cents = EXCLUDED.unit_price_cents,
  stock_quantity = EXCLUDED.stock_quantity,
  size_label = EXCLUDED.size_label;

INSERT INTO public.products (slug, name, category, description, ingredients, allergens, calories, is_hero, sort_order)
VALUES ('ube-milk-tea', 'Ube Milk Tea', 'Classic & Flavored Milk Teas', 'Purple-hued milk tea featuring the sweet, earthy flavor of ube.', ARRAY['Premium Tea', 'Ube Extract', 'Fresh Milk', 'Ube Cream', 'Ice']::text[], ARRAY['Dairy']::text[], '220-300 cal', false, 10)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  ingredients = EXCLUDED.ingredients,
  allergens = EXCLUDED.allergens,
  calories = EXCLUDED.calories,
  is_hero = EXCLUDED.is_hero,
  sort_order = EXCLUDED.sort_order;

INSERT INTO public.product_variants (product_id, size_label, sku, unit_price_cents, stock_quantity)
SELECT id, 'Regular', 'ube-milk-tea-regular', 2600, 100
FROM public.products WHERE slug = 'ube-milk-tea'
ON CONFLICT (sku) DO UPDATE SET
  unit_price_cents = EXCLUDED.unit_price_cents,
  stock_quantity = EXCLUDED.stock_quantity,
  size_label = EXCLUDED.size_label;

INSERT INTO public.product_variants (product_id, size_label, sku, unit_price_cents, stock_quantity)
SELECT id, 'Large', 'ube-milk-tea-large', 3400, 100
FROM public.products WHERE slug = 'ube-milk-tea'
ON CONFLICT (sku) DO UPDATE SET
  unit_price_cents = EXCLUDED.unit_price_cents,
  stock_quantity = EXCLUDED.stock_quantity,
  size_label = EXCLUDED.size_label;

INSERT INTO public.products (slug, name, category, description, ingredients, allergens, calories, is_hero, sort_order)
VALUES ('pistachio-milk-tea', 'Pistachio Milk Tea', 'Classic & Flavored Milk Teas', 'Nutty and creamy milk tea featuring real pistachio flavor.', ARRAY['Premium Tea', 'Pistachio Syrup', 'Fresh Milk', 'Pistachio Cream', 'Ice']::text[], ARRAY['Dairy', 'Tree Nuts']::text[], '240-320 cal', false, 11)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  ingredients = EXCLUDED.ingredients,
  allergens = EXCLUDED.allergens,
  calories = EXCLUDED.calories,
  is_hero = EXCLUDED.is_hero,
  sort_order = EXCLUDED.sort_order;

INSERT INTO public.product_variants (product_id, size_label, sku, unit_price_cents, stock_quantity)
SELECT id, 'Regular', 'pistachio-milk-tea-regular', 2800, 100
FROM public.products WHERE slug = 'pistachio-milk-tea'
ON CONFLICT (sku) DO UPDATE SET
  unit_price_cents = EXCLUDED.unit_price_cents,
  stock_quantity = EXCLUDED.stock_quantity,
  size_label = EXCLUDED.size_label;

INSERT INTO public.product_variants (product_id, size_label, sku, unit_price_cents, stock_quantity)
SELECT id, 'Large', 'pistachio-milk-tea-large', 3600, 100
FROM public.products WHERE slug = 'pistachio-milk-tea'
ON CONFLICT (sku) DO UPDATE SET
  unit_price_cents = EXCLUDED.unit_price_cents,
  stock_quantity = EXCLUDED.stock_quantity,
  size_label = EXCLUDED.size_label;

INSERT INTO public.products (slug, name, category, description, ingredients, allergens, calories, is_hero, sort_order)
VALUES ('horchata-milk-tea', 'Horchata Milk Tea', 'Classic & Flavored Milk Teas', 'Latin and Asian fusion milk tea with cinnamon and rice notes.', ARRAY['Premium Tea', 'Horchata Base', 'Cinnamon', 'Fresh Milk', 'Ice']::text[], ARRAY['Dairy']::text[], '200-280 cal', false, 12)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  ingredients = EXCLUDED.ingredients,
  allergens = EXCLUDED.allergens,
  calories = EXCLUDED.calories,
  is_hero = EXCLUDED.is_hero,
  sort_order = EXCLUDED.sort_order;

INSERT INTO public.product_variants (product_id, size_label, sku, unit_price_cents, stock_quantity)
SELECT id, 'Regular', 'horchata-milk-tea-regular', 2400, 100
FROM public.products WHERE slug = 'horchata-milk-tea'
ON CONFLICT (sku) DO UPDATE SET
  unit_price_cents = EXCLUDED.unit_price_cents,
  stock_quantity = EXCLUDED.stock_quantity,
  size_label = EXCLUDED.size_label;

INSERT INTO public.product_variants (product_id, size_label, sku, unit_price_cents, stock_quantity)
SELECT id, 'Large', 'horchata-milk-tea-large', 3200, 100
FROM public.products WHERE slug = 'horchata-milk-tea'
ON CONFLICT (sku) DO UPDATE SET
  unit_price_cents = EXCLUDED.unit_price_cents,
  stock_quantity = EXCLUDED.stock_quantity,
  size_label = EXCLUDED.size_label;

INSERT INTO public.products (slug, name, category, description, ingredients, allergens, calories, is_hero, sort_order)
VALUES ('mango-milk-tea', 'Mango Milk Tea', 'Classic & Flavored Milk Teas', 'Tropical milk tea featuring real mango puree with premium tea.', ARRAY['Premium Tea', 'Mango Puree', 'Fresh Milk', 'Sugar', 'Ice']::text[], ARRAY['Dairy']::text[], '220-300 cal', false, 13)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  ingredients = EXCLUDED.ingredients,
  allergens = EXCLUDED.allergens,
  calories = EXCLUDED.calories,
  is_hero = EXCLUDED.is_hero,
  sort_order = EXCLUDED.sort_order;

INSERT INTO public.product_variants (product_id, size_label, sku, unit_price_cents, stock_quantity)
SELECT id, 'Regular', 'mango-milk-tea-regular', 2400, 100
FROM public.products WHERE slug = 'mango-milk-tea'
ON CONFLICT (sku) DO UPDATE SET
  unit_price_cents = EXCLUDED.unit_price_cents,
  stock_quantity = EXCLUDED.stock_quantity,
  size_label = EXCLUDED.size_label;

INSERT INTO public.product_variants (product_id, size_label, sku, unit_price_cents, stock_quantity)
SELECT id, 'Large', 'mango-milk-tea-large', 3200, 100
FROM public.products WHERE slug = 'mango-milk-tea'
ON CONFLICT (sku) DO UPDATE SET
  unit_price_cents = EXCLUDED.unit_price_cents,
  stock_quantity = EXCLUDED.stock_quantity,
  size_label = EXCLUDED.size_label;

INSERT INTO public.products (slug, name, category, description, ingredients, allergens, calories, is_hero, sort_order)
VALUES ('honeydew-milk-tea', 'Honeydew Milk Tea', 'Classic & Flavored Milk Teas', 'Subtly sweet milk tea featuring delicate honeydew melon flavor.', ARRAY['Premium Tea', 'Honeydew Syrup', 'Fresh Milk', 'Ice']::text[], ARRAY['Dairy']::text[], '180-250 cal', false, 14)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  ingredients = EXCLUDED.ingredients,
  allergens = EXCLUDED.allergens,
  calories = EXCLUDED.calories,
  is_hero = EXCLUDED.is_hero,
  sort_order = EXCLUDED.sort_order;

INSERT INTO public.product_variants (product_id, size_label, sku, unit_price_cents, stock_quantity)
SELECT id, 'Regular', 'honeydew-milk-tea-regular', 2200, 100
FROM public.products WHERE slug = 'honeydew-milk-tea'
ON CONFLICT (sku) DO UPDATE SET
  unit_price_cents = EXCLUDED.unit_price_cents,
  stock_quantity = EXCLUDED.stock_quantity,
  size_label = EXCLUDED.size_label;

INSERT INTO public.product_variants (product_id, size_label, sku, unit_price_cents, stock_quantity)
SELECT id, 'Large', 'honeydew-milk-tea-large', 3000, 100
FROM public.products WHERE slug = 'honeydew-milk-tea'
ON CONFLICT (sku) DO UPDATE SET
  unit_price_cents = EXCLUDED.unit_price_cents,
  stock_quantity = EXCLUDED.stock_quantity,
  size_label = EXCLUDED.size_label;

INSERT INTO public.products (slug, name, category, description, ingredients, allergens, calories, is_hero, sort_order)
VALUES ('matcha-latte', 'Matcha Latte', 'Matcha Collection', 'Creamy matcha latte made with premium Japanese matcha powder.', ARRAY['Premium Matcha Powder', 'Fresh Milk', 'Sugar', 'Ice']::text[], ARRAY['Dairy']::text[], '160-230 cal', false, 15)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  ingredients = EXCLUDED.ingredients,
  allergens = EXCLUDED.allergens,
  calories = EXCLUDED.calories,
  is_hero = EXCLUDED.is_hero,
  sort_order = EXCLUDED.sort_order;

INSERT INTO public.product_variants (product_id, size_label, sku, unit_price_cents, stock_quantity)
SELECT id, 'Regular', 'matcha-latte-regular', 2600, 100
FROM public.products WHERE slug = 'matcha-latte'
ON CONFLICT (sku) DO UPDATE SET
  unit_price_cents = EXCLUDED.unit_price_cents,
  stock_quantity = EXCLUDED.stock_quantity,
  size_label = EXCLUDED.size_label;

INSERT INTO public.product_variants (product_id, size_label, sku, unit_price_cents, stock_quantity)
SELECT id, 'Large', 'matcha-latte-large', 3400, 100
FROM public.products WHERE slug = 'matcha-latte'
ON CONFLICT (sku) DO UPDATE SET
  unit_price_cents = EXCLUDED.unit_price_cents,
  stock_quantity = EXCLUDED.stock_quantity,
  size_label = EXCLUDED.size_label;

INSERT INTO public.products (slug, name, category, description, ingredients, allergens, calories, is_hero, sort_order)
VALUES ('strawberry-matcha-latte', 'Strawberry Matcha Latte', 'Matcha Collection', 'Layered strawberry puree with creamy matcha and fresh milk.', ARRAY['Premium Matcha Powder', 'Strawberry Puree', 'Fresh Milk', 'Sugar', 'Ice']::text[], ARRAY['Dairy']::text[], '200-280 cal', false, 16)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  ingredients = EXCLUDED.ingredients,
  allergens = EXCLUDED.allergens,
  calories = EXCLUDED.calories,
  is_hero = EXCLUDED.is_hero,
  sort_order = EXCLUDED.sort_order;

INSERT INTO public.product_variants (product_id, size_label, sku, unit_price_cents, stock_quantity)
SELECT id, 'Regular', 'strawberry-matcha-latte-regular', 2800, 100
FROM public.products WHERE slug = 'strawberry-matcha-latte'
ON CONFLICT (sku) DO UPDATE SET
  unit_price_cents = EXCLUDED.unit_price_cents,
  stock_quantity = EXCLUDED.stock_quantity,
  size_label = EXCLUDED.size_label;

INSERT INTO public.product_variants (product_id, size_label, sku, unit_price_cents, stock_quantity)
SELECT id, 'Large', 'strawberry-matcha-latte-large', 3600, 100
FROM public.products WHERE slug = 'strawberry-matcha-latte'
ON CONFLICT (sku) DO UPDATE SET
  unit_price_cents = EXCLUDED.unit_price_cents,
  stock_quantity = EXCLUDED.stock_quantity,
  size_label = EXCLUDED.size_label;

INSERT INTO public.products (slug, name, category, description, ingredients, allergens, calories, is_hero, sort_order)
VALUES ('mango-matcha-latte', 'Mango Matcha Latte', 'Matcha Collection', 'Tropical twist on matcha featuring sweet mango puree.', ARRAY['Premium Matcha Powder', 'Mango Puree', 'Fresh Milk', 'Sugar', 'Ice']::text[], ARRAY['Dairy']::text[], '220-300 cal', false, 17)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  ingredients = EXCLUDED.ingredients,
  allergens = EXCLUDED.allergens,
  calories = EXCLUDED.calories,
  is_hero = EXCLUDED.is_hero,
  sort_order = EXCLUDED.sort_order;

INSERT INTO public.product_variants (product_id, size_label, sku, unit_price_cents, stock_quantity)
SELECT id, 'Regular', 'mango-matcha-latte-regular', 2800, 100
FROM public.products WHERE slug = 'mango-matcha-latte'
ON CONFLICT (sku) DO UPDATE SET
  unit_price_cents = EXCLUDED.unit_price_cents,
  stock_quantity = EXCLUDED.stock_quantity,
  size_label = EXCLUDED.size_label;

INSERT INTO public.product_variants (product_id, size_label, sku, unit_price_cents, stock_quantity)
SELECT id, 'Large', 'mango-matcha-latte-large', 3600, 100
FROM public.products WHERE slug = 'mango-matcha-latte'
ON CONFLICT (sku) DO UPDATE SET
  unit_price_cents = EXCLUDED.unit_price_cents,
  stock_quantity = EXCLUDED.stock_quantity,
  size_label = EXCLUDED.size_label;

INSERT INTO public.products (slug, name, category, description, ingredients, allergens, calories, is_hero, sort_order)
VALUES ('coconut-matcha', 'Coconut Matcha', 'Matcha Collection', 'Tropical matcha with coconut milk — a dairy-free option.', ARRAY['Premium Matcha Powder', 'Coconut Milk', 'Sugar', 'Ice']::text[], ARRAY[]::text[], '180-250 cal', false, 18)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  ingredients = EXCLUDED.ingredients,
  allergens = EXCLUDED.allergens,
  calories = EXCLUDED.calories,
  is_hero = EXCLUDED.is_hero,
  sort_order = EXCLUDED.sort_order;

INSERT INTO public.product_variants (product_id, size_label, sku, unit_price_cents, stock_quantity)
SELECT id, 'Regular', 'coconut-matcha-regular', 2600, 100
FROM public.products WHERE slug = 'coconut-matcha'
ON CONFLICT (sku) DO UPDATE SET
  unit_price_cents = EXCLUDED.unit_price_cents,
  stock_quantity = EXCLUDED.stock_quantity,
  size_label = EXCLUDED.size_label;

INSERT INTO public.product_variants (product_id, size_label, sku, unit_price_cents, stock_quantity)
SELECT id, 'Large', 'coconut-matcha-large', 3400, 100
FROM public.products WHERE slug = 'coconut-matcha'
ON CONFLICT (sku) DO UPDATE SET
  unit_price_cents = EXCLUDED.unit_price_cents,
  stock_quantity = EXCLUDED.stock_quantity,
  size_label = EXCLUDED.size_label;

INSERT INTO public.products (slug, name, category, description, ingredients, allergens, calories, is_hero, sort_order)
VALUES ('sea-salt-jasmine-tea', 'Sea Salt Jasmine Tea', 'Fruit & Refreshing Teas', 'Refreshing jasmine tea topped with signature sea salt cream.', ARRAY['Jasmine Tea', 'Sea Salt Cream', 'Sugar', 'Ice']::text[], ARRAY['Dairy']::text[], '120-180 cal', false, 19)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  ingredients = EXCLUDED.ingredients,
  allergens = EXCLUDED.allergens,
  calories = EXCLUDED.calories,
  is_hero = EXCLUDED.is_hero,
  sort_order = EXCLUDED.sort_order;

INSERT INTO public.product_variants (product_id, size_label, sku, unit_price_cents, stock_quantity)
SELECT id, 'Regular', 'sea-salt-jasmine-tea-regular', 2200, 100
FROM public.products WHERE slug = 'sea-salt-jasmine-tea'
ON CONFLICT (sku) DO UPDATE SET
  unit_price_cents = EXCLUDED.unit_price_cents,
  stock_quantity = EXCLUDED.stock_quantity,
  size_label = EXCLUDED.size_label;

INSERT INTO public.product_variants (product_id, size_label, sku, unit_price_cents, stock_quantity)
SELECT id, 'Large', 'sea-salt-jasmine-tea-large', 3000, 100
FROM public.products WHERE slug = 'sea-salt-jasmine-tea'
ON CONFLICT (sku) DO UPDATE SET
  unit_price_cents = EXCLUDED.unit_price_cents,
  stock_quantity = EXCLUDED.stock_quantity,
  size_label = EXCLUDED.size_label;

INSERT INTO public.products (slug, name, category, description, ingredients, allergens, calories, is_hero, sort_order)
VALUES ('peach-oolong-tea', 'Peach Oolong Tea', 'Fruit & Refreshing Teas', 'Light oolong tea infused with natural peach flavor.', ARRAY['Oolong Tea', 'Peach Syrup', 'Sugar', 'Ice']::text[], ARRAY[]::text[], '100-160 cal', false, 20)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  ingredients = EXCLUDED.ingredients,
  allergens = EXCLUDED.allergens,
  calories = EXCLUDED.calories,
  is_hero = EXCLUDED.is_hero,
  sort_order = EXCLUDED.sort_order;

INSERT INTO public.product_variants (product_id, size_label, sku, unit_price_cents, stock_quantity)
SELECT id, 'Regular', 'peach-oolong-tea-regular', 2000, 100
FROM public.products WHERE slug = 'peach-oolong-tea'
ON CONFLICT (sku) DO UPDATE SET
  unit_price_cents = EXCLUDED.unit_price_cents,
  stock_quantity = EXCLUDED.stock_quantity,
  size_label = EXCLUDED.size_label;

INSERT INTO public.product_variants (product_id, size_label, sku, unit_price_cents, stock_quantity)
SELECT id, 'Large', 'peach-oolong-tea-large', 2800, 100
FROM public.products WHERE slug = 'peach-oolong-tea'
ON CONFLICT (sku) DO UPDATE SET
  unit_price_cents = EXCLUDED.unit_price_cents,
  stock_quantity = EXCLUDED.stock_quantity,
  size_label = EXCLUDED.size_label;

INSERT INTO public.products (slug, name, category, description, ingredients, allergens, calories, is_hero, sort_order)
VALUES ('strawberry-passionfruit-tea', 'Strawberry Passionfruit Tea', 'Fruit & Refreshing Teas', 'Sweet strawberry and exotic passionfruit tea.', ARRAY['Premium Tea', 'Strawberry Puree', 'Passionfruit Syrup', 'Sugar', 'Ice']::text[], ARRAY[]::text[], '140-200 cal', false, 21)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  ingredients = EXCLUDED.ingredients,
  allergens = EXCLUDED.allergens,
  calories = EXCLUDED.calories,
  is_hero = EXCLUDED.is_hero,
  sort_order = EXCLUDED.sort_order;

INSERT INTO public.product_variants (product_id, size_label, sku, unit_price_cents, stock_quantity)
SELECT id, 'Regular', 'strawberry-passionfruit-tea-regular', 2400, 100
FROM public.products WHERE slug = 'strawberry-passionfruit-tea'
ON CONFLICT (sku) DO UPDATE SET
  unit_price_cents = EXCLUDED.unit_price_cents,
  stock_quantity = EXCLUDED.stock_quantity,
  size_label = EXCLUDED.size_label;

INSERT INTO public.product_variants (product_id, size_label, sku, unit_price_cents, stock_quantity)
SELECT id, 'Large', 'strawberry-passionfruit-tea-large', 3200, 100
FROM public.products WHERE slug = 'strawberry-passionfruit-tea'
ON CONFLICT (sku) DO UPDATE SET
  unit_price_cents = EXCLUDED.unit_price_cents,
  stock_quantity = EXCLUDED.stock_quantity,
  size_label = EXCLUDED.size_label;

INSERT INTO public.products (slug, name, category, description, ingredients, allergens, calories, is_hero, sort_order)
VALUES ('grapefruit-tea', 'Grapefruit Tea', 'Fruit & Refreshing Teas', 'Zesty tea featuring tangy grapefruit flavor.', ARRAY['Premium Tea', 'Grapefruit Juice', 'Sugar', 'Ice']::text[], ARRAY[]::text[], '110-170 cal', false, 22)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  ingredients = EXCLUDED.ingredients,
  allergens = EXCLUDED.allergens,
  calories = EXCLUDED.calories,
  is_hero = EXCLUDED.is_hero,
  sort_order = EXCLUDED.sort_order;

INSERT INTO public.product_variants (product_id, size_label, sku, unit_price_cents, stock_quantity)
SELECT id, 'Regular', 'grapefruit-tea-regular', 2000, 100
FROM public.products WHERE slug = 'grapefruit-tea'
ON CONFLICT (sku) DO UPDATE SET
  unit_price_cents = EXCLUDED.unit_price_cents,
  stock_quantity = EXCLUDED.stock_quantity,
  size_label = EXCLUDED.size_label;

INSERT INTO public.product_variants (product_id, size_label, sku, unit_price_cents, stock_quantity)
SELECT id, 'Large', 'grapefruit-tea-large', 2800, 100
FROM public.products WHERE slug = 'grapefruit-tea'
ON CONFLICT (sku) DO UPDATE SET
  unit_price_cents = EXCLUDED.unit_price_cents,
  stock_quantity = EXCLUDED.stock_quantity,
  size_label = EXCLUDED.size_label;

INSERT INTO public.products (slug, name, category, description, ingredients, allergens, calories, is_hero, sort_order)
VALUES ('mango-sago-coconut-milk', 'Mango Sago Coconut Milk', 'Specialty Dessert Drink', 'Dessert drink with mango chunks, sago pearls, and coconut milk.', ARRAY['Fresh Mango', 'Sago Pearls', 'Coconut Milk', 'Sugar', 'Ice']::text[], ARRAY[]::text[], '280-380 cal', true, 23)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  ingredients = EXCLUDED.ingredients,
  allergens = EXCLUDED.allergens,
  calories = EXCLUDED.calories,
  is_hero = EXCLUDED.is_hero,
  sort_order = EXCLUDED.sort_order;

INSERT INTO public.product_variants (product_id, size_label, sku, unit_price_cents, stock_quantity)
SELECT id, 'Regular', 'mango-sago-coconut-milk-regular', 3200, 100
FROM public.products WHERE slug = 'mango-sago-coconut-milk'
ON CONFLICT (sku) DO UPDATE SET
  unit_price_cents = EXCLUDED.unit_price_cents,
  stock_quantity = EXCLUDED.stock_quantity,
  size_label = EXCLUDED.size_label;

INSERT INTO public.product_variants (product_id, size_label, sku, unit_price_cents, stock_quantity)
SELECT id, 'Large', 'mango-sago-coconut-milk-large', 4200, 100
FROM public.products WHERE slug = 'mango-sago-coconut-milk'
ON CONFLICT (sku) DO UPDATE SET
  unit_price_cents = EXCLUDED.unit_price_cents,
  stock_quantity = EXCLUDED.stock_quantity,
  size_label = EXCLUDED.size_label;

INSERT INTO public.products (slug, name, category, description, ingredients, allergens, calories, is_hero, sort_order)
VALUES ('avocado-smoothie', 'Avocado Smoothie', 'Smoothies', 'Rich creamy smoothie made with fresh avocado and milk.', ARRAY['Fresh Avocado', 'Fresh Milk', 'Condensed Milk', 'Ice']::text[], ARRAY['Dairy']::text[], '300-400 cal', false, 24)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  ingredients = EXCLUDED.ingredients,
  allergens = EXCLUDED.allergens,
  calories = EXCLUDED.calories,
  is_hero = EXCLUDED.is_hero,
  sort_order = EXCLUDED.sort_order;

INSERT INTO public.product_variants (product_id, size_label, sku, unit_price_cents, stock_quantity)
SELECT id, 'Regular', 'avocado-smoothie-regular', 2600, 100
FROM public.products WHERE slug = 'avocado-smoothie'
ON CONFLICT (sku) DO UPDATE SET
  unit_price_cents = EXCLUDED.unit_price_cents,
  stock_quantity = EXCLUDED.stock_quantity,
  size_label = EXCLUDED.size_label;

INSERT INTO public.product_variants (product_id, size_label, sku, unit_price_cents, stock_quantity)
SELECT id, 'Large', 'avocado-smoothie-large', 3400, 100
FROM public.products WHERE slug = 'avocado-smoothie'
ON CONFLICT (sku) DO UPDATE SET
  unit_price_cents = EXCLUDED.unit_price_cents,
  stock_quantity = EXCLUDED.stock_quantity,
  size_label = EXCLUDED.size_label;

INSERT INTO public.products (slug, name, category, description, ingredients, allergens, calories, is_hero, sort_order)
VALUES ('ube-smoothie', 'Ube Smoothie', 'Smoothies', 'Vibrant purple smoothie featuring sweet ube flavor.', ARRAY['Ube Extract', 'Fresh Milk', 'Condensed Milk', 'Ice']::text[], ARRAY['Dairy']::text[], '320-420 cal', false, 25)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  ingredients = EXCLUDED.ingredients,
  allergens = EXCLUDED.allergens,
  calories = EXCLUDED.calories,
  is_hero = EXCLUDED.is_hero,
  sort_order = EXCLUDED.sort_order;

INSERT INTO public.product_variants (product_id, size_label, sku, unit_price_cents, stock_quantity)
SELECT id, 'Regular', 'ube-smoothie-regular', 2800, 100
FROM public.products WHERE slug = 'ube-smoothie'
ON CONFLICT (sku) DO UPDATE SET
  unit_price_cents = EXCLUDED.unit_price_cents,
  stock_quantity = EXCLUDED.stock_quantity,
  size_label = EXCLUDED.size_label;

INSERT INTO public.product_variants (product_id, size_label, sku, unit_price_cents, stock_quantity)
SELECT id, 'Large', 'ube-smoothie-large', 3600, 100
FROM public.products WHERE slug = 'ube-smoothie'
ON CONFLICT (sku) DO UPDATE SET
  unit_price_cents = EXCLUDED.unit_price_cents,
  stock_quantity = EXCLUDED.stock_quantity,
  size_label = EXCLUDED.size_label;

INSERT INTO public.products (slug, name, category, description, ingredients, allergens, calories, is_hero, sort_order)
VALUES ('matcha-smoothie', 'Matcha Smoothie', 'Smoothies', 'Creamy energizing smoothie with premium matcha powder.', ARRAY['Premium Matcha Powder', 'Fresh Milk', 'Sugar', 'Ice']::text[], ARRAY['Dairy']::text[], '240-320 cal', false, 26)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  ingredients = EXCLUDED.ingredients,
  allergens = EXCLUDED.allergens,
  calories = EXCLUDED.calories,
  is_hero = EXCLUDED.is_hero,
  sort_order = EXCLUDED.sort_order;

INSERT INTO public.product_variants (product_id, size_label, sku, unit_price_cents, stock_quantity)
SELECT id, 'Regular', 'matcha-smoothie-regular', 2600, 100
FROM public.products WHERE slug = 'matcha-smoothie'
ON CONFLICT (sku) DO UPDATE SET
  unit_price_cents = EXCLUDED.unit_price_cents,
  stock_quantity = EXCLUDED.stock_quantity,
  size_label = EXCLUDED.size_label;

INSERT INTO public.product_variants (product_id, size_label, sku, unit_price_cents, stock_quantity)
SELECT id, 'Large', 'matcha-smoothie-large', 3400, 100
FROM public.products WHERE slug = 'matcha-smoothie'
ON CONFLICT (sku) DO UPDATE SET
  unit_price_cents = EXCLUDED.unit_price_cents,
  stock_quantity = EXCLUDED.stock_quantity,
  size_label = EXCLUDED.size_label;

COMMIT;
