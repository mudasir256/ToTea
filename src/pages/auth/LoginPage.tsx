import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { GoogleAuthButton } from "@/features/auth/components/GoogleAuthButton";
import { AuthConfigBanner } from "@/features/auth/components/AuthConfigBanner";
import { useAuth } from "@/features/auth/AuthProvider";
import { loginSchema } from "@/lib/validation";
import { isSafeReturnPath } from "@/lib/validation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import type { z } from "zod";

type FormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { signIn, configured } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formError, setFormError] = useState<string | null>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setFormError(null);
    try {
      await signIn(values);
      toast.success("Signed in successfully");
      const from = (location.state as { from?: string } | null)?.from;
      navigate(isSafeReturnPath(from) ? from : "/cart", { replace: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to sign in";
      setFormError(message);
    }
  });

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in with your email and password, or continue with Google."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="font-medium text-accent hover:underline">
            Sign up
          </Link>
        </>
      }
    >
      <AuthConfigBanner />
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        {formError ? <ErrorAlert message={formError} /> : null}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" {...form.register("email")} />
          {form.formState.errors.email ? (
            <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to="/forgot-password" className="text-xs text-accent hover:underline">
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            {...form.register("password")}
          />
          {form.formState.errors.password ? (
            <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
          ) : null}
        </div>
        <Button
          type="submit"
          className="btn-accent w-full h-12"
          disabled={!configured || form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Sign in
        </Button>
      </form>
      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs uppercase tracking-wide text-muted-foreground">Or</span>
        <div className="h-px flex-1 bg-border" />
      </div>
      <GoogleAuthButton />
    </AuthLayout>
  );
}
