/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_APP_URL?: string;
  readonly VITE_SQUARE_APPLICATION_ID?: string;
  readonly VITE_SQUARE_LOCATION_ID?: string;
  readonly VITE_SQUARE_ENVIRONMENT?: string;
  readonly VITE_ORDER_TOAST_URL?: string;
  readonly VITE_ORDER_UBER_URL?: string;
  readonly VITE_ORDER_DOORDASH_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
