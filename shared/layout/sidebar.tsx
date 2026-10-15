"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, LogOut, Pin } from "lucide-react";
import { cn } from "@/utils/utils";
import { useUiStore } from "@/shared/store/ui-store";
import { logout } from "@/features/auth/services/auth-actions";
import type { AdminAccount } from "@/features/auth/utils/account";
import { Avatar } from "@/shared/ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/shared/ui/sheet";
import { Logo } from "@/shared/layout/logo";
import { adminFonts } from "@/shared/layout/admin-fonts";
import {
  ADMIN_NAV_SECTIONS,
  isNavActive,
  isNavGroup,
  type NavGroup,
  type NavLink,
} from "@/shared/layout/nav-config";

const EXPANDED_STORAGE_KEY = "ayf-sidebar-expanded";

function groupHasActive(group: NavGroup, pathname: string): boolean {
  return group.items.some((item) => isNavActive(pathname, item.href));
}

function readExpanded(): Record<string, boolean> {
  try {
    const raw = window.localStorage.getItem(EXPANDED_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
  } catch {
    return {};
  }
}

const iconButton =
  "grid size-8 shrink-0 cursor-pointer place-items-center rounded-md text-ink-muted transition-colors hover:bg-surface-muted hover:text-ink";

function SidebarLink({
  item,
  active,
  onNavigate,
  collapsed,
}: {
  item: NavLink;
  active: boolean;
  onNavigate?: () => void;
  collapsed?: boolean;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      title={collapsed ? item.label : undefined}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium no-underline transition-colors",
        collapsed && "justify-center px-0",
        active
          ? "bg-sun font-semibold text-sun-ink"
          : "text-ink-muted hover:bg-surface-muted hover:text-ink"
      )}
    >
      <Icon className="size-[18px] shrink-0" aria-hidden="true" />
      {collapsed ? (
        <span className="sr-only">{item.label}</span>
      ) : (
        <span className="truncate">{item.label}</span>
      )}
    </Link>
  );
}

