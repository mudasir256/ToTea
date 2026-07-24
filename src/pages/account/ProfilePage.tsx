import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, LogOut, Package } from "lucide-react";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/features/auth/AuthProvider";
import { getSupabase } from "@/lib/supabase";
import { profileUpdateSchema, normalizePhone } from "@/lib/validation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import type { z } from "zod";

type FormValues = z.infer<typeof profileUpdateSchema>;

export default function ProfilePage() {
  const { user, profile, refreshProfile, signOut, loading: authLoading } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      full_name: "",
      contact_number: "",
      address_line_1: "",
      address_line_2: "",
      city: "",
      state: "",
      postal_code: "",
      country: "US",
    },
  });

  useEffect(() => {
    if (!profile) return;
    form.reset({
      full_name: profile.full_name ?? "",
      contact_number: profile.contact_number ?? "",
      address_line_1: profile.address_line_1 ?? "",
      address_line_2: profile.address_line_2 ?? "",
      city: profile.city ?? "",
      state: profile.state ?? "",
      postal_code: profile.postal_code ?? "",
      country: "US",
    });
  }, [profile, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    if (!user) return;
    setFormError(null);
    const supabase = getSupabase();
    if (!supabase) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: values.full_name,
        contact_number: values.contact_number ? normalizePhone(values.contact_number) : null,
        address_line_1: values.address_line_1 || null,
        address_line_2: values.address_line_2 || null,
        city: values.city || null,
        state: values.state || null,
        postal_code: values.postal_code || null,
        country: "US",
      })
      .eq("id", user.id);

    if (error) {
      setFormError(error.message);
      return;
    }
    await refreshProfile();
    toast.success("Profile updated");
  });

  const onUpload = async (file: File | undefined) => {
    if (!file || !user) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
    if (!allowedTypes.has(file.type)) {
      toast.error("Only JPG, PNG, WebP, or GIF images are allowed");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB");
      return;
    }

    const supabase = getSupabase();
    if (!supabase) return;
    setUploading(true);
    try {
      const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : file.type === "image/gif" ? "gif" : "jpg";
      const path = `${user.id}/avatar.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("profile-images")
        .upload(path, file, { upsert: true, contentType: file.type });
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("profile-images").getPublicUrl(path);
      const { error } = await supabase
        .from("profiles")
        .update({ profile_image_url: `${data.publicUrl}?t=${Date.now()}` })
        .eq("id", user.id);
      if (error) throw error;
      await refreshProfile();
      toast.success("Profile image updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (authLoading && !profile) {
    return (
      <div className="min-h-screen">
        <Header />
        <LoadingSpinner label="Loading profile..." />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="section-padding pt-28 md:pt-36">
        <div className="container mx-auto max-w-3xl px-6 md:px-12">
          <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="heading-lg">Your profile</h1>
              <p className="mt-2 text-muted-foreground">Manage your account and shipping details.</p>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline" className="rounded-2xl">
                <Link to="/account/orders">
                  <Package className="mr-2 h-4 w-4" />
                  Orders
                </Link>
              </Button>
              <Button
                variant="outline"
                className="rounded-2xl"
                onClick={async () => {
                  await signOut();
                  toast.success("Signed out");
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </Button>
            </div>
          </div>

          <div className="rounded-4xl border border-border bg-card p-6 md:p-8 space-y-8">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="h-24 w-24 overflow-hidden rounded-3xl bg-secondary">
                {profile?.profile_image_url ? (
                  <img
                    src={profile.profile_image_url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-2xl font-serif">
                    {(profile?.full_name || profile?.email || "T").charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{profile?.email || user?.email}</p>
                </div>
                <div>
                  <Label htmlFor="avatar">Profile image</Label>
                  <Input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    className="mt-2"
                    disabled={uploading}
                    onChange={(e) => void onUpload(e.target.files?.[0])}
                  />
                </div>
              </div>
            </div>

            <form onSubmit={onSubmit} className="space-y-4" noValidate>
              {formError ? <ErrorAlert message={formError} /> : null}
              <div className="space-y-2">
                <Label htmlFor="full_name">Full name</Label>
                <Input id="full_name" {...form.register("full_name")} />
                {form.formState.errors.full_name ? (
                  <p className="text-sm text-destructive">{form.formState.errors.full_name.message}</p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_number">Contact number</Label>
                <Input id="contact_number" {...form.register("contact_number")} />
                {form.formState.errors.contact_number ? (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.contact_number.message}
                  </p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="address_line_1">Address line 1</Label>
                <Input id="address_line_1" {...form.register("address_line_1")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address_line_2">Address line 2</Label>
                <Input id="address_line_2" {...form.register("address_line_2")} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" {...form.register("city")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State / province</Label>
                  <Input id="state" {...form.register("state")} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="postal_code">Postal code</Label>
                  <Input id="postal_code" {...form.register("postal_code")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" {...form.register("country")} readOnly />
                  <p className="text-xs text-muted-foreground">United States (ISO code: US)</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Account created {profile?.created_at ? new Date(profile.created_at).toLocaleString() : "—"}
                {profile?.updated_at ? ` · Updated ${new Date(profile.updated_at).toLocaleString()}` : ""}
              </p>
              <Button type="submit" className="btn-accent h-12" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save profile
              </Button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
