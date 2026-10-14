"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Fades and slides its children in when they scroll into view. */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || !("IntersectionObserver" in window)) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        "transition duration-700 ease-out motion-reduce:transition-none",
        shown ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100",
        className
      )}
    >
      {children}
    </div>
  );
}

/** Cycles through words with a little pop-in animation. */
export function RotatingWord({ words, interval = 2200 }: { words: string[]; interval?: number }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const id = setInterval(() => setI((n) => (n + 1) % words.length), interval);
    return () => clearInterval(id);
  }, [words.length, interval]);
  return (
    <span className="relative inline-block">
      <span className="sr-only">{words.join(", ")}</span>
      <span
        key={i}
        aria-hidden="true"
        className="inline-block bg-linear-to-r from-sun via-accent to-sun bg-size-[200%_auto] bg-clip-text text-transparent motion-safe:animate-word"
      >
        {words[i]}
      </span>
    </span>
  );
}

/** Counts up from 0 to `to` once visible. */
export function CountUp({ to, suffix = "", duration = 1400 }: { to: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(to);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || !("IntersectionObserver" in window)) return;
    setValue(0);
    let raf = 0;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        setValue(Math.round(to * (1 - Math.pow(1 - t, 3))));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {value.toLocaleString("en-NG")}
      {suffix}
    </span>
  );
}

/** Soft, slowly drifting colour blobs for dark bands. */
export function Blobs() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute -left-24 -top-24 size-[28rem] rounded-full bg-primary/50 blur-3xl motion-safe:animate-blob" />
      <div className="absolute -right-20 top-10 size-[24rem] rounded-full bg-accent/40 blur-3xl motion-safe:animate-blob [animation-delay:-6s]" />
      <div className="absolute -bottom-32 left-1/3 size-[22rem] rounded-full bg-sun/25 blur-3xl motion-safe:animate-blob [animation-delay:-12s]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(255_255_255/0.08)_1px,transparent_0)] bg-size-[22px_22px]" />
    </div>
  );
}

/** Endless scrolling strip of words. */
export function Marquee({ items }: { items: string[] }) {
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center gap-8 pr-8">
      {items.map((w, i) => (
        <li key={i} className="flex items-center gap-8 whitespace-nowrap">
          {w}
          <span className="text-accent">✦</span>
        </li>
      ))}
    </ul>
  );
  return (
    <div className="flex overflow-hidden">
      <div className="flex motion-safe:animate-marquee">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}

/** Words slide up one after another, e.g. for a headline. */
export function SplitReveal({ text, delay = 0, step = 70 }: { text: string; delay?: number; step?: number }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
          <span
            className="inline-block motion-safe:animate-rise"
            style={{ animationDelay: `${delay + i * step}ms` }}
          >
            {w}
            {i < words.length - 1 ? " " : ""}
          </span>
        </span>
      ))}
    </>
  );
}

/** Dark-band background (same drifting blobs as the rest of the site). */
export const Aurora = Blobs;

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return { days: Math.floor(s / 86400), hours: Math.floor((s % 86400) / 3600), mins: Math.floor((s % 3600) / 60), secs: s % 60 };
}

/** Live countdown to an event, or a "coming soon" label when no date is set. */
export function Countdown({
  start,
  end,
  pendingLabel,
  tone = "night",
}: {
  start: string | null;
  end: string | null;
  pendingLabel: string;
  tone?: "night" | "light";
}) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    if (!start) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [start]);

  const muted = tone === "night" ? "text-night-muted" : "text-ink-muted";
  const box =
    tone === "night" ? "border-night-ink/15 bg-night-ink/5 text-night-ink" : "border-line bg-surface text-ink";

  if (!start) {
    return (
      <p className={cn("inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.18em]", muted)}>
        <span className="relative flex size-2.5">
          <span className="absolute inset-0 rounded-full bg-sun motion-safe:animate-pulse-ring" />
          <span className="relative size-2.5 rounded-full bg-sun" />
        </span>
        {pendingLabel}
      </p>
    );
  }

  const startMs = new Date(`${start}T09:00:00+01:00`).getTime();
  const endMs = new Date(`${end ?? start}T18:00:00+01:00`).getTime();
  if (now !== null && now > endMs) {
    return <p className={cn("text-sm font-semibold uppercase tracking-[0.18em]", muted)}>This convention has ended</p>;
  }
  if (now !== null && now >= startMs) {
    return <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sun">Happening now</p>;
  }

  const p = parts(now === null ? 0 : startMs - now);
  const cells = [
    { label: "Days", v: p.days },
    { label: "Hours", v: p.hours },
    { label: "Minutes", v: p.mins },
    { label: "Seconds", v: p.secs },
  ];
  return (
    <div role="timer" aria-label={`${p.days} days to go`} className="flex gap-2 sm:gap-3">
      {cells.map((c) => (
        <div key={c.label} className={cn("w-16 rounded-xl border px-2 py-3 text-center sm:w-20", box)}>
          <div className="h-8 overflow-hidden font-display text-3xl font-medium leading-8 tabular-nums sm:h-9 sm:text-4xl sm:leading-9">
            <span key={c.v} className="block motion-safe:animate-rise">
              {now === null ? "–" : String(c.v).padStart(2, "0")}
            </span>
          </div>
          <div className={cn("mt-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em]", muted)}>{c.label}</div>
        </div>
      ))}
    </div>
  );
}
