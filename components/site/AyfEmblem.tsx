import { cn } from "@/lib/cn";

/**
 * Stand-in AYF emblem, drawn from the published description of the official badge:
 * an open Bible between twigs forming a "V", in a circle with a blue background.
 * (The official emblem also has a handshake.) To use the official artwork instead,
 * add it as public/ayf-logo.png and swap this component for an <Image>.
 */
export default function AyfEmblem({ className, title = "Anglican Youth Fellowship emblem" }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 64 64" role="img" aria-label={title} className={cn("shrink-0", className)}>
      <circle cx="32" cy="32" r="31" className="fill-sun" />
      <circle cx="32" cy="32" r="27.5" className="fill-primary" />
      {/* Twigs forming a V */}
      <g className="stroke-sun" strokeWidth="2.6" strokeLinecap="round" fill="none">
        <path d="M32 52 L15 15" />
        <path d="M32 52 L49 15" />
        <path d="M21.5 29 l-5 -2.5 M18.5 22.5 l-4.5 -1 M42.5 29 l5 -2.5 M45.5 22.5 l4.5 -1" strokeWidth="2" />
      </g>
      {/* Open Bible */}
      <path d="M32 27 C27 24.5 22 24.5 18.5 26 V41 C22 39.5 27 39.5 32 42 Z" fill="#fff" />
      <path d="M32 27 C37 24.5 42 24.5 45.5 26 V41 C42 39.5 37 39.5 32 42 Z" fill="#fff" />
      <path d="M32 27 V42" className="stroke-primary" strokeWidth="1.2" />
      <path d="M22 30 h6.5 M22 33 h6.5 M22 36 h5 M35.5 30 h6.5 M35.5 33 h6.5 M35.5 36 h5" className="stroke-primary/50" strokeWidth="1" strokeLinecap="round" />
      <path d="M31 31.5 h2 M32 29.5 v5" className="stroke-sun" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
