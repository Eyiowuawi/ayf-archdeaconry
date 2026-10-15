import Link from "next/link";
import { Container } from "@/design-system/Layout";
import { Logo } from "@/shell/Logo";
import { ScrollProgress } from "@/shell/ScrollProgress";
import { SiteNav } from "@/shell/SiteNav";
import { ThemeToggle } from "@/shell/ThemeToggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-line/60">
      {/* Blur lives on its own layer so the fixed mobile menu isn't trapped inside the header. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-canvas/75 backdrop-blur-xl" />
      <Container className="flex items-center justify-between gap-2 py-2.5 sm:gap-3">
        <Link href="/" className="group flex shrink-0 items-center gap-2 text-ink no-underline sm:gap-2.5">
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
