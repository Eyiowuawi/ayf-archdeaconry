import Link from "next/link";
import { Container } from "@/shared/ui/page-layout";
import { Logo } from "@/shared/layout/logo";
import { ScrollProgress } from "@/shared/layout/scroll-progress";
import { SiteNav } from "@/shared/layout/site-nav";
import { ThemeToggle } from "@/shared/layout/theme-toggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-line/60 print:hidden">
      {/* Blur lives on its own layer so the fixed mobile menu isn't trapped inside the header. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-canvas/75 backdrop-blur-xl" />
      <Container className="flex items-center justify-between gap-2 py-2.5 sm:gap-3">
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2 text-ink no-underline sm:gap-2.5"
        >
          <Logo
            priority
            className="size-10 shadow-md transition-transform duration-500 motion-safe:group-hover:rotate-[-10deg] motion-safe:group-hover:scale-105 sm:size-11"
          />
          <span className="flex flex-col leading-none">
            <span className="font-display text-xl font-extrabold tracking-tight">AYF</span>
            <span className="mt-0.5 hidden whitespace-nowrap text-[0.7rem] font-semibold text-ink-muted min-[400px]:block">
              Diocese of Egba
            </span>
          </span>
        </Link>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <SiteNav />
          <ThemeToggle />
        </div>
      </Container>
      <ScrollProgress />
    </header>
  );
}
