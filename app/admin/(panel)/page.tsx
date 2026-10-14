import Link from "next/link";
import { Empty, NoDatabase, PageTitle } from "@/components/admin/Parts";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { upcomingEvents } from "@/lib/content/events";
import { adminStore } from "@/lib/admin-auth";
import type { RegistrationStatus } from "@/lib/db";
import { parishName } from "@/lib/parishes";

export const metadata = { title: "Dashboard" };

export default async function Dashboard() {
  const store = await adminStore();
  if (!store) {
    return (
      <>
        <PageTitle>Welcome</PageTitle>
        <NoDatabase />
      </>
    );
  }
  const [regs, events, devotionals] = await Promise.all([
    store.listRegistrations(),
    store.listEvents(),
    store.listDevotionals(),
  ]);
  const pending = regs.filter((r) => r.status === "pending");
  const stats = [
    { label: "Waiting for review", value: pending.length, href: "/admin/registrations?status=pending" },
    { label: "Approved members", value: regs.filter((r) => r.status === "approved").length, href: "/admin/registrations?status=approved" },
    { label: "Upcoming events", value: upcomingEvents(events.filter((e) => e.published)).length, href: "/admin/events" },
    { label: "Devotionals", value: devotionals.filter((d) => d.published).length, href: "/admin/devotionals" },
  ];
  const recent = [...regs].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);

  return (
    <>
      <PageTitle>Dashboard</PageTitle>
      <div className="mb-10 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="rounded-card border border-line bg-surface p-5 text-ink no-underline shadow-card transition hover:border-primary/40">
            <p className="font-display text-4xl font-extrabold tabular-nums">{s.value}</p>
            <p className="mt-1 text-sm font-semibold text-ink-muted">{s.label}</p>
          </Link>
        ))}
      </div>
      <h2 className="mb-3 font-display text-xl font-extrabold">Latest registrations</h2>
      {recent.length ? (
        <Card className="divide-y divide-line p-0">
          {recent.map((r) => (
            <div key={r.id} className="flex flex-wrap items-center justify-between gap-2 px-5 py-3.5">
              <div>
                <p className="font-bold">{r.firstName} {r.surname}</p>
                <p className="text-sm text-ink-muted">{parishName(r.parishId)} · {r.archdeaconry}</p>
              </div>
              <Badge variant={r.status === "approved" ? "success" : r.status === "rejected" ? "danger" : "warning"}>
                {r.status}
              </Badge>
            </div>
          ))}
        </Card>
      ) : (
        <Empty>No one has registered yet. New sign-ups from the Join page appear here.</Empty>
      )}
    </>
  );
}
