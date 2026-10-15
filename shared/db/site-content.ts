import "server-only";
import { revalidatePath } from "next/cache";
import { DEVOTIONALS } from "@/features/devotionals/data/starter-devotionals";
import type { Devotional } from "@/features/devotionals/types";
import { EVENTS } from "@/features/events/data/starter-events";
import type { EventItem } from "@/features/events/types";
import { getStore } from "@/shared/db";

// What the public site shows: published items from the admin area's storage when one is
// connected, otherwise the starter content in features/events/data and features/devotionals/data.

export async function siteEvents(): Promise<EventItem[]> {
  const store = getStore();
  if (!store) return EVENTS;
  return (await store.listEvents()).filter((e) => e.published);
}

export async function siteEvent(slug: string): Promise<EventItem | undefined> {
  return (await siteEvents()).find((e) => e.slug === slug);
}

export async function siteDevotionals(): Promise<Devotional[]> {
  const store = getStore();
  if (!store) return DEVOTIONALS;
  return (await store.listDevotionals()).filter((d) => d.published);
}

export async function siteDevotional(slug: string): Promise<Devotional | undefined> {
  return (await siteDevotionals()).find((d) => d.slug === slug);
}

/** Whether the Join form really saves (a store is connected). */
export function registrationsOpen(): boolean {
  return getStore() !== null;
}

/** Refresh the public pages after content changes. */
export function refreshSite() {
  revalidatePath("/", "layout");
}
