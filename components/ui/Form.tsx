import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

const control =
  "w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-base text-ink focus:outline-2 focus:outline-offset-1 focus:outline-primary disabled:bg-surface-muted disabled:text-ink-muted aria-invalid:border-danger";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(control, className)} {...props} />;
}

export function Select({ className, ...props }: ComponentProps<"select">) {
  return <select className={cn(control, className)} {...props} />;
}

export function Label({ className, ...props }: ComponentProps<"label">) {
  return <label className={cn("mb-1.5 block text-sm font-bold", className)} {...props} />;
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
    <fieldset className="mb-4 rounded-card border border-line bg-surface p-4">
      <legend className="px-1.5 font-serif text-[1.05rem] font-semibold">{legend}</legend>
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
        "rounded-card border px-3 py-2.5 text-sm text-ink",
        tone === "danger" ? "border-danger-line bg-danger-soft" : "border-success-line bg-success-soft",
        className
      )}
      {...props}
    />
  );
}
