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
        className="inline-block bg-linear-to-r from-sun via-accent to-primary bg-clip-text text-transparent motion-safe:animate-word"
      >
        {words[i]}
      </span>
    </span>
  );
}

/** Counts up from 0 to `to` once visible. */
export function CountUp({ to, duration = 1400 }: { to: number; duration?: number }) {
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
      {value}
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
