import "server-only";
import { randomUUID } from "node:crypto";
import { newTicketCode } from "@/lib/codes";
import { dataStore, upgrade, type Data } from "@/lib/db/dataStore";
import { ARCHDEACONRIES } from "@/lib/parishes";
import { DEMO_PEOPLE, demoEvents } from "@/mocks/demo";
import { DEVOTIONALS } from "@/mocks/devotionals";
import type { Registration } from "@/types";

// Sample data for the demo account, kept in memory. Changes last until the server restarts
// (on Vercel, any time), and never reach the public website or any real data.

function seed(): Data {
  const now = Date.now();
  const iso = (daysAgo: number) => new Date(now - daysAgo * 86_400_000).toISOString();
  const registrations: Registration[] = DEMO_PEOPLE.map(([firstName, surname, gender, dateOfBirth, educationLevel, status, userCode], i) => {
    const arch = ARCHDEACONRIES[i % ARCHDEACONRIES.length];
    const minor = Number(dateOfBirth.slice(0, 4)) > 2008;
    return {
      id: randomUUID(),
      userCode,
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
      extra: i < 2 ? { tshirtSize: i ? "M" : "L", fellowshipRole: i ? "Secretary" : "President" } : undefined,
      createdAt: iso(i + 1),
      updatedAt: iso(i + 1),
    };
  });
  // Two people already registered for the workshop, one of them checked in.
  const tickets = registrations.slice(0, 2).map((r, i) => ({
    code: newTicketCode(),
    eventSlug: "leadership-workshop-demo",
    memberId: r.id,
    createdAt: iso(1),
    checkedInAt: i === 0 ? iso(0) : undefined,
  }));
  return upgrade({
    events: demoEvents().map((e) => ({ ...e, updatedAt: iso(3) })),
    devotionals: DEVOTIONALS.map((d) => ({ ...d, published: true, updatedAt: iso(3) })),
    registrations,
    tickets,
  });
}

const data = seed();

export const demoStore = dataStore({
  label: "Demo account",
  read: async () => data,
  write: async (change) => change(data),
  maxUploads: 10,
});
