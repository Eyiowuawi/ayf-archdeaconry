import { notFound } from "next/navigation";
import { Container } from "@/shared/ui/page-layout";
import { formatDateTime, formatEventDate, formatEventTime } from "@/features/events/utils/events";
import { formatTicketCode } from "@/utils/identifiers";
import { parishName } from "@/shared/data/parishes";
import { findTicket, qrSvg, ticketUrl } from "@/features/events/services/tickets";
import { TicketActions } from "@/features/events/components/ticket-actions";

type Props = { params: Promise<{ code: string }>; searchParams: Promise<{ new?: string }> };

export async function TicketPage({ params, searchParams }: Props) {
  const view = await findTicket((await params).code);
  if (!view) notFound();
  const { ticket, event, member, demo } = view;
  const isNew = (await searchParams).new === "1";
  const url = await ticketUrl(ticket.code);
  const svg = await qrSvg(url);
  const time = formatEventTime(event);

  return (
    <Container className="max-w-lg py-10 sm:py-14">
      {isNew && (
        <p
          role="status"
          className="mb-5 rounded-xl border border-success-line bg-success-soft px-4 py-3 text-center text-sm font-semibold text-success print:hidden"
        >
          You&apos;re registered! Save or share this ticket and show it at the entrance.
        </p>
      )}
      {demo && (
        <p className="mb-5 rounded-xl border border-sun/60 bg-sun/15 px-4 py-3 text-center text-sm print:hidden">
          Sample ticket from the demo account.
        </p>
      )}
      <article className="overflow-hidden rounded-card border border-line bg-surface shadow-lift">
        <header className="bg-night px-6 pb-5 pt-6 text-center text-night-ink">
          <p className="font-display text-xs font-bold uppercase tracking-widest text-sun">
            Event ticket
          </p>
          <h1 className="mt-2 font-display text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">
            {event.title}
          </h1>
          <p className="mt-2 text-sm text-night-ink/85">
            {formatEventDate(event)}
            {time && ` · ${time}`}
          </p>
          <p className="text-sm text-night-ink/85">{event.venue}</p>
        </header>
        <div className="px-6 py-6 text-center">
          <div
            role="img"
            aria-label={`QR code for ticket ${formatTicketCode(ticket.code)}`}
            className="mx-auto w-56 rounded-2xl bg-white p-2 sm:w-64 [&_svg]:h-auto [&_svg]:w-full"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
          <p className="mt-3 font-mono text-lg font-bold tracking-widest">
            {formatTicketCode(ticket.code)}
          </p>
          {ticket.checkedInAt && (
            <p className="mt-2 inline-block rounded-full bg-success-soft px-3 py-1 text-sm font-bold text-success">
              Checked in {formatDateTime(ticket.checkedInAt)}
            </p>
          )}
        </div>
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 border-t border-dashed border-line px-6 py-5 text-[0.93rem]">
          <dt className="font-bold text-ink-muted">Name</dt>
          <dd>
            {member.firstName} {member.surname}
          </dd>
          <dt className="font-bold text-ink-muted">Parish</dt>
          <dd>{parishName(member.parishId)}</dd>
          <dt className="font-bold text-ink-muted">User code</dt>
          <dd className="font-mono">{member.userCode}</dd>
        </dl>
      </article>
      <p className="mt-5 text-center text-sm text-ink-muted print:hidden">
        Anyone with this link can see the ticket, so only share it with people you trust.
      </p>
      <div className="mt-5">
        <TicketActions url={url} title={event.title} />
      </div>
    </Container>
  );
}
