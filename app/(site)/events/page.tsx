import type { Metadata } from "next";
import EventCard from "@/components/site/EventCard";
import { Container, PageHeader, SectionHeading } from "@/components/ui/Layout";
import { pastEvents, upcomingEvents } from "@/lib/content/events";

export const metadata: Metadata = { title: "Events" };
export const revalidate = 3600;

export default function EventsPage() {
  const upcoming = upcomingEvents();
  const past = pastEvents();
  return (
    <Container className="py-9 pb-14">
      <PageHeader
        title="Events"
        lead="Diocesan, archdeaconry and parish programmes for youths. Ask your parish youth president for details of local meetings."
      />

      <SectionHeading>Upcoming</SectionHeading>
      {upcoming.length ? (
        <div className="grid gap-3">
          {upcoming.map((e) => (
            <EventCard key={e.slug} event={e} />
          ))}
        </div>
      ) : (
        <p className="text-ink-muted">No upcoming events yet. Check back soon.</p>
      )}

      {past.length > 0 && (
        <>
          <SectionHeading className="mt-9">Past events</SectionHeading>
          <div className="grid gap-3">
            {past.map((e) => (
              <EventCard key={e.slug} event={e} past />
            ))}
          </div>
        </>
      )}
    </Container>
  );
}
