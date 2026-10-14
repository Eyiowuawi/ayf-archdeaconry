import Link from "next/link";
import { Container } from "@/components/ui/Layout";
import { Blobs } from "@/components/ui/Motion";

const LINKS = [
  { href: "/events", label: "Events" },
  { href: "/devotionals", label: "Devotionals" },
  { href: "/register", label: "Join the fellowship" },
  { href: "/representatives", label: "Parish representatives" },
];

export default function SiteFooter() {
  return (
    <footer className="relative isolate overflow-hidden bg-night py-12 text-night-ink">
      <Blobs />
      <Container className="flex flex-wrap items-end justify-between gap-8">
        <div>
          <p className="font-display text-3xl font-extrabold tracking-tight">Anglican Youth Fellowship</p>
          <p className="mt-1 text-sm text-night-muted">Diocese of Egba · Church of Nigeria (Anglican Communion)</p>
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
