import { getRole, storeFor } from "@/features/auth/utils/session";
import { csvResponse } from "@/utils/csv";
import { formatTicketCode } from "@/utils/identifiers";
import { parishName } from "@/shared/data/parishes";

export const dynamic = "force-dynamic";

/** Downloads an event's registered attendees as CSV, including their answers to the event's questions. */
export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const role = await getRole();
  if (!role) return new Response("Not signed in", { status: 401 });
  const store = storeFor(role);
  if (!store) return new Response("No database connected", { status: 503 });
  const { slug } = await params;
  const event = await store.getEvent(slug);
  if (!event) return new Response("Not found", { status: 404 });

  const fields = event.registration?.fields ?? [];
  const members = new Map((await store.listRegistrations()).map((m) => [m.id, m]));
  const rows = (await store.listTickets(slug))
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    .map((t) => {
      const m = members.get(t.memberId);
      const answer = (key: string) =>
        (key === "email" ? m?.email : key === "occupation" ? m?.occupation : m?.extra?.[key]) ?? "";
      return [
        formatTicketCode(t.code),
        m?.userCode,
        m?.firstName,
        m?.surname,
        m?.phone,
        m ? parishName(m.parishId) : "",
        m?.archdeaconry,
        ...fields.map((f) => answer(f.key)),
        t.createdAt,
        t.checkedInAt ?? "",
      ];
    });
  const header = [
    "Ticket",
    "User code",
    "First name",
    "Surname",
    "Phone",
    "Parish",
    "Archdeaconry",
    ...fields.map((f) => f.label),
    "Registered",
    "Checked in",
  ];
  return csvResponse(`${slug}-attendees.csv`, header, rows);
}
