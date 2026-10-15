import { DEVOTIONALS } from "@/features/devotionals/data/starter-devotionals";
import type { Devotional } from "@/features/devotionals/types";

export function sortedDevotionals(list: Devotional[] = DEVOTIONALS): Devotional[] {
  return [...list].sort((a, b) => b.date.localeCompare(a.date));
}

export function getDevotional(slug: string): Devotional | undefined {
  return DEVOTIONALS.find((d) => d.slug === slug);
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function formatLongDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}
