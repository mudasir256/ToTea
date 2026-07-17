# ToTea — Authenticated Commerce Storefront

Vite + React + TypeScript bubble tea storefront with Supabase Auth/Postgres and Square Web Payments.

## Features

- Email/password signup and login (any valid email, including Gmail)
- Continue with Google (OAuth)
- Forgot/reset password and email verification (Supabase Auth)
- Persistent sessions with protected account/checkout/order routes
- User profiles with contact number, shipping address, and avatar
- Guest + signed-in carts with persistence, merge-on-login, stock limits
- Checkout with first-order contact capture and Square card payments
- In-store Square Point of Sale handoff (`/pos`) for phone/tablet + reader
- Order confirmation, history, and owner-scoped order details

Existing marketing pages (`/`, `/menu`, `/about`, `/contact`, `/order`) are preserved.

## Quick start

```sh
npm install
cp .env.example .env
npm run dev
```

The app runs at `http://localhost:8080`.

Without Supabase/Square env values you can still browse the menu and use the **local guest cart**. Auth, profile sync, and paid checkout require configuration below.

## Environment variables

Copy [`.env.example`](.env.example).

### Browser (`VITE_*`)

| Variable | Purpose |
| --- | --- |
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `VITE_APP_URL` | App origin for auth redirects |
| `VITE_SQUARE_APPLICATION_ID` | Square Web Payments application id |
| `VITE_SQUARE_LOCATION_ID` | Square location id |
| `VITE_SQUARE_ENVIRONMENT` | `sandbox` or `production` |
| `VITE_ORDER_TOAST_URL` | Optional third-party ordering link |
| `VITE_ORDER_UBER_URL` | Optional third-party ordering link |
| `VITE_ORDER_DOORDASH_URL` | Optional third-party ordering link |

Never put Square access tokens or the Supabase service role key in `VITE_*` variables.

### Edge Function secrets

```sh
supabase secrets set \
  SQUARE_ACCESS_TOKEN=your-square-access-token \
  SQUARE_LOCATION_ID=your-location-id \
  SQUARE_ENVIRONMENT=sandbox \
  SQUARE_WEBHOOK_SIGNATURE_KEY=your-webhook-signature-key \
  SQUARE_WEBHOOK_NOTIFICATION_URL=https://<project-ref>.supabase.co/functions/v1/square-webhook \
  SHIPPING_AMOUNT_CENTS=0 \
  TAX_RATE_BPS=0
```

`SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` are provided automatically to Edge Functions.

## Supabase setup

