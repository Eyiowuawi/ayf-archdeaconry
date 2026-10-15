"use server";

import { getStore } from "@/lib/db";
import type { Store } from "@/lib/db/store";
import { checkAnswer, isPreset, missingFields } from "@/lib/eventFields";
import { formatDateTime, registrationState } from "@/lib/events";
import { normalizePhone, parseUserCode } from "@/lib/identifiers";
import { parishName } from "@/lib/parishes";
import type { EventField, EventRecord, Registration } from "@/types";

// The public event registration flow: find the member by user code or phone, ask for any
// details the event needs that they have never given, then issue a ticket.
// Every step re-checks the lookup, so knowing a member's id alone is never enough.

export type MemberMatch = { id: string; label: string };
export type LookupResult = { ok: true; matches: MemberMatch[] } | { ok: false; message: string };
export type StartResult =
  | { ok: true; firstName: string; missing: EventField[]; ticketCode?: string }
  | { ok: false; message: string };
export type CompleteResult =
  | { ok: true; ticketCode: string }
  | { ok: false; message?: string; errors?: Record<string, string> };

type Open = { store: Store; event: EventRecord & { registration: NonNullable<EventRecord["registration"]> } };

async function openEvent(slug: string): Promise<Open | string> {
  const store = getStore();
  if (!store) return "Online registration isn't open yet.";
  const event = await store.getEvent(slug);
  if (!event || !event.published) return "This event isn't available.";
  const state = registrationState(event);
  if (state === "none" || !event.registration) return "This event doesn't take registrations.";
  if (state === "upcoming") return `Registration opens ${formatDateTime(event.registration.opensAt)}.`;
  if (state === "closed") return "Registration for this event has closed.";
  return { store, event: event as Open["event"] };
}

async function membersFor(store: Store, query: string): Promise<Registration[]> {
  const code = parseUserCode(query);
  let found: Registration[] = [];
  if (code) found = await store.findMembers({ userCode: code });
  else {
    const phone = normalizePhone(query);
    if (phone.length >= 10) found = await store.findMembers({ phone });
  }
  return found.filter((m) => m.status !== "rejected");
}

async function verified(slug: string, query: string, memberId: string) {
  const open = await openEvent(slug);
  if (typeof open === "string") return open;
  const member = (await membersFor(open.store, query)).find((m) => m.id === memberId);
  if (!member) return "We couldn't find your record. Please look it up again.";
  return { ...open, member };
}

export async function lookupMember(slug: string, query: string): Promise<LookupResult> {
  const open = await openEvent(slug);
  if (typeof open === "string") return { ok: false, message: open };
  const q = String(query ?? "").slice(0, 40);
  const members = await membersFor(open.store, q);
  if (!members.length)
    return { ok: false, message: "We couldn't find that user code or phone number. Check it, or register as a new member." };
  return {
    ok: true,
    // Only enough to tell people sharing a phone apart; never the full record.
    matches: members.map((m) => ({ id: m.id, label: `${m.firstName} ${m.surname.charAt(0)}. · ${parishName(m.parishId)}` })),
  };
}

export async function startRegistration(slug: string, query: string, memberId: string): Promise<StartResult> {
  const v = await verified(slug, String(query ?? ""), String(memberId ?? ""));
  if (typeof v === "string") return { ok: false, message: v };
  const existing = (await v.store.listTickets(slug)).find((t) => t.memberId === v.member.id);
  return {
    ok: true,
    firstName: v.member.firstName,
    missing: missingFields(v.member, v.event.registration.fields),
    ticketCode: existing?.code,
  };
}

export async function completeRegistration(
  slug: string,
  query: string,
  memberId: string,
  answers: Record<string, string>
): Promise<CompleteResult> {
  const v = await verified(slug, String(query ?? ""), String(memberId ?? ""));
  if (typeof v === "string") return { ok: false, message: v };

  const errors: Record<string, string> = {};
  const extra: Record<string, string> = {};
  const details: { email?: string; occupation?: string; extra?: Record<string, string> } = {};
  for (const f of missingFields(v.member, v.event.registration.fields)) {
    const value = typeof answers?.[f.key] === "string" ? answers[f.key].trim().slice(0, 500) : "";
    const problem = checkAnswer(f, value);
    if (problem) errors[f.key] = problem;
    else if (f.key === "email" || f.key === "occupation") details[f.key] = value;
    else if (isPreset(f.key) || f.key.startsWith("q-")) extra[f.key] = value;
  }
  if (Object.keys(errors).length) return { ok: false, errors };

  try {
    if (Object.keys(extra).length) details.extra = extra;
    if (Object.keys(details).length) await v.store.updateMemberDetails(v.member.id, details);
    const ticket = await v.store.issueTicket(slug, v.member.id);
    return { ok: true, ticketCode: ticket.code };
  } catch {
    return { ok: false, message: "Something went wrong saving your registration. Please try again." };
  }
}
