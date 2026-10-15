import type { ComponentProps } from "react";
import { cn } from "@/utils/utils";

// Shared look for text inputs and select triggers.
export const controlClasses =
  "w-full rounded-xl border-2 border-line bg-surface px-4 py-3 text-base text-ink transition-colors placeholder:text-ink-muted/60 hover:border-primary/40 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15 disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-ink-muted aria-invalid:border-danger";

export function Input({ className, type, ...props }: ComponentProps<"input">) {
  return (
    <input type={type} data-slot="input" className={cn(controlClasses, className)} {...props} />
  );
}
