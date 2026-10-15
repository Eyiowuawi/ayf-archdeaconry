import { Download, ScanLine } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { checkInFromList } from "@/features/events/services/event-actions";
import { Button } from "@/shared/ui/button";
import { Empty, NoDatabase, PageTitle } from "@/shared/ui/states";
import { Badge } from "@/shared/ui/badge";
import { adminStore } from "@/features/auth/utils/session";
import { formatDateTime, formatEventDate, registrationState } from "@/features/events/utils/events";
import { formatTicketCode } from "@/utils/identifiers";
import { parishName } from "@/shared/data/parishes";

const STATE_LABEL = {
  none: "No registration",
  upcoming: "Opens soon",
  open: "Registration open",
  closed: "Registration closed",
} as const;

export async function AttendeesPage({ params }: { params: Promise<{ slug: string }> }) {
  const store = await adminStore();
  if (!store)
    return (
      <>
        <PageTitle>Attendees</PageTitle>
        <NoDatabase />
      </>
    );
  const event = await store.getEvent((await params).slug);
  if (!event) notFound();
  const members = new Map((await store.listRegistrations()).map((m) => [m.id, m]));
  const tickets = (await store.listTickets(event.slug)).sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  );
  const checkedIn = tickets.filter((t) => t.checkedInAt).length;
  const state = registrationState(event);

  return (
    <>
      <PageTitle>{event.title}</PageTitle>
      <p className="-mt-4 mb-5 text-sm text-ink-muted">
        {formatEventDate(event)} · {event.venue}
        {event.registration && <> · closes {formatDateTime(event.registration.closesAt)}</>}
      </p>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant={state === "open" ? "success" : "default"}>{STATE_LABEL[state]}</Badge>
          <Badge>{tickets.length} registered</Badge>
          <Badge variant="success">{checkedIn} checked in</Badge>
          {!event.published && <Badge variant="warning">Unpublished</Badge>}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm">
            <Link href={`/admin/check-in?event=${event.slug}`}>
              <ScanLine aria-hidden="true" /> Check people in
            </Link>
          </Button>
          <Button asChild size="sm" variant="secondary">
            <a href={`/admin/events/${event.slug}/attendees/export`} download>
              <Download aria-hidden="true" /> Export CSV
            </a>
          </Button>
          <Button asChild size="sm" variant="secondary">
            <Link href={`/admin/events/${event.slug}`}>Edit event</Link>
          </Button>
        </div>
      </div>

      {tickets.length ? (
        <div className="relative overflow-x-auto rounded-card border border-line bg-surface shadow-card">
          <table className="w-full min-w-[44rem] text-left text-sm">
            <thead className="border-b border-line bg-surface-muted text-xs uppercase tracking-wider text-ink-muted">
              <tr>
                <th scope="col" className="px-4 py-3">
                  Name
                </th>
                <th scope="col" className="px-4 py-3">
                  Parish
                </th>
                <th scope="col" className="px-4 py-3">
                  Ticket
                </th>
                <th scope="col" className="px-4 py-3">
                  Entry
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {tickets.map((t) => {
                const m = members.get(t.memberId);
                return (
                  <tr key={t.code} className="align-top">
                    <td className="px-4 py-3">
                      <p className="font-bold">
                        {m ? `${m.firstName} ${m.surname}` : "Removed member"}
                      </p>
                      {m && <p className="font-mono text-xs text-primary">{m.userCode}</p>}
                      {m && (
                        <a href={`tel:${m.phone.replace(/\s/g, "")}`} className="text-ink-muted">
                          {m.phone}
                        </a>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {m && <p>{parishName(m.parishId)}</p>}
                      {m && <p className="text-ink-muted">{m.archdeaconry}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/tickets/${t.code}`} target="_blank" className="font-mono">
                        {formatTicketCode(t.code)}
                      </Link>
                      <p className="text-ink-muted">Registered {formatDateTime(t.createdAt)}</p>
                    </td>
                    <td className="px-4 py-3">
                      {t.checkedInAt ? (
                        <Badge variant="success">
                          In · {formatDateTime(t.checkedInAt).split(", ").pop()}
                        </Badge>
                      ) : (
                        <form action={checkInFromList}>
                          <input type="hidden" name="eventSlug" value={event.slug} />
                          <input type="hidden" name="code" value={t.code} />
                          <Button type="submit" size="sm" variant="secondary">
                            Check in
                          </Button>
                        </form>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <Empty>
          {event.registration
            ? "No one has registered yet."
            : "This event doesn't take registrations. Turn it on in Edit event."}
        </Empty>
      )}
    </>
  );
}
