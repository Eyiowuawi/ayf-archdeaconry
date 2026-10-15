import "server-only";
import { randomUUID } from "node:crypto";
import { legacyUserCode, newTicketCode, newUserCode } from "@/utils/codes";
import { normalizePhone } from "@/utils/identifiers";
import type { DevotionalRecord } from "@/features/devotionals/types";
import type { EventRecord, Ticket } from "@/features/events/types";
import type { Registration } from "@/features/members/types";
import type { Store } from "@/shared/db/store";

/** Everything a simple store keeps. Uploads are base64 so the whole thing can be saved as JSON. */
export type Data = {
  events: EventRecord[];
  devotionals: DevotionalRecord[];
  registrations: Registration[];
  tickets: Ticket[];
  uploads: Record<string, { type: string; data: string }>;
};

/** Fills in anything an older copy of the data is missing. */
export function upgrade(d: Partial<Data>): Data {
  const data: Data = {
    events: d.events ?? [],
    devotionals: d.devotionals ?? [],
    registrations: d.registrations ?? [],
    tickets: d.tickets ?? [],
    uploads: d.uploads ?? {},
  };
  for (const r of data.registrations) r.userCode ||= legacyUserCode(r.id);
  return data;
}

function upsert<T extends { slug: string }>(list: T[], item: T) {
  const i = list.findIndex((x) => x.slug === item.slug);
  if (i >= 0) list[i] = item;
  else list.push(item);
}

const now = () => new Date().toISOString();

/**
 * A Store over one in-memory `Data` object. `read` returns the current data; `write` applies a
 * change and saves it. The local JSON file and the demo account both use this.
 */
export function dataStore(opts: {
  label: string;
  read: () => Promise<Data>;
  write: (change: (d: Data) => void) => Promise<void>;
  /** Oldest uploads are dropped beyond this many (keeps the demo's memory small). */
  maxUploads?: number;
}): Store {
  const { read, write } = opts;
  return {
    label: opts.label,
    live: false,

    listEvents: async () => (await read()).events,
    getEvent: async (slug) => (await read()).events.find((e) => e.slug === slug) ?? null,
    saveEvent: (event) => write((d) => upsert(d.events, { ...event, updatedAt: now() })),
    deleteEvent: (slug) =>
      write((d) => {
        d.events = d.events.filter((e) => e.slug !== slug);
        d.tickets = d.tickets.filter((t) => t.eventSlug !== slug);
      }),

    listDevotionals: async () => (await read()).devotionals,
    getDevotional: async (slug) => (await read()).devotionals.find((x) => x.slug === slug) ?? null,
    saveDevotional: (dev) => write((d) => upsert(d.devotionals, { ...dev, updatedAt: now() })),
    deleteDevotional: (slug) =>
      write((d) => void (d.devotionals = d.devotionals.filter((x) => x.slug !== slug))),

    listRegistrations: async () => (await read()).registrations,
    async createRegistration(input) {
      let reg!: Registration;
      await write((d) => {
        const taken = new Set(d.registrations.map((r) => r.userCode));
        let userCode = newUserCode();
        while (taken.has(userCode)) userCode = newUserCode();
        const t = now();
        reg = {
          ...input,
          id: randomUUID(),
          userCode,
          status: "pending",
          createdAt: t,
          updatedAt: t,
        } as Registration;
        d.registrations.push(reg);
      });
      return reg;
    },
    setRegistrationStatus: (id, status) =>
      write((d) => {
        const r = d.registrations.find((x) => x.id === id);
        if (r) Object.assign(r, { status, updatedAt: now() });
      }),
    deleteRegistration: (id) =>
      write((d) => {
        d.registrations = d.registrations.filter((r) => r.id !== id);
        d.tickets = d.tickets.filter((t) => t.memberId !== id);
      }),
    async findMembers({ userCode, phone }) {
      const list = (await read()).registrations;
      if (userCode) return list.filter((r) => r.userCode === userCode);
      if (phone) return list.filter((r) => normalizePhone(r.phone) === phone);
      return [];
    },
    getMember: async (id) => (await read()).registrations.find((r) => r.id === id) ?? null,
    updateMemberDetails: (id, details) =>
      write((d) => {
        const r = d.registrations.find((x) => x.id === id);
        if (!r) return;
        if (details.email !== undefined) r.email = details.email;
        if (details.occupation !== undefined) r.occupation = details.occupation;
        if (details.extra) r.extra = { ...r.extra, ...details.extra };
        r.updatedAt = now();
      }),

    listTickets: async (slug) =>
      (await read()).tickets.filter((t) => !slug || t.eventSlug === slug),
    getTicket: async (code) => (await read()).tickets.find((t) => t.code === code) ?? null,
    async issueTicket(eventSlug, memberId) {
      let ticket!: Ticket;
      await write((d) => {
        const existing = d.tickets.find(
          (t) => t.eventSlug === eventSlug && t.memberId === memberId
        );
        if (existing) {
          ticket = existing;
          return;
        }
        const taken = new Set(d.tickets.map((t) => t.code));
        let code = newTicketCode();
        while (taken.has(code)) code = newTicketCode();
        ticket = { code, eventSlug, memberId, createdAt: now() };
        d.tickets.push(ticket);
      });
      return ticket;
    },
    async checkIn(code) {
      let result: Awaited<ReturnType<Store["checkIn"]>> = null;
      await write((d) => {
        const t = d.tickets.find((x) => x.code === code);
        if (!t) return;
        const alreadyCheckedIn = Boolean(t.checkedInAt);
        if (!alreadyCheckedIn) t.checkedInAt = now();
        result = { ticket: { ...t }, alreadyCheckedIn };
      });
      return result;
    },

    async saveUpload({ type, bytes }) {
      const id = randomUUID();
      await write((d) => {
        d.uploads[id] = { type, data: Buffer.from(bytes).toString("base64") };
        const ids = Object.keys(d.uploads);
        if (opts.maxUploads && ids.length > opts.maxUploads) delete d.uploads[ids[0]];
      });
      return id;
    },
    async getUpload(id) {
      const u = (await read()).uploads[id];
      return u ? { type: u.type, bytes: new Uint8Array(Buffer.from(u.data, "base64")) } : null;
    },
    deleteUpload: (id) => write((d) => void delete d.uploads[id]),
  };
}
