import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "gold" | "ghost-on-night";

const base =
  "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full border px-6 py-3 text-[0.95rem] font-semibold tracking-wide no-underline cursor-pointer transition duration-300 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-default disabled:opacity-55";

// A soft light sweep across solid buttons on hover.
const sheen =
  "before:pointer-events-none before:absolute before:inset-0 before:-translate-x-full before:bg-linear-to-r before:from-transparent before:via-white/25 before:to-transparent before:transition-transform before:duration-700 hover:before:translate-x-full motion-reduce:before:hidden";

const variants: Record<Variant, string> = {
  primary: cn("border-transparent bg-primary text-primary-ink shadow-card hover:shadow-lift", sheen),
  secondary: "border-line bg-surface text-ink hover:border-ink/40",
  gold: cn("border-transparent bg-sun text-sun-ink shadow-[0_12px_30px_-14px] shadow-sun hover:brightness-105", sheen),
  "ghost-on-night": "border-night-ink/25 bg-transparent text-night-ink hover:border-night-ink/60 hover:bg-night-ink/5",
};

export function buttonClasses(variant: Variant = "primary", className?: string) {
  return cn(base, variants[variant], className);
}

/** Arrow that nudges right on hover; use inside a button or link. */
export function Arrow() {
  return (
    <span aria-hidden="true" className="relative transition-transform duration-300 motion-safe:group-hover:translate-x-1">
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
