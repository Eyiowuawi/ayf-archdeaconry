import { cn } from "@/lib/cn";

export default function Scripture({
  text,
  reference,
  size = "md",
}: {
  text: string;
  reference: string;
  size?: "md" | "lg";
}) {
  return (
    <blockquote className="relative">
      <span aria-hidden="true" className="absolute -left-1 -top-6 font-display text-7xl leading-none text-accent/40">
        “
      </span>
      <p
        className={cn(
          "relative font-display font-bold leading-snug tracking-tight",
          size === "lg" ? "text-[clamp(1.4rem,3.2vw,2.1rem)]" : "text-xl"
        )}
      >
        {text}
      </p>
      <cite className="mt-3 inline-block rounded-full bg-sun px-3 py-1 text-xs font-bold not-italic text-sun-ink">
        {reference}
      </cite>
    </blockquote>
  );
}
