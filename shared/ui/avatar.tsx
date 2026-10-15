import type { ComponentProps } from "react";
import { cn } from "@/utils/utils";

/** A round badge with someone's initials. */
export function Avatar({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      data-slot="avatar"
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-full bg-sun text-xs font-bold text-sun-ink",
        className
      )}
      {...props}
    />
  );
}
