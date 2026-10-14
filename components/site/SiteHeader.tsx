import Link from "next/link";
import { Container } from "@/components/ui/Layout";
import SiteNav from "./SiteNav";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-line/60 bg-canvas/75 backdrop-blur-xl">
      <Container className="flex items-center justify-between gap-3 py-3">
        <Link href="/" className="group flex items-center gap-2.5 text-ink no-underline">
          <span
            aria-hidden="true"
            className="grid size-10 shrink-0 place-items-center rounded-2xl bg-linear-to-br from-primary via-accent to-sun text-white shadow-lift transition-transform duration-500 motion-safe:group-hover:rotate-[-8deg] motion-safe:group-hover:scale-105"
          >
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path d="M10.5 2h3v6.5H20v3h-6.5V22h-3V11.5H4v-3h6.5z" fill="currentColor" />
            </svg>
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-xl font-extrabold tracking-tight">AYF</span>
            <span className="mt-0.5 whitespace-nowrap text-[0.7rem] font-semibold text-ink-muted">Diocese of Egba</span>
          </span>
        </Link>
        <SiteNav />
      </Container>
    </header>
  );
}
