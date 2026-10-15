import { createHash, randomInt } from "node:crypto";

// Codes people read aloud or type: no 0/O, 1/I/L confusion.
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

function randomChars(n: number): string {
  let s = "";
  for (let i = 0; i < n; i++) s += ALPHABET[randomInt(ALPHABET.length)];
  return s;
}

/** A member's user code, e.g. AYF-7KQ2MX. */
export function newUserCode(): string {
  return `AYF-${randomChars(6)}`;
}

/** The same user code every time for a record saved before codes existed. */
export function legacyUserCode(id: string): string {
  const hash = createHash("sha256").update(id).digest();
  let s = "";
  for (let i = 0; i < 6; i++) s += ALPHABET[hash[i] % ALPHABET.length];
  return `AYF-${s}`;
}

/** A ticket code: 12 characters, unguessable, shown as XXXX-XXXX-XXXX. */
export function newTicketCode(): string {
  return randomChars(12);
}
