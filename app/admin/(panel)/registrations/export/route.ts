import { isAdmin } from "@/lib/admin-auth";
import { getStore } from "@/lib/db";
import { parishName } from "@/lib/parishes";
import { ageOn } from "@/lib/registrations";

export const dynamic = "force-dynamic";

function csvCell(v: unknown): string {
  let s = String(v ?? "");
  if (/^[=+\-@]/.test(s)) s = `'${s}`; // stop spreadsheets treating text as a formula
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** Downloads registrations as a CSV file (respects the status filter and search). */
export async function GET(req: Request) {
  if (!(await isAdmin())) return new Response("Not signed in", { status: 401 });
  const store = getStore();
  if (!store) return new Response("No database connected", { status: 503 });

  const url = new URL(req.url);
  const status = url.searchParams.get("status") ?? "all";
  const q = (url.searchParams.get("q") ?? "").toLowerCase().split(/\s+/).filter(Boolean);
  const rows = (await store.listRegistrations())
    .filter((r) => status === "all" || r.status === status)
    .filter((r) => {
      const hay = `${r.firstName} ${r.surname} ${r.phone} ${r.email} ${parishName(r.parishId)} ${r.archdeaconry}`.toLowerCase();
      return q.every((w) => hay.includes(w));
    })
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  const header = [
    "First name", "Surname", "Gender", "Date of birth", "Age", "Phone", "Email", "Level of education",
    "School or occupation", "Archdeaconry", "Parish", "Guardian name", "Guardian phone", "Status", "Registered",
  ];
  const lines = rows.map((r) =>
    [
      r.firstName, r.surname, r.gender, r.dateOfBirth, ageOn(r.dateOfBirth) ?? "", r.phone, r.email, r.educationLevel,
      r.occupation, r.archdeaconry, parishName(r.parishId), r.guardianName, r.guardianPhone, r.status, r.createdAt,
    ].map(csvCell).join(",")
  );
  const body = "﻿" + [header.join(","), ...lines].join("\r\n");
  const date = new Date().toISOString().slice(0, 10);
  return new Response(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="ayf-registrations-${status}-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
