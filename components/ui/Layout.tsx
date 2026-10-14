import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Container({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-5xl px-4", className)} {...props} />;
}

export function PageHeader({ title, lead }: { title: string; lead?: ReactNode }) {
  return (
    <header className="mb-7">
      <h1 className="mb-2 font-serif text-[clamp(1.6rem,4vw,2.2rem)] font-semibold leading-tight">{title}</h1>
      {lead && <p className="max-w-[60ch] text-ink-muted">{lead}</p>}
    </header>
  );
}

export function SectionHeading({
  children,
  action,
  className,
}: {
  children: ReactNode;
  action?: { href: string; label: string };
  className?: string;
}) {
  return (
    <div className={cn("mb-3.5 flex items-baseline justify-between gap-3", className)}>
      <h2 className="font-serif text-2xl font-semibold">{children}</h2>
      {action && <TextLink href={action.href}>{action.label}</TextLink>}
    </div>
  );
}

export function TextLink({ className, ...props }: ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn(
        "text-sm font-bold text-primary no-underline hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        className
      )}
      {...props}
    />
  );
}

export function Eyebrow({ className, ...props }: ComponentProps<"p">) {
  return <p className={cn("text-xs font-bold uppercase tracking-wider", className)} {...props} />;
}
