import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { DEVOTIONALS } from "@/lib/devotionals";
import { EVENTS } from "@/lib/events";
import type { Registration } from "@/lib/registrations";
import type { DevotionalRecord, EventRecord, Store } from "@/lib/db/store";

// A JSON file on disk, for trying the admin area locally. Not for the live site:
// Vercel's file system is read-only and resets, and the file is not private enough for member data.

type Data = { events: EventRecord[]; devotionals: DevotionalRecord[]; registrations: Registration[] };

const FILE = path.join(/* turbopackIgnore: true */ process.cwd(), process.env.CMS_LOCAL_FILE || ".data/cms.json");

function seed(): Data {
  const now = new Date().toISOString();
  return {
    events: EVENTS.map((e) => ({ ...e, published: true, updatedAt: now })),
    devotionals: DEVOTIONALS.map((d) => ({ ...d, published: true, updatedAt: now })),
    registrations: [],
  };
}

async function load(): Promise<Data> {
  try {
    return JSON.parse(await readFile(FILE, "utf8")) as Data;
  } catch {
    return seed();
  }
}

// Serialise writes so two quick saves don't overwrite each other.
let queue: Promise<unknown> = Promise.resolve();
function update(fn: (d: Data) => void): Promise<void> {
  const run = queue.then(async () => {
    const d = await load();
    fn(d);
    await mkdir(path.dirname(FILE), { recursive: true });
    const tmp = `${FILE}.tmp`;
    await writeFile(tmp, JSON.stringify(d, null, 2));
    await rename(tmp, FILE);
  });
  queue = run.catch(() => {});
  return run;
}

function upsert<T extends { slug: string }>(list: T[], item: T) {
  const i = list.findIndex((x) => x.slug === item.slug);
  if (i >= 0) list[i] = item;
  else list.push(item);
}

export const fileStore: Store = {
  label: "Local test data",
  live: false,

  listEvents: async () => (await load()).events,
  getEvent: async (slug) => (await load()).events.find((e) => e.slug === slug) ?? null,
  saveEvent: (event) => update((d) => upsert(d.events, { ...event, updatedAt: new Date().toISOString() })),
  deleteEvent: (slug) => update((d) => void (d.events = d.events.filter((e) => e.slug !== slug))),

  listDevotionals: async () => (await load()).devotionals,
  getDevotional: async (slug) => (await load()).devotionals.find((x) => x.slug === slug) ?? null,
  saveDevotional: (dev) => update((d) => upsert(d.devotionals, { ...dev, updatedAt: new Date().toISOString() })),
  deleteDevotional: (slug) => update((d) => void (d.devotionals = d.devotionals.filter((x) => x.slug !== slug))),

  listRegistrations: async () => (await load()).registrations,
  async createRegistration(input) {
    const now = new Date().toISOString();
    const reg = { ...input, id: randomUUID(), status: "pending", createdAt: now, updatedAt: now } as Registration;
    await update((d) => void d.registrations.push(reg));
    return reg;
  },
  setRegistrationStatus: (id, status) =>
    update((d) => {
      const r = d.registrations.find((x) => x.id === id);
      if (r) Object.assign(r, { status, updatedAt: new Date().toISOString() });
    }),
  deleteRegistration: (id) => update((d) => void (d.registrations = d.registrations.filter((r) => r.id !== id))),
};
