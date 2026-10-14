import type { Metadata } from "next";
import Logo from "@/components/site/Logo";
import { Arrow, ButtonLink } from "@/components/ui/Button";
import { CardLink } from "@/components/ui/Card";
import { Container, Emphasis, Eyebrow, PageHero, SectionHeading } from "@/components/ui/Layout";
import { CountUp, Reveal } from "@/components/ui/Motion";
import { ABOUT, HUBS, NUMBERS, PILLARS, SITE, VALUES } from "@/lib/content/site";
import { ARCHDEACONRIES } from "@/lib/parishes";

export const metadata: Metadata = {
  title: "About",
  description: ABOUT.intro,
};

export default function AboutPage() {
  const parishCount = ARCHDEACONRIES.reduce((n, a) => n + a.parishes.length, 0);
  const numbers = [
    { value: ARCHDEACONRIES.length, suffix: "", label: "Archdeaconries" },
    { value: parishCount, suffix: "", label: "Parishes" },
    ...NUMBERS,
  ];
  return (
    <>
      <PageHero eyebrow="About us" title="A fellowship with deep roots." lead={ABOUT.intro} />

      {/* Story */}
      <section className="py-24 sm:py-32">
        <Container className="grid gap-14 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <Reveal>
            <div className="relative mx-auto aspect-square w-full max-w-sm">
              <div className="absolute inset-0 rounded-full border border-sun/40" />
              <div className="absolute inset-0 rounded-full border-t-2 border-sun motion-safe:animate-[spin_30s_linear_infinite]" />
              <div className="absolute inset-8">
                <Logo className="size-full shadow-lift" />
              </div>
            </div>
          </Reveal>
          <Reveal delay={150}>
            <Eyebrow className="mb-5">Our story</Eyebrow>
            <p className="font-display text-[clamp(1.6rem,3vw,2.25rem)] font-extrabold leading-snug tracking-tight">
              {ABOUT.roots}
            </p>
            <p className="mt-6 leading-relaxed text-ink-muted">
              Our motto is <em className="font-display text-ink">“{SITE.motto}”</em> ({SITE.mottoRef}): to grow
              in Christ together until we reflect Him in every part of life.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Vision / mission / call */}
      <section className="bg-surface-muted py-24 sm:py-32">
        <Container>
          <div className="grid gap-12 md:grid-cols-3">
            {[
              { k: "Vision", v: ABOUT.vision },
              { k: "Mission", v: ABOUT.mission },
              { k: "Our call", v: ABOUT.call },
            ].map((x, i) => (
              <Reveal key={x.k} delay={i * 120}>
                <div className="border-t border-ink/15 pt-6">
                  <Eyebrow className="mb-5">{x.k}</Eyebrow>
                  <p className="font-display text-2xl font-extrabold leading-snug tracking-tight">{x.v}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Pillars */}
      <section className="py-24 sm:py-32">
        <Container>
          <Reveal>
            <SectionHeading eyebrow="Three pillars">
              What <Emphasis>shapes</Emphasis> us
            </SectionHeading>
          </Reveal>
          <div className="grid gap-4 md:grid-cols-3">
            {PILLARS.map((p, i) => (
              <Reveal key={p.title} delay={i * 120} className="h-full">
                <div className="h-full rounded-card border border-line bg-surface p-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{p.label}</p>
                  <h3 className="mt-4 font-display text-3xl font-extrabold tracking-tight">{p.title}</h3>
                  <p className="mt-4 leading-relaxed text-ink-muted">{p.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Values */}
      <section className="pb-24 sm:pb-32">
        <Container>
          <Reveal>
            <SectionHeading eyebrow="Core values">
              Six things we <Emphasis>hold to</Emphasis>
            </SectionHeading>
          </Reveal>
          <ol className="grid border-t border-line sm:grid-cols-2 lg:grid-cols-3">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={(i % 3) * 100}>
                <li className="group flex gap-5 border-b border-line py-8 pr-6">
                  <span className="font-display text-sm text-accent">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-display text-2xl font-extrabold tracking-tight transition-colors group-hover:text-accent">{v.title}</h3>
                    <p className="mt-2 leading-relaxed text-ink-muted">{v.text}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      {/* Numbers */}
      <section className="bg-night py-20 text-night-ink">
        <Container>
          <Eyebrow className="mb-12 text-sun">The fellowship in numbers</Eyebrow>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-5">
            {numbers.map((n) => (
              <div key={n.label}>
                <dt className="sr-only">{n.label}</dt>
                <dd className="font-display text-5xl font-extrabold tracking-tight">
                  <CountUp to={n.value} suffix={n.suffix} />
                </dd>
                <dd className="mt-3 border-t border-night-ink/15 pt-3 text-xs font-semibold uppercase tracking-[0.16em] text-night-muted">
                  {n.label}
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* Hubs */}
      <section className="py-24 sm:py-32">
        <Container>
          <Reveal>
            <SectionHeading eyebrow="Get involved">
              Find your <Emphasis>place</Emphasis>
            </SectionHeading>
          </Reveal>
          <div className="grid gap-4 md:grid-cols-3">
            {HUBS.map((h, i) => (
              <Reveal key={h.title} delay={i * 120} className="h-full">
                <CardLink href={h.href} className="flex h-full flex-col">
                  <h3 className="font-display text-2xl font-extrabold tracking-tight">{h.title}</h3>
                  <p className="mt-3 flex-1 leading-relaxed text-ink-muted">{h.text}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                    {h.cta}
                    <span aria-hidden="true" className="transition-transform duration-300 motion-safe:group-hover:translate-x-1">→</span>
                  </span>
                </CardLink>
              </Reveal>
            ))}
          </div>
          <div className="mt-16 text-center">
            <ButtonLink href="/register">
              Join AYF Egba <Arrow />
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
