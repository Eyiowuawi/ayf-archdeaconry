// Every data shape the site, the admin area and storage share. Constants that go with a type
// (the lists a form offers) live next to the code that uses them in src/lib.

// ---- Parish representatives tracker ----

export type Person = {
  name: string;
  phone: string;
};

export type FillEntry = {
  mode: "officers" | "members";
  president?: Person;
  secretary?: Person;
  members?: [Person, Person];
  filledBy?: string;
  updatedAt: string;
};

export type FillData = Record<string, FillEntry>;

// ---- Events ----

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

// ---- Devotionals ----

export type Devotional = {
  slug: string;
  title: string;
  date: string;
  scripture: { ref: string; text: string };
  body: string[];
  prayer: string;
};

export type DevotionalRecord = Devotional & { published: boolean; updatedAt: string };

// ---- Members (Join form registrations) ----

export type EducationLevel =
  | "Primary school"
  | "Junior secondary (JSS)"
  | "Senior secondary (SSS)"
  | "OND / NCE"
  | "HND / Bachelor's degree"
  | "Postgraduate"
  | "Not in school";

/** What the public Join form sends. */
export type RegistrationInput = {
  firstName: string;
  surname: string;
  gender: "" | "Male" | "Female";
  dateOfBirth: string;
  phone: string;
  email: string;
  educationLevel: "" | EducationLevel;
  archdeaconry: string;
  parishId: string;
  occupation: string;
  guardianName: string;
  guardianPhone: string;
  consent: boolean;
};

export type RegistrationStatus = "pending" | "approved" | "rejected";

/** A stored member. `userCode` is the system-generated code members use to find their record. */
export type Registration = Omit<RegistrationInput, "gender" | "educationLevel"> & {
  id: string;
  userCode: string;
  gender: "Male" | "Female";
  educationLevel: EducationLevel;
  status: RegistrationStatus;
  /** Answers to event questions, keyed by EventField.key. */
  extra?: Record<string, string>;
  createdAt: string; // ISO timestamp
  updatedAt: string;
};

export type RegistrationErrors = Partial<Record<keyof RegistrationInput, string>>;

// ---- Uploads ----

export type Upload = { type: string; bytes: Uint8Array };
