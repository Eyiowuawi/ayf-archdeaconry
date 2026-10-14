import type { Metadata } from "next";
import EventCard from "@/components/site/EventCard";
import { pastEvents, upcomingEvents } from "@/lib/content/events";

export const metadata: Metadata = { title: "Events" };
export const revalidate = 3600;

export default function EventsPage() {
  const upcoming = upcomingEvents();
  const past = pastEvents();
  return (
    <div className="sitecontainer pagepad">
      <h1 className="pagetitle">Events</h1>
      <p className="pagelead">
        Diocesan, archdeaconry and parish programmes for youths. Ask your parish youth president
        for details of local meetings.
      </p>

      <h2 className="sectiontitle">Upcoming</h2>
      {upcoming.length ? (
        <div className="eventlist">
          {upcoming.map((e) => (
            <EventCard key={e.slug} event={e} />
          ))}
        </div>
      ) : (
        <p className="muted">No upcoming events yet. Check back soon.</p>
      )}

      {past.length > 0 && (
        <>
          <h2 className="sectiontitle sectiontitle-spaced">Past events</h2>
          <div className="eventlist eventlist-past">
            {past.map((e) => (
              <EventCard key={e.slug} event={e} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
