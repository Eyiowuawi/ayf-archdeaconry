"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/devotionals", label: "Devotionals" },
  { href: "/register", label: "Join" },
];

export default function SiteNav() {
  const pathname = usePathname();
  return (
    <nav className="sitenav" aria-label="Main">
      {LINKS.map((l) => {
        const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            className={active ? "active" : undefined}
            aria-current={active ? "page" : undefined}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
