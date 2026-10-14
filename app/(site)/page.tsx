import Link from "next/link";
import ConventionTeaser from "@/components/site/ConventionTeaser";
import EventCard from "@/components/site/EventCard";
import Logo from "@/components/site/Logo";
import ParishFinder from "@/components/site/ParishFinder";
import Scripture from "@/components/site/Scripture";
import { Arrow, ButtonLink } from "@/components/ui/Button";
import { Container, Emphasis, Eyebrow, SectionHeading } from "@/components/ui/Layout";
import { Aurora, CountUp, Marquee, Parallax, Reveal, SplitReveal, Underline } from "@/components/ui/Motion";
import { sortedDevotionals } from "@/lib/content/devotionals";
import { upcomingEvents } from "@/lib/content/events";
import { BISHOP, NUMBERS, PILLARS, SITE, VALUES } from "@/lib/content/site";
import { CONVENTION, SPEAKERS } from "@/lib/content/convention";
import { ARCHDEACONRIES } from "@/lib/parishes";

// Re-render hourly so "upcoming" stays current without a redeploy.
export const revalidate = 3600;

const ROMAN = ["I", "II", "III"];

export default function HomePage() {
  const events = upcomingEvents().slice(0, 3);
  const devotional = sortedDevotionals()[0];
  const parishCount = ARCHDEACONRIES.reduce((n, a) => n + a.parishes.length, 0);
  const numbers = [
    { value: ARCHDEACONRIES.length, suffix: "", label: "Archdeaconries" },
    { value: parishCount, suffix: "", label: "Parishes" },
    ...NUMBERS.slice(0, 2),
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-night pb-36 pt-16 text-night-ink sm:pt-24 lg:pb-44">
        <Aurora />
        <Container className="grid items-center gap-14 lg:grid-cols-[1.35fr_1fr]">
          <div>
            <Eyebrow className="mb-8 text-sun">Anglican Youth Fellowship · Egba Diocese</Eyebrow>
            <h1 className="font-display text-[clamp(2.9rem,8vw,5.75rem)] font-medium leading-[0.98] tracking-tight">
              <span className="block">
                <SplitReveal text="Rooted in Christ," />
              </span>
              <span className="block">
                <SplitReveal text="equipped for" delay={250} />
                <span className="inline-block overflow-hidden pb-[0.12em] align-bottom">
                  <span className="inline-block italic text-sun motion-safe:animate-rise" style={{ animationDelay: "400ms" }}>
                    <Underline>impact.</Underline>
                  </span>
                </span>
              </span>
            </h1>
            <Reveal delay={500}>
              <p className="mt-8 max-w-[50ch] text-lg leading-relaxed text-night-muted">
                {SITE.tagline} Scripture, leadership, fellowship and kingdom advancement for every young Anglican in
                the diocese.
              </p>
            </Reveal>
            <Reveal delay={650}>
              <div className="mt-10 flex flex-wrap gap-3">
                <ButtonLink href="/convention/register" variant="gold">
                  Register for Convention <Arrow />
                </ButtonLink>
                <ButtonLink href="/register" variant="ghost-on-night">
                  Join AYF Egba
                </ButtonLink>
              </div>
            </Reveal>
          </div>

          <div className="relative hidden lg:block" aria-hidden="true">
            <Parallax speed={0.12}>
              <div className="relative mx-auto aspect-square w-full max-w-[26rem]">
                <div className="absolute inset-10 rounded-full bg-sun/25 blur-3xl motion-safe:animate-glow" />
                <div className="absolute inset-0 rounded-full border border-sun/25" />
                <div className="absolute inset-0 rounded-full border-t border-sun/70 motion-safe:animate-[spin_24s_linear_infinite]" />
                <div className="absolute inset-6 rounded-full border border-night-ink/10" />
                <div className="absolute inset-12 motion-safe:animate-float">
                  <Logo priority className="size-full shadow-2xl" />
                </div>
              </div>
            </Parallax>
          </div>
        </Container>
      </section>

      {/* Convention card overlapping the hero */}
      <Container className="relative z-10 -mt-24 lg:-mt-28">
        <Reveal>
          <ConventionTeaser />
        </Reveal>
      </Container>

      {/* Values marquee */}
      <div className="mt-20 border-y border-line py-6 font-display text-2xl italic text-ink-muted sm:text-3xl">
        <Marquee items={VALUES.map((v) => v.title)} />
      </div>

      {/* Pillars */}
      <section className="py-24 sm:py-32">
        <Container>
          <Reveal>
            <SectionHeading eyebrow="What we stand on">
              Three pillars, <Emphasis>one</Emphasis> fellowship.
            </SectionHeading>
          </Reveal>
          <div className="grid gap-px overflow-hidden rounded-card border border-line bg-line md:grid-cols-3">
            {PILLARS.map((p, i) => (
              <Reveal key={p.title} delay={i * 120} className="h-full">
                <div className="group relative h-full bg-surface p-8 transition-colors duration-500 hover:bg-surface-muted sm:p-10">
                  <span className="font-display text-sm italic text-accent">{ROMAN[i]}</span>
                  <h3 className="mt-10 font-display text-3xl font-medium tracking-tight">{p.title}</h3>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-ink-muted">{p.label}</p>
                  <p className="mt-5 leading-relaxed text-ink-muted">{p.text}</p>
                  <span aria-hidden="true" className="absolute bottom-0 left-0 h-0.5 w-0 bg-sun transition-all duration-700 group-hover:w-full" />
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Bishop's charge */}
      <section className="bg-surface-muted py-24 sm:py-32">
        <Container className="grid gap-12 lg:grid-cols-[1fr_2fr] lg:items-center">
          <Reveal>
            <Eyebrow className="mb-4">The Bishop&apos;s charge</Eyebrow>
            <p className="font-display text-xl font-medium">{BISHOP.name}</p>
            <p className="mt-1 text-sm text-ink-muted">{BISHOP.role}</p>
          </Reveal>
          <Reveal delay={150}>
            <figure>
              <blockquote className="font-display text-[clamp(1.7rem,3.6vw,2.7rem)] font-light leading-[1.2] tracking-tight">
                <p className="mb-6 italic text-accent">“{BISHOP.title}.”</p>
                {BISHOP.charge.map((line) => (
                  <p key={line} className="mb-3">{line}</p>
                ))}
              </blockquote>
              <figcaption className="mt-8">
                <Link href="/convention#charge" className="text-sm font-semibold text-primary hover:underline">
                  Read the full charge
                </Link>
              </figcaption>
            </figure>
          </Reveal>
        </Container>
      </section>

      {/* Numbers */}
      <section className="relative isolate overflow-hidden bg-night py-20 text-night-ink">
        <Aurora />
        <Container>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
            {numbers.map((n, i) => (
              <Reveal key={n.label} delay={i * 100}>
                <dt className="sr-only">{n.label}</dt>
                <dd className="font-display text-5xl font-light tracking-tight sm:text-6xl">
                  <CountUp to={n.value} suffix={n.suffix} />
                </dd>
                <dd className="mt-3 border-t border-night-ink/15 pt-3 text-xs font-semibold uppercase tracking-[0.18em] text-night-muted">
                  {n.label}
                </dd>
              </Reveal>
            ))}
          </dl>
        </Container>
      </section>

      {/* Speakers preview */}
      <section className="py-24 sm:py-32">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow={CONVENTION.shortName}
              action={{ href: "/convention#speakers", label: "Full programme" }}
              lead={CONVENTION.themeBlurb}
            >
              “If God be <Emphasis>for us</Emphasis>”
            </SectionHeading>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SPEAKERS.map((s, i) => (
              <Reveal key={s.name} delay={i * 100} className="h-full">
                <div className="group h-full rounded-card border border-line bg-surface p-6 transition duration-500 hover:border-sun/60 hover:shadow-lift">
                  <div
                    aria-hidden="true"
                    className="grid size-14 place-items-center rounded-full bg-night font-display text-lg text-sun transition-transform duration-500 group-hover:scale-110"
                  >
                    {s.initials}
                  </div>
                  <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-accent">{s.sessionType}</p>
                  <p className="mt-2 font-display text-lg font-medium leading-snug">{s.session}</p>
                  <p className="mt-4 text-sm font-semibold">{s.name}</p>
                  <p className="text-sm text-ink-muted">{s.role}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Events */}
      <section className="pb-24 sm:pb-32">
        <Container>
          <Reveal>
            <SectionHeading eyebrow="Calendar" action={{ href: "/events", label: "All events" }}>
              What&apos;s <Emphasis>coming up</Emphasis>
            </SectionHeading>
          </Reveal>
          {events.length ? (
            <div className="grid gap-4 lg:grid-cols-3">
              {events.map((e, i) => (
                <Reveal key={e.slug} delay={i * 100} className="h-full">
                  <EventCard event={e} />
                </Reveal>
              ))}
            </div>
          ) : (
            <p className="text-ink-muted">New events are coming soon.</p>
          )}
        </Container>
      </section>

      {/* Word of the week */}
      {devotional && (
        <section className="relative isolate overflow-hidden bg-night py-24 text-night-ink sm:py-32">
          <Aurora />
          <Container className="max-w-4xl">
            <Reveal>
              <Eyebrow className="mb-10 text-sun">Word of the week</Eyebrow>
              <Scripture text={devotional.scripture.text} reference={devotional.scripture.ref} size="lg" />
              <div className="mt-12 flex flex-wrap gap-3">
                <ButtonLink href={`/devotionals/${devotional.slug}`} variant="gold">
                  Read the devotional <Arrow />
                </ButtonLink>
                <ButtonLink href="/devotionals" variant="ghost-on-night">
                  All devotionals
                </ButtonLink>
              </div>
            </Reveal>
          </Container>
        </section>
      )}

      {/* Parish finder */}
      <section className="py-24 sm:py-32">
        <Container>
          <Reveal>
            <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-start">
              <SectionHeading
                eyebrow="Find your people"
                className="mb-0"
                lead={`Search ${parishCount} parishes across ${ARCHDEACONRIES.length} archdeaconries, then join your parish fellowship in a few taps.`}
              >
                Where do you <Emphasis>worship?</Emphasis>
              </SectionHeading>
              <ParishFinder archdeaconries={ARCHDEACONRIES} />
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Join */}
      <section className="pb-24 sm:pb-32">
        <Container>
          <Reveal>
            <div className="relative isolate overflow-hidden rounded-card bg-night px-6 py-16 text-center text-night-ink sm:px-12 sm:py-24">
              <Aurora />
              <h2 className="mx-auto max-w-[18ch] font-display text-[clamp(2.2rem,5.5vw,3.75rem)] font-medium leading-[1.05] tracking-tight">
                There&apos;s a seat with <em className="italic text-sun">your name</em> on it.
              </h2>
              <p className="mx-auto mt-6 max-w-[46ch] text-lg text-night-muted">
                Register as a member and your parish youth leaders will welcome you in.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-3">
                <ButtonLink href="/register" variant="gold">
                  Join AYF Egba <Arrow />
                </ButtonLink>
                <ButtonLink href="/representatives" variant="ghost-on-night">
                  Parish representatives
                </ButtonLink>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
