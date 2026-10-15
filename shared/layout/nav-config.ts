import type { LucideIcon } from "lucide-react";
import { BookOpen, CalendarDays, Church, LayoutDashboard, ScanLine, Users } from "lucide-react";

/** Links in the public website's header and footer. */
export const NAV_LINKS = [
  { href: "/events", label: "Events" },
  { href: "/devotionals", label: "Devotionals" },
  { href: "/representatives", label: "Parish reps" },
  { href: "/contact", label: "Contact" },
];

export interface NavLink {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface NavGroup {
  label: string;
  items: NavLink[];
}

export type NavSection = NavLink | NavGroup;

export function isNavGroup(section: NavSection): section is NavGroup {
  return "items" in section;
}

export const ADMIN_HOME_HREF = "/admin";

/** The admin sidebar. Drives the breadcrumb trail in the header too. */
export const ADMIN_NAV_SECTIONS: NavSection[] = [
  { label: "Dashboard", href: ADMIN_HOME_HREF, icon: LayoutDashboard },
  {
    label: "Members",
    items: [
      { label: "Registrations", href: "/admin/registrations", icon: Users },
      { label: "Parish reps", href: "/admin/representatives", icon: Church },
    ],
  },
  {
    label: "Events",
    items: [
      { label: "Events", href: "/admin/events", icon: CalendarDays },
      { label: "Check-in", href: "/admin/check-in", icon: ScanLine },
    ],
  },
  {
    label: "Content",
    items: [{ label: "Devotionals", href: "/admin/devotionals", icon: BookOpen }],
  },
];

export const ADMIN_NAV_LINKS: NavLink[] = ADMIN_NAV_SECTIONS.flatMap((section) =>
  isNavGroup(section) ? section.items : [section]
);

/** True when `href` is the current page or one of its sub-pages. The dashboard only matches itself. */
export function isNavActive(pathname: string, href: string): boolean {
  if (href === ADMIN_HOME_HREF) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

const SEGMENT_LABELS: Record<string, string> = { new: "New", attendees: "Attendees" };

function titleCase(segment: string): string {
  return decodeURIComponent(segment)
    .split("-")
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * The header's breadcrumb trail for an admin path: the matching sidebar link, then
 * one crumb per remaining segment. `overrides` holds record titles keyed by pathname.
 */
export function getBreadcrumbItems(
  pathname: string,
  overrides: Record<string, string> = {}
): { label: string; href?: string }[] {
  if (pathname === ADMIN_HOME_HREF) return [{ label: "Dashboard" }];

  const link = ADMIN_NAV_LINKS.filter(
    (item) => item.href !== ADMIN_HOME_HREF && isNavActive(pathname, item.href)
  ).sort((a, b) => b.href.length - a.href.length)[0];
  if (!link) return [];

  const crumbs: { label: string; href?: string }[] = [{ label: link.label, href: link.href }];
  let path = link.href;
  for (const segment of pathname.slice(link.href.length).split("/").filter(Boolean)) {
    path = `${path}/${segment}`;
    crumbs.push({
      label: overrides[path] ?? SEGMENT_LABELS[segment] ?? titleCase(segment),
      href: path,
    });
  }
  return crumbs;
}
