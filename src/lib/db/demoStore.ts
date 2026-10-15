import "server-only";
import { randomUUID } from "node:crypto";
import { DEVOTIONALS } from "@/lib/devotionals";
import { EVENTS } from "@/lib/events";
import { ARCHDEACONRIES } from "@/lib/parishes";
import type { Registration } from "@/lib/registrations";
import type { DevotionalRecord, EventRecord, Store } from "@/lib/db/store";

// Sample data for the demo account, kept in memory. Changes last until the server restarts
// (on Vercel, any time), and never reach the public website or any real data.

const SAMPLE_PEOPLE: [string, string, "Male" | "Female", string, Registration["educationLevel"], Registration["status"]][] = [
  ["Tobi", "Sample", "Male", "2005-03-14", "HND / Bachelor's degree", "approved"],
  ["Funmi", "Example", "Female", "2009-07-02", "Senior secondary (SSS)", "pending"],
  ["Dayo", "Demo", "Male", "2011-11-20", "Junior secondary (JSS)", "pending"],
  ["Kemi", "Test", "Female", "2001-01-09", "Postgraduate", "approved"],
  ["Seyi", "Placeholder", "Male", "2007-05-30", "OND / NCE", "pending"],
  ["Bisi", "Sample", "Female", "2003-09-17", "Not in school", "rejected"],
];

function seed() {
  const now = Date.now();
  const iso = (daysAgo: number) => new Date(now - daysAgo * 86_400_000).toISOString();
  const events: EventRecord[] = EVENTS.map((e) => ({ ...e, published: true, updatedAt: iso(3) }));
  const devotionals: DevotionalRecord[] = DEVOTIONALS.map((d) => ({ ...d, published: true, updatedAt: iso(3) }));
  const registrations: Registration[] = SAMPLE_PEOPLE.map(([firstName, surname, gender, dateOfBirth, educationLevel, status], i) => {
    const arch = ARCHDEACONRIES[i % ARCHDEACONRIES.length];
    const minor = Number(dateOfBirth.slice(0, 4)) > 2008;
    return {
      id: randomUUID(),
      firstName,
      surname,
      gender,
      dateOfBirth,
      phone: `0800 000 00${10 + i}`,
      email: `${firstName.toLowerCase()}@example.com`,
      educationLevel,
      archdeaconry: arch.name,
      parishId: arch.parishes[0].id,
      occupation: "",
      guardianName: minor ? `Parent of ${firstName}` : "",
      guardianPhone: minor ? "0800 000 0099" : "",
      consent: true,
      status,
      createdAt: iso(i + 1),
      updatedAt: iso(i + 1),
    };
  });
  return { events, devotionals, registrations };
}

const data = seed();

function upsert<T extends { slug: string }>(list: T[], item: T) {
  const i = list.findIndex((x) => x.slug === item.slug);
  if (i >= 0) list[i] = item;
  else list.push(item);
}

export const demoStore: Store = {
  label: "Demo account",
  live: false,

  listEvents: async () => data.events,
  getEvent: async (slug) => data.events.find((e) => e.slug === slug) ?? null,
  saveEvent: async (event) => upsert(data.events, { ...event, updatedAt: new Date().toISOString() }),
  deleteEvent: async (slug) => void (data.events = data.events.filter((e) => e.slug !== slug)),

  listDevotionals: async () => data.devotionals,
  getDevotional: async (slug) => data.devotionals.find((d) => d.slug === slug) ?? null,
  saveDevotional: async (dev) => upsert(data.devotionals, { ...dev, updatedAt: new Date().toISOString() }),
  deleteDevotional: async (slug) => void (data.devotionals = data.devotionals.filter((d) => d.slug !== slug)),

  listRegistrations: async () => data.registrations,
  async createRegistration(input) {
    const now = new Date().toISOString();
    const reg = { ...input, id: randomUUID(), status: "pending", createdAt: now, updatedAt: now } as Registration;
    data.registrations.push(reg);
    return reg;
  },
  setRegistrationStatus: async (id, status) => {
    const r = data.registrations.find((x) => x.id === id);
    if (r) Object.assign(r, { status, updatedAt: new Date().toISOString() });
  },
  deleteRegistration: async (id) => void (data.registrations = data.registrations.filter((r) => r.id !== id)),
};
