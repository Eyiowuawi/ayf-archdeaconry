import type { EventField, Registration } from "@/types";

// Details an event can ask for on top of the Join form. Answers are kept on the member's
// record, so once someone has given their T-shirt size they are never asked for it again.

export const PRESET_FIELDS: EventField[] = [
  { key: "email", label: "Email address", type: "email" },
  { key: "occupation", label: "Occupation or school", type: "text" },
  { key: "tshirtSize", label: "T-shirt size", type: "select", options: ["S", "M", "L", "XL", "XXL"] },
  { key: "emergencyName", label: "Emergency contact name", type: "text" },
  { key: "emergencyPhone", label: "Emergency contact phone", type: "tel" },
  { key: "medical", label: "Allergies or medical conditions (write “None” if none)", type: "textarea" },
  { key: "diet", label: "Dietary needs (write “None” if none)", type: "text" },
  { key: "fellowshipRole", label: "Role in your parish youth fellowship", type: "text" },
  { key: "address", label: "Home address", type: "textarea" },
];

const PRESET_KEYS = new Set(PRESET_FIELDS.map((f) => f.key));
const CUSTOM_PREFIX = "q-";

function keyFor(label: string): string {
  return CUSTOM_PREFIX + label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 50);
}

/**
 * The admin's extra questions, one per line. Options go after a colon:
 * "Do you need accommodation?: Yes, No" becomes a choice.
 */
export function parseCustomQuestions(text: string): EventField[] {
  const out: EventField[] = [];
  for (const line of text.split("\n")) {
    const raw = line.trim();
    if (!raw) continue;
    const i = raw.lastIndexOf(":");
    const options = i > 0 ? raw.slice(i + 1).split(",").map((o) => o.trim()).filter(Boolean) : [];
    const label = (options.length >= 2 ? raw.slice(0, i) : raw).trim().slice(0, 120);
    if (!label || out.some((f) => f.key === keyFor(label))) continue;
    out.push(options.length >= 2 ? { key: keyFor(label), label, type: "select", options } : { key: keyFor(label), label, type: "text" });
  }
  return out;
}

export function customQuestionsText(fields: EventField[] = []): string {
  return fields
    .filter((f) => !PRESET_KEYS.has(f.key))
    .map((f) => (f.options?.length ? `${f.label}: ${f.options.join(", ")}` : f.label))
    .join("\n");
}

export function isPreset(key: string): boolean {
  return PRESET_KEYS.has(key);
}

/** What the member has already given for this field ("" if nothing). */
export function memberValue(m: Pick<Registration, "email" | "occupation" | "extra">, key: string): string {
  if (key === "email") return m.email?.trim() ?? "";
  if (key === "occupation") return m.occupation?.trim() ?? "";
  return m.extra?.[key]?.trim() ?? "";
}

/** The event's questions this member has never answered. */
export function missingFields(m: Pick<Registration, "email" | "occupation" | "extra">, fields: EventField[]): EventField[] {
  return fields.filter((f) => !memberValue(m, f.key));
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[0-9 ()-]{7,20}$/;

/** Checks one answer; returns an error message or "". */
export function checkAnswer(f: EventField, value: string): string {
  const v = value.trim();
  if (!v) return "This is needed for this event.";
  if (f.type === "email" && !EMAIL_RE.test(v)) return "Check this email address.";
  if (f.type === "tel" && !PHONE_RE.test(v)) return "Enter a phone number, e.g. 0803 123 4567.";
  if (f.type === "select" && !f.options?.includes(v)) return "Choose one of the options.";
  return "";
}
