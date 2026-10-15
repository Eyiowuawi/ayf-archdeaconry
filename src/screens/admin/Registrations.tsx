import { Download } from "lucide-react";
import Link from "next/link";
import { deleteRegistration, setRegistrationStatus } from "@/lib/actions/admin";
import { ConfirmButton } from "@/design-system/ConfirmButton";
import { Empty, NoDatabase, PageTitle } from "@/design-system/States";
import { Badge } from "@/design-system/StatusPill";
import { Button } from "@/design-system/Button";
import { Input } from "@/design-system/Input";
import { adminStore } from "@/lib/adminAuth";
import type { RegistrationStatus } from "@/lib/db";
import { parishName } from "@/lib/parishes";
import { ageOn, type Registration } from "@/lib/registrations";
import { cn } from "@/lib/cn";

export const metadata = { title: "Registrations" };

const TABS: { key: RegistrationStatus | "all"; label: string }[] = [
  { key: "pending", label: "Waiting" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
  { key: "all", label: "All" },
];

type Props = { searchParams: Promise<{ status?: string; q?: string }> };

function matches(r: Registration, q: string) {
  const hay = `${r.firstName} ${r.surname} ${r.phone} ${r.email} ${parishName(r.parishId)} ${r.archdeaconry}`.toLowerCase();
  return q.toLowerCase().split(/\s+/).every((w) => hay.includes(w));
}

function StatusForm({ id, status, label }: { id: string; status: RegistrationStatus; label: string }) {
  return (
    <form action={setRegistrationStatus}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value={status} />
      <Button type="submit" size="sm" variant={status === "approved" ? "primary" : "secondary"}>{label}</Button>
    </form>
  );
}

export async function Registrations({ searchParams }: Props) {
  const store = await adminStore();
  if (!store) return (<><PageTitle>Registrations</PageTitle><NoDatabase /></>);
  const sp = await searchParams;
  const tab = TABS.some((t) => t.key === sp.status) ? (sp.status as RegistrationStatus | "all") : "pending";
  const q = (sp.q ?? "").trim();
  const all = (await store.listRegistrations()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const counts = Object.fromEntries(TABS.map((t) => [t.key, t.key === "all" ? all.length : all.filter((r) => r.status === t.key).length]));
  const rows = all.filter((r) => (tab === "all" || r.status === tab) && (!q || matches(r, q)));
  const exportHref = `/admin/registrations/export?status=${tab}${q ? `&q=${encodeURIComponent(q)}` : ""}`;

  return (
    <>
      <PageTitle>Registrations</PageTitle>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <nav aria-label="Filter by status" className="flex flex-wrap gap-1 rounded-full bg-surface-muted p-1">
          {TABS.map((t) => (
            <Link
              key={t.key}
              href={`/admin/registrations?status=${t.key}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
              aria-current={tab === t.key ? "page" : undefined}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-sm font-bold no-underline",
                tab === t.key ? "bg-surface text-ink shadow-card" : "text-ink-muted hover:text-ink"
              )}
            >
              {t.label} <span className="tabular-nums text-ink-muted">{counts[t.key]}</span>
            </Link>
          ))}
        </nav>
        <div className="flex flex-wrap gap-2">
          <form className="flex gap-2" role="search">
            <input type="hidden" name="status" value={tab} />
            <Input name="q" defaultValue={q} placeholder="Search name, phone, parish" aria-label="Search registrations" className="w-56 py-2 text-sm" />
          </form>
          <Button asChild size="sm" variant="secondary">
            <a href={exportHref} download><Download aria-hidden="true" /> Export CSV</a>
          </Button>
        </div>
      </div>

      {rows.length ? (
        <div className="relative overflow-x-auto rounded-card border border-line bg-surface shadow-card">
          <table className="w-full min-w-[56rem] text-left text-sm">
            <thead className="border-b border-line bg-surface-muted text-xs uppercase tracking-wider text-ink-muted">
              <tr>
                <th scope="col" className="px-4 py-3">Name</th>
                <th scope="col" className="px-4 py-3">Parish</th>
                <th scope="col" className="px-4 py-3">Age</th>
                <th scope="col" className="px-4 py-3">Education</th>
                <th scope="col" className="px-4 py-3">Contact</th>
                <th scope="col" className="px-4 py-3">Status</th>
                <th scope="col" className="px-4 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((r) => {
                const age = ageOn(r.dateOfBirth);
                return (
                  <tr key={r.id} className="align-top">
                    <td className="px-4 py-3">
                      <p className="font-bold">{r.firstName} {r.surname}</p>
                      <p className="text-ink-muted">{r.gender} · joined {new Date(r.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p>{parishName(r.parishId)}</p>
                      <p className="text-ink-muted">{r.archdeaconry}</p>
                    </td>
                    <td className="px-4 py-3 tabular-nums">
                      {age ?? "—"}
                      {age !== null && age < 18 && (
                        <p className="text-ink-muted">Guardian: {r.guardianName}, {r.guardianPhone}</p>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {r.educationLevel}
                      {r.occupation && <p className="text-ink-muted">{r.occupation}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <a href={`tel:${r.phone.replace(/\s/g, "")}`}>{r.phone}</a>
                      {r.email && <p className="text-ink-muted">{r.email}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <Badge className="capitalize" variant={r.status === "approved" ? "success" : r.status === "rejected" ? "danger" : "warning"}>{r.status}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1.5">
                        {r.status !== "approved" && <StatusForm id={r.id} status="approved" label="Approve" />}
                        {r.status !== "rejected" && <StatusForm id={r.id} status="rejected" label="Reject" />}
                        <form action={deleteRegistration}>
                          <input type="hidden" name="id" value={r.id} />
                          <ConfirmButton size="sm" variant="secondary" message={`Delete ${r.firstName} ${r.surname}'s registration? This can't be undone.`}>Delete</ConfirmButton>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <Empty>{q ? "No registrations match that search." : "Nothing here yet."}</Empty>
      )}
    </>
  );
}
