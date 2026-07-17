import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { useAuth } from "@/features/auth/AuthProvider";
import { resetPasswordSchema } from "@/lib/validation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import type { z } from "zod";

type FormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const { updatePassword, signOut, passwordRecovery, loading, user } = useAuth();
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const canReset =
    passwordRecovery || window.location.hash.includes("type=recovery");

  useEffect(() => {
    if (!loading && user && !canReset) {
      navigate("/account/settings", { replace: true });
    }
  }, [loading, user, canReset, navigate]);

  const onSubmit = form.handleSubmit(async (values) => {
    if (!canReset) {
      setFormError("Use the password reset link from your email to set a new password.");
      return;
    }

    setFormError(null);
    try {
      await updatePassword(values.password);
      await signOut();
      toast.success("Password updated. Please sign in with your new password.");
      navigate("/login", { replace: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to update password";
      setFormError(message);
    }
  });

  if (loading) {
    return <LoadingSpinner label="Verifying reset link..." />;
  }

  if (!canReset) {
    return (
      <AuthLayout
        title="Invalid reset link"
        subtitle="Password resets must be started from the link in your email."
        footer={
          <Link to="/forgot-password" className="font-medium text-accent hover:underline">
            Request a new reset link
          </Link>
        }
      >
        <ErrorAlert message="This page is only available through a valid password reset email." />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Reset password"
      subtitle="Choose a new password for your account."
      footer={
        <Link to="/login" className="font-medium text-accent hover:underline">
          Back to sign in
        </Link>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        {formError ? <ErrorAlert message={formError} /> : null}
        <div className="space-y-2">
          <Label htmlFor="password">New password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            {...form.register("password")}
          />
          {form.formState.errors.password ? (
            <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm new password</Label>
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            {...form.register("confirmPassword")}
          />
          {form.formState.errors.confirmPassword ? (
            <p className="text-sm text-destructive">{form.formState.errors.confirmPassword.message}</p>
          ) : null}
        </div>
        <Button type="submit" className="btn-accent w-full h-12" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Update password
        </Button>
      </form>
    </AuthLayout>
  );
}
