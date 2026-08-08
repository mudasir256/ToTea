type Props = {
  containerId?: string;
  applePayContainerId?: string;
  ready: boolean;
  applePayReady?: boolean;
  applePayError?: string | null;
  error: string | null;
};

/** Presentational Square card + Apple Pay mount point + status text. */
export function SquareCardField({
  containerId = "square-card-container",
  applePayContainerId = "square-apple-pay-container",
  ready,
  applePayReady = false,
  applePayError,
  error,
}: Props) {
  return (
    <div>
      {/* Apple Pay section (Container exists in DOM for SDK, styled when ready) */}
      <div className={applePayReady ? "mb-5" : "hidden"}>
        <p className="mb-2 text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">
          Express Checkout
        </p>
        <div
          id={applePayContainerId}
          className="min-h-[48px] w-full rounded-lg bg-black text-white"
        />
        <div className="relative my-4 text-center">
          <span className="bg-white px-3 text-[11px] font-medium text-muted-foreground">
            OR PAY WITH CARD
          </span>
          <div className="absolute inset-0 top-1/2 -z-10 h-px bg-border" />
        </div>
      </div>

      {applePayError && !applePayReady ? (
        <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-[11.5px] text-amber-800">
          💡 <span className="font-semibold">Apple Pay Status:</span> {applePayError}
        </div>
      ) : null}

      <p className="mb-2 text-[12px] font-medium text-foreground">
        Card number · MM/YY · CVV · ZIP
      </p>
      <div
        className={`rounded-lg border bg-white p-3.5 transition-colors ${
          error
            ? "border-destructive"
            : ready
              ? "border-accent shadow-[0_0_0_1px_hsl(var(--accent)/0.25)]"
              : "border-border"
        }`}
      >
        {/* Square injects iframes here — keep this node empty aside from the mount id. */}
        <div id={containerId} className="min-h-[110px] w-full bg-white" />
      </div>
      {error ? (
        <div className="mt-2 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-[12.5px] text-destructive">
          <p className="font-medium">Card form failed to load</p>
          <p className="mt-1">{error}</p>
        </div>
      ) : ready ? (
        <p className="mt-2.5 text-[11px] text-muted-foreground">
          🔒 Click inside the box above and type. Sandbox test card:{" "}
          <span className="font-medium text-foreground">4111 1111 1111 1111</span> · any future
          expiry · any CVV · any ZIP
        </p>
      ) : (
        <p className="mt-2 text-[12.5px] text-muted-foreground">Loading secure payment form…</p>
      )}
    </div>
  );
}
