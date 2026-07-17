import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim();

const PLACEHOLDER_MARKERS = [
  "your-project",
  "your-anon",
  "PASTE_YOUR_ANON_KEY",
  "xxxxxxxx",
  "example",
];

function looksLikePlaceholder(value: string | undefined): boolean {
  if (!value) return true;
  return PLACEHOLDER_MARKERS.some((marker) => value.includes(marker));
}

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith("https://") &&
    supabaseAnonKey.length > 20 &&
    !looksLikePlaceholder(supabaseUrl) &&
    !looksLikePlaceholder(supabaseAnonKey)
);

export function getSupabaseConfigError(): string | null {
  if (!supabaseUrl || looksLikePlaceholder(supabaseUrl)) {
    return "Set VITE_SUPABASE_URL in your .env file to your Supabase project URL.";
  }
  if (!supabaseAnonKey || looksLikePlaceholder(supabaseAnonKey)) {
    return "Set VITE_SUPABASE_ANON_KEY in your .env file. Copy the anon/public key from Supabase → Project Settings → API, then restart npm run dev.";
  }
  return null;
}

let client: SupabaseClient<Database> | null = null;

export function getSupabase(): SupabaseClient<Database> | null {
  if (!isSupabaseConfigured) return null;
  if (!client) {
    client = createClient<Database>(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: "pkce",
      },
    });
  }
  return client;
}

export const supabase = getSupabase();

export function getAppUrl(): string {
  // Always prefer the live browser origin so PKCE storage matches the return URL
  // (localhost vs 127.0.0.1 would otherwise break Google callback).
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }
  const configured = (import.meta.env.VITE_APP_URL as string | undefined)?.trim();
  if (configured && !configured.includes("your-")) return configured.replace(/\/$/, "");
  return "http://localhost:8080";
}
