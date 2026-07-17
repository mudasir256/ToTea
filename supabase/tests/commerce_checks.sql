-- Manual/CI SQL smoke checks for commerce RPCs and ownership assumptions.
-- Run against a seeded local Supabase instance after creating two test users.

-- Expect: lock_and_price_cart fails for empty cart
-- SELECT public.lock_and_price_cart('<user-uuid>');

-- Expect: finalize_paid_order is idempotent for the same idempotency key
-- SELECT public.finalize_paid_order(...same args twice...);

-- Expect: users cannot select another user's orders through RLS
-- SET request.jwt.claim.sub = '<user-a>';
-- SELECT * FROM public.orders WHERE user_id = '<user-b>'; -- returns 0 rows

-- Expect: order contact_number remains unchanged when profile contact updates
-- UPDATE public.profiles SET contact_number = '+10000000000' WHERE auth_user_id = '<user-a>';
-- SELECT contact_number FROM public.orders WHERE user_id = '<user-a>'; -- original value
