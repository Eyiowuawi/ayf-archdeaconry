import Link from "next/link";
import { Container } from "@/components/ui/Layout";
import SiteNav from "./SiteNav";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-line bg-surface">
      <Container className="flex flex-col items-start gap-3 py-2.5 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="flex items-center gap-2.5 text-ink no-underline">
          <span aria-hidden="true" className="grid size-[34px] shrink-0 place-items-center rounded-[9px] bg-primary text-primary-ink">
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path d="M10.5 2h3v6.5H20v3h-6.5V22h-3V11.5H4v-3h6.5z" fill="currentColor" />
            </svg>
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-serif font-semibold">Anglican Youth Fellowship</span>
            <span className="text-xs text-ink-muted">Diocese of Egba</span>
          </span>
        </Link>
        <SiteNav />
      </Container>
    </header>
  );
}
