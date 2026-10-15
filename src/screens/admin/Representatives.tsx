import { Download } from "lucide-react";
import Link from "next/link";
import { Empty, PageTitle } from "@/design-system/States";
import { Badge } from "@/design-system/StatusPill";
import { Button } from "@/design-system/Button";
import { Input } from "@/design-system/Input";
import { requireAdmin } from "@/lib/adminAuth";
import { cn } from "@/lib/cn";
import { loadRepresentatives, repPeople, type RepRow } from "@/lib/representatives";

export const metadata = { title: "Parish representatives" };

const TABS = [
  { key: "all", label: "All parishes" },
  { key: "filled", label: "Submitted" },
  { key: "missing", label: "Not yet" },
] as const;

type Props = { searchParams: Promise<{ show?: string; q?: string; arch?: string }> };

function matches(r: RepRow, q: string) {
  const people = r.entry ? repPeople(r.entry).map((p) => `${p.person.name} ${p.person.phone}`).join(" ") : "";
  const hay = `${r.parish} ${r.archdeaconry} ${people}`.toLowerCase();
  return q.toLowerCase().split(/\s+/).every((w) => hay.includes(w));
}

export async function Representatives({ searchParams }: Props) {
  await requireAdmin();
  const sp = await searchParams;
  const show = TABS.some((t) => t.key === sp.show) ? sp.show! : "all";
  const q = (sp.q ?? "").trim();
  const arch = sp.arch ?? "";
  const reps = await loadRepresentatives();
  const rows = reps.rows.filter(
    (r) =>
      (show === "all" || (show === "filled" ? r.entry : !r.entry)) &&
      (!arch || r.archdeaconry === arch) &&
      (!q || matches(r, q))
  );
  const qs = (next: Record<string, string>) =>
    "?" + new URLSearchParams(Object.entries({ show, q, arch, ...next }).filter(([, v]) => v)).toString();
  const pct = reps.total ? Math.round((reps.filled / reps.total) * 100) : 0;

  return (
    <>
      <PageTitle>Parish representatives</PageTitle>
      {reps.error && (
        <p role="alert" className="mb-5 rounded-xl border border-danger-line bg-danger-soft px-4 py-3 text-sm text-danger">
          Couldn&apos;t load the list: {reps.error}
        </p>
      )}
      <div className="mb-6 rounded-card border border-line bg-surface p-5 shadow-card">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="font-display text-2xl font-extrabold">
            {reps.filled} <span className="text-ink-muted">of {reps.total} parishes</span>
          </p>
          <p className="text-sm text-ink-muted">
            have sent their representatives · <Link href="/representatives" target="_blank">open the public form</Link>
          </p>
        </div>
        <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-surface-muted" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Parishes submitted">
          <div className="h-full rounded-full bg-linear-to-r from-primary to-accent" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <nav aria-label="Filter" className="flex flex-wrap gap-1 rounded-full bg-surface-muted p-1">
          {TABS.map((t) => (
            <Link
              key={t.key}
              href={qs({ show: t.key })}
              aria-current={show === t.key ? "page" : undefined}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-sm font-bold no-underline",
                show === t.key ? "bg-surface text-ink shadow-card" : "text-ink-muted hover:text-ink"
              )}
            >
              {t.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-wrap gap-2">
          <form className="flex flex-wrap gap-2" role="search">
            <input type="hidden" name="show" value={show} />
            <select
              name="arch"
              defaultValue={arch}
              aria-label="Archdeaconry"
              className="rounded-xl border-2 border-line bg-surface px-3 py-2 text-sm text-ink"
            >
              <option value="">All archdeaconries</option>
              {reps.byArchdeaconry.map((a) => (
                <option key={a.name} value={a.name}>{a.name} ({a.filled}/{a.total})</option>
              ))}
            </select>
            <Input name="q" defaultValue={q} placeholder="Search parish or name" aria-label="Search" className="w-48 py-2 text-sm" />
            <Button type="submit" size="sm" variant="secondary">Filter</Button>
          </form>
          <Button asChild size="sm" variant="secondary">
            <a href={`/admin/representatives/export${qs({})}`} download><Download aria-hidden="true" /> Export CSV</a>
          </Button>
        </div>
      </div>

      {rows.length ? (
        <div className="relative overflow-x-auto rounded-card border border-line bg-surface shadow-card">
          <table className="w-full min-w-[44rem] text-left text-sm">
            <thead className="border-b border-line bg-surface-muted text-xs uppercase tracking-wider text-ink-muted">
              <tr>
                <th scope="col" className="px-4 py-3">Parish</th>
                <th scope="col" className="px-4 py-3">Representatives</th>
                <th scope="col" className="px-4 py-3">Sent by</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((r) => (
                <tr key={r.parishId} className="align-top">
                  <td className="px-4 py-3">
                    <p className="font-bold">{r.parish}</p>
                    <p className="text-ink-muted">{r.archdeaconry}</p>
                  </td>
                  <td className="px-4 py-3">
                    {r.entry ? (
                      <ul className="space-y-1">
                        {repPeople(r.entry).map(({ role, person }) => (
                          <li key={role}>
                            <span className="text-ink-muted">{role}:</span> {person.name},{" "}
                            <a href={`tel:${person.phone.replace(/\s/g, "")}`}>{person.phone}</a>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <Badge variant="warning">Not yet</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 text-ink-muted">
                    {r.entry && (
                      <>
                        {r.entry.filledBy || "—"}
                        <p>{new Date(r.entry.updatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Empty>No parishes match.</Empty>
      )}
    </>
  );
}
