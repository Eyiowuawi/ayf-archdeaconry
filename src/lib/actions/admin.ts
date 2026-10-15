"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkCredentials, endSession, requireAdmin, startSession, storeFor } from "@/lib/adminAuth";
import { EVENT_LEVELS, type EventItem } from "@/lib/events";
import type { RegistrationStatus } from "@/lib/db";

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

export async function saveEvent(_: FormState, form: FormData): Promise<FormState> {
  await requireAdmin(); // before reading anything, so a signed-out visitor is redirected
  const original = text(form, "originalSlug");
  const event: EventItem = {
    slug: original,
    title: text(form, "title"),
    date: text(form, "date"),
    endDate: text(form, "endDate") || undefined,
    time: text(form, "time") || undefined,
    venue: text(form, "venue"),
    level: text(form, "level") as EventItem["level"],
    summary: text(form, "summary"),
  };
  if (!event.title) return { error: "Give the event a title." };
  if (!ISO_DATE.test(event.date)) return { error: "Choose the event date." };
  if (event.endDate && (!ISO_DATE.test(event.endDate) || event.endDate < event.date))
    return { error: "The end date must be on or after the start date." };
  if (!event.venue) return { error: "Add a venue (or “Venue to be announced”)." };
  if (!EVENT_LEVELS.includes(event.level)) return { error: "Choose who the event is for." };
  if (!event.summary) return { error: "Add a short summary." };

  try {
    const store = await sessionStore();
    if (!original) {
      const base = `${slugify(event.title) || "event"}-${event.date.slice(0, 4)}`;
      const taken = new Set((await store.listEvents()).map((e) => e.slug));
      let slug = base;
      for (let n = 2; taken.has(slug); n++) slug = `${base}-${n}`;
      event.slug = slug;
    }
    await store.saveEvent({ ...event, published: form.get("published") === "on" });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Couldn't save the event." };
  }
  refreshSite();
  redirect("/admin/events?saved=1");
}

export async function deleteEvent(form: FormData) {
  await (await sessionStore()).deleteEvent(text(form, "slug"));
  refreshSite();
  redirect("/admin/events?deleted=1");
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
