import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
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
    <article className="sitecontainer pagepad reading">
      <Link href="/devotionals" className="textlink backlink">All devotionals</Link>
      <p className="devdate">{formatLongDate(d.date)}</p>
      <h1 className="pagetitle">{d.title}</h1>
      <blockquote className="scripture">
        <p>{d.scripture.text}</p>
        <cite>{d.scripture.ref} (KJV)</cite>
      </blockquote>
      {d.body.map((p, i) => (
        <p key={i} className="readingpara">{p}</p>
      ))}
      <div className="prayer">
        <h2>Prayer</h2>
        <p>{d.prayer}</p>
      </div>
    </article>
  );
}
