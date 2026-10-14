import Link from "next/link";
import { Container } from "@/components/ui/Layout";
import Logo from "./Logo";
import ScrollProgress from "./ScrollProgress";
import SiteNav from "./SiteNav";
import ThemeToggle from "./ThemeToggle";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-30">
      {/* Blur lives on a layer, not the header, so the fixed mobile menu can cover the viewport. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 border-b border-line/70 bg-canvas/80 backdrop-blur-xl" />
      <Container className="flex items-center justify-between gap-3 py-3">
        <Link href="/" className="group flex shrink-0 items-center gap-3 text-ink no-underline">
          <Logo priority className="size-10 transition-transform duration-700 motion-safe:group-hover:rotate-[-8deg] sm:size-11" />
          <span className="flex flex-col leading-tight">
            <span className="font-display text-lg font-medium tracking-tight">AYF Egba Diocese</span>
            <span className="hidden text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-ink-muted min-[400px]:block">
              Anglican Youth Fellowship
            </span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <SiteNav />
          <ThemeToggle />
        </div>
      </Container>
      <ScrollProgress />
    </header>
  );
}
