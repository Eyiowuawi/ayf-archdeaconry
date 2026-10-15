import { PageHeader } from "@/shared/layout/page-header";
import Link from "next/link";
import { deleteDevotional } from "@/features/devotionals/services/devotional-actions";
import { ConfirmButton } from "@/shared/ui/confirm-button";
import { Empty, Flash, NoDatabase } from "@/shared/ui/states";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { formatLongDate } from "@/features/devotionals/utils/devotionals";
import { adminStore } from "@/features/auth/utils/session";

type Props = { searchParams: Promise<{ saved?: string; deleted?: string }> };

export async function DevotionalsAdminPage({ searchParams }: Props) {
  const { saved, deleted } = await searchParams;
  const store = await adminStore();
  if (!store)
    return (
      <>
        <PageHeader title="Devotionals" />
        <NoDatabase />
      </>
    );
  const items = (await store.listDevotionals()).sort((a, b) => b.date.localeCompare(a.date));
  return (
    <>
      <PageHeader
        title="Devotionals"
        actions={
          <Button asChild size="sm">
            <Link href="/admin/devotionals/new">Write devotional</Link>
          </Button>
        }
      />
      {saved && <Flash>Devotional saved.</Flash>}
      {deleted && <Flash>Devotional deleted.</Flash>}
      {items.length ? (
        <ul className="divide-y divide-line rounded-card border border-line bg-surface shadow-card">
          {items.map((d) => (
            <li
              key={d.slug}
              className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/admin/devotionals/${d.slug}`}
                    className="font-bold text-ink no-underline hover:text-primary"
                  >
                    {d.title}
                  </Link>
                  {!d.published && <Badge>Hidden</Badge>}
                </div>
                <p className="text-sm text-ink-muted">
                  {formatLongDate(d.date)} · {d.scripture.ref}
                </p>
              </div>
              <div className="flex gap-2">
                <Button asChild size="sm" variant="secondary">
                  <Link href={`/admin/devotionals/${d.slug}`}>Edit</Link>
                </Button>
                <form action={deleteDevotional}>
                  <input type="hidden" name="slug" value={d.slug} />
                  <ConfirmButton
                    size="sm"
                    variant="secondary"
                    message={`Delete “${d.title}”? This can't be undone.`}
                  >
                    Delete
                  </ConfirmButton>
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
