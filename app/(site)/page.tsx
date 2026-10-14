import Link from "next/link";
import EventCard from "@/components/site/EventCard";
import { upcomingEvents } from "@/lib/content/events";
import { formatLongDate, sortedDevotionals } from "@/lib/content/devotionals";
import { ARCHDEACONRIES } from "@/lib/parishes";

// Re-render hourly so "upcoming" stays current without a redeploy.
export const revalidate = 3600;

export default function HomePage() {
  const events = upcomingEvents().slice(0, 3);
  const devotional = sortedDevotionals()[0];
  const parishCount = ARCHDEACONRIES.reduce((n, a) => n + a.parishes.length, 0);

  return (
    <>
      <section className="hero">
        <div className="sitecontainer">
          <p className="eyebrow">Anglican Youth Fellowship · Diocese of Egba</p>
          <h1 className="herotitle">Growing young people in faith, friendship and service.</h1>
          <p className="herolead">
            One fellowship across {ARCHDEACONRIES.length} archdeaconries and {parishCount} parishes.
            Worship with us, find what&apos;s on, and join your parish fellowship.
          </p>
          <div className="herocta">
            <Link href="/register" className="btn btn-primary">Join the fellowship</Link>
            <Link href="/events" className="btn btn-secondary">See upcoming events</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="sitecontainer">
          <div className="pillars">
            <div className="pillar">
              <h2>Faith</h2>
              <p>Bible study, prayer and worship that help you know Christ for yourself.</p>
            </div>
            <div className="pillar">
              <h2>Fellowship</h2>
              <p>Friends who share your values, from your parish to the whole diocese.</p>
            </div>
            <div className="pillar">
              <h2>Service</h2>
              <p>Outreach, leadership and skills that build up the church and the community.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="sitecontainer">
          <div className="sectionhead">
            <h2 className="sectiontitle">Upcoming events</h2>
            <Link href="/events" className="textlink">All events</Link>
          </div>
          {events.length ? (
            <div className="eventlist">
              {events.map((e) => (
                <EventCard key={e.slug} event={e} />
              ))}
            </div>
          ) : (
            <p className="muted">No upcoming events yet. Check back soon.</p>
          )}
        </div>
      </section>

      {devotional && (
        <section className="section">
          <div className="sitecontainer">
            <div className="sectionhead">
              <h2 className="sectiontitle">This week&apos;s devotional</h2>
              <Link href="/devotionals" className="textlink">All devotionals</Link>
            </div>
            <Link href={`/devotionals/${devotional.slug}`} className="devfeature">
              <p className="devdate">{formatLongDate(devotional.date)}</p>
              <h3 className="devtitle">{devotional.title}</h3>
              <blockquote className="scripture">
                <p>{devotional.scripture.text}</p>
                <cite>{devotional.scripture.ref}</cite>
              </blockquote>
              <span className="textlink">Read the devotional</span>
            </Link>
          </div>
        </section>
      )}

      <section className="section">
        <div className="sitecontainer">
          <div className="callout">
            <div>
              <h2 className="callouttitle">Are you a parish youth leader?</h2>
              <p>
                Make sure your parish&apos;s president and secretary are on the diocesan list so you
                receive updates and invitations.
              </p>
            </div>
            <Link href="/representatives" className="btn btn-secondary">Parish representatives</Link>
          </div>
        </div>
      </section>
    </>
  );
}
