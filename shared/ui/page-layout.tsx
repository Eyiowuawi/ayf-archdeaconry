import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/utils/utils";
import { Blobs } from "@/shared/ui/motion";

export function Container({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6", className)} {...props} />;
}

export function Eyebrow({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "font-display text-xs font-bold uppercase tracking-[0.18em] text-accent",
        className
      )}
      {...props}
    />
  );
}

/** Text with the animated brand gradient. */
export function GradientText({
  className,
  onDark = false,
  ...props
}: ComponentProps<"span"> & { onDark?: boolean }) {
  return (
    <span
      className={cn(
        onDark ? "from-sun via-accent to-sun" : "from-primary via-accent to-primary",
        "bg-linear-to-r bg-size-[200%_auto] bg-clip-text text-transparent motion-safe:animate-gradient",
        className
      )}
      {...props}
    />
  );
}

/** Dark band with moving colour blobs, used at the top of inner pages. */
export function PageHero({
  eyebrow,
  title,
  lead,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-night pb-14 pt-12 text-night-ink sm:pb-20 sm:pt-16">
      <Blobs />
      <Container>
        {eyebrow && <Eyebrow className="mb-3 text-sun">{eyebrow}</Eyebrow>}
        <h1 className="max-w-[18ch] font-display text-[clamp(2.4rem,7vw,4.5rem)] font-extrabold leading-[0.95] tracking-tight">
          {title}
        </h1>
        {lead && <p className="mt-5 max-w-[52ch] text-lg text-night-muted">{lead}</p>}
      </Container>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  children,
  action,
  className,
}: {
  eyebrow?: string;
  children: ReactNode;
  action?: { href: string; label: string };
  className?: string;
}) {
  return (
    <div className={cn("mb-6 flex flex-wrap items-end justify-between gap-3", className)}>
      <div>
        {eyebrow && <Eyebrow className="mb-2">{eyebrow}</Eyebrow>}
        <h2 className="font-display text-[clamp(1.9rem,4.5vw,3rem)] font-extrabold leading-none tracking-tight">
          {children}
        </h2>
      </div>
      {action && <TextLink href={action.href}>{action.label}</TextLink>}
    </div>
  );
}

export function TextLink({ className, children, ...props }: ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn(
        "group inline-flex items-center gap-1.5 font-display text-sm font-bold text-primary no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        className
      )}
      {...props}
    >
      <span className="bg-linear-to-r from-current to-current bg-size-[0%_2px] bg-bottom-left bg-no-repeat transition-[background-size] duration-300 group-hover:bg-size-[100%_2px]">
        {children}
      </span>
      <span
        aria-hidden="true"
        className="transition-transform duration-300 motion-safe:group-hover:translate-x-1"
      >
        →
      </span>
    </Link>
  );
}
