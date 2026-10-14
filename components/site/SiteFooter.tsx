import Link from "next/link";
import { Container } from "@/components/ui/Layout";
import { Aurora } from "@/components/ui/Motion";
import { CONTACT, SITE } from "@/lib/content/site";
import Logo from "./Logo";
import { NAV_LINKS } from "./nav-links";

export default function SiteFooter() {
  return (
    <footer className="relative isolate overflow-hidden bg-night pt-16 text-night-ink">
      <Aurora />
      <Container>
        <div className="grid gap-12 pb-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-4">
              <Logo className="size-16 ring-1 ring-sun/40" />
              <div>
                <p className="font-display text-2xl font-medium">AYF Egba Diocese</p>
                <p className="text-sm text-night-muted">Church of Nigeria (Anglican Communion)</p>
              </div>
            </div>
            <p className="mt-6 max-w-sm font-display text-lg italic leading-snug text-night-ink/90">{SITE.tagline}</p>
          </div>
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-sun">Explore</p>
            <ul className="space-y-2.5 text-sm">
              {[...NAV_LINKS, { href: "/register", label: "Join AYF" }, { href: "/representatives", label: "Parish representatives" }].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-night-muted no-underline transition-colors hover:text-night-ink">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-sun">Secretariat</p>
            <address className="space-y-2.5 text-sm not-italic text-night-muted">
              <p>{CONTACT.address}</p>
              <p>
                <a href={`mailto:${CONTACT.email}`} className="text-night-ink no-underline hover:underline">
                  {CONTACT.email}
                </a>
              </p>
              {CONTACT.phonesConfirmed && CONTACT.phones.map((p) => <p key={p}>{p}</p>)}
            </address>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-night-ink/10 py-6 text-xs text-night-muted">
          <p>© {new Date().getFullYear()} Anglican Youth Fellowship, Egba Diocese</p>
          <p className="uppercase tracking-[0.18em]">
            {SITE.motto} · {SITE.mottoRef}
          </p>
        </div>
      </Container>
    </footer>
  );
}
