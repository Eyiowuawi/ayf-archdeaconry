import type { Metadata } from "next";
import Link from "next/link";
import { cardBase, cardLift } from "@/design-system/Card";
import { cn } from "@/lib/cn";
import { Container, GradientText, PageHero } from "@/design-system/Layout";
import { Reveal } from "@/design-system/Motion";
import { siteDevotionals } from "@/lib/cms";
import { formatLongDate, sortedDevotionals } from "@/lib/devotionals";

export const metadata: Metadata = { title: "Devotionals" };

export async function Devotionals() {
  const items = sortedDevotionals(await siteDevotionals());
  return (
    <>
      <PageHero
        eyebrow="Devotionals"
        title={<>Five minutes. <GradientText onDark>One Word.</GradientText></>}
        lead="A short word from Scripture each week, with a prayer to take into your day."
      />
      <Container className="py-16 sm:py-20">
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((d, i) => (
            <Reveal key={d.slug} delay={(i % 2) * 90} className={i === 0 ? "md:col-span-2" : undefined}>
              <Link
                href={`/devotionals/${d.slug}`}
                className={cn(
                  cardBase,
                  cardLift,
                  "group block h-full p-6 text-ink no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                )}
              >
                <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                  {i === 0 && (
                    <span className="rounded-full bg-accent px-2.5 py-1 uppercase tracking-wider text-accent-ink">New</span>
                  )}
                  <span className="rounded-full bg-sun px-2.5 py-1 text-sun-ink">{d.scripture.ref}</span>
                  <span className="text-ink-muted">{formatLongDate(d.date)}</span>
                </div>
                <h2
                  className={`mt-4 font-display font-extrabold leading-tight tracking-tight transition-colors group-hover:text-primary ${
                    i === 0 ? "text-[clamp(1.8rem,4vw,2.8rem)]" : "text-2xl"
                  }`}
                >
                  {d.title}
                </h2>
                <p className="mt-3 max-w-[60ch] text-ink-muted">{d.body[0]}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 font-display text-sm font-bold text-primary">
                  Read it
                  <span aria-hidden="true" className="transition-transform duration-300 motion-safe:group-hover:translate-x-1">→</span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </>
  );
}
