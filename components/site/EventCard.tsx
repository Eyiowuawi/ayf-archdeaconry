import { dateBadge, formatEventDate, type EventItem } from "@/lib/content/events";

export default function EventCard({ event }: { event: EventItem }) {
  const badge = dateBadge(event.date);
  return (
    <article className="eventcard" id={event.slug}>
      <div className="datebadge" aria-hidden="true">
        <span className="datebadge-month">{badge.month}</span>
        <span className="datebadge-day">{badge.day}</span>
      </div>
      <div className="eventbody">
        <p className="eventlevel">{event.level}</p>
        <h3 className="eventtitle">{event.title}</h3>
        <p className="eventmeta">
          {formatEventDate(event)}
          {event.time ? ` · ${event.time}` : ""}
          <br />
          {event.venue}
        </p>
        <p className="eventsummary">{event.summary}</p>
      </div>
    </article>
  );
}
