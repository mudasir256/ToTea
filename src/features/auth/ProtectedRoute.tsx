import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthProvider";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import type { ReactNode } from "react";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading, configured } = useAuth();
  const location = useLocation();

  if (!configured) {
    return (
      <div className="container mx-auto max-w-xl px-6 py-24">
        <ErrorAlert
          title="Supabase not configured"
          message="Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file to enable authentication and protected pages."
        />
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner label="Checking session..." />;
  }

  if (!user) {
    const returnTo = `${location.pathname}${location.search}`;
    return <Navigate to="/login" replace state={{ from: returnTo }} />;
  }

  return <>{children}</>;
}
