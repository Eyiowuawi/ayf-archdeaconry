import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Scripture from "@/components/site/Scripture";
import { Arrow, ButtonLink } from "@/components/ui/Button";
import { Container, Eyebrow, TextLink } from "@/components/ui/Layout";
import { Aurora, Reveal, SplitReveal } from "@/components/ui/Motion";
import { DEVOTIONALS, formatLongDate, getDevotional } from "@/lib/content/devotionals";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return DEVOTIONALS.map((d) => ({ slug: d.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const d = getDevotional((await params).slug);
  return d ? { title: d.title, description: `${d.scripture.ref}: ${d.scripture.text}` } : {};
}

export default async function DevotionalPage({ params }: Props) {
  const d = getDevotional((await params).slug);
  if (!d) notFound();
  return (
    <article>
      <header className="relative isolate overflow-hidden bg-night pb-20 pt-12 text-night-ink sm:pb-28">
        <Aurora />
        <Container className="max-w-3xl">
          <TextLink href="/devotionals" className="mb-12 text-sun">All devotionals</TextLink>
          <Eyebrow className="mb-6 text-sun">{formatLongDate(d.date)}</Eyebrow>
          <h1 className="mb-12 font-display text-[clamp(2.4rem,6vw,4.25rem)] font-medium leading-[1.02] tracking-tight">
            <SplitReveal text={d.title} />
          </h1>
          <Reveal delay={300}>
            <Scripture text={d.scripture.text} reference={`${d.scripture.ref} (KJV)`} size="lg" />
          </Reveal>
        </Container>
      </header>
      <Container className="max-w-3xl py-16 sm:py-20">
        {d.body.map((p, i) => (
          <Reveal key={i} delay={i * 80}>
            <p className={`mb-6 text-lg leading-[1.8] ${i === 0 ? "first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-6xl first-letter:leading-[0.85] first-letter:text-accent" : ""}`}>
              {p}
            </p>
          </Reveal>
        ))}
        <Reveal>
          <div className="mt-12 border-l-2 border-sun pl-6 sm:pl-8">
            <Eyebrow className="mb-4">Prayer</Eyebrow>
            <p className="font-display text-2xl font-light italic leading-snug">{d.prayer}</p>
          </div>
        </Reveal>
        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 rounded-card border border-line bg-surface p-6 sm:p-8">
          <p className="font-display text-2xl font-medium tracking-tight">Grow with others in your parish.</p>
          <ButtonLink href="/register">
            Join AYF Egba <Arrow />
          </ButtonLink>
        </div>
      </Container>
    </article>
  );
}