function SidebarGroup({
  group,
  pathname,
  open,
  onToggle,
  onNavigate,
  collapsed,
}: {
  group: NavGroup;
  pathname: string;
  open: boolean;
  onToggle: () => void;
  onNavigate?: () => void;
  collapsed?: boolean;
}) {
  const hasActive = groupHasActive(group, pathname);

  // The icon-only rail has no room for group headings, so each group becomes a flat
  // icon list separated by a divider.
  if (collapsed) {
    return (
      <div className="space-y-1 border-t border-line pt-2 first:border-0 first:pt-0">
        {group.items.map((item) => (
          <SidebarLink
            key={item.href}
            item={item}
            active={isNavActive(pathname, item.href)}
            onNavigate={onNavigate}
            collapsed
          />
        ))}
      </div>
    );
  }

  return (
    <div className="pt-2 first:pt-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className={cn(
          "flex w-full cursor-pointer items-center justify-between gap-2 rounded-md px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors",
          "text-ink-muted hover:bg-surface-muted hover:text-ink",
          !open && hasActive && "text-ink"
        )}
      >
        <span className="flex items-center gap-2">
          {group.label}
          {!open && hasActive && <span className="size-1.5 rounded-full bg-sun" aria-hidden />}
        </span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 transition-transform duration-200",
            open ? "rotate-0" : "-rotate-90"
          )}
          aria-hidden="true"
        />
      </button>
      {open && (
        <div className="mt-1 space-y-1">
          {group.items.map((item) => (
            <SidebarLink
              key={item.href}
              item={item}
              active={isNavActive(pathname, item.href)}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface SidebarContentProps {
  account: AdminAccount;
  onNavigate?: () => void;
  /** Icon-only rail, used by the desktop panel when it isn't expanded. */
  collapsed?: boolean;
  /** Only the desktop panel passes these, and only it shows the pin button. */
  pinned?: boolean;
  onTogglePin?: () => void;
}

function SidebarContent({
  account,
  onNavigate,
  collapsed = false,
  pinned,
  onTogglePin,
}: SidebarContentProps) {
  const pathname = usePathname();

  // Groups are collapsible. With so few links they all start open; a toggle is kept
  // across reloads.
  const [overrides, setOverrides] = useState<Record<string, boolean>>({});
  useEffect(() => setOverrides(readExpanded()), []);
  const isGroupOpen = (group: NavGroup): boolean => overrides[group.label] ?? true;

  function toggleGroup(group: NavGroup) {
    setOverrides((prev) => {
      const next = { ...prev, [group.label]: !isGroupOpen(group) };
      try {
        window.localStorage.setItem(EXPANDED_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Non-fatal: persistence is a convenience, not a requirement.
      }
      return next;
    });
  }

  return (
    <div className="flex h-full flex-col">
      <div className={cn("flex items-center gap-2 px-4 py-5", collapsed && "justify-center px-0")}>
        <Link href="/admin" onClick={onNavigate} className="shrink-0" title="AYF Admin">
          <Logo className="size-9" />
        </Link>
        {!collapsed && (
          <div className="flex flex-1 items-center justify-between gap-2 leading-tight">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">AYF Admin</p>
              <p className="truncate text-xs text-ink-muted">Diocese of Egba</p>
            </div>
            {onTogglePin && (
              <button
                type="button"
                className={cn(iconButton, "size-7", pinned && "text-sun hover:text-sun")}
                onClick={onTogglePin}
                title={pinned ? "Unpin sidebar" : "Pin sidebar open"}
              >
                <Pin className={cn("size-4", pinned && "fill-current")} aria-hidden="true" />
                <span className="sr-only">{pinned ? "Unpin sidebar" : "Pin sidebar open"}</span>
              </button>
            )}
          </div>
        )}
      </div>

      <nav
        aria-label="Admin"
        className={cn(
          "flex-1 space-y-1 overflow-y-auto px-3 pb-4",
          collapsed && "overflow-x-hidden px-2"
        )}
      >
        {ADMIN_NAV_SECTIONS.map((section) =>
          isNavGroup(section) ? (
            <SidebarGroup
              key={section.label}
              group={section}
              pathname={pathname}
              open={isGroupOpen(section)}
              onToggle={() => toggleGroup(section)}
              onNavigate={onNavigate}
              collapsed={collapsed}
            />
          ) : (
            <SidebarLink
              key={section.href}
              item={section}
              active={isNavActive(pathname, section.href)}
              onNavigate={onNavigate}
              collapsed={collapsed}
            />
          )
        )}
      </nav>

      <div className={cn("border-t border-line p-3", collapsed && "px-2")}>
        <div
          className={cn(
            "flex items-center gap-2 rounded-md px-1 py-1",
            collapsed && "flex-col gap-2 px-0"
          )}
        >
          <Avatar>{account.initials}</Avatar>
          {!collapsed && (
            <div className="min-w-0 flex-1 leading-tight">
              <p className="truncate text-sm font-medium text-ink">{account.name}</p>
              <p className="truncate text-xs text-ink-muted">{account.label}</p>
            </div>
          )}
          <form action={logout}>
            <button type="submit" className={iconButton} title="Sign out">
              <LogOut className="size-4" aria-hidden="true" />
              <span className="sr-only">Sign out</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export function Sidebar({ account }: { account: AdminAccount }) {
  const { mobileMenuOpen, setMobileMenuOpen, sidebarPinned, loadSidebarPinned, toggleSidebarPin } =
    useUiStore();
  const [hovered, setHovered] = useState(false);
  const expanded = sidebarPinned || hovered;
  const floating = hovered && !sidebarPinned;

  useEffect(loadSidebarPinned, [loadSidebarPinned]);

  return (
    <>
      {/* Desktop: a spacer reserves the layout width (icon rail, or full width when
          pinned), while the panel itself is fixed so it can float over the page on hover. */}
      <div
        aria-hidden
        className={cn(
          "hidden shrink-0 transition-[width] duration-200 ease-in-out md:block",
          sidebarPinned ? "w-64" : "w-16"
        )}
      />
      <aside
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) setHovered(false);
        }}
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden w-16 flex-col border-r border-line bg-surface transition-[width] duration-200 ease-in-out md:flex",
          expanded && "w-64",
          floating && "shadow-lift"
        )}
      >
        <SidebarContent
          account={account}
          collapsed={!expanded}
          pinned={sidebarPinned}
          onTogglePin={toggleSidebarPin}
        />
      </aside>

      {/* Mobile: the same nav in a drawer, opened from the header's menu button. */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className={cn(adminFonts, "p-0")}>
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
          </SheetHeader>
          <SidebarContent account={account} onNavigate={() => setMobileMenuOpen(false)} />
        </SheetContent>
      </Sheet>
    </>
  );
}
