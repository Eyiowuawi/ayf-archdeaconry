import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "sun" | "ghost-on-night";

const base =
  "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full border px-6 py-3 font-display text-base font-bold no-underline cursor-pointer transition duration-300 ease-out motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-default disabled:opacity-55";

const variants: Record<Variant, string> = {
  primary:
    "border-transparent bg-linear-to-r from-primary via-accent to-primary bg-size-[200%_auto] bg-left text-primary-ink shadow-lift hover:bg-right",
  secondary: "border-line bg-surface text-ink hover:border-primary hover:text-primary",
  sun: "border-transparent bg-sun text-sun-ink shadow-[0_10px_30px_-10px] shadow-sun/70 hover:brightness-105",
  "ghost-on-night": "border-night-ink/25 bg-night-ink/5 text-night-ink backdrop-blur hover:bg-night-ink/15",
};

export function buttonClasses(variant: Variant = "primary", className?: string) {
  return cn(base, variants[variant], className);
}

/** Arrow that nudges right on hover; use inside a button or link. */
export function Arrow() {
  return (
    <span aria-hidden="true" className="transition-transform duration-300 motion-safe:group-hover:translate-x-1">
      →
    </span>
  );
}

export function Button({
  variant = "primary",
  className,
  ...props
}: ComponentProps<"button"> & { variant?: Variant }) {
  return <button className={buttonClasses(variant, className)} {...props} />;
}

export function ButtonLink({
  variant = "primary",
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant }) {
  return <Link className={buttonClasses(variant, className)} {...props} />;
}
