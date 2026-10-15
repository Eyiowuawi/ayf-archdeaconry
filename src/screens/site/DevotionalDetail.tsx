import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Scripture } from "@/screens/site/Scripture";
import { Arrow, Button } from "@/design-system/Button";
import { Container, Eyebrow, TextLink } from "@/design-system/Layout";
import { Blobs, Reveal } from "@/design-system/Motion";
import { siteDevotional, siteDevotionals } from "@/lib/cms";
import { formatLongDate } from "@/lib/devotionals";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await siteDevotionals()).map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const d = await siteDevotional((await params).slug);
  return d ? { title: d.title, description: `${d.scripture.ref}: ${d.scripture.text}` } : {};
}

export async function DevotionalDetail({ params }: Props) {
  const d = await siteDevotional((await params).slug);
  if (!d) notFound();
  return (
    <article>
      <header className="relative isolate overflow-hidden bg-night pb-16 pt-10 text-night-ink sm:pb-20">
        <Blobs />
        <Container className="max-w-3xl">
          <TextLink href="/devotionals" className="mb-8 text-sun">All devotionals</TextLink>
          <Eyebrow className="mb-3 text-sun">{formatLongDate(d.date)}</Eyebrow>
          <h1 className="mb-10 font-display text-[clamp(2.2rem,6vw,4rem)] font-extrabold leading-[0.95] tracking-tighter">
            {d.title}
          </h1>
          <Scripture text={d.scripture.text} reference={`${d.scripture.ref} (KJV)`} size="lg" />
        </Container>
      </header>
      <Container className="max-w-3xl py-14">
        {d.body.map((p, i) => (
          <Reveal key={i} delay={i * 60}>
            <p className="mb-5 text-lg leading-relaxed">{p}</p>
          </Reveal>
        ))}
        <Reveal>
          <div className="mt-10 rounded-card bg-linear-to-br from-primary to-accent p-[2px] shadow-lift">
            <div className="rounded-[calc(var(--radius-card)-2px)] bg-surface p-6 sm:p-8">
              <Eyebrow className="mb-3">Pray this</Eyebrow>
              <p className="font-display text-xl font-bold leading-snug sm:text-2xl">{d.prayer}</p>
            </div>
          </div>
        </Reveal>
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-card bg-surface-muted p-6">
          <p className="font-display text-xl font-extrabold tracking-tight">Want to grow with others?</p>
          <Button asChild>
            <Link href="/register">
              Join the fellowship <Arrow />
            </Link>
          </Button>
        </div>
      </Container>
    </article>
  );
}
