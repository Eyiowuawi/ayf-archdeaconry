import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container, Eyebrow, TextLink } from "@/design-system/Layout";
import { Blobs, Reveal } from "@/design-system/Motion";
import { registrationsOpen, siteEvent } from "@/lib/cms";
import { calendarLink, formatDateTime, formatEventDate, formatEventTime, registrationState } from "@/lib/events";
import { ARCHDEACONRIES } from "@/lib/parishes";
import { EventRegistration } from "@/screens/site/EventRegistration";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const e = await siteEvent((await params).slug);
  return e ? { title: e.title, description: e.summary } : {};
}

export async function EventDetail({ params }: Props) {
  const event = await siteEvent((await params).slug);
  if (!event) notFound();
  const time = formatEventTime(event);
  const state = registrationState(event);
  const reg = event.registration;
  const flierUrl = event.flier ? `/uploads/${event.flier.id}` : null;
  const paragraphs = (event.description ?? "").split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

  return (
    <article>
      <header className="relative isolate overflow-hidden bg-night pb-16 pt-10 text-night-ink sm:pb-20">
        <Blobs />
        <Container className="max-w-4xl">
          <TextLink href="/events" className="mb-8 text-sun">All events</TextLink>
          <Eyebrow className="mb-3 text-sun">{event.level} event</Eyebrow>
          <h1 className="mb-6 font-display text-[clamp(2.2rem,6vw,4rem)] font-extrabold leading-[0.95] tracking-tighter">
            {event.title}
          </h1>
          <dl className="grid gap-x-8 gap-y-2 text-night-ink/90 sm:grid-cols-[auto_1fr]">
            <dt className="font-bold text-sun">When</dt>
            <dd>
              {formatEventDate(event)}
              {time && <span className="block text-night-ink/75">{time}</span>}
            </dd>
            <dt className="font-bold text-sun">Where</dt>
            <dd>{event.venue}</dd>
          </dl>
          <a
            href={calendarLink(event)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex rounded-full border border-night-ink/30 px-4 py-2 font-display text-sm font-bold text-night-ink no-underline hover:border-sun hover:text-sun"
          >
            Add to calendar
          </a>
        </Container>
      </header>

      <Container className="grid max-w-4xl gap-10 py-14 md:grid-cols-[1fr_17rem]">
        <div>
          <Reveal>
            {paragraphs.length ? (
              paragraphs.map((p, i) => <p key={i} className="mb-5 text-lg leading-relaxed">{p}</p>)
            ) : (
              <p className="mb-5 text-lg leading-relaxed">{event.summary}</p>
            )}
          </Reveal>

          {event.speakers?.length ? (
            <Reveal>
              <h2 className="mb-4 mt-10 font-display text-2xl font-extrabold tracking-tight">Speakers</h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {event.speakers.map((s) => (
                  <li key={s.name} className="rounded-card border border-line bg-surface p-4 shadow-card">
                    <p className="font-display text-lg font-extrabold">{s.name}</p>
                    {s.role && <p className="text-sm text-ink-muted">{s.role}</p>}
                  </li>
                ))}
              </ul>
            </Reveal>
          ) : null}

          {reg && (
            <section id="register" className="mt-12 scroll-mt-24">
              <h2 className="mb-2 font-display text-3xl font-extrabold tracking-tight">Register</h2>
              {state === "open" && (
                <p className="mb-5 text-ink-muted">Registration closes {formatDateTime(reg.closesAt)}.</p>
              )}
              {state === "upcoming" && (
                <p className="rounded-card border border-line bg-surface-muted p-5">
                  Registration opens <b>{formatDateTime(reg.opensAt)}</b>. Come back then to get your ticket.
                </p>
              )}
              {state === "closed" && (
                <p className="rounded-card border border-line bg-surface-muted p-5">Registration for this event has closed.</p>
              )}
              {state === "open" && (
                <EventRegistration
                  slug={event.slug}
                  archdeaconries={ARCHDEACONRIES}
                  savesEnabled={registrationsOpen()}
                />
              )}
            </section>
          )}
        </div>

        {flierUrl && (
          <aside>
            {event.flier!.type.startsWith("image/") ? (
              <a href={flierUrl} target="_blank" rel="noreferrer" className="block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={flierUrl} alt={`Flier for ${event.title}`} className="w-full rounded-card border border-line shadow-lift" />
              </a>
            ) : (
              <a href={flierUrl} target="_blank" rel="noreferrer" className="block rounded-card border border-line bg-surface p-5 font-bold text-primary shadow-card">
                View the event flier (PDF)
              </a>
            )}
          </aside>
        )}
      </Container>
    </article>
  );
}
