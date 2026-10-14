import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Aurora, SplitReveal } from "./Motion";

export function Container({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-6xl px-5 sm:px-8", className)} {...props} />;
}

/** Small uppercase label with a gold rule in front. */
export function Eyebrow({ className, children, ...props }: ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "flex items-center gap-3 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-accent",
        className
      )}
      {...props}
    >
      <span aria-hidden="true" className="h-px w-8 bg-current opacity-70" />
      {children}
    </p>
  );
}

/** Italic serif emphasis in gold, for one or two key words in a heading. */
export function Emphasis({ className, ...props }: ComponentProps<"em">) {
  return <em className={cn("font-normal italic text-accent", className)} {...props} />;
}

/** Navy band at the top of inner pages. */
export function PageHero({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow?: string;
  title: string;
  lead?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-night pb-16 pt-14 text-night-ink sm:pb-24 sm:pt-20">
      <Aurora />
      <Container>
        {eyebrow && <Eyebrow className="mb-6 text-sun">{eyebrow}</Eyebrow>}
        <h1 className="max-w-[20ch] font-display text-[clamp(2.4rem,6.5vw,4.6rem)] font-medium leading-[1.02] tracking-tight">
          <SplitReveal text={title} />
        </h1>
        {lead && <p className="mt-6 max-w-[56ch] text-lg leading-relaxed text-night-muted">{lead}</p>}
        {children}
      </Container>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  children,
  lead,
  action,
  className,
}: {
  eyebrow?: string;
  children: ReactNode;
  lead?: ReactNode;
  action?: { href: string; label: string };
  className?: string;
}) {
  return (
    <div className={cn("mb-10 flex flex-wrap items-end justify-between gap-4", className)}>
      <div className="max-w-2xl">
        {eyebrow && <Eyebrow className="mb-4">{eyebrow}</Eyebrow>}
        <h2 className="font-display text-[clamp(2rem,4.5vw,3.25rem)] font-medium leading-[1.05] tracking-tight">
          {children}
        </h2>
        {lead && <p className="mt-4 text-lg leading-relaxed text-ink-muted">{lead}</p>}
      </div>
      {action && <TextLink href={action.href}>{action.label}</TextLink>}
    </div>
  );
}

export function TextLink({ className, children, ...props }: ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn(
        "group inline-flex items-center gap-2 text-sm font-semibold text-primary no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        className
      )}
      {...props}
    >
      <span className="bg-linear-to-r from-current to-current bg-size-[0%_1px] bg-bottom-left bg-no-repeat pb-0.5 transition-[background-size] duration-500 group-hover:bg-size-[100%_1px]">
        {children}
      </span>
      <span aria-hidden="true" className="transition-transform duration-300 motion-safe:group-hover:translate-x-1">→</span>
    </Link>
  );
}
