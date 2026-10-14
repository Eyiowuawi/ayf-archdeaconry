// Events shown on the public site. Edit this list to add, change or remove events.
// `date` is YYYY-MM-DD; `endDate` is optional for multi-day events.
// The entries below are starter examples: replace them with the real programme.

export type EventItem = {
  slug: string;
  title: string;
  date: string;
  endDate?: string;
  time?: string;
  venue: string;
  level: "Diocese" | "Archdeaconry" | "Parish";
  summary: string;
};

export const EVENTS: EventItem[] = [
  {
    slug: "youth-week-2026",
    title: "Diocesan Youth Week",
    date: "2026-11-08",
    endDate: "2026-11-15",
    venue: "Parishes across the diocese",
    level: "Diocese",
    summary:
      "A week of youth-led services, outreach and fellowship. Each parish's youths lead worship on the closing Sunday.",
  },
  {
    slug: "leadership-workshop-2026",
    title: "Youth Leaders' Workshop",
    date: "2026-11-21",
    time: "10:00 am",
    venue: "Venue to be announced",
    level: "Diocese",
    summary:
      "Training for parish youth presidents, secretaries and coordinators on planning programmes, keeping records and mentoring younger members.",
  },
  {
    slug: "carol-service-2026",
    title: "Youth Carol Service",
    date: "2026-12-13",
    time: "4:00 pm",
    venue: "Cathedral of St. Peter, Ake, Abeokuta",
    level: "Diocese",
    summary:
      "Nine lessons and carols led by youth choirs and readers from every archdeaconry. Families and friends are welcome.",
  },
  {
    slug: "new-year-retreat-2027",
    title: "New Year Spiritual Retreat",
    date: "2027-01-15",
    endDate: "2027-01-17",
    venue: "Venue to be announced",
    level: "Diocese",
    summary:
      "Three days of prayer, Bible study, career talks and games to start the year together.",
  },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function parts(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return { y, m, d };
}

export function formatEventDate(e: EventItem): string {
  const a = parts(e.date);
  const start = `${a.d} ${MONTHS[a.m - 1]} ${a.y}`;
  if (!e.endDate) return start;
  const b = parts(e.endDate);
  if (a.y === b.y && a.m === b.m) return `${a.d}–${b.d} ${MONTHS[a.m - 1]} ${a.y}`;
  return `${start} – ${b.d} ${MONTHS[b.m - 1]} ${b.y}`;
}

export function dateBadge(iso: string) {
  const { m, d } = parts(iso);
  return { day: String(d), month: MONTHS[m - 1] };
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Events that have not finished yet, soonest first. */
export function upcomingEvents(): EventItem[] {
  const today = todayIso();
  return [...EVENTS]
    .filter((e) => (e.endDate ?? e.date) >= today)
    .sort((a, b) => a.date.localeCompare(b.date));
}

/** Events that have finished, most recent first. */
export function pastEvents(): EventItem[] {
  const today = todayIso();
  return [...EVENTS]
    .filter((e) => (e.endDate ?? e.date) < today)
    .sort((a, b) => b.date.localeCompare(a.date));
}

/** Google Calendar "add event" link (all-day, inclusive of endDate). */
export function calendarLink(e: EventItem): string {
  const compact = (iso: string) => iso.replace(/-/g, "");
  const end = new Date(`${e.endDate ?? e.date}T00:00:00Z`);
  end.setUTCDate(end.getUTCDate() + 1);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: e.title,
    dates: `${compact(e.date)}/${end.toISOString().slice(0, 10).replace(/-/g, "")}`,
    details: `${e.summary}${e.time ? `\nStarts ${e.time}.` : ""}\n\nAnglican Youth Fellowship, Diocese of Egba`,
    location: e.venue,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
