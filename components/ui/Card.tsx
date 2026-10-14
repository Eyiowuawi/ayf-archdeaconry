import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

const cardBase = "rounded-card border border-line bg-surface shadow-card";

export function Card({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn(cardBase, "p-5", className)} {...props} />;
}

/** A whole card that is one link, with a hover/focus state. */
export function CardLink({ className, ...props }: ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn(
        cardBase,
        "block p-5 text-ink no-underline transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        className
      )}
      {...props}
    />
  );
}
