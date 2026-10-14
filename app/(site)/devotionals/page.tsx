import type { Metadata } from "next";
import { CardLink } from "@/components/ui/Card";
import { Container, PageHeader } from "@/components/ui/Layout";
import { formatLongDate, sortedDevotionals } from "@/lib/content/devotionals";

export const metadata: Metadata = { title: "Devotionals" };

export default function DevotionalsPage() {
  const items = sortedDevotionals();
  return (
    <Container className="py-9 pb-14">
      <PageHeader title="Devotionals" lead="A short word from Scripture each week, with a prayer to take with you." />
      <div className="grid gap-3">
        {items.map((d) => (
          <CardLink key={d.slug} href={`/devotionals/${d.slug}`}>
            <p className="mb-1 text-[0.8rem] text-ink-muted">
              {formatLongDate(d.date)} · {d.scripture.ref}
            </p>
            <h2 className="mb-2.5 font-serif text-xl font-semibold">{d.title}</h2>
            <p className="text-[0.95rem] text-ink-muted">{d.body[0]}</p>
          </CardLink>
        ))}
      </div>
    </Container>
  );
}
