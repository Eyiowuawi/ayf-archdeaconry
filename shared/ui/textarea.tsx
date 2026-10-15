import type { ComponentProps } from "react";
import { cn } from "@/utils/utils";
import { controlClasses } from "@/shared/ui/input";

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(controlClasses, "min-h-28 leading-relaxed", className)}
      {...props}
    />
  );
}
