"use client";

import { create } from "zustand";

const SIDEBAR_PINNED_KEY = "ayf-sidebar-pinned";

function readSidebarPinned(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(SIDEBAR_PINNED_KEY) === "true";
  } catch {
    return false;
  }
}

function writeSidebarPinned(pinned: boolean): void {
  try {
    window.localStorage.setItem(SIDEBAR_PINNED_KEY, String(pinned));
  } catch {
    // Non-fatal: persistence is a convenience, not a requirement.
  }
}

interface UiState {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  /**
   * The desktop sidebar starts icon-only and expands on hover. Pinning keeps it
   * expanded; the choice is toggled from within the sidebar and kept across reloads.
   */
  sidebarPinned: boolean;
  /** Reads the saved pin after hydration, so the server and first client render agree. */
  loadSidebarPinned: () => void;
  toggleSidebarPin: () => void;
  /**
   * Detail pages (an event, a devotional) register their record's title here, keyed
   * by pathname, so the breadcrumb trail shows it instead of the raw URL slug.
   */
  breadcrumbOverrides: Record<string, string>;
  setBreadcrumbOverride: (path: string, label: string | undefined) => void;
}

export const useUiStore = create<UiState>((set, get) => ({
  mobileMenuOpen: false,
  setMobileMenuOpen: (mobileMenuOpen) => set({ mobileMenuOpen }),
  sidebarPinned: false,
  loadSidebarPinned: () => set({ sidebarPinned: readSidebarPinned() }),
  toggleSidebarPin: () => {
    const next = !get().sidebarPinned;
    writeSidebarPinned(next);
    set({ sidebarPinned: next });
  },
  breadcrumbOverrides: {},
  setBreadcrumbOverride: (path, label) => {
    const current = get().breadcrumbOverrides;
    if (label === undefined) {
      if (!(path in current)) return;
      const next = { ...current };
      delete next[path];
      set({ breadcrumbOverrides: next });
    } else if (current[path] !== label) {
      set({ breadcrumbOverrides: { ...current, [path]: label } });
    }
  },
}));
