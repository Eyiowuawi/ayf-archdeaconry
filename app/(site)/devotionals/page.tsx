import type { Metadata } from "next";
import Link from "next/link";
import { formatLongDate, sortedDevotionals } from "@/lib/content/devotionals";

export const metadata: Metadata = { title: "Devotionals" };

export default function DevotionalsPage() {
  const items = sortedDevotionals();
  return (
    <div className="sitecontainer pagepad">
      <h1 className="pagetitle">Devotionals</h1>
      <p className="pagelead">A short word from Scripture each week, with a prayer to take with you.</p>
      <div className="devlist">
        {items.map((d) => (
          <Link key={d.slug} href={`/devotionals/${d.slug}`} className="devcard">
            <p className="devdate">{formatLongDate(d.date)} · {d.scripture.ref}</p>
            <h2 className="devtitle">{d.title}</h2>
            <p className="devexcerpt">{d.body[0]}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
