import type { Devotional } from "@/lib/devotionals";
import type { EventItem } from "@/lib/events";
import type { Registration, RegistrationInput } from "@/lib/registrations";

export type EventRecord = EventItem & { published: boolean; updatedAt: string };
export type DevotionalRecord = Devotional & { published: boolean; updatedAt: string };
export type RegistrationStatus = Registration["status"];

/**
 * Everything the admin area and public site need from storage.
 * Implement this for the database you choose (Supabase, Neon/Postgres, ...) and return it from
 * `getStore()` in lib/db/index.ts. Slugs are the stable ids for events and devotionals.
 */
export interface Store {
  /** Shown in the admin header, e.g. "Local test data". */
  label: string;
  /** True when changes reach the live site (false for local test data). */
  live: boolean;

  listEvents(): Promise<EventRecord[]>;
  getEvent(slug: string): Promise<EventRecord | null>;
  saveEvent(event: Omit<EventRecord, "updatedAt">): Promise<void>;
  deleteEvent(slug: string): Promise<void>;

  listDevotionals(): Promise<DevotionalRecord[]>;
  getDevotional(slug: string): Promise<DevotionalRecord | null>;
  saveDevotional(devotional: Omit<DevotionalRecord, "updatedAt">): Promise<void>;
  deleteDevotional(slug: string): Promise<void>;

  listRegistrations(): Promise<Registration[]>;
  createRegistration(input: RegistrationInput): Promise<Registration>;
  setRegistrationStatus(id: string, status: RegistrationStatus): Promise<void>;
  deleteRegistration(id: string): Promise<void>;
}
