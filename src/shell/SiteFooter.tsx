import Link from "next/link";
import { Container } from "@/design-system/Layout";
import { Blobs } from "@/design-system/Motion";
import { Logo } from "@/shell/Logo";

const LINKS = [
  { href: "/events", label: "Events" },
  { href: "/devotionals", label: "Devotionals" },
  { href: "/contact", label: "Contact" },
  { href: "/register", label: "Join the fellowship" },
  { href: "/representatives", label: "Parish representatives" },
];

export function SiteFooter() {
  return (
    <footer className="relative isolate overflow-hidden bg-night py-12 text-night-ink print:hidden">
      <Blobs />
      <Container className="flex flex-wrap items-end justify-between gap-8">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <Logo className="size-20 ring-4 ring-sun/30" />
          <div>
          <p className="font-display text-3xl font-extrabold tracking-tight">Anglican Youth Fellowship</p>
          <p className="mt-1 text-sm text-night-muted">Diocese of Egba · Church of Nigeria (Anglican Communion)</p>
          <p className="mt-2 font-display text-sm font-bold uppercase tracking-widest text-sun">Towards the perfect man · Eph 4:13</p>
          </div>
        </div>
        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="text-night-muted no-underline transition-colors hover:text-sun">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </footer>
  );
}
