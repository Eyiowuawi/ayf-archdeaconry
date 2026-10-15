import Link from "next/link";
import { EventCard } from "@/screens/site/EventCard";
import { Logo } from "@/shell/Logo";
import { ParishFinder } from "@/screens/site/ParishFinder";
import { Scripture } from "@/screens/site/Scripture";
import { Arrow, Button } from "@/design-system/Button";
import { Card } from "@/design-system/Card";
import { Container, Eyebrow, GradientText, SectionHeading } from "@/design-system/Layout";
import { Blobs, CountUp, Marquee, Reveal, RotatingWord } from "@/design-system/Motion";
import { siteDevotionals, siteEvents } from "@/lib/cms";
import { formatEventDate, upcomingEvents } from "@/lib/events";
import { sortedDevotionals } from "@/lib/devotionals";
import { ARCHDEACONRIES } from "@/lib/parishes";

// Re-render hourly so "upcoming" stays current without a redeploy.

const REASONS = [
  {
    title: "Real talk about God",
    text: "Bible study and worship that connect with your Monday-to-Saturday life, not just Sunday.",
    tone: "from-primary to-accent",
  },
  {
    title: "Find your people",
    text: "Friends who get you, from your own parish to youths across the whole diocese.",
    tone: "from-accent to-sun",
  },
  {
    title: "Lead and serve",
    text: "Run outreach, lead worship, plan events. Your gifts have a place here, starting now.",
    tone: "from-mint to-primary",
  },
  {
    title: "Rallies, retreats, good vibes",
    text: "Youth week, carol nights, camps and retreats. Faith is better together, and more fun.",
    tone: "from-sun to-accent",
  },
];

