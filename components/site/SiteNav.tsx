"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/devotionals", label: "Devotionals" },
];

const linkBase =
  "rounded-full px-3.5 py-2 font-display text-sm font-bold no-underline transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

export default function SiteNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Main" className="flex items-center gap-0.5">
      {LINKS.map((l) => {
        const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              linkBase,
              l.href === "/" && "hidden sm:inline-flex",
              active ? "bg-ink text-canvas" : "text-ink-muted hover:bg-surface-muted hover:text-ink"
            )}
          >
            {l.label}
          </Link>
        );
      })}
      <Link
        href="/register"
        aria-current={pathname.startsWith("/register") ? "page" : undefined}
        className={cn(
          linkBase,
          "ml-1 bg-linear-to-r from-primary to-accent text-primary-ink shadow-lift transition-transform motion-safe:hover:-translate-y-0.5"
        )}
      >
        Join
      </Link>
    </nav>
  );
}
