import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

// Form layout pieces used alongside the shadcn controls.

export function Optional() {
  return <span className="font-normal text-ink-muted">(optional)</span>;
}

export function FieldError({ id, children }: { id: string; children?: ReactNode }) {
  if (!children) return null;
  return (
    <p id={id} className="mt-1.5 text-[0.82rem] text-danger">
      {children}
    </p>
  );
}

export function FieldHint({ children }: { children: ReactNode }) {
  return <p className="mt-1.5 text-[0.82rem] text-ink-muted">{children}</p>;
}

export function Fieldset({ legend, children }: { legend: string; children: ReactNode }) {
  return (
    <fieldset className="mb-5 rounded-card border border-line bg-surface p-5 shadow-card sm:p-6">
      <legend className="rounded-full bg-night px-3 py-1 font-display text-sm font-bold text-night-ink">{legend}</legend>
      {children}
    </fieldset>
  );
}

export function FieldRow({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-3">{children}</div>;
}

export function Notice({
  tone = "danger",
  className,
  ...props
}: ComponentProps<"div"> & { tone?: "danger" | "success" }) {
  return (
    <div
      className={cn(
        "rounded-2xl border px-4 py-3 text-sm text-ink",
        tone === "danger" ? "border-sun/60 bg-sun/15" : "border-success-line bg-success-soft",
        className
      )}
      {...props}
    />
  );
}
