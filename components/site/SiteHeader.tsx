import Link from "next/link";
import { Container } from "@/components/ui/Layout";
import AyfEmblem from "./AyfEmblem";
import SiteNav from "./SiteNav";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-line/60 bg-canvas/75 backdrop-blur-xl">
      <Container className="flex items-center justify-between gap-3 py-3">
        <Link href="/" className="group flex shrink-0 items-center gap-2 text-ink sm:gap-2.5 no-underline">
          <AyfEmblem
            title=""
            className="size-10 drop-shadow-md sm:size-11 transition-transform duration-500 motion-safe:group-hover:rotate-[-12deg] motion-safe:group-hover:scale-105"
          />
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
