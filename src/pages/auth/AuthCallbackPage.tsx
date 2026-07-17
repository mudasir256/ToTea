import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSupabase } from "@/lib/supabase";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { toast } from "sonner";

/**
 * Google / email confirmation returns here with ?code=...
 * supabase-js (detectSessionInUrl + PKCE) may already exchange the code on init.
 * Calling exchangeCodeForSession again causes "PKCE code verifier not found".
 */
export default function AuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    const finish = (ok: boolean, message?: string) => {
      if (cancelled) return;
      // Remove auth params from the URL so refresh doesn't re-run the exchange
      window.history.replaceState({}, document.title, "/auth/callback");
      if (ok) {
        toast.success("Signed in successfully");
        navigate("/account/profile", { replace: true });
      } else {
        toast.error(message || "Sign-in failed. Please try again.");
        navigate("/login", { replace: true });
      }
    };

    const run = async () => {
      const supabase = getSupabase();
      if (!supabase) {
        finish(false, "Supabase is not configured.");
        return;
      }

      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");
      const errorDescription =
        url.searchParams.get("error_description") || url.searchParams.get("error");

      if (errorDescription) {
        finish(false, decodeURIComponent(errorDescription));
        return;
      }

      try {
        // 1) Prefer an already-established session (detectSessionInUrl often wins the race)
        let {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          // Brief wait while supabase-js finishes PKCE exchange from the URL
          await new Promise((r) => setTimeout(r, 300));
          ({
            data: { session },
          } = await supabase.auth.getSession());
        }

        // 2) Only exchange manually if still no session
        if (!session && code) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            // If another race already consumed the verifier but created a session, recover
            const retry = await supabase.auth.getSession();
            if (retry.data.session) {
              finish(true);
              return;
            }
            throw error;
          }
          session = data.session;
        }

        if (!session) {
          finish(false, "No auth session found after Google redirect. Try signing in again.");
          return;
        }

        finish(true);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Sign-in callback failed";
        // Recover if session exists despite a noisy PKCE error
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          finish(true);
          return;
        }
        finish(false, message);
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner label="Completing sign-in..." />
    </div>
  );
}
