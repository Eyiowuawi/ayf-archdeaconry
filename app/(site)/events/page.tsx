import type { Metadata } from "next";
import EventCard from "@/components/site/EventCard";
import { Container, Emphasis, PageHero, SectionHeading } from "@/components/ui/Layout";
import { Reveal } from "@/components/ui/Motion";
import { pastEvents, upcomingEvents } from "@/lib/content/events";

export const metadata: Metadata = { title: "Events" };
export const revalidate = 3600;

export default function EventsPage() {
  const upcoming = upcomingEvents();
  const past = pastEvents();
  return (
    <>
      <PageHero
        eyebrow="Events"
        title="Gather, grow and serve together."
        lead="Diocesan rallies, retreats, workshops and services across the year. Ask your parish youth president about local meetings too."
      />
      <Container className="py-20 sm:py-28">
        <SectionHeading eyebrow="Upcoming">
          Save the <Emphasis>date</Emphasis>
        </SectionHeading>
        {upcoming.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {upcoming.map((e, i) => (
              <Reveal key={e.slug} delay={(i % 2) * 120} className="h-full">
                <EventCard event={e} />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="text-ink-muted">New events are coming soon.</p>
        )}

        {past.length > 0 && (
          <>
            <SectionHeading eyebrow="Archive" className="mt-24">
              Past events
            </SectionHeading>
            <div className="grid gap-4 md:grid-cols-2">
              {past.map((e) => (
                <EventCard key={e.slug} event={e} past />
              ))}
            </div>
          </>
        )}
      </Container>
    </>
  );
}
