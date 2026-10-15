import Link from "next/link";
import { Empty, NoDatabase, PageTitle } from "@/shared/ui/states";
import { Badge } from "@/shared/ui/badge";
import { Card } from "@/shared/ui/card";
import { upcomingEvents } from "@/features/events/utils/events";
import { adminStore } from "@/features/auth/utils/session";
import { parishName } from "@/shared/data/parishes";
import {
  loadRepresentatives,
  type RepSummary,
} from "@/features/representatives/services/representatives";

function RepsPanel({ reps }: { reps: RepSummary }) {
  const pct = reps.total ? Math.round((reps.filled / reps.total) * 100) : 0;
  const behind = [...reps.byArchdeaconry]
    .sort((a, b) => a.filled / a.total - b.filled / b.total)
    .slice(0, 5);
  return (
    <section className="mb-10">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-display text-xl font-extrabold">Parish representatives</h2>
        <Link href="/admin/representatives" className="text-sm font-bold">
          See the full list →
        </Link>
      </div>
      <Card>
        {reps.error ? (
          <p className="text-sm text-danger">Couldn&apos;t load the list: {reps.error}</p>
        ) : (
          <>
            <p className="font-display text-3xl font-extrabold tabular-nums">
              {reps.filled}{" "}
              <span className="text-lg text-ink-muted">
                of {reps.total} parishes have sent their reps
              </span>
            </p>
            <div
              className="mt-3 h-2.5 overflow-hidden rounded-full bg-surface-muted"
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Parishes submitted"
            >
              <div
                className="h-full rounded-full bg-linear-to-r from-primary to-accent"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="mb-2 mt-5 text-xs font-bold uppercase tracking-wider text-ink-muted">
              Archdeaconries furthest behind
            </p>
            <ul className="grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
              {behind.map((a) => (
                <li key={a.name} className="flex justify-between gap-3">
                  <Link
                    href={`/admin/representatives?show=missing&arch=${encodeURIComponent(a.name)}`}
                    className="truncate text-ink no-underline hover:text-primary"
                  >
                    {a.name}
                  </Link>
                  <span className="shrink-0 tabular-nums text-ink-muted">
                    {a.filled}/{a.total}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </Card>
    </section>
  );
}

export async function DashboardPage() {
  const store = await adminStore(); // checks sign-in first
  const reps = await loadRepresentatives();
  if (!store) {
    return (
      <>
        <PageTitle>Welcome</PageTitle>
        <RepsPanel reps={reps} />
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
    {
      label: "Waiting for review",
      value: pending.length,
      href: "/admin/registrations?status=pending",
    },
    {
      label: "Approved members",
      value: regs.filter((r) => r.status === "approved").length,
      href: "/admin/registrations?status=approved",
    },
    {
      label: "Upcoming events",
      value: upcomingEvents(events.filter((e) => e.published)).length,
      href: "/admin/events",
    },
    {
      label: "Devotionals",
      value: devotionals.filter((d) => d.published).length,
      href: "/admin/devotionals",
    },
  ];
  const recent = [...regs].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);

  return (
    <>
      <PageTitle>Dashboard</PageTitle>
      <div className="mb-10 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-card border border-line bg-surface p-5 text-ink no-underline shadow-card transition hover:border-primary/40"
          >
            <p className="font-display text-4xl font-extrabold tabular-nums">{s.value}</p>
            <p className="mt-1 text-sm font-semibold text-ink-muted">{s.label}</p>
          </Link>
        ))}
      </div>
      <RepsPanel reps={reps} />
      <h2 className="mb-3 font-display text-xl font-extrabold">Latest registrations</h2>
      {recent.length ? (
        <Card className="divide-y divide-line p-0">
          {recent.map((r) => (
            <div
              key={r.id}
              className="flex flex-wrap items-center justify-between gap-2 px-5 py-3.5"
            >
              <div>
                <p className="font-bold">
                  {r.firstName} {r.surname}
                </p>
                <p className="text-sm text-ink-muted">
                  {parishName(r.parishId)} · {r.archdeaconry}
                </p>
              </div>
              <Badge
                className="capitalize"
                variant={
                  r.status === "approved"
                    ? "success"
                    : r.status === "rejected"
                      ? "danger"
                      : "warning"
                }
              >
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
