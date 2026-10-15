import Link from "next/link";
import { deleteEvent, setEventPublished } from "@/features/events/services/event-actions";
import { ConfirmButton } from "@/shared/ui/confirm-button";
import { Empty, Flash, NoDatabase, PageTitle } from "@/shared/ui/states";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import {
  formatEventDate,
  formatEventTime,
  registrationState,
  todayIso,
} from "@/features/events/utils/events";
import { adminStore } from "@/features/auth/utils/session";

type Props = { searchParams: Promise<{ saved?: string; deleted?: string }> };

export async function EventsAdminPage({ searchParams }: Props) {
  const { saved, deleted } = await searchParams;
  const store = await adminStore();
  if (!store)
    return (
      <>
        <PageTitle>Events</PageTitle>
        <NoDatabase />
      </>
    );
  const today = todayIso();
  const events = (await store.listEvents()).sort((a, b) => b.date.localeCompare(a.date));
  const tickets = await store.listTickets();
  const registered = (slug: string) => tickets.filter((t) => t.eventSlug === slug).length;
  return (
    <>
      <PageTitle action={{ href: "/admin/events/new", label: "Add event" }}>Events</PageTitle>
      {saved && <Flash>Event saved.</Flash>}
      {deleted && <Flash>Event deleted.</Flash>}
      {events.length ? (
        <ul className="divide-y divide-line rounded-card border border-line bg-surface shadow-card">
          {events.map((e) => (
            <li
              key={e.slug}
              className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/admin/events/${e.slug}`}
                    className="font-bold text-ink no-underline hover:text-primary"
                  >
                    {e.title}
                  </Link>
                  {e.published ? (
                    <Badge variant="success">Published</Badge>
                  ) : (
                    <Badge variant="warning">Unpublished</Badge>
                  )}
                  {registrationState(e) === "open" && <Badge>Registration open</Badge>}
                  {(e.endDate ?? e.date) < today && <Badge>Past</Badge>}
                </div>
                <p className="text-sm text-ink-muted">
                  {formatEventDate(e)}
                  {formatEventTime(e) && ` · ${formatEventTime(e)}`} · {e.venue} · {e.level}
                  {e.registration && (
                    <>
                      {" "}
                      ·{" "}
                      <Link href={`/admin/events/${e.slug}/attendees`}>
                        {registered(e.slug)} registered
                      </Link>
                    </>
                  )}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <form action={setEventPublished}>
                  <input type="hidden" name="slug" value={e.slug} />
                  <input type="hidden" name="published" value={e.published ? "0" : "1"} />
                  <Button type="submit" size="sm" variant={e.published ? "secondary" : "primary"}>
                    {e.published ? "Unpublish" : "Publish"}
                  </Button>
                </form>
                {e.registration && (
                  <Button asChild size="sm" variant="secondary">
                    <Link href={`/admin/events/${e.slug}/attendees`}>Attendees</Link>
                  </Button>
                )}
                <Button asChild size="sm" variant="secondary">
                  <Link href={`/admin/events/${e.slug}`}>Edit</Link>
                </Button>
                <form action={deleteEvent}>
                  <input type="hidden" name="slug" value={e.slug} />
                  <ConfirmButton
                    size="sm"
                    variant="secondary"
                    message={`Delete “${e.title}”? This can't be undone.`}
                  >
                    Delete
                  </ConfirmButton>
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
