import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

const control =
  "w-full rounded-xl border-2 border-line bg-surface px-4 py-3 text-base text-ink transition-colors placeholder:text-ink-muted/60 hover:border-primary/40 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15 disabled:bg-surface-muted disabled:text-ink-muted aria-invalid:border-danger";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(control, className)} {...props} />;
}

export function Select({ className, ...props }: ComponentProps<"select">) {
  return <select className={cn(control, className)} {...props} />;
}

export function Label({ className, ...props }: ComponentProps<"label">) {
  return <label className={cn("mb-2 block font-display text-sm font-bold", className)} {...props} />;
}

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
