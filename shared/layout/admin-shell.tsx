import { requireAdmin, storeFor } from "@/features/auth/utils/session";
import { accountFor } from "@/features/auth/utils/account";
import { Header } from "@/shared/layout/header";
import { Sidebar } from "@/shared/layout/sidebar";

// The admin layout, after plug-admin-dashboard's app/(dashboard)/layout.tsx: a full-height
// row with the sidebar, then the sticky header over a scrolling main area.
export async function AdminShell({ children }: { children: React.ReactNode }) {
  const role = await requireAdmin();
  const store = storeFor(role);
  const account = accountFor(role);
  const notice =
    role === "demo" ? (
      <>
        <b>Demo account:</b> you&apos;re looking at sample people and content. Changes reset from
        time to time and never reach the website. Parish representatives are the real list.
      </>
    ) : store && !store.live ? (
      <>
        <b>{store.label}:</b> changes here are for testing and don&apos;t reach the live website.
      </>
    ) : null;

  return (
    <div className="flex h-dvh overflow-hidden bg-canvas">
      <Sidebar account={account} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header account={account} />
        <main className="flex-1 overflow-y-auto">
          {notice && (
            <p className="border-b border-sun/50 bg-sun/15 px-4 py-2.5 text-sm md:px-6">{notice}</p>
          )}
          <div className="px-4 py-6 md:px-6 md:py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
