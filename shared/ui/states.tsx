import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/shared/ui/button";

export function PageTitle({
  children,
  action,
}: {
  children: ReactNode;
  action?: { href: string; label: string };
}) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
      <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
        {children}
      </h1>
      {action && (
        <Button asChild size="sm">
          <Link href={action.href}>{action.label}</Link>
        </Button>
      )}
    </div>
  );
}

export function Flash({ children }: { children: ReactNode }) {
  return (
    <p
      role="status"
      className="mb-5 rounded-xl border border-success-line bg-success-soft px-4 py-3 text-sm font-semibold text-success"
    >
      {children}
    </p>
  );
}

export function NoDatabase() {
  return (
    <div className="rounded-card border border-sun/60 bg-sun/15 p-6">
      <h2 className="font-display text-xl font-extrabold">No database connected yet</h2>
      <p className="mt-2 max-w-[60ch] text-sm">
        The admin area is ready, but there is nowhere to save changes on the live site until a
        database is chosen and connected. Until then the website shows its built-in starter events
        and devotionals, and the Join form stays in preview mode.
      </p>
    </div>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-card border border-dashed border-line p-8 text-center text-ink-muted">
      {children}
    </p>
  );
}
