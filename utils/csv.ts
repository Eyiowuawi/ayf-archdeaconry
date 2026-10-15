/** One CSV cell, quoted when needed and safe to open in a spreadsheet. */
export function csvCell(v: unknown): string {
  let s = String(v ?? "");
  if (/^[=+\-@]/.test(s)) s = `'${s}`; // stop spreadsheets treating text as a formula
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** A CSV file download (with a BOM so Excel reads accented names correctly). */
export function csvResponse(filename: string, header: string[], rows: unknown[][]): Response {
  const body = [header, ...rows].map((r) => r.map(csvCell).join(",")).join("\r\n");
  return new Response("﻿" + body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
