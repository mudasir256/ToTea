import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AuthLayout } from "@/features/auth/components/AuthLayout";
import { GoogleAuthButton } from "@/features/auth/components/GoogleAuthButton";
import { AuthConfigBanner } from "@/features/auth/components/AuthConfigBanner";
import { useAuth } from "@/features/auth/AuthProvider";
import { signupSchema } from "@/lib/validation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import type { z } from "zod";

type FormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const { signUp, configured } = useAuth();
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);
  const form = useForm<FormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { fullName: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setFormError(null);
    try {
      const result = await signUp({
        email: values.email,
        password: values.password,
        fullName: values.fullName,
      });
      if (result.needsEmailConfirmation) {
        toast.success("Account created. Check your email to verify, then sign in.");
        navigate("/login");
      } else {
        toast.success("Account created");
        navigate("/account/profile");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to create account";
      setFormError(message);
    }
  });

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Sign up with any valid email (including Gmail) and password, or continue with Google."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-accent hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <AuthConfigBanner />
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        {formError ? <ErrorAlert message={formError} /> : null}
        <div className="space-y-2">
          <Label htmlFor="fullName">Full name</Label>
          <Input id="fullName" autoComplete="name" {...form.register("fullName")} />
          {form.formState.errors.fullName ? (
            <p className="text-sm text-destructive">{form.formState.errors.fullName.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" autoComplete="email" {...form.register("email")} />
          {form.formState.errors.email ? (
            <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
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
          <Label htmlFor="confirmPassword">Confirm password</Label>
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
        <Button
          type="submit"
          className="btn-accent w-full h-12"
          disabled={!configured || form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Create account
        </Button>
      </form>
      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs uppercase tracking-wide text-muted-foreground">Or</span>
        <div className="h-px flex-1 bg-border" />
      </div>
      <GoogleAuthButton label="Continue with Google" />
    </AuthLayout>
  );
}
