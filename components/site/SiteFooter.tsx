import Link from "next/link";
import { Container } from "@/components/ui/Layout";

const LINKS = [
  { href: "/events", label: "Events" },
  { href: "/devotionals", label: "Devotionals" },
  { href: "/register", label: "Join the fellowship" },
  { href: "/representatives", label: "Parish representatives" },
];

export default function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line bg-surface py-7">
      <Container className="flex flex-wrap justify-between gap-5">
        <div>
          <p className="mb-1 font-serif font-semibold">Anglican Youth Fellowship</p>
          <p className="text-sm text-ink-muted">Diocese of Egba, Church of Nigeria (Anglican Communion)</p>
        </div>
        <ul className="flex flex-wrap gap-x-4.5 gap-y-1.5 text-sm">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="text-ink-muted no-underline hover:text-ink hover:underline">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </footer>
  );
}
