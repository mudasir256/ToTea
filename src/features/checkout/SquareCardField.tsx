type Props = {
  containerId?: string;
  ready: boolean;
  error: string | null;
};

/** Presentational Square card mount point + status text. */
export function SquareCardField({
  containerId = "square-card-container",
  ready,
  error,
}: Props) {
  return (
    <div>
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
          <p className="mt-2 text-[11.5px] text-muted-foreground">
            Hard-refresh this page (Cmd+Shift+R). Or open{" "}
            <a className="underline" href="/square-test.html" target="_blank" rel="noreferrer">
              /square-test.html
            </a>{" "}
            to test Square by itself.
          </p>
        </div>
      ) : ready ? (
        <p className="mt-2.5 text-[11px] text-muted-foreground">
          🔒 Click inside the box above and type. Sandbox test card:{" "}
          <span className="font-medium text-foreground">4111 1111 1111 1111</span> · any future
          expiry · any CVV · any ZIP
        </p>
      ) : (
        <p className="mt-2 text-[12.5px] text-muted-foreground">Loading secure card form…</p>
      )}
    </div>
  );
}
