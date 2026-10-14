import { calendarLink, dateBadge, formatEventDate, type EventItem } from "@/lib/content/events";
import { cn } from "@/lib/cn";

const TILE_GRADIENTS = [
  "from-primary to-accent",
  "from-accent to-sun",
  "from-mint to-primary",
];

export default function EventCard({ event, index = 0, past = false }: { event: EventItem; index?: number; past?: boolean }) {
  const badge = dateBadge(event.date);
  return (
    <article
      id={event.slug}
      className={cn(
        "group flex h-full gap-5 rounded-card border border-line bg-surface p-5 transition duration-300 ease-out",
        past
          ? "opacity-70 grayscale"
          : "shadow-card hover:border-primary/40 hover:shadow-lift motion-safe:hover:-translate-y-1"
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          "flex h-20 w-18 shrink-0 flex-col items-center justify-center rounded-2xl bg-linear-to-br text-white shadow-card transition-transform duration-500 motion-safe:group-hover:-rotate-6 motion-safe:group-hover:scale-105",
          TILE_GRADIENTS[index % TILE_GRADIENTS.length]
        )}
      >
        <span className="font-display text-xs font-bold uppercase tracking-widest opacity-90">{badge.month}</span>
        <span className="font-display text-3xl font-extrabold leading-none">{badge.day}</span>
      </div>
      <div className="min-w-0">
        <span className="inline-block rounded-full bg-surface-muted px-2.5 py-0.5 text-[0.7rem] font-bold uppercase tracking-wider text-primary">
          {event.level}
        </span>
        <h3 className="mt-2 font-display text-xl font-extrabold leading-tight tracking-tight">{event.title}</h3>
        <p className="mt-1 text-sm font-semibold text-ink-muted">
          {formatEventDate(event)}
          {event.time ? ` · ${event.time}` : ""} · {event.venue}
        </p>
        <p className="mt-3 text-[0.95rem] leading-relaxed">{event.summary}</p>
        {!past && (
          <a
            href={calendarLink(event)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 font-display text-xs font-bold text-primary no-underline transition-colors hover:border-primary hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <rect x="3" y="5" width="18" height="16" rx="2" />
              <path d="M16 3v4M8 3v4M3 10h18M12 13v5M9.5 15.5h5" />
            </svg>
            Add to calendar
          </a>
        )}
      </div>
    </article>
  );
}
