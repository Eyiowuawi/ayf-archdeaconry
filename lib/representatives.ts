import "server-only";
import { getFillData } from "@/lib/github-store";
import { ARCHDEACONRIES } from "@/lib/parishes";
import type { FillEntry, Person } from "@/lib/types";

// Read-only view of the parish representatives tracker (/representatives) for the admin area.

export type RepRow = {
  parishId: string;
  parish: string;
  archdeaconry: string;
  entry: FillEntry | null;
};

export type RepSummary = {
  rows: RepRow[];
  filled: number;
  total: number;
  byArchdeaconry: { name: string; filled: number; total: number }[];
  error: string | null;
};

export async function loadRepresentatives(): Promise<RepSummary> {
  let data: Record<string, FillEntry> = {};
  let error: string | null = null;
  try {
    data = await getFillData();
  } catch (e) {
    error = e instanceof Error ? e.message : "Couldn't load the representatives list.";
  }
  const rows: RepRow[] = ARCHDEACONRIES.flatMap((a) =>
    a.parishes.map((p) => ({ parishId: p.id, parish: p.name, archdeaconry: a.name, entry: data[p.id] ?? null }))
  );
  const byArchdeaconry = ARCHDEACONRIES.map((a) => ({
    name: a.name,
    total: a.parishes.length,
    filled: a.parishes.filter((p) => data[p.id]).length,
  }));
  return { rows, filled: rows.filter((r) => r.entry).length, total: rows.length, byArchdeaconry, error };
}

/** The people listed for a parish, with their role. */
export function repPeople(entry: FillEntry): { role: string; person: Person }[] {
  if (entry.mode === "officers") {
    return [
      ...(entry.president ? [{ role: "President", person: entry.president }] : []),
      ...(entry.secretary ? [{ role: "Secretary", person: entry.secretary }] : []),
    ];
  }
  return (entry.members ?? []).map((person, i) => ({ role: `Member ${i + 1}`, person }));
}
