import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useCart } from "@/features/cart/CartProvider";
import { getSupabase } from "@/lib/supabase";
import {
  clearPosPending,
  loadPosPending,
  parsePosCallback,
} from "@/lib/squarePos";
import { Button } from "@/components/ui/button";
import { ErrorAlert } from "@/components/shared/ErrorAlert";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export default function PosCallbackPage() {
  const navigate = useNavigate();
  const { refreshCart } = useCart();
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"working" | "done" | "failed">("working");
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    async function finish() {
      const result = parsePosCallback(window.location.search, window.location.hash);
      const pending = loadPosPending();

      if (!result.ok) {
        clearPosPending();
        setStatus("failed");
        setError(
          result.errorDescription ||
            `Square POS reported an error (${result.errorCode}). You can try again from the POS page.`
        );
        return;
      }

      if (!pending) {
        setStatus("failed");
        setError(
          "No pending POS checkout was found in this browser session. Start again from /pos."
        );
        return;
      }

      const supabase = getSupabase();
      if (!supabase) {
        setStatus("failed");
        setError("Supabase is not configured.");
        return;
      }

      try {
        const { data, error: fnError } = await supabase.functions.invoke("finalize-pos-checkout", {
          body: {
            idempotencyKey: pending.idempotencyKey,
            clientTransactionId: result.clientTransactionId,
            serverTransactionId: result.serverTransactionId,
            customerName: pending.customerName,
            contactNumber: pending.contactNumber,
          },
        });

        if (fnError) throw fnError;
        if (data?.error) throw new Error(data.error);
        if (!data?.orderId) throw new Error("POS finalization did not return an order id");

        clearPosPending();
        await refreshCart();
        setStatus("done");
        toast.success("In-store payment recorded");
        navigate(`/order-confirmation/${data.orderId}`, { replace: true });
      } catch (err) {
        setStatus("failed");
        setError(err instanceof Error ? err.message : "Failed to finalize POS payment");
      }
    }

    void finish();
  }, [navigate, refreshCart]);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="section-padding pt-28">
        <div className="container mx-auto max-w-lg px-6 space-y-4">
          <h1 className="heading-lg">Square POS return</h1>
          {status === "working" ? (
            <LoadingSpinner label="Confirming your Square POS payment…" />
          ) : null}
          {status === "failed" && error ? (
            <>
              <ErrorAlert message={error} />
              <Button asChild className="btn-accent">
                <Link to="/pos">Back to POS</Link>
              </Button>
            </>
          ) : null}
          {status === "done" ? (
            <p className="text-muted-foreground flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Redirecting to order confirmation…
            </p>
          ) : null}
        </div>
      </main>
      <Footer />
    </div>
  );
}
