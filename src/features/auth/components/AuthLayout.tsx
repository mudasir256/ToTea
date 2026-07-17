import { Link } from "react-router-dom";
import type { ReactNode } from "react";

type Props = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthLayout({ title, subtitle, children, footer }: Props) {
  return (
    <div className="min-h-screen">
      <main className="flex min-h-screen items-center py-12">
        <div className="container mx-auto max-w-md px-6">
          <div className="rounded-4xl border border-border bg-card p-8 shadow-elevated">
            <div className="mb-8 text-center">
              <Link to="/" className="font-serif text-2xl font-bold text-foreground">
                Totea
              </Link>
              <h1 className="mt-4 text-2xl font-semibold text-foreground">{title}</h1>
              {subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
            </div>
            {children}
            {footer ? <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div> : null}
          </div>
        </div>
      </main>
    </div>
  );
}
