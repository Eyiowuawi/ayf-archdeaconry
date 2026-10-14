"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { NAV_LINKS } from "./nav-links";

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Desktop */}
      <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
        {NAV_LINKS.map((l) => {
          const active = isActive(pathname, l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative px-3 py-2 text-sm font-semibold no-underline transition-colors after:absolute after:inset-x-3 after:bottom-1 after:h-px after:origin-left after:bg-sun after:transition-transform after:duration-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                active ? "text-ink after:scale-x-100" : "text-ink-muted after:scale-x-0 hover:text-ink hover:after:scale-x-100"
              )}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>
      <Link
        href="/convention/register"
        className="hidden rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-ink no-underline transition hover:shadow-lift sm:inline-flex"
      >
        Register
      </Link>

      {/* Mobile */}
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((o) => !o)}
        className="relative z-50 grid size-10 cursor-pointer place-items-center rounded-full border border-line bg-surface text-ink lg:hidden"
      >
        <span className="relative block h-3 w-4">
          <span className={cn("absolute left-0 top-0 h-0.5 w-4 rounded bg-current transition duration-300", open && "translate-y-1.5 rotate-45")} />
          <span className={cn("absolute left-0 top-1.5 h-0.5 w-4 rounded bg-current transition duration-300", open && "opacity-0")} />
          <span className={cn("absolute left-0 top-3 h-0.5 w-4 rounded bg-current transition duration-300", open && "-translate-y-1.5 -rotate-45")} />
        </span>
      </button>
      <div
        id="mobile-menu"
        className={cn(
          "fixed inset-0 z-40 flex flex-col bg-night px-6 pb-10 pt-24 text-night-ink transition duration-500 lg:hidden",
          open ? "visible opacity-100" : "invisible opacity-0"
        )}
      >
        <nav aria-label="Mobile" className="flex flex-col">
          {[{ href: "/", label: "Home" }, ...NAV_LINKS, { href: "/register", label: "Join AYF" }].map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              style={{ transitionDelay: open ? `${80 + i * 50}ms` : "0ms" }}
              className={cn(
                "border-b border-night-ink/10 py-4 font-display text-3xl font-medium no-underline transition duration-500",
                open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
                isActive(pathname, l.href) && l.href !== "/" ? "text-sun" : "text-night-ink"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/convention/register"
          className="mt-auto rounded-full bg-sun py-4 text-center font-semibold text-sun-ink no-underline"
        >
          Register for Convention
        </Link>
      </div>
    </>
  );
}
