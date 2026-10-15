import { EventCard } from "@/features/events/components/event-card";
import { Container, GradientText, PageHero, SectionHeading } from "@/shared/ui/page-layout";
import { Reveal } from "@/shared/ui/motion";
import { siteEvents } from "@/shared/db/site-content";
import { pastEvents, upcomingEvents } from "@/features/events/utils/events";

export async function EventsPage() {
  const events = await siteEvents();
  const upcoming = upcomingEvents(events);
  const past = pastEvents(events);
  return (
    <>
      <PageHero
        eyebrow="Events"
        title={
          <>
            Save the date. <GradientText onDark>Bring a friend.</GradientText>
          </>
        }
        lead="Rallies, retreats, workshops and worship nights across the diocese. Ask your parish youth president about local meetups too."
      />
      <Container className="py-16 sm:py-20">
        <SectionHeading eyebrow="Coming up">Don&apos;t miss these</SectionHeading>
        {upcoming.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {upcoming.map((e, i) => (
              <Reveal key={e.slug} delay={(i % 2) * 90}>
                <EventCard event={e} index={i} />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="text-ink-muted">New events are coming soon. Watch this space.</p>
        )}

        {past.length > 0 && (
          <>
            <SectionHeading eyebrow="Throwback" className="mt-16">
              Past events
            </SectionHeading>
            <div className="grid gap-4 md:grid-cols-2">
              {past.map((e, i) => (
                <EventCard key={e.slug} event={e} index={i} past />
              ))}
            </div>
          </>
        )}
      </Container>
    </>
  );
}
