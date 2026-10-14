import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "highlight" | "ghost-on-brand";

const base =
  "inline-flex items-center justify-center gap-1.5 rounded-card border px-4.5 py-2.5 text-[0.95rem] font-bold no-underline transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-default disabled:opacity-55";

const variants: Record<Variant, string> = {
  primary: "border-transparent bg-primary text-primary-ink hover:brightness-110",
  secondary: "border-line bg-surface text-ink hover:bg-surface-muted",
  highlight: "border-transparent bg-highlight text-highlight-ink hover:brightness-105",
  "ghost-on-brand": "border-brand-ink/35 bg-transparent text-brand-ink hover:bg-brand-ink/10",
};

export function buttonClasses(variant: Variant = "primary", className?: string) {
  return cn(base, variants[variant], className);
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