1. Create a Supabase project.
2. Install the [Supabase CLI](https://supabase.com/docs/guides/cli) and log in.
3. Link the project:

```sh
npx supabase link --project-ref <your-project-ref>
npx supabase db push
```

This applies:

- [`supabase/migrations/20260716000000_commerce_schema.sql`](supabase/migrations/20260716000000_commerce_schema.sql)
- [`supabase/migrations/20260716000001_seed_catalog.sql`](supabase/migrations/20260716000001_seed_catalog.sql)

4. Deploy functions:

```sh
npx supabase functions deploy create-checkout
npx supabase functions deploy finalize-pos-checkout
npx supabase functions deploy square-webhook
```

5. In Supabase Dashboard → Authentication:
   - Enable Email provider
   - Enable Google provider (Client ID/Secret from Google Cloud Console)
   - Add redirect URLs:
     - `http://localhost:8080/auth/callback`
     - `http://localhost:8080/reset-password`
     - your production equivalents
   - Optionally enable email confirmation and Auth CAPTCHA/rate limiting

### Google OAuth

1. Create an OAuth client in Google Cloud Console.
2. Authorized redirect URI must be the Supabase callback:

`https://<project-ref>.supabase.co/auth/v1/callback`

3. Paste Client ID/Secret into Supabase Auth → Providers → Google.
4. Keep the site’s “Continue with Google” button separate from email/password signup.

## Square setup

1. Create a Square Developer application.
2. Use **Sandbox** credentials while testing online Web Payments.
3. Copy Application ID + Location ID into `.env` (`VITE_SQUARE_*`).
4. Copy the Access Token into Edge Function secrets (`SQUARE_ACCESS_TOKEN` — never `VITE_*`).
5. Enable Web Payments and create a webhook subscription for payment events pointing at:

`https://<project-ref>.supabase.co/functions/v1/square-webhook`

6. Set `SQUARE_WEBHOOK_SIGNATURE_KEY` and matching `SQUARE_WEBHOOK_NOTIFICATION_URL`.

### Online checkout (Web Payments)

1. Browser tokenizes the card with Square Web Payments SDK on `/checkout`.
2. Authenticated `create-checkout` Edge Function re-prices the cart, creates a Square order/payment with idempotency keys, and finalizes a local order snapshot.
3. Cart clears only after successful finalization.
4. Webhook reconciles delayed payment status updates.

### In-store Square Point of Sale

Staff flow on a phone/tablet with the [Square Point of Sale](https://squareup.com/us/en/point-of-sale) app:

1. Sign in, add items to the cart, open `/pos`.
2. The site opens the Square POS app with the cart total (no shipping).
3. Staff takes payment (reader / cash / Tap to Pay).
4. Square returns to `/pos/callback`.
5. `finalize-pos-checkout` verifies the payment and finalizes the local order as `square_pos`.

**Setup**

1. In Square Developer Console → your app → **Point of Sale API**, set Web Callback URL to:

`http://localhost:8080/pos/callback` (and your production `/pos/callback`)

2. Deploy the function:

```sh
npx supabase functions deploy finalize-pos-checkout
npx supabase secrets set \
  SQUARE_ACCESS_TOKEN=your-token \
  SQUARE_LOCATION_ID=your-location-id \
  SQUARE_ENVIRONMENT=sandbox
```

3. Install Square Point of Sale on a real iOS/Android device and sign in.

**Note:** The POS app handoff requires a real mobile device. Square’s POS API has limited sandbox coverage — use sandbox for online Web Payments; test POS on a device signed into your Square account. Desktop browsers cannot launch the POS app.

Deploy functions:

```sh
npx supabase functions deploy create-checkout
npx supabase functions deploy finalize-pos-checkout
npx supabase functions deploy square-webhook
```


## Catalog and pricing

Active catalog source: [`src/data/catalog.ts`](src/data/catalog.ts).

- 26 drinks from the existing menu
- USD prices in integer cents
- Regular/Large variants mapped from previous display ranges (for example `$ 18-26` → `$18.00` / `$26.00`)
- Review seeded amounts before production

Product detail URLs remain `/product/:productName` for compatibility.

## Key routes

| Path | Access |
| --- | --- |
| `/login`, `/signup`, `/forgot-password`, `/reset-password` | Public |
| `/cart` | Public (guest cart supported) |
| `/checkout` | Authenticated |
| `/account/profile`, `/account/settings` | Authenticated |
| `/account/orders`, `/account/orders/:orderId` | Authenticated + owner-scoped |
| `/order-confirmation/:orderId` | Authenticated + owner-scoped |

## Scripts

```sh
npm run dev
npm run build
npm run lint
npm test
```

## Testing checklist

Automated:

```sh
npm test
```

Manual after credentials are configured:

1. Sign up with email/password and confirm email if required.
2. Sign in with Google.
3. Refresh the page and confirm the session persists.
4. Update profile, contact number, address, and avatar.
5. Add products, change quantities, refresh, and confirm cart persistence.
6. Log in with a guest cart and confirm merge.
7. Checkout as a first-time buyer without a contact number — prompt once, then reuse thereafter.
8. Place a sandbox Square order; confirm cart clears and order details show immutable contact/item snapshots.
9. Attempt to open another user’s order id and confirm access is denied.
10. Verify mobile layout on auth, cart, checkout, and order pages.

## Architecture notes

- Passwords are handled only by Supabase Auth (never stored in app tables).
- RLS restricts profiles, carts, and orders to the owning user.
- Checkout totals are recalculated server-side via `lock_and_price_cart` / `finalize_paid_order`.
- Order items snapshot product name, image, options, quantity, and unit price.
- Previous orders keep the contact number used at purchase time even if the profile number later changes.

## File summary

Created/updated highlights:

- `src/features/auth/*`, `src/features/cart/*`, `src/pages/auth/*`, `src/pages/account/*`
- `src/pages/CartPage.tsx`, `src/pages/CheckoutPage.tsx`, `src/pages/OrderConfirmationPage.tsx`
- `src/data/catalog.ts`, `src/lib/supabase.ts`, `src/lib/money.ts`, `src/lib/validation.ts`
- `supabase/migrations/*`, `supabase/functions/create-checkout`, `supabase/functions/square-webhook`
- `.env.example`, updated `src/App.tsx`, `Header.tsx`, `ProductDetail.tsx`, `OrderOnline.tsx`, `README.md`
