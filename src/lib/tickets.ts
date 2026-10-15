import "server-only";
import { headers } from "next/headers";
import QRCode from "qrcode";
import { getStore } from "@/lib/db";
import { demoStore } from "@/lib/db/demoStore";
import { parseTicketCode } from "@/lib/identifiers";
import type { EventRecord, Registration, Ticket } from "@/types";

export type TicketView = { ticket: Ticket; event: EventRecord; member: Registration; demo: boolean };

/** A ticket with its event and member, from the live store or (for sample tickets) the demo account. */
export async function findTicket(raw: string): Promise<TicketView | null> {
  const code = parseTicketCode(raw);
  if (!code) return null;
  const real = getStore();
  for (const store of real ? [real, demoStore] : [demoStore]) {
    const ticket = await store.getTicket(code);
    if (!ticket) continue;
    const [event, member] = await Promise.all([store.getEvent(ticket.eventSlug), store.getMember(ticket.memberId)]);
    if (event && member) return { ticket, event, member, demo: store === demoStore };
  }
  return null;
}

/** The ticket's public link, which is also what its QR code carries. */
export async function ticketUrl(code: string): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}/tickets/${code}`;
}

export async function qrSvg(text: string): Promise<string> {
  return QRCode.toString(text, { type: "svg", margin: 1, errorCorrectionLevel: "M", color: { dark: "#0b0a2e", light: "#ffffff" } });
}
