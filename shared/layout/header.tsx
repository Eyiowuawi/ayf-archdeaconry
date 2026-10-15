"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { ExternalLink, LogOut, Menu } from "lucide-react";
import { useUiStore } from "@/shared/store/ui-store";
import { logout } from "@/features/auth/services/auth-actions";
import type { AdminAccount } from "@/features/auth/utils/account";
import { Avatar } from "@/shared/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Breadcrumbs } from "@/shared/layout/breadcrumbs";
import { getBreadcrumbItems } from "@/shared/layout/nav-config";
import { ThemeToggle } from "@/shared/layout/theme-toggle";

export function Header({ account }: { account: AdminAccount }) {
  const pathname = usePathname();
  const setMobileMenuOpen = useUiStore((s) => s.setMobileMenuOpen);
  const breadcrumbOverrides = useUiStore((s) => s.breadcrumbOverrides);
  const breadcrumbItems = React.useMemo(
    () => getBreadcrumbItems(pathname, breadcrumbOverrides),
    [pathname, breadcrumbOverrides]
  );
  const signOutForm = React.useRef<HTMLFormElement>(null);

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-line bg-surface px-4 md:px-6">
      <button
        type="button"
        className="grid size-9 cursor-pointer place-items-center rounded-md text-ink hover:bg-surface-muted md:hidden"
        onClick={() => setMobileMenuOpen(true)}
      >
        <Menu className="size-5" aria-hidden="true" />
        <span className="sr-only">Open navigation</span>
      </button>

      <div className="min-w-0 flex-1">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      <ThemeToggle />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex cursor-pointer items-center gap-2 rounded-full py-1 pl-1 pr-2 transition-colors hover:bg-surface-muted"
          >
            <Avatar>{account.initials}</Avatar>
            <span className="hidden flex-col items-start leading-tight sm:flex">
              <span className="text-sm font-medium text-ink">{account.name}</span>
              <span className="text-xs text-ink-muted">{account.label}</span>
            </span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-60">
          <DropdownMenuLabel>
            <p className="text-sm font-medium leading-none">{account.name}</p>
            <p className="mt-1 text-xs leading-none text-ink-muted">{account.label}</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <a href="/" target="_blank" rel="noreferrer">
              <ExternalLink aria-hidden="true" />
              View website
            </a>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => signOutForm.current?.requestSubmit()}
            className="text-danger"
          >
            <LogOut aria-hidden="true" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <form ref={signOutForm} action={logout} hidden />
    </header>
  );
}
