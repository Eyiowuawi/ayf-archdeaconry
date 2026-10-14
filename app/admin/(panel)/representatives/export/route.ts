import { getRole } from "@/lib/admin-auth";
import { loadRepresentatives, repPeople } from "@/lib/representatives";

export const dynamic = "force-dynamic";

function csvCell(v: unknown): string {
  let s = String(v ?? "");
  if (/^[=+\-@]/.test(s)) s = `'${s}`; // stop spreadsheets treating text as a formula
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** Downloads the parish representatives list as CSV, one row per person (respects the filters). */
export async function GET(req: Request) {
  if (!(await getRole())) return new Response("Not signed in", { status: 401 });
  const url = new URL(req.url);
  const show = url.searchParams.get("show") ?? "all";
  const arch = url.searchParams.get("arch") ?? "";
  const q = (url.searchParams.get("q") ?? "").toLowerCase().split(/\s+/).filter(Boolean);
  const reps = await loadRepresentatives();
  if (reps.error) return new Response(reps.error, { status: 502 });

  const lines = [["Archdeaconry", "Parish", "Role", "Name", "Phone", "Sent by", "Updated"].join(",")];
  for (const r of reps.rows) {
    if (show === "filled" && !r.entry) continue;
    if (show === "missing" && r.entry) continue;
    if (arch && r.archdeaconry !== arch) continue;
    const people = r.entry ? repPeople(r.entry) : [];
    const hay = `${r.parish} ${r.archdeaconry} ${people.map((p) => `${p.person.name} ${p.person.phone}`).join(" ")}`.toLowerCase();
    if (!q.every((w) => hay.includes(w))) continue;
    if (!people.length) lines.push([r.archdeaconry, r.parish, "", "", "", "", ""].map(csvCell).join(","));
    for (const { role, person } of people)
      lines.push([r.archdeaconry, r.parish, role, person.name, person.phone, r.entry?.filledBy, r.entry?.updatedAt].map(csvCell).join(","));
  }
  const date = new Date().toISOString().slice(0, 10);
  return new Response("﻿" + lines.join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="ayf-parish-representatives-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
