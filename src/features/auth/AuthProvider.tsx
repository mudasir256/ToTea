import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { getAppUrl, getSupabase, getSupabaseConfigError, isSupabaseConfigured } from "@/lib/supabase";
import type { Profile } from "@/types/database";
import { toast } from "sonner";

const PROFILE_COLUMNS =
  "id, full_name, email, profile_image_url, contact_number, address_line_1, address_line_2, city, state, postal_code, country, role, created_at, updated_at";

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  passwordRecovery: boolean;
  configured: boolean;
  configError: string | null;
  refreshProfile: () => Promise<void>;
  ensureProfile: (user: User, fullName?: string) => Promise<Profile | null>;
  signUp: (input: {
    email: string;
    password: string;
    fullName: string;
  }) => Promise<{ needsEmailConfirmation: boolean }>;
  signIn: (input: { email: string; password: string }) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function requireAuthClient() {
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error(
      getSupabaseConfigError() ||
        "Authentication is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env, then restart the dev server."
    );
  }
  return supabase;
}

async function fetchProfile(userId: string): Promise<Profile | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("profiles")
    .select(PROFILE_COLUMNS)
    .eq("id", userId)
    .maybeSingle();
  if (error) {
    console.error(error);
    return null;
  }
  return data as Profile | null;
}

async function ensureProfileRecord(user: User, fullName?: string): Promise<Profile | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const existing = await fetchProfile(user.id);
  if (!existing) {
    console.error(
      "No customer profile was found for the authenticated user. The Supabase new-user trigger should create it.",
    );
    return null;
  }

  const requestedName = fullName?.trim();
  if (requestedName && requestedName !== existing.full_name) {
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: requestedName })
      .eq("id", user.id);
    if (error) {
      console.error(error);
      return existing;
    }
    return fetchProfile(user.id);
  }

  return existing;
}

function friendlyAuthError(error: unknown): Error {
  if (!(error instanceof Error)) return new Error("Authentication failed");
  const message = error.message || "Authentication failed";
  const lower = message.toLowerCase();

  if (lower.includes("email not confirmed")) {
    return new Error("Please confirm your email before signing in. Check your inbox for the verification link.");
  }
  if (lower.includes("invalid login credentials")) {
    return new Error("Incorrect email or password.");
  }
  if (lower.includes("user already registered")) {
    return new Error("An account with this email already exists. Sign in instead.");
  }
  if (lower.includes("provider is not enabled") || lower.includes("unsupported provider")) {
    return new Error(
      "Google sign-in is not enabled yet. In Supabase Dashboard → Authentication → Providers, enable Google and add your Client ID/Secret."
    );
  }
  if (lower.includes("redirect") && lower.includes("not allowed")) {
    return new Error(
      "Redirect URL not allowed. In Supabase → Authentication → URL Configuration, add your app callback URL."
    );
  }
  return error;
}

function isRecoveryUrl(): boolean {
  if (typeof window === "undefined") return false;
  return window.location.hash.includes("type=recovery");
}

function deferProfileSync(user: User, onComplete: (profile: Profile | null) => void) {
  queueMicrotask(() => {
    void ensureProfileRecord(user).then(onComplete);
  });
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [passwordRecovery, setPasswordRecovery] = useState(isRecoveryUrl);

  const refreshProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      return;
    }
    const next = await fetchProfile(user.id);
    setProfile(next);
  }, [user]);

  const ensureProfile = useCallback(async (nextUser: User, fullName?: string) => {
    const profileRecord = await ensureProfileRecord(nextUser, fullName);
    setProfile(profileRecord);
    return profileRecord;
  }, []);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) {
      setLoading(false);
      return;
    }

    let mounted = true;

    supabase.auth.getSession().then(async ({ data, error }) => {
      if (!mounted) return;
      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }
      setSession(data.session);
      setUser(data.session?.user ?? null);
      if (data.session?.user) {
        const profileRecord = await ensureProfileRecord(data.session.user);
        if (mounted) setProfile(profileRecord);
      }
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);

      if (event === "SIGNED_OUT") {
        setProfile(null);
        setPasswordRecovery(false);
      }

      if (event === "PASSWORD_RECOVERY") {
        setPasswordRecovery(true);
      }

      if (event === "TOKEN_REFRESHED" && !nextSession) {
        toast.error("Your session expired. Please sign in again.");
      }

      setLoading(false);

      if ((event === "SIGNED_IN" || event === "USER_UPDATED") && nextSession?.user) {
        deferProfileSync(nextSession.user, (profileRecord) => {
          if (mounted) setProfile(profileRecord);
        });
      }
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      profile,
      loading,
      passwordRecovery,
      configured: isSupabaseConfigured,
      configError: getSupabaseConfigError(),
      refreshProfile,
      ensureProfile,
      async signUp({ email, password, fullName }) {
        const supabase = requireAuthClient();
        const { data, error } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: `${getAppUrl()}/auth/callback`,
          },
        });
        if (error) throw friendlyAuthError(error);

        if (data.user && data.session) {
          await ensureProfileRecord(data.user, fullName);
        }

        if (data.user && !data.session && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
          throw new Error("An account with this email already exists. Sign in instead.");
        }

        return { needsEmailConfirmation: !data.session };
      },
      async signIn({ email, password }) {
        const supabase = requireAuthClient();
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });
        if (error) throw friendlyAuthError(error);
        if (data.user) {
          await ensureProfileRecord(data.user);
        }
      },
      async signInWithGoogle() {
        const supabase = requireAuthClient();
        const redirectTo = `${window.location.origin}/auth/callback`;
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo,
            skipBrowserRedirect: true,
            queryParams: {
              access_type: "offline",
              prompt: "select_account",
            },
          },
        });
        if (error) throw friendlyAuthError(error);
        if (!data.url) {
          throw new Error("Google sign-in did not return a redirect URL.");
        }
        window.location.assign(data.url);
      },
      async signOut() {
        const supabase = getSupabase();
        if (!supabase) return;
        const { error } = await supabase.auth.signOut();
        if (error) throw friendlyAuthError(error);
        setProfile(null);
        setPasswordRecovery(false);
      },
      async sendPasswordReset(email: string) {
        const supabase = requireAuthClient();
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
          redirectTo: `${getAppUrl()}/reset-password`,
        });
        if (error) throw friendlyAuthError(error);
      },
      async updatePassword(password: string) {
        const supabase = requireAuthClient();
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw friendlyAuthError(error);
        setPasswordRecovery(false);
      },
    }),
    [user, session, profile, loading, passwordRecovery, refreshProfile, ensureProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
