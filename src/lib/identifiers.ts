// Parsing what people type or scan: phone numbers, user codes and ticket codes.
// Safe to use in the browser (no Node imports).

/** Nigerian phone numbers in one form, so 0803..., +234 803... and 234803... all match. */
export function normalizePhone(raw: string): string {
  let d = raw.replace(/\D/g, "");
  if (d.startsWith("234") && d.length === 13) d = "0" + d.slice(3);
  else if (d.length === 10 && /^[789]/.test(d)) d = "0" + d;
  return d;
}

/** "ayf 7kq2mx" -> "AYF-7KQ2MX", or null when it isn't shaped like a user code. */
export function parseUserCode(raw: string): string | null {
  const m = raw.trim().toUpperCase().replace(/[\s-]/g, "").match(/^AYF([A-Z0-9]{6})$/);
  return m ? `AYF-${m[1]}` : null;
}

/** Reads a ticket code from a typed code or a scanned ticket link. */
export function parseTicketCode(raw: string): string | null {
  const s = raw.trim();
  const fromLink = s.match(/\/tickets\/([A-Za-z0-9-]+)/);
  const code = (fromLink ? fromLink[1] : s).toUpperCase().replace(/[\s-]/g, "");
  return /^[A-Z0-9]{12}$/.test(code) ? code : null;
}

export function formatTicketCode(code: string): string {
  return code.match(/.{1,4}/g)?.join("-") ?? code;
}
