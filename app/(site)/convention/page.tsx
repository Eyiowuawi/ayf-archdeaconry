import type { Metadata } from "next";
import ProgrammeTabs from "@/components/site/ProgrammeTabs";
import { Arrow, ButtonLink } from "@/components/ui/Button";
import { Container, Emphasis, Eyebrow, SectionHeading } from "@/components/ui/Layout";
import { Aurora, Countdown, Reveal, SplitReveal } from "@/components/ui/Motion";
import {
  CONVENTION,
  PAYMENT,
  PROGRAMME,
  REGISTRATION_STEPS,
  SPEAKERS,
  formatNaira,
} from "@/lib/content/convention";
import { BISHOP } from "@/lib/content/site";

export const metadata: Metadata = {
  title: CONVENTION.shortName,
  description: `${CONVENTION.edition}: “${CONVENTION.theme}” (${CONVENTION.themeRef}). Speakers, programme and registration.`,
};

export default function ConventionPage() {
  const c = CONVENTION;
  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-night pb-24 pt-16 text-night-ink sm:pb-32 sm:pt-24">
        <Aurora />
        <Container>
          <Eyebrow className="mb-8 text-sun">{c.edition}</Eyebrow>
          <h1 className="font-display text-[clamp(3.2rem,11vw,8rem)] font-medium italic leading-[0.92] tracking-tight">
            <SplitReveal text={`${c.theme}.`} step={110} />
          </h1>
          <Reveal delay={500}>
            <p className="mt-8 max-w-[52ch] text-lg leading-relaxed text-night-muted">
              <span className="font-display text-xl italic text-night-ink">“{c.themeText}”</span>{" "}
              <span className="whitespace-nowrap text-sun">{c.themeRef}</span>
              <br />
              <br />
              {c.themeBlurb}
            </p>
          </Reveal>
          <Reveal delay={650}>
            <div className="mt-12 flex flex-wrap items-end justify-between gap-10 border-t border-night-ink/15 pt-10">
              <dl className="grid grid-cols-2 gap-x-10 gap-y-6 sm:grid-cols-3">
                {[
                  { k: "When", v: c.startDate ? c.datesLabel : "To be announced" },
                  { k: "Where", v: `${c.city} · ${c.venue}` },
                  { k: "Fee", v: `${formatNaira(c.fee)} per delegate` },
                ].map((x) => (
                  <div key={x.k}>
                    <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-sun">{x.k}</dt>
                    <dd className="mt-2 font-display text-lg">{x.v}</dd>
                  </div>
                ))}
              </dl>
              <div className="flex flex-col items-start gap-6">
                <Countdown start={c.startDate} end={c.endDate} pendingLabel="Dates coming soon" />
                {c.registrationOpen && (
                  <ButtonLink href="/convention/register" variant="gold">
                    Register now <Arrow />
                  </ButtonLink>
                )}
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Bishop's charge */}
      <section id="charge" className="scroll-mt-24 py-24 sm:py-32">
        <Container className="max-w-4xl">
          <Reveal>
            <Eyebrow className="mb-8">Patronal charge</Eyebrow>
            <p className="font-display text-[clamp(2rem,4.5vw,3.25rem)] font-light italic leading-[1.1] tracking-tight text-accent">
              “{BISHOP.title}.”
            </p>
            <div className="mt-8 space-y-5 text-lg leading-relaxed text-ink/85">
              <p>
                Our Lord Bishop and Patron charges every young Anglican in the diocese to come to this convention as to
                an altar of fire: expectant, prayerful and ready to be renewed.
              </p>
              <p>
                “You are not the church of tomorrow. You are the active, vibrant church of today.” Register online, bring
                a friend, and come ready to meet God.
              </p>
            </div>
            <p className="mt-10 font-display text-xl font-medium">{BISHOP.name}</p>
            <p className="text-sm text-ink-muted">{BISHOP.role}</p>
          </Reveal>
        </Container>
      </section>

      {/* Speakers */}
      <section id="speakers" className="scroll-mt-24 bg-surface-muted py-24 sm:py-32">
        <Container>
          <Reveal>
            <SectionHeading eyebrow="Speakers">
              Voices for <Emphasis>this season</Emphasis>
            </SectionHeading>
          </Reveal>
          <div className="grid gap-px overflow-hidden rounded-card border border-line bg-line md:grid-cols-2">
            {SPEAKERS.map((s, i) => (
              <Reveal key={s.name} delay={(i % 2) * 120} className="h-full">
                <div className="group flex h-full gap-6 bg-surface p-8 transition-colors duration-500 hover:bg-canvas sm:p-10">
                  <div
                    aria-hidden="true"
                    className="grid size-16 shrink-0 place-items-center rounded-full bg-night font-display text-xl text-sun ring-1 ring-sun/40 transition-transform duration-500 group-hover:scale-110"
                  >
                    {s.initials}
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{s.sessionType}</p>
                    <h3 className="mt-2 font-display text-2xl font-medium leading-snug tracking-tight">{s.session}</h3>
                    <p className="mt-4 font-semibold">{s.name}</p>
                    <p className="text-sm text-ink-muted">{s.role}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Programme */}
      <section id="programme" className="scroll-mt-24 py-24 sm:py-32">
        <Container className="max-w-4xl">
          <Reveal>
            <SectionHeading eyebrow="Programme" lead={c.pavilion}>
              Four days, <Emphasis>one altar</Emphasis>
            </SectionHeading>
          </Reveal>
          <Reveal delay={100}>
            <ProgrammeTabs days={PROGRAMME} />
          </Reveal>
        </Container>
      </section>

      {/* Registration */}
      <section id="register" className="scroll-mt-24 relative isolate overflow-hidden bg-night py-24 text-night-ink sm:py-32">
        <Aurora />
        <Container>
          <Reveal>
            <Eyebrow className="mb-5 text-sun">Registration</Eyebrow>
            <h2 className="max-w-[18ch] font-display text-[clamp(2.2rem,5vw,3.5rem)] font-medium leading-[1.05] tracking-tight">
              {formatNaira(c.fee)} covers <em className="italic text-sun">everything</em> you need.
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-14 lg:grid-cols-2">
            <Reveal>
              <ul className="space-y-4">
                {c.feeCovers.map((f) => (
                  <li key={f} className="flex gap-4 border-b border-night-ink/10 pb-4 text-lg">
                    <span aria-hidden="true" className="text-sun">✦</span>
                    {f}
                  </li>
                ))}
              </ul>
              <p className="mt-8 leading-relaxed text-night-muted">{c.buses}</p>
            </Reveal>
            <Reveal delay={150}>
              <ol className="space-y-8">
                {REGISTRATION_STEPS.map((s, i) => (
                  <li key={s.title} className="flex gap-5">
                    <span className="grid size-10 shrink-0 place-items-center rounded-full border border-sun/60 font-display text-lg text-sun">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-display text-xl font-medium">{s.title}</p>
                      <p className="mt-1 text-night-muted">{s.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="mt-10 rounded-card border border-night-ink/15 bg-night-ink/5 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sun">Pay to</p>
                {PAYMENT.confirmed ? (
                  <p className="mt-3 font-display text-xl leading-relaxed">
                    {PAYMENT.bank} · <span className="tabular-nums">{PAYMENT.accountNumber}</span>
                    <br />
                    <span className="text-base text-night-muted">{PAYMENT.accountName}</span>
                  </p>
                ) : (
                  <p className="mt-3 text-night-muted">
                    Official account details will be published here once confirmed by the Diocesan Secretariat. Please
                    don&apos;t pay into any account you weren&apos;t given by your archdeaconry youth president.
                  </p>
                )}
              </div>
              {c.registrationOpen && (
                <ButtonLink href="/convention/register" variant="gold" className="mt-8">
                  Start registration <Arrow />
                </ButtonLink>
              )}
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Packing + notes */}
      <section className="py-24 sm:py-32">
        <Container className="grid gap-14 lg:grid-cols-2">
          <Reveal>
            <SectionHeading eyebrow="Before you travel" className="mb-8">
              What to <Emphasis>bring</Emphasis>
            </SectionHeading>
            <ul className="grid gap-3 sm:grid-cols-2">
              {c.bring.map((b) => (
                <li key={b} className="rounded-xl border border-line bg-surface px-4 py-3 text-[0.95rem]">
                  {b}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={150}>
            <SectionHeading eyebrow="Good to know" className="mb-8">
              Everyone is <Emphasis>welcome</Emphasis>
            </SectionHeading>
            <div className="space-y-6 text-lg leading-relaxed text-ink-muted">
              <p>{c.guests}</p>
              <p>{c.security}</p>
              <p>{c.pavilion}</p>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
