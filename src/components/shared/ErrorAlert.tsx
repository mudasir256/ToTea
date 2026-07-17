import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  title?: string;
  message: string;
  className?: string;
};

export function ErrorAlert({ title = "Something went wrong", message, className }: Props) {
  return (
    <div
      role="alert"
      className={cn(
        "flex gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm",
        className
      )}
    >
      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
      <div>
        <p className="font-semibold text-foreground">{title}</p>
        <p className="mt-1 text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
