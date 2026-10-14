"use client";

import { useRef, useState } from "react";
import type { ProgrammeDay } from "@/lib/content/convention";
import { cn } from "@/lib/cn";

/** Day tabs over the convention programme, with a sliding underline and a timeline. */
export default function ProgrammeTabs({ days }: { days: ProgrammeDay[] }) {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  function onKey(e: React.KeyboardEvent, i: number) {
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = (i + dir + days.length) % days.length;
    setActive(next);
    tabs.current[next]?.focus();
  }

  return (
    <div>
      <div role="tablist" aria-label="Convention days" className="relative grid grid-cols-4 border-b border-line">
        {days.map((d, i) => (
          <button
            key={d.day}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            role="tab"
            id={`tab-${i}`}
            aria-selected={active === i}
            aria-controls={`panel-${i}`}
            tabIndex={active === i ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(e) => onKey(e, i)}
            className={cn(
              "cursor-pointer px-2 py-4 text-left font-display text-lg font-extrabold transition-colors sm:text-2xl",
              active === i ? "text-ink" : "text-ink-muted hover:text-ink"
            )}
          >
            <span className="block text-[0.65rem] font-sans font-semibold uppercase tracking-[0.2em] text-accent">Day {i + 1}</span>
            <span className="sm:hidden">{d.day.slice(0, 3)}</span>
            <span className="hidden sm:inline">{d.day}</span>
          </button>
        ))}
        <span
          aria-hidden="true"
          className="absolute -bottom-px left-0 h-0.5 w-1/4 bg-sun transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ transform: `translateX(${active * 100}%)` }}
        />
      </div>

      {days.map((d, i) => (
        <div key={d.day} role="tabpanel" id={`panel-${i}`} aria-labelledby={`tab-${i}`} hidden={active !== i}>
          <ol className="relative mt-10 border-l border-line pl-8">
            {d.sessions.map((s, j) => (
              <li
                key={s.title}
                className="relative pb-10 last:pb-0 motion-safe:animate-word"
                style={{ animationDelay: `${j * 70}ms` }}
              >
                <span aria-hidden="true" className="absolute -left-[2.3rem] top-1.5 size-2.5 rounded-full border-2 border-sun bg-canvas" />
                <p className="text-sm font-semibold tabular-nums text-accent">{s.time}</p>
                <p className="mt-1 font-display text-xl font-extrabold tracking-tight sm:text-2xl">{s.title}</p>
                {s.note && <p className="mt-1 text-sm text-ink-muted">{s.note}</p>}
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
}
