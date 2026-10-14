import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Scripture from "@/components/site/Scripture";
import { Container, TextLink } from "@/components/ui/Layout";
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
    <Container className="max-w-2xl py-9 pb-14">
      <article>
        <TextLink href="/devotionals" className="mb-4.5 inline-block">All devotionals</TextLink>
        <p className="mb-1 text-[0.8rem] text-ink-muted">{formatLongDate(d.date)}</p>
        <h1 className="mb-4 font-serif text-[clamp(1.6rem,4vw,2.2rem)] font-semibold leading-tight">{d.title}</h1>
        <Scripture text={d.scripture.text} reference={`${d.scripture.ref} (KJV)`} />
        {d.body.map((p, i) => (
          <p key={i} className="mb-3.5 text-[1.04rem] leading-relaxed">{p}</p>
        ))}
        <div className="mt-6 rounded-card border border-success-line bg-success-soft px-4.5 py-4">
          <h2 className="mb-1.5 text-xs font-bold uppercase tracking-wider text-success">Prayer</h2>
          <p className="font-serif text-[1.05rem]">{d.prayer}</p>
        </div>
      </article>
    </Container>
  );
}
