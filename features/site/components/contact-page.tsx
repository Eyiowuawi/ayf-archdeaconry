import { Container, Eyebrow, PageHero } from "@/shared/ui/page-layout";
import { Reveal } from "@/shared/ui/motion";
import { CONTACT } from "@/features/site/data/site";

export function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="We'd love to hear from you."
        lead={`The ${CONTACT.office} handles ${CONTACT.handles.charAt(0).toLowerCase()}${CONTACT.handles.slice(1)}`}
      />
      <Container className="grid gap-4 py-20 sm:py-28 md:grid-cols-3">
        <Reveal className="h-full">
          <div className="h-full rounded-card border border-line bg-surface p-8">
            <Eyebrow className="mb-5">Visit</Eyebrow>
            <address className="font-display text-xl not-italic leading-snug">
              {CONTACT.address}
            </address>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONTACT.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block text-sm font-semibold text-primary hover:underline"
            >
              Open in Google Maps →
            </a>
          </div>
        </Reveal>
        <Reveal delay={120} className="h-full">
          <div className="h-full rounded-card border border-line bg-surface p-8">
            <Eyebrow className="mb-5">Write</Eyebrow>
            <a
              href={`mailto:${CONTACT.email}`}
              className="break-all font-display text-xl text-ink no-underline hover:text-accent"
            >
              {CONTACT.email}
            </a>
            {CONTACT.phonesConfirmed && (
              <div className="mt-6 space-y-1">
                {CONTACT.phones.map((p) => (
                  <a
                    key={p}
                    href={`tel:${p.replace(/\s/g, "")}`}
                    className="block font-display text-lg text-ink no-underline hover:text-accent"
                  >
                    {p}
                  </a>
                ))}
              </div>
            )}
          </div>
        </Reveal>
        <Reveal delay={240} className="h-full">
          <div className="h-full rounded-card border border-line bg-surface p-8">
            <Eyebrow className="mb-5">Office hours</Eyebrow>
            <dl className="space-y-4">
              {CONTACT.hours.map((h) => (
                <div key={h.days}>
                  <dt className="font-display text-xl">{h.days}</dt>
                  <dd className="text-ink-muted">{h.time}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </Container>
    </>
  );
}
