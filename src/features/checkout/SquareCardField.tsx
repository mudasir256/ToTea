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
      <div
        id={containerId}
        className="min-h-[56px] rounded-lg border border-border bg-white px-3.5 py-3.5"
      />
      {error ? (
        <p className="mt-2 text-[12.5px] text-destructive">{error}</p>
      ) : ready ? (
        <p className="mt-2.5 text-[11px] text-muted-foreground">
          🔒 Payments processed securely by Square
        </p>
      ) : (
        <p className="mt-2 text-[12.5px] text-muted-foreground">Loading secure card form…</p>
      )}
    </div>
  );
}
