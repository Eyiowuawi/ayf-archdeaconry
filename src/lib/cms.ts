import "server-only";
import { DEVOTIONALS, type Devotional } from "@/lib/devotionals";
import { EVENTS, type EventItem } from "@/lib/events";
import { getStore } from "@/lib/db";

// What the public site shows: published items from the admin area's storage when one is
// connected, otherwise the starter content in lib/content.

export async function siteEvents(): Promise<EventItem[]> {
  const store = getStore();
  if (!store) return EVENTS;
  return (await store.listEvents()).filter((e) => e.published);
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
