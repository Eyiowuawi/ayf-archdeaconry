import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

const badgeVariants = cva("inline-flex items-center rounded-full capitalize px-2.5 py-0.5 text-xs font-bold whitespace-nowrap", {
  variants: {
    variant: {
      default: "bg-surface-muted text-ink",
      success: "bg-success-soft text-success",
      warning: "bg-sun/20 text-ink",
      danger: "bg-danger-soft text-danger",
    },
  },
  defaultVariants: { variant: "default" },
});

export function Badge({ className, variant, ...props }: ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />;
}
