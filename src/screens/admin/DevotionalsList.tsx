import Link from "next/link";
import { deleteDevotional } from "@/lib/actions/admin";
import { ConfirmButton } from "@/design-system/ConfirmButton";
import { Empty, Flash, NoDatabase, PageTitle } from "@/design-system/States";
import { Badge } from "@/design-system/StatusPill";
import { Button } from "@/design-system/Button";
import { formatLongDate } from "@/lib/devotionals";
import { adminStore } from "@/lib/adminAuth";
import type { RegistrationStatus } from "@/lib/db";

export const metadata = { title: "Devotionals" };

type Props = { searchParams: Promise<{ saved?: string; deleted?: string }> };

export async function DevotionalsList({ searchParams }: Props) {
  const { saved, deleted } = await searchParams;
  const store = await adminStore();
  if (!store) return (<><PageTitle>Devotionals</PageTitle><NoDatabase /></>);
  const items = (await store.listDevotionals()).sort((a, b) => b.date.localeCompare(a.date));
  return (
    <>
      <PageTitle action={{ href: "/admin/devotionals/new", label: "Write devotional" }}>Devotionals</PageTitle>
      {saved && <Flash>Devotional saved.</Flash>}
      {deleted && <Flash>Devotional deleted.</Flash>}
      {items.length ? (
        <ul className="divide-y divide-line rounded-card border border-line bg-surface shadow-card">
          {items.map((d) => (
            <li key={d.slug} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Link href={`/admin/devotionals/${d.slug}`} className="font-bold text-ink no-underline hover:text-primary">{d.title}</Link>
                  {!d.published && <Badge>Hidden</Badge>}
                </div>
                <p className="text-sm text-ink-muted">{formatLongDate(d.date)} · {d.scripture.ref}</p>
              </div>
              <div className="flex gap-2">
                <Button asChild size="sm" variant="secondary"><Link href={`/admin/devotionals/${d.slug}`}>Edit</Link></Button>
                <form action={deleteDevotional}>
                  <input type="hidden" name="slug" value={d.slug} />
                  <ConfirmButton size="sm" variant="secondary" message={`Delete “${d.title}”? This can't be undone.`}>Delete</ConfirmButton>
                </form>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <Empty>No devotionals yet. Write the first one.</Empty>
      )}
    </>
  );
}
