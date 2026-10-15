"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkCredentials, endSession, requireAdmin, startSession, storeFor } from "@/lib/adminAuth";
import { PRESET_FIELDS, parseCustomQuestions } from "@/lib/eventFields";
import { EVENT_LEVELS, fromLagosInput } from "@/lib/events";
import { parseTicketCode } from "@/lib/identifiers";
import { parishName } from "@/lib/parishes";
import type { EventField, EventItem, EventLevel, RegistrationStatus, Speaker } from "@/types";

export type FormState = { error?: string };

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function text(form: FormData, key: string): string {
  const v = form.get(key);
  return typeof v === "string" ? v.trim() : "";
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
}

/** The signed-in user's store (sample data for the demo account). Redirects if not signed in. */
async function sessionStore() {
  const store = storeFor(await requireAdmin());
  if (!store) throw new Error("No database is connected yet, so changes can't be saved.");
  return store;
}

/** Refresh the public pages after content changes. */
function refreshSite() {
  revalidatePath("/", "layout");
}

// ---- Sign in ----

export async function login(_: FormState, form: FormData): Promise<FormState> {
  const role = checkCredentials(text(form, "email"), typeof form.get("password") === "string" ? (form.get("password") as string) : "");
  if (!role) {
    await new Promise((r) => setTimeout(r, 800)); // slow down guessing
    return { error: "That email or password isn't right." };
  }
  await startSession(role);
  redirect("/admin");
}

export async function logout() {
  await endSession();
  redirect("/admin/login");
}

// ---- Events ----

const TIME = /^\d{2}:\d{2}$/;
const FLIER_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
const MAX_FLIER_BYTES = 4 * 1024 * 1024;

/** "Name — Role" (or "Name - Role", "Name, Role") per line. */
function parseSpeakers(raw: string): Speaker[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 20)
    .map((line) => {
      const [name, ...role] = line.split(/\s+[—–-]\s+|,\s*/);
      return role.length ? { name: name.trim(), role: role.join(", ").trim() } : { name: name.trim() };
    });
}

export async function saveEvent(_: FormState, form: FormData): Promise<FormState> {
  await requireAdmin(); // before reading anything, so a signed-out visitor is redirected
  const original = text(form, "originalSlug");
  const event: EventItem = {
    slug: original,
    title: text(form, "title"),
    date: text(form, "date"),
    endDate: text(form, "endDate") || undefined,
    startTime: text(form, "startTime") || undefined,
    endTime: text(form, "endTime") || undefined,
    venue: text(form, "venue"),
    level: text(form, "level") as EventLevel,
    summary: text(form, "summary"),
    description: text(form, "description") || undefined,
    speakers: parseSpeakers(text(form, "speakers")),
  };
  if (!event.speakers?.length) delete event.speakers;
  if (event.endDate === event.date) delete event.endDate;

  if (!event.title) return { error: "Give the event a title." };
  if (!ISO_DATE.test(event.date)) return { error: "Choose the event date." };
  if (event.endDate && (!ISO_DATE.test(event.endDate) || event.endDate < event.date))
    return { error: "The last day must be after the first day." };
  if (event.startTime && !TIME.test(event.startTime)) return { error: "Check the start time." };
  if (event.endTime && (!TIME.test(event.endTime) || !event.startTime))
    return { error: "Add a start time before the end time." };
  if (event.startTime && event.endTime && event.endTime <= event.startTime)
    return { error: "The end time must be after the start time." };
  if (!event.venue) return { error: "Add a venue (or “Venue to be announced”)." };
  if (!EVENT_LEVELS.includes(event.level)) return { error: "Choose who the event is for." };
  if (!event.summary) return { error: "Add a short summary." };

  if (form.get("takesRegistration") === "on") {
    const opensAt = fromLagosInput(text(form, "opensAt"));
    const closesAt = fromLagosInput(text(form, "closesAt"));
    if (!opensAt || !closesAt) return { error: "Set when registration opens and closes." };
    if (Date.parse(closesAt) <= Date.parse(opensAt)) return { error: "Registration must close after it opens." };
    const picked = new Set(form.getAll("fields").map(String));
    const fields: EventField[] = [
      ...PRESET_FIELDS.filter((f) => picked.has(f.key)),
      ...parseCustomQuestions(text(form, "questions")),
    ];
    event.registration = { opensAt, closesAt, fields };
  }

  const flier = form.get("flier");
  const newFlier = flier instanceof File && flier.size > 0 ? flier : null;
  if (newFlier) {
    if (!FLIER_TYPES.includes(newFlier.type)) return { error: "The flier must be a JPG, PNG, WebP image or a PDF." };
    if (newFlier.size > MAX_FLIER_BYTES) return { error: "The flier is too large. Keep it under 4 MB." };
  }

  try {
    const store = await sessionStore();
    const existing = original ? await store.getEvent(original) : null;
    if (!original) {
      const base = `${slugify(event.title) || "event"}-${event.date.slice(0, 4)}`;
      const taken = new Set((await store.listEvents()).map((e) => e.slug));
      let slug = base;
      for (let n = 2; taken.has(slug); n++) slug = `${base}-${n}`;
      event.slug = slug;
    }
    event.flier = existing?.flier;
    if ((newFlier || form.get("removeFlier") === "on") && existing?.flier) {
      await store.deleteUpload(existing.flier.id);
      event.flier = undefined;
    }
    if (newFlier) {
      const id = await store.saveUpload({ type: newFlier.type, bytes: new Uint8Array(await newFlier.arrayBuffer()) });
      event.flier = { id, type: newFlier.type };
    }
    if (!event.flier) delete event.flier;
    await store.saveEvent({ ...event, published: form.get("published") === "on" });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Couldn't save the event." };
  }
  refreshSite();
  redirect("/admin/events?saved=1");
}

