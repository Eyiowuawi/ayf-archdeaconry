import { ExternalLink, LogOut } from "lucide-react";
import Link from "next/link";
import { logout } from "@/app/admin/actions";
import AdminNav from "@/components/admin/AdminNav";
import Logo from "@/components/site/Logo";
import ThemeToggle from "@/components/site/ThemeToggle";
import { requireAdmin } from "@/lib/admin-auth";
import { getStore } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  const store = getStore();
  return (
    <div className="lg:grid lg:min-h-dvh lg:grid-cols-[15rem_1fr]">
      <aside className="border-b border-line bg-surface px-4 py-3 lg:sticky lg:top-0 lg:h-dvh lg:border-b-0 lg:border-r lg:py-6">
        <div className="mb-3 flex items-center justify-between gap-2 lg:mb-8">
          <Link href="/admin" className="flex items-center gap-2.5 text-ink no-underline">
            <Logo className="size-9" />
            <span className="leading-none">
              <span className="block font-display text-lg font-extrabold">AYF Admin</span>
              <span className="text-[0.7rem] font-semibold text-ink-muted">Diocese of Egba</span>
            </span>
          </Link>
          <ThemeToggle />
        </div>
        <AdminNav />
        <div className="mt-3 flex gap-1 text-sm lg:absolute lg:inset-x-4 lg:bottom-6 lg:flex-col">
          <Link href="/" target="_blank" className="flex items-center gap-2.5 rounded-xl px-3 py-2 font-semibold text-ink-muted no-underline hover:bg-surface-muted hover:text-ink">
            <ExternalLink className="size-4" aria-hidden="true" /> View website
          </Link>
          <form action={logout}>
            <button type="submit" className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 font-semibold text-ink-muted hover:bg-surface-muted hover:text-ink">
              <LogOut className="size-4" aria-hidden="true" /> Sign out
            </button>
          </form>
        </div>
      </aside>
      <main className="px-4 py-6 sm:px-8 sm:py-10">
        {store && !store.live && (
          <p className="mb-6 rounded-xl border border-sun/60 bg-sun/15 px-4 py-2.5 text-sm">
            <b>{store.label}:</b> changes here are for testing and don&apos;t reach the live website.
          </p>
        )}
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
