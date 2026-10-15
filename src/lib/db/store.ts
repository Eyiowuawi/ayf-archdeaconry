import type {
  DevotionalRecord,
  EventRecord,
  Registration,
  RegistrationInput,
  RegistrationStatus,
  Ticket,
  Upload,
} from "@/types";

export type MemberDetails = Partial<Pick<Registration, "email" | "occupation">> & { extra?: Record<string, string> };

export type CheckInResult = { ticket: Ticket; alreadyCheckedIn: boolean } | null;

/**
 * Everything the admin area and public site need from storage.
 * Implement this for the database you choose (Supabase, Neon/Postgres, ...) and return it from
 * `getStore()` in src/lib/db/index.ts. Slugs are the stable ids for events and devotionals.
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

  /** Members (Join form registrations). */
  listRegistrations(): Promise<Registration[]>;
  createRegistration(input: RegistrationInput): Promise<Registration>;
  setRegistrationStatus(id: string, status: RegistrationStatus): Promise<void>;
  deleteRegistration(id: string): Promise<void>;
  /** Members whose user code or phone number (already normalised) matches. */
  findMembers(by: { userCode?: string; phone?: string }): Promise<Registration[]>;
  getMember(id: string): Promise<Registration | null>;
  updateMemberDetails(id: string, details: MemberDetails): Promise<void>;

  /** Event tickets. `issueTicket` returns the member's existing ticket when they already have one. */
  listTickets(eventSlug?: string): Promise<Ticket[]>;
  getTicket(code: string): Promise<Ticket | null>;
  issueTicket(eventSlug: string, memberId: string): Promise<Ticket>;
  /** Marks a ticket used. Returns null when no ticket has that code. */
  checkIn(code: string): Promise<CheckInResult>;

  /** Fliers and other uploaded files. */
  saveUpload(upload: Upload): Promise<string>;
  getUpload(id: string): Promise<Upload | null>;
  deleteUpload(id: string): Promise<void>;
}