export async function setEventPublished(form: FormData) {
  const store = await sessionStore();
  const event = await store.getEvent(text(form, "slug"));
  if (!event) return;
  const { updatedAt: _, ...rest } = event;
  await store.saveEvent({ ...rest, published: text(form, "published") === "1" });
  refreshSite();
  revalidatePath("/admin", "layout");
}

export async function deleteEvent(form: FormData) {
  const store = await sessionStore();
  const event = await store.getEvent(text(form, "slug"));
  if (event?.flier) await store.deleteUpload(event.flier.id);
  await store.deleteEvent(text(form, "slug"));
  refreshSite();
  redirect("/admin/events?deleted=1");
}

// ---- Check-in ----

export type CheckInState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "ok" | "already" | "other-event"; name: string; detail: string; eventTitle: string; at?: string; code: string };

/** Marks a scanned or typed ticket as used, for the event chosen on the check-in screen. */
export async function checkInTicket(eventSlug: string, raw: string): Promise<CheckInState> {
  const store = await sessionStore();
  const code = parseTicketCode(raw);
  if (!code) return { status: "error", message: "That isn't a ticket code." };
  const ticket = await store.getTicket(code);
  if (!ticket) return { status: "error", message: "No ticket has this code." };
  const [member, event] = await Promise.all([store.getMember(ticket.memberId), store.getEvent(ticket.eventSlug)]);
  const name = member ? `${member.firstName} ${member.surname}` : "Unknown member";
  const detail = member ? `${parishName(member.parishId)} · ${member.userCode}` : "";
  const base = { name, detail, eventTitle: event?.title ?? ticket.eventSlug, code };
  if (eventSlug && ticket.eventSlug !== eventSlug) return { status: "other-event", ...base };
  const result = await store.checkIn(code);
  if (!result) return { status: "error", message: "No ticket has this code." };
  revalidatePath("/admin", "layout");
  return { status: result.alreadyCheckedIn ? "already" : "ok", ...base, at: result.ticket.checkedInAt };
}

/** The check-in button on the attendee list. */
export async function checkInFromList(form: FormData) {
  await checkInTicket(text(form, "eventSlug"), text(form, "code"));
}

// ---- Devotionals ----

export async function saveDevotional(_: FormState, form: FormData): Promise<FormState> {
  await requireAdmin(); // before reading anything, so a signed-out visitor is redirected
  const original = text(form, "originalSlug");
  const title = text(form, "title");
  const date = text(form, "date");
  const ref = text(form, "scriptureRef");
  const scriptureText = text(form, "scriptureText");
  const body = text(form, "body")
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s*\n\s*/g, " ").trim())
    .filter(Boolean);
  const prayer = text(form, "prayer");

  if (!title) return { error: "Give the devotional a title." };
  if (!ISO_DATE.test(date)) return { error: "Choose the date it is for." };
  if (!ref || !scriptureText) return { error: "Add the Bible reference and the verse." };
  if (!body.length) return { error: "Write the devotional text." };
  if (!prayer) return { error: "Add a closing prayer." };

  try {
    const store = await sessionStore();
    let slug = original;
    if (!slug) {
      const base = slugify(title) || "devotional";
      const taken = new Set((await store.listDevotionals()).map((d) => d.slug));
      slug = base;
      for (let n = 2; taken.has(slug); n++) slug = `${base}-${n}`;
    }
    await store.saveDevotional({
      slug,
      title,
      date,
      scripture: { ref, text: scriptureText },
      body,
      prayer,
      published: form.get("published") === "on",
    });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Couldn't save the devotional." };
  }
  refreshSite();
  redirect("/admin/devotionals?saved=1");
}

export async function deleteDevotional(form: FormData) {
  await (await sessionStore()).deleteDevotional(text(form, "slug"));
  refreshSite();
  redirect("/admin/devotionals?deleted=1");
}

// ---- Registrations ----

const STATUSES: RegistrationStatus[] = ["pending", "approved", "rejected"];

export async function setRegistrationStatus(form: FormData) {
  const store = await sessionStore();
  const status = text(form, "status") as RegistrationStatus;
  if (!STATUSES.includes(status)) return;
  await store.setRegistrationStatus(text(form, "id"), status);
  revalidatePath("/admin", "layout");
}

export async function deleteRegistration(form: FormData) {
  await (await sessionStore()).deleteRegistration(text(form, "id"));
  revalidatePath("/admin", "layout");
}
