import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

// shadcn/ui Button, styled with the AYF theme tokens from app/theme.css.
const buttonVariants = cva(
  "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full border font-display font-bold no-underline cursor-pointer transition duration-300 ease-out motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-55 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "border-transparent bg-linear-to-r from-primary via-accent to-primary bg-size-[200%_auto] bg-left text-primary-ink shadow-lift hover:bg-right",
        secondary: "border-line bg-surface text-ink hover:border-primary hover:text-primary",
        sun: "border-transparent bg-sun text-sun-ink shadow-[0_10px_30px_-10px] shadow-sun/70 hover:brightness-105",
        "ghost-on-night": "border-night-ink/25 bg-night-ink/5 text-night-ink backdrop-blur hover:bg-night-ink/15",
      },
      size: {
        default: "px-6 py-3 text-base",
        sm: "px-4 py-2 text-sm",
        lg: "px-7 py-4 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  }
);

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

/** Arrow that nudges right on hover; use inside a button or link. */
export function Arrow() {
  return (
    <span aria-hidden="true" className="transition-transform duration-300 motion-safe:group-hover:translate-x-1">
      →
    </span>
  );
}

export { buttonVariants };
