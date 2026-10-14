import { calendarLink, dateBadge, formatEventDate, type EventItem } from "@/lib/content/events";
import { cn } from "@/lib/cn";

export default function EventCard({ event, past = false }: { event: EventItem; index?: number; past?: boolean }) {
  const badge = dateBadge(event.date);
  return (
    <article
      id={event.slug}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-card border border-line bg-surface p-6 transition duration-500 ease-out sm:p-7",
        past ? "opacity-60" : "hover:border-sun/60 hover:shadow-lift motion-safe:hover:-translate-y-1"
      )}
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-sun transition-transform duration-700 group-hover:scale-x-100"
      />
      <div className="flex items-baseline gap-3">
        <span className="font-display text-5xl font-light leading-none tracking-tight">{badge.day}</span>
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{badge.month}</span>
        <span className="ml-auto rounded-full border border-line px-2.5 py-0.5 text-[0.68rem] font-semibold uppercase tracking-wider text-ink-muted">
          {event.level}
        </span>
      </div>
      <h3 className="mt-6 font-display text-2xl font-medium leading-snug tracking-tight">{event.title}</h3>
      <p className="mt-2 text-sm text-ink-muted">
        {formatEventDate(event)}
        {event.time ? ` · ${event.time}` : ""}
        <br />
        {event.venue}
      </p>
      <p className="mt-4 flex-1 text-[0.95rem] leading-relaxed text-ink/85">{event.summary}</p>
      {!past && (
        <a
          href={calendarLink(event)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex w-fit items-center gap-2 text-sm font-semibold text-primary no-underline hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <path d="M16 3v4M8 3v4M3 10h18M12 13v5M9.5 15.5h5" />
          </svg>
          Add to calendar
        </a>
      )}
    </article>
  );
}
