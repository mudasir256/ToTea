import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { useAuth } from "@/features/auth/AuthProvider";

export function AuthConfigBanner() {
  const { configured, configError } = useAuth();
  if (configured || !configError) return null;

  return (
    <ErrorAlert
      className="mb-4"
      title="Supabase is not configured"
      message={configError}
    />
  );
}
