import { dateBadge, formatEventDate, type EventItem } from "@/lib/content/events";
import { cn } from "@/lib/cn";

export default function EventCard({ event, past = false }: { event: EventItem; past?: boolean }) {
  const badge = dateBadge(event.date);
  return (
    <article
      id={event.slug}
      className={cn(
        "flex gap-4 rounded-card border border-line bg-surface p-4",
        past ? "opacity-75" : "shadow-card"
      )}
    >
      <div
        aria-hidden="true"
        className="flex h-[62px] w-[58px] shrink-0 flex-col items-center justify-center rounded-[9px] border border-line bg-surface-muted leading-none"
      >
        <span className="text-[0.72rem] font-bold uppercase tracking-wider text-primary">{badge.month}</span>
        <span className="mt-1 font-serif text-[1.6rem] font-semibold">{badge.day}</span>
      </div>
      <div className="min-w-0">
        <p className="mb-0.5 text-[0.72rem] font-bold uppercase tracking-wider text-success">{event.level}</p>
        <h3 className="mb-1 font-serif text-lg font-semibold">{event.title}</h3>
        <p className="mb-2 text-sm text-ink-muted">
          {formatEventDate(event)}
          {event.time ? ` · ${event.time}` : ""}
          <br />
          {event.venue}
        </p>
        <p className="text-[0.93rem]">{event.summary}</p>
      </div>
    </article>
  );
}
