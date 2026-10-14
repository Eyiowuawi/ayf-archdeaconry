import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

const cardBase = "rounded-card border border-line bg-surface shadow-card";
const lift =
  "transition duration-300 ease-out hover:border-primary/40 hover:shadow-lift motion-safe:hover:-translate-y-1";

export function Card({ className, interactive = false, ...props }: ComponentProps<"div"> & { interactive?: boolean }) {
  return <div className={cn(cardBase, "p-6", interactive && lift, className)} {...props} />;
}

/** A whole card that is one link, with a lift on hover. */
export function CardLink({ className, ...props }: ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn(
        cardBase,
        lift,
        "group block p-6 text-ink no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        className
      )}
      {...props}
    />
  );
}
