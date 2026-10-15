import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

// shadcn/ui Card, styled with the AYF theme tokens. Pass `interactive` for a hover lift;
// wrap a link with `<Card asLink>`-style classes via `cardLift` when the whole card is clickable.
export const cardBase = "rounded-card border border-line bg-surface text-ink shadow-card";
export const cardLift =
  "transition duration-300 ease-out hover:border-primary/40 hover:shadow-lift motion-safe:hover:-translate-y-1";

export function Card({ className, interactive = false, ...props }: ComponentProps<"div"> & { interactive?: boolean }) {
  return <div data-slot="card" className={cn(cardBase, "p-6", interactive && cardLift, className)} {...props} />;
}

export function CardHeader({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="card-header" className={cn("mb-3 flex flex-col gap-1.5", className)} {...props} />;
}

export function CardTitle({ className, ...props }: ComponentProps<"h3">) {
  return <h3 data-slot="card-title" className={cn("font-display text-xl font-extrabold tracking-tight", className)} {...props} />;
}

export function CardDescription({ className, ...props }: ComponentProps<"p">) {
  return <p data-slot="card-description" className={cn("text-sm text-ink-muted", className)} {...props} />;
}

export function CardContent({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="card-content" className={className} {...props} />;
}
