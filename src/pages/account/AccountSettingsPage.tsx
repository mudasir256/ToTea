import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/features/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AccountSettingsPage() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <Header />
      <main className="section-padding pt-28 md:pt-36">
        <div className="container mx-auto max-w-2xl px-6">
          <h1 className="heading-lg mb-2">Account settings</h1>
          <p className="mb-8 text-muted-foreground">Manage security and account access.</p>
          <div className="space-y-4 rounded-4xl border border-border bg-card p-6">
            <div>
              <p className="text-sm text-muted-foreground">Signed in as</p>
              <p className="font-medium">{profile?.email || user?.email}</p>
            </div>
            <Button asChild variant="outline" className="rounded-2xl w-full sm:w-auto">
              <Link to="/forgot-password">Change password</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-2xl w-full sm:w-auto ml-0 sm:ml-2">
              <Link to="/account/profile">Edit profile</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-2xl w-full sm:w-auto ml-0 sm:ml-2">
              <Link to="/pos">In-store Square POS</Link>
            </Button>
            <div>
              <Button
                variant="destructive"
                className="rounded-2xl"
                onClick={async () => {
                  await signOut();
                  toast.success("Signed out");
                  navigate("/");
                }}
              >
                Log out
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
