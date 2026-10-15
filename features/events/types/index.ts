export type EventLevel = "Diocese" | "Archdeaconry" | "Parish";

export type Speaker = { name: string; role?: string };

/**
 * A detail an event asks for when someone registers. Answers are saved on the member's record,
 * so a member is only asked for what they have never given before.
 */
export type EventField = {
  key: string;
  label: string;
  type: "text" | "textarea" | "email" | "tel" | "select";
  options?: string[];
};

export type EventItem = {
  /** Stable id, used in the URL. */
  slug: string;
  title: string;
  /** First (or only) day, YYYY-MM-DD. */
  date: string;
  /** Last day of a multi-day event, YYYY-MM-DD. */
  endDate?: string;
  /** Daily start and end, HH:MM in Nigerian time. */
  startTime?: string;
  endTime?: string;
  venue: string;
  level: EventLevel;
  /** One or two sentences for the event card. */
  summary: string;
  /** The full description of the meeting, paragraphs separated by blank lines. */
  description?: string;
  speakers?: Speaker[];
  /** An uploaded flier (image or PDF), served from /uploads/{id}. */
  flier?: { id: string; type: string };
  /** Present when the event takes registrations. Times are ISO strings with an offset. */
  registration?: { opensAt: string; closesAt: string; fields: EventField[] };
};

export type EventRecord = EventItem & { published: boolean; updatedAt: string };

/** An entry pass for one member at one event. `code` is what the QR code carries. */
export type Ticket = {
  code: string;
  eventSlug: string;
  memberId: string;
  createdAt: string;
  checkedInAt?: string;
};
