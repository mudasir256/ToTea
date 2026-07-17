-- Allow authenticated users to create their own profile/cart if the auth trigger
-- has not run yet (or raced). Still owner-scoped only.

CREATE POLICY "Users insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = auth_user_id);

CREATE POLICY "Users insert own cart"
  ON public.carts FOR INSERT
  WITH CHECK (auth.uid() = user_id);
