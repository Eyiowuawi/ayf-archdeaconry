import { getRole, storeFor } from "@/features/auth/utils/session";
import { parishName } from "@/shared/data/parishes";
import { ageOn } from "@/features/members/utils/registrations";
import { csvCell } from "@/utils/csv";

export const dynamic = "force-dynamic";

/** Downloads registrations as a CSV file (respects the status filter and search). */
export async function GET(req: Request) {
  const role = await getRole();
  if (!role) return new Response("Not signed in", { status: 401 });
  const store = storeFor(role);
  if (!store) return new Response("No database connected", { status: 503 });

  const url = new URL(req.url);
  const status = url.searchParams.get("status") ?? "all";
  const q = (url.searchParams.get("q") ?? "").toLowerCase().split(/\s+/).filter(Boolean);
  const rows = (await store.listRegistrations())
    .filter((r) => status === "all" || r.status === status)
    .filter((r) => {
      const hay =
        `${r.userCode} ${r.firstName} ${r.surname} ${r.phone} ${r.email} ${parishName(r.parishId)} ${r.archdeaconry}`.toLowerCase();
      return q.every((w) => hay.includes(w));
    })
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  const header = [
    "User code",
    "First name",
    "Surname",
    "Gender",
    "Date of birth",
    "Age",
    "Phone",
    "Email",
    "Level of education",
    "School or occupation",
    "Archdeaconry",
    "Parish",
    "Guardian name",
    "Guardian phone",
    "Status",
    "Registered",
  ];
  const lines = rows.map((r) =>
    [
      r.userCode,
      r.firstName,
      r.surname,
      r.gender,
      r.dateOfBirth,
      ageOn(r.dateOfBirth) ?? "",
      r.phone,
      r.email,
      r.educationLevel,
      r.occupation,
      r.archdeaconry,
      parishName(r.parishId),
      r.guardianName,
      r.guardianPhone,
      r.status,
      r.createdAt,
    ]
      .map(csvCell)
      .join(",")
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
