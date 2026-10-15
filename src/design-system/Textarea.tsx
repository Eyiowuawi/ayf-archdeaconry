import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
import { controlClasses } from "@/design-system/Input";

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea data-slot="textarea" className={cn(controlClasses, "min-h-28 leading-relaxed", className)} {...props} />;
}
