import type { EventItem, EventLevel } from "@/features/events/types";

export const EVENT_LEVELS: EventLevel[] = ["Diocese", "Archdeaconry", "Parish"];

/** Nigeria is on West Africa Time all year (UTC+1, no daylight saving). */
export const TIME_ZONE = "Africa/Lagos";
const OFFSET = "+01:00";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function parts(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return { y, m, d };
}

export function formatEventDate(e: Pick<EventItem, "date" | "endDate">): string {
  const a = parts(e.date);
  const start = `${a.d} ${MONTHS[a.m - 1]} ${a.y}`;
  if (!e.endDate || e.endDate === e.date) return start;
  const b = parts(e.endDate);
  if (a.y === b.y && a.m === b.m) return `${a.d}–${b.d} ${MONTHS[a.m - 1]} ${a.y}`;
  return `${start} – ${b.d} ${MONTHS[b.m - 1]} ${b.y}`;
}

/** "14:30" -> "2:30 pm" */
export function formatClock(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h < 12 ? "am" : "pm";
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${suffix}`;
}

/** "10:00 am – 2:00 pm", "From 4:00 pm", or "" when no time is set. Multi-day events say "daily". */
export function formatEventTime(
  e: Pick<EventItem, "startTime" | "endTime" | "endDate" | "date">
): string {
  if (!e.startTime) return "";
  const range = e.endTime
    ? `${formatClock(e.startTime)} – ${formatClock(e.endTime)}`
    : `From ${formatClock(e.startTime)}`;
  return e.endDate && e.endDate !== e.date ? `${range} daily` : range;
}

export function dateBadge(iso: string) {
  const { m, d } = parts(iso);
  return { day: String(d), month: MONTHS[m - 1] };
}

/** Today's date in Nigeria, YYYY-MM-DD. */
export function todayIso(now = new Date()): string {
  return toLagosInput(now.toISOString()).slice(0, 10);
}

/** Events that have not finished yet, soonest first. */
export function upcomingEvents<T extends EventItem>(list: T[]): T[] {
  const today = todayIso();
  return list
    .filter((e) => (e.endDate ?? e.date) >= today)
    .sort((a, b) => a.date.localeCompare(b.date));
}

/** Events that have finished, most recent first. */
export function pastEvents<T extends EventItem>(list: T[]): T[] {
  const today = todayIso();
  return list
    .filter((e) => (e.endDate ?? e.date) < today)
    .sort((a, b) => b.date.localeCompare(a.date));
}

// ---- Registration window ----

export type RegistrationState = "none" | "upcoming" | "open" | "closed";

export function registrationState(e: EventItem, now = new Date()): RegistrationState {
  const r = e.registration;
  if (!r) return "none";
  const t = now.getTime();
  if (t < Date.parse(r.opensAt)) return "upcoming";
  if (t >= Date.parse(r.closesAt) || (e.endDate ?? e.date) < todayIso(now)) return "closed";
  return "open";
}

/** "Sat 1 Nov 2026, 9:00 am" in Nigerian time. */
export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  const date = new Intl.DateTimeFormat("en-GB", {
    timeZone: TIME_ZONE,
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
  return `${date}, ${formatClock(toLagosInput(iso).slice(11, 16))}`;
}

/** ISO timestamp -> "YYYY-MM-DDTHH:MM" in Nigerian time, for a datetime-local input. */
export function toLagosInput(iso: string): string {
  return new Date(Date.parse(iso) + 60 * 60 * 1000).toISOString().slice(0, 16);
}

/** A datetime-local value typed in Nigerian time -> ISO timestamp with offset, or "" if invalid. */
export function fromLagosInput(value: string): string {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) return "";
  const iso = `${value}:00${OFFSET}`;
  return Number.isNaN(Date.parse(iso)) ? "" : iso;
}

// ---- Calendar ----

/** Google Calendar "add event" link: timed when the event has a start time, otherwise all-day. */
export function calendarLink(e: EventItem): string {
  const compact = (s: string) => s.replace(/[-:]/g, "");
  let dates: string;
  if (e.startTime) {
    const lastDay = e.endDate ?? e.date;
    const end = e.endTime ?? e.startTime;
    const toUtc = (day: string, hhmm: string) =>
      compact(new Date(`${day}T${hhmm}:00${OFFSET}`).toISOString().slice(0, 19)) + "Z";
    dates = `${toUtc(e.date, e.startTime)}/${toUtc(lastDay, end)}`;
  } else {
    const end = new Date(`${e.endDate ?? e.date}T00:00:00Z`);
    end.setUTCDate(end.getUTCDate() + 1);
    dates = `${compact(e.date)}/${compact(end.toISOString().slice(0, 10))}`;
  }
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: e.title,
    dates,
    details: `${e.summary}\n\nAnglican Youth Fellowship, Diocese of Egba`,
    location: e.venue,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