export async function Home() {
  const events = upcomingEvents(await siteEvents());
  const next = events[0];
  const devotional = sortedDevotionals(await siteDevotionals())[0];
  const parishCount = ARCHDEACONRIES.reduce((n, a) => n + a.parishes.length, 0);

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-night text-night-ink">
        <Blobs />
        <Container className="grid items-center gap-12 pb-20 pt-14 sm:pt-20 lg:grid-cols-[1.25fr_1fr] lg:pb-28">
          <div>
            <Reveal>
              <Logo priority className="mb-6 size-20 shadow-xl ring-4 ring-sun/30 lg:hidden" />
              <Eyebrow className="mb-5 text-sun">Anglican Youth Fellowship · Towards the perfect man</Eyebrow>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="font-display text-[clamp(3rem,10vw,6.5rem)] font-extrabold leading-[0.9] tracking-tighter">
                Faith that
                <br />
                <RotatingWord words={["moves.", "shows up.", "leads.", "lasts."]} />
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-night-muted sm:text-xl">
                We&apos;re young people figuring out life, faith and purpose together. Come as you are.
                Bring a friend.
              </p>
            </Reveal>
            <Reveal delay={240}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild variant="sun">
                  <Link href="/register">
                    Join the movement <Arrow />
                  </Link>
                </Button>
                <Button asChild variant="ghost-on-night">
                  <Link href="/events">
                    See what&apos;s on
                  </Link>
                </Button>
              </div>
            </Reveal>
            <Reveal delay={320}>
              <dl className="mt-12 grid max-w-md grid-cols-3 gap-4 border-t border-night-ink/15 pt-6">
                {[
                  { n: ARCHDEACONRIES.length, label: "Archdeaconries" },
                  { n: parishCount, label: "Parishes" },
                  { n: 1, label: "Family" },
                ].map((s) => (
                  <div key={s.label}>
                    <dt className="sr-only">{s.label}</dt>
                    <dd className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
                      <CountUp to={s.n} />
                    </dd>
                    <dd className="mt-1 text-xs font-semibold uppercase tracking-wider text-night-muted">{s.label}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          {/* Logo centrepiece with floating cards */}
          <div className="relative mx-auto hidden size-[26rem] lg:block" aria-hidden="true">
            <div className="absolute inset-6 rounded-full bg-sun/25 blur-3xl" />
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-sun/40 motion-safe:animate-[spin_60s_linear_infinite]" />
            <div className="absolute inset-8 rounded-full border border-night-ink/15" />
            <div className="absolute inset-14">
              <Logo priority className="size-full shadow-2xl ring-8 ring-night-ink/5" />
            </div>
            {next && (
              <div className="absolute -right-10 top-2 w-60 rotate-3 rounded-3xl bg-surface p-4 text-ink shadow-2xl motion-safe:animate-float">
                <p className="text-xs font-bold uppercase tracking-widest text-accent">Next up</p>
                <p className="mt-1.5 font-display text-xl font-extrabold leading-tight">{next.title}</p>
                <p className="mt-1.5 text-sm font-semibold text-ink-muted">{formatEventDate(next)}</p>
              </div>
            )}
            {devotional && (
              <div className="absolute -left-14 bottom-2 w-64 -rotate-3 rounded-3xl bg-linear-to-br from-primary to-accent p-4 text-white shadow-2xl ring-1 ring-white/20 motion-safe:animate-float [animation-delay:-3s]">
                <p className="text-xs font-bold uppercase tracking-widest text-sun">Word of the week</p>
                <p className="mt-1.5 font-display text-base font-bold leading-snug">“{devotional.scripture.text.split(";")[0]}”</p>
                <p className="mt-1.5 text-sm font-semibold opacity-80">{devotional.scripture.ref}</p>
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* Marquee */}
      <div className="relative z-10 -mt-6 -rotate-2 bg-sun py-4 font-display text-2xl font-extrabold uppercase tracking-tight text-sun-ink shadow-xl sm:text-3xl">
        <Marquee items={["Pray", "Play", "Serve", "Lead", "Belong", "Worship", "Grow"]} />
      </div>

      {/* Why */}
      <section className="py-20 sm:py-28">
        <Container>
          <Reveal>
            <SectionHeading eyebrow="Why you'll love it">
              More than a <GradientText>Sunday thing.</GradientText>
            </SectionHeading>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {REASONS.map((r, i) => (
              <Reveal key={r.title} delay={i * 90}>
                <Card interactive className="group h-full overflow-hidden">
                  <span
                    className={`bg-linear-to-br ${r.tone} bg-clip-text font-display text-6xl font-extrabold leading-none text-transparent`}
                  >
                    0{i + 1}
                  </span>
                  <h3 className="mt-4 font-display text-2xl font-extrabold tracking-tight">{r.title}</h3>
                  <p className="mt-2 text-ink-muted">{r.text}</p>
                  <div
                    aria-hidden="true"
                    className={`mt-6 h-1.5 w-12 rounded-full bg-linear-to-r ${r.tone} transition-all duration-500 group-hover:w-full`}
                  />
                </Card>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Parish finder */}
      <section className="pb-20 sm:pb-28">
        <Container>
          <Reveal>
            <div className="grid gap-8 rounded-[2rem] border border-line bg-surface p-6 shadow-card sm:p-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
              <div>
                <SectionHeading eyebrow="Find your people" className="mb-3">
                  Where do you <GradientText>worship?</GradientText>
                </SectionHeading>
                <p className="text-ink-muted">
                  Search {parishCount} parishes across {ARCHDEACONRIES.length} archdeaconries, then join
                  your parish fellowship in a tap.
                </p>
              </div>
              <ParishFinder archdeaconries={ARCHDEACONRIES} />
            </div>
          </Reveal>
          <Reveal>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-card border border-line bg-surface-muted px-6 py-5">
              <div>
                <p className="font-display text-lg font-extrabold">Parish youth leaders</p>
                <p className="text-sm text-ink-muted">
                  Send your parish&apos;s President and Secretary (or two active members) to the diocese.
                </p>
              </div>
              <Button asChild variant="secondary" size="sm">
                <Link href="/representatives">
                  Fill the representatives form <Arrow />
                </Link>
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Events */}
      <section className="pb-20 sm:pb-28">
        <Container>
          <Reveal>
            <SectionHeading eyebrow="Don't miss it" action={{ href: "/events", label: "All events" }}>
              What&apos;s on
            </SectionHeading>
          </Reveal>
          {events.length ? (
            <div className="grid gap-4 lg:grid-cols-3">
              {events.slice(0, 3).map((e, i) => (
                <Reveal key={e.slug} delay={i * 90}>
                  <EventCard event={e} index={i} />
                </Reveal>
              ))}
            </div>
          ) : (
            <p className="text-ink-muted">New events are coming soon. Watch this space.</p>
          )}
        </Container>
      </section>

      {/* Devotional */}
      {devotional && (
        <section className="pb-20 sm:pb-28">
          <Container>
            <Reveal>
              <div className="relative isolate overflow-hidden rounded-[2rem] bg-night px-6 py-12 text-night-ink sm:px-12 sm:py-16">
                <Blobs />
                <Eyebrow className="mb-8 text-sun">Word of the week · {devotional.title}</Eyebrow>
                <div className="max-w-3xl">
                  <Scripture text={devotional.scripture.text} reference={devotional.scripture.ref} size="lg" />
                </div>
                <div className="mt-10 flex flex-wrap gap-3">
                  <Button asChild variant="sun">
                    <Link href={`/devotionals/${devotional.slug}`}>
                      Read this week&apos;s devotional <Arrow />
                    </Link>
                  </Button>
                  <Button asChild variant="ghost-on-night">
                    <Link href="/devotionals">
                      More devotionals
                    </Link>
                  </Button>
                </div>
              </div>
            </Reveal>
          </Container>
        </section>
      )}

      {/* Join CTA */}
      <section className="pb-20 sm:pb-28">
        <Container>
          <Reveal>
            <div className="relative overflow-hidden rounded-[2rem] bg-linear-to-r from-night via-primary to-night bg-size-[200%_auto] px-6 py-14 text-center text-night-ink motion-safe:animate-gradient sm:px-12 sm:py-20">
              <h2 className="mx-auto max-w-[16ch] font-display text-[clamp(2.2rem,6vw,4rem)] font-extrabold leading-[0.95] tracking-tighter">
                There&apos;s a seat with your name on it.
              </h2>
              <p className="mx-auto mt-5 max-w-[44ch] text-lg opacity-90">
                Sign up in two minutes and your parish youth leaders will welcome you in.
              </p>
              <Button asChild variant="sun" className="mt-8">
                <Link href="/register">
                  Join the fellowship <Arrow />
                </Link>
              </Button>
            </div>
          </Reveal>
          <p className="mt-6 text-center text-sm text-ink-muted">
            Parish youth leader?{" "}
            <Link href="/representatives" className="font-bold text-primary underline-offset-4 hover:underline">
              Make sure your parish is on the representatives list
            </Link>
            .
          </p>
        </Container>
      </section>
    </>
  );
}
