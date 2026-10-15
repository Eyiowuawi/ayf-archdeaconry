"use client";

import * as SheetPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "@/utils/utils";

// shadcn/ui Sheet (left or right drawer), styled with the AYF theme tokens.
export const Sheet = SheetPrimitive.Root;
export const SheetTitle = SheetPrimitive.Title;

export function SheetHeader({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-1.5 p-4", className)} {...props} />;
}

export function SheetContent({
  className,
  children,
  side = "left",
  ...props
}: ComponentProps<typeof SheetPrimitive.Content> & { side?: "left" | "right" }) {
  return (
    <SheetPrimitive.Portal>
      <SheetPrimitive.Overlay className="fixed inset-0 z-50 bg-night/50 backdrop-blur-[1px]" />
      <SheetPrimitive.Content
        className={cn(
          "fixed inset-y-0 z-50 flex h-full w-72 flex-col bg-surface text-ink shadow-lift transition-transform duration-300",
          side === "left" ? "left-0 border-r border-line" : "right-0 border-l border-line",
          className
        )}
        aria-describedby={undefined}
        {...props}
      >
        {children}
        <SheetPrimitive.Close className="absolute right-3 top-5 grid size-8 cursor-pointer place-items-center rounded-md text-ink-muted hover:bg-surface-muted hover:text-ink">
          <X className="size-4" aria-hidden="true" />
          <span className="sr-only">Close</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPrimitive.Portal>
  );
}
