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
  "rounded-lg px-3 py-1.5 text-sm font-semibold no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

export default function SiteNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Main" className="flex w-full flex-wrap justify-between gap-0.5 sm:w-auto sm:justify-end">
      {LINKS.map((l) => {
        const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              linkBase,
              active ? "bg-surface-muted text-ink" : "text-ink-muted hover:bg-surface-muted hover:text-ink"
            )}
          >
            {l.label}
          </Link>
        );
      })}
      <Link
        href="/register"
        aria-current={pathname.startsWith("/register") ? "page" : undefined}
        className={cn(linkBase, "bg-primary text-primary-ink hover:brightness-110")}
      >
        Join
      </Link>
    </nav>
  );
}
