"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Archdeaconry } from "@/lib/parishes";

const MAX_RESULTS = 6;

function normalise(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
}

/** Search box over every parish; each result links to the Join form with that parish picked. */
export default function ParishFinder({ archdeaconries }: { archdeaconries: Archdeaconry[] }) {
  const [query, setQuery] = useState("");

  const all = useMemo(
    () =>
      archdeaconries.flatMap((a) =>
        a.parishes.map((p) => ({ ...p, archdeaconry: a.name, haystack: normalise(`${p.name} ${a.name}`) }))
      ),
    [archdeaconries]
  );

  const q = normalise(query);
  const matches = q ? all.filter((p) => q.split(" ").every((w) => p.haystack.includes(w))) : [];

  return (
    <div>
      <label htmlFor="parish-finder" className="sr-only">
        Search for your parish
      </label>
      <div className="relative">
        <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          id="parish-finder"
          type="search"
          autoComplete="off"
          placeholder="Try “St. John” or “Igbein”"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-full border border-line bg-canvas py-4 pl-12 pr-5 text-base text-ink transition-colors placeholder:text-ink-muted/70 hover:border-primary/40 focus:border-sun focus:outline-none focus:ring-4 focus:ring-sun/20"
        />
      </div>

      <div aria-live="polite" className="mt-4 min-h-[3rem]">
        {!q && (
          <p className="text-sm text-ink-muted">Start typing your church or town.</p>
        )}
        {q && matches.length === 0 && (
          <p className="text-sm text-ink-muted">
            No parish matches that yet. Try a shorter word, or{" "}
            <Link href="/register" className="font-bold text-primary hover:underline">
              join and pick it from the list
            </Link>
            .
          </p>
        )}
        {matches.length > 0 && (
          <>
            <ul className="grid gap-2">
              {matches.slice(0, MAX_RESULTS).map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/register?parish=${p.id}`}
                    className="group flex items-center justify-between gap-3 rounded-2xl border border-line bg-canvas px-4 py-3 no-underline transition duration-200 hover:border-sun hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    <span className="min-w-0">
                      <span className="block truncate font-semibold text-ink">{p.name}</span>
                      <span className="block truncate text-xs font-semibold text-ink-muted">{p.archdeaconry}</span>
                    </span>
                    <span className="shrink-0 text-xs font-semibold text-primary transition-transform group-hover:translate-x-0.5">
                      Join →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            {matches.length > MAX_RESULTS && (
              <p className="mt-2 text-xs text-ink-muted">
                {matches.length - MAX_RESULTS} more. Keep typing to narrow it down.
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
