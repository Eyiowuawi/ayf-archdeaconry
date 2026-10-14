"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Calls back once the element scrolls into view (immediately under reduced motion). */
function useInView<T extends Element>(rootMargin = "0px 0px -12% 0px") {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || !("IntersectionObserver" in window)) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);
  return [ref, inView] as const;
}

/** Fades and lifts its children in when they scroll into view. */
export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const [ref, shown] = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        "transition duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
        shown ? "translate-y-0 opacity-100 blur-0" : "translate-y-10 opacity-0 blur-[2px]",
        className
      )}
    >
      {children}
    </div>
  );
}

/** Headline whose words rise into place one after another. */
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

/** A hand-drawn gold underline that draws itself under its children. */
export function Underline({ children }: { children: ReactNode }) {
  return (
    <span className="relative inline-block whitespace-nowrap">
      {children}
      <svg
        aria-hidden="true"
        viewBox="0 0 300 20"
        preserveAspectRatio="none"
        className="absolute -bottom-[0.18em] left-0 h-[0.32em] w-full text-sun"
      >
        <path
          d="M3 14 C 70 4, 150 4, 297 10"
          pathLength={1}
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray="1"
          className="motion-safe:animate-draw"
        />
      </svg>
    </span>
  );
}

/** Counts up from 0 to `to` once visible. */
export function CountUp({ to, suffix = "", duration = 1800 }: { to: number; suffix?: string; duration?: number }) {
  const [ref, inView] = useInView<HTMLSpanElement>();
  const [value, setValue] = useState(to);
  const started = useRef(false);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (!started.current) setValue(0);
    if (!inView || started.current) return;
    started.current = true;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setValue(Math.round(to * (1 - Math.pow(1 - t, 4))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {value.toLocaleString("en-NG")}
      {suffix}
    </span>
  );
}

/** Moves its children slower than the page as you scroll, for depth. */
export function Parallax({ children, speed = 0.15, className }: { children: ReactNode; speed?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      if (ref.current) ref.current.style.transform = `translate3d(0, ${window.scrollY * speed}px, 0)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [speed]);
  return (
    <div ref={ref} className={cn("will-change-transform", className)}>
      {children}
    </div>
  );
}

/** Soft gold light and a fine grid drifting behind navy bands. */
export function Aurora() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute -right-40 -top-40 size-[40rem] rounded-full bg-sun/20 blur-[120px] motion-safe:animate-glow" />
      <div className="absolute -bottom-56 -left-40 size-[36rem] rounded-full bg-night-ink/10 blur-[120px] motion-safe:animate-glow [animation-delay:-7s]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(255_255_255/0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.04)_1px,transparent_1px)] bg-size-[64px_64px] mask-[radial-gradient(ellipse_at_top_right,black,transparent_70%)]" />
    </div>
  );
}

/** Endless, slow scrolling line of words. */
export function Marquee({ items }: { items: string[] }) {
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center gap-10 pr-10">
      {items.map((w, i) => (
        <li key={i} className="flex items-center gap-10 whitespace-nowrap">
          {w}
          <span aria-hidden="true" className="text-sun">✦</span>
        </li>
      ))}
    </ul>
  );
  return (
    <div className="flex overflow-hidden mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <div className="flex motion-safe:animate-marquee">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return { days: Math.floor(s / 86400), hours: Math.floor((s % 86400) / 3600), mins: Math.floor((s % 3600) / 60), secs: s % 60 };
}

/** Live countdown to an ISO date; shows a friendly label when there's no date or it has passed. */
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
