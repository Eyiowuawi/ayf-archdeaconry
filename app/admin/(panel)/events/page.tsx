import Link from "next/link";
import { deleteEvent } from "@/app/admin/actions";
import ConfirmButton from "@/components/admin/ConfirmButton";
import { Empty, Flash, NoDatabase, PageTitle } from "@/components/admin/Parts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatEventDate } from "@/lib/content/events";
import { adminStore } from "@/lib/admin-auth";
import type { RegistrationStatus } from "@/lib/db";

export const metadata = { title: "Events" };

type Props = { searchParams: Promise<{ saved?: string; deleted?: string }> };

export default async function EventsAdmin({ searchParams }: Props) {
  const { saved, deleted } = await searchParams;
  const store = await adminStore();
  if (!store) return (<><PageTitle>Events</PageTitle><NoDatabase /></>);
  const today = new Date().toISOString().slice(0, 10);
  const events = (await store.listEvents()).sort((a, b) => b.date.localeCompare(a.date));
  return (
    <>
      <PageTitle action={{ href: "/admin/events/new", label: "Add event" }}>Events</PageTitle>
      {saved && <Flash>Event saved.</Flash>}
      {deleted && <Flash>Event deleted.</Flash>}
      {events.length ? (
        <ul className="divide-y divide-line rounded-card border border-line bg-surface shadow-card">
          {events.map((e) => (
            <li key={e.slug} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Link href={`/admin/events/${e.slug}`} className="font-bold text-ink no-underline hover:text-primary">{e.title}</Link>
                  {!e.published && <Badge>Hidden</Badge>}
                  {(e.endDate ?? e.date) < today && <Badge>Past</Badge>}
                </div>
                <p className="text-sm text-ink-muted">{formatEventDate(e)} · {e.venue} · {e.level}</p>
              </div>
              <div className="flex gap-2">
                <Button asChild size="sm" variant="secondary"><Link href={`/admin/events/${e.slug}`}>Edit</Link></Button>
                <form action={deleteEvent}>
                  <input type="hidden" name="slug" value={e.slug} />
                  <ConfirmButton size="sm" variant="secondary" message={`Delete “${e.title}”? This can't be undone.`}>Delete</ConfirmButton>
                </form>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <Empty>No events yet. Add the first one.</Empty>
      )}
    </>
  );
}
