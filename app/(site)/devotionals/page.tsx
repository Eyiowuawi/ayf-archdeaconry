import type { Metadata } from "next";
import { CardLink } from "@/components/ui/Card";
import { Container, PageHero } from "@/components/ui/Layout";
import { Reveal } from "@/components/ui/Motion";
import { formatLongDate, sortedDevotionals } from "@/lib/content/devotionals";

export const metadata: Metadata = { title: "Devotionals" };

export default function DevotionalsPage() {
  const items = sortedDevotionals();
  return (
    <>
      <PageHero
        eyebrow="Devotionals"
        title="A word for the week ahead."
        lead="A short reading from Scripture, a reflection, and a prayer to carry into your day."
      />
      <Container className="py-20 sm:py-28">
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((d, i) => (
            <Reveal key={d.slug} delay={(i % 2) * 120} className={i === 0 ? "md:col-span-2" : "h-full"}>
              <CardLink href={`/devotionals/${d.slug}`} className="h-full">
                <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em]">
                  {i === 0 && <span className="text-accent">Latest</span>}
                  <span className="text-ink-muted">{formatLongDate(d.date)}</span>
                  <span className="text-ink-muted">· {d.scripture.ref}</span>
                </div>
                <h2
                  className={`mt-5 font-display font-medium leading-tight tracking-tight transition-colors group-hover:text-accent ${
                    i === 0 ? "text-[clamp(2rem,4vw,3rem)]" : "text-2xl"
                  }`}
                >
                  {d.title}
                </h2>
                <p className="mt-4 max-w-[62ch] leading-relaxed text-ink-muted">{d.body[0]}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  Read
                  <span aria-hidden="true" className="transition-transform duration-300 motion-safe:group-hover:translate-x-1">→</span>
                </span>
              </CardLink>
            </Reveal>
          ))}
        </div>
      </Container>
    </>
  );
}
