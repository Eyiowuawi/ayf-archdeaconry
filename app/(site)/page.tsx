import EventCard from "@/components/site/EventCard";
import Scripture from "@/components/site/Scripture";
import { ButtonLink } from "@/components/ui/Button";
import { Card, CardLink } from "@/components/ui/Card";
import { Container, Eyebrow, SectionHeading } from "@/components/ui/Layout";
import { upcomingEvents } from "@/lib/content/events";
import { formatLongDate, sortedDevotionals } from "@/lib/content/devotionals";
import { ARCHDEACONRIES } from "@/lib/parishes";

// Re-render hourly so "upcoming" stays current without a redeploy.
export const revalidate = 3600;

const PILLARS = [
  { title: "Faith", text: "Bible study, prayer and worship that help you know Christ for yourself." },
  { title: "Fellowship", text: "Friends who share your values, from your parish to the whole diocese." },
  { title: "Service", text: "Outreach, leadership and skills that build up the church and the community." },
];

export default function HomePage() {
  const events = upcomingEvents().slice(0, 3);
  const devotional = sortedDevotionals()[0];
  const parishCount = ARCHDEACONRIES.reduce((n, a) => n + a.parishes.length, 0);

  return (
    <div className="pb-14">
      <section className="bg-brand py-14 text-brand-ink">
        <Container>
          <Eyebrow className="mb-3 text-highlight">Anglican Youth Fellowship · Diocese of Egba</Eyebrow>
          <h1 className="mb-3.5 max-w-[20ch] font-serif text-[clamp(1.9rem,5vw,3rem)] font-semibold leading-[1.12]">
            Growing young people in faith, friendship and service.
          </h1>
          <p className="mb-6 max-w-[56ch] text-[1.05rem] text-brand-muted">
            One fellowship across {ARCHDEACONRIES.length} archdeaconries and {parishCount} parishes.
            Worship with us, find what&apos;s on, and join your parish fellowship.
          </p>
          <div className="flex flex-wrap gap-2.5">
            <ButtonLink href="/register" variant="highlight">Join the fellowship</ButtonLink>
            <ButtonLink href="/events" variant="ghost-on-brand">See upcoming events</ButtonLink>
          </div>
        </Container>
      </section>

      <Container className="mt-10 space-y-10">
        <section className="grid gap-3 md:grid-cols-3">
          {PILLARS.map((p) => (
            <Card key={p.title} className="p-4.5 shadow-none">
              <h2 className="mb-1.5 font-serif text-lg font-semibold text-primary">{p.title}</h2>
              <p className="text-[0.93rem] text-ink-muted">{p.text}</p>
            </Card>
          ))}
        </section>

        <section>
          <SectionHeading action={{ href: "/events", label: "All events" }}>Upcoming events</SectionHeading>
          {events.length ? (
            <div className="grid gap-3">
              {events.map((e) => (
                <EventCard key={e.slug} event={e} />
              ))}
            </div>
          ) : (
            <p className="text-ink-muted">No upcoming events yet. Check back soon.</p>
          )}
        </section>

        {devotional && (
          <section>
            <SectionHeading action={{ href: "/devotionals", label: "All devotionals" }}>
              This week&apos;s devotional
            </SectionHeading>
            <CardLink href={`/devotionals/${devotional.slug}`}>
              <p className="mb-1 text-[0.8rem] text-ink-muted">{formatLongDate(devotional.date)}</p>
              <h3 className="mb-2.5 font-serif text-xl font-semibold">{devotional.title}</h3>
              <Scripture text={devotional.scripture.text} reference={devotional.scripture.ref} />
              <span className="text-sm font-bold text-primary">Read the devotional</span>
            </CardLink>
          </section>
        )}

        <section className="flex flex-wrap items-center justify-between gap-4 rounded-card border border-line bg-surface-muted p-5">
          <div>
            <h2 className="mb-1 font-serif text-lg font-semibold">Are you a parish youth leader?</h2>
            <p className="max-w-[60ch] text-[0.93rem] text-ink-muted">
              Make sure your parish&apos;s president and secretary are on the diocesan list so you
              receive updates and invitations.
            </p>
          </div>
          <ButtonLink href="/representatives" variant="secondary">Parish representatives</ButtonLink>
        </section>
      </Container>
    </div>
  );
}
