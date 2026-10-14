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
      <p
        className={cn(
          "font-display font-light italic leading-snug tracking-tight",
          size === "lg" ? "text-[clamp(1.6rem,3.6vw,2.6rem)]" : "text-xl"
        )}
      >
        “{text}”
      </p>
      <cite className="mt-5 flex items-center gap-3 text-xs font-semibold uppercase not-italic tracking-[0.2em] text-sun">
        <span aria-hidden="true" className="h-px w-8 bg-current" />
        {reference}
      </cite>
    </blockquote>
  );
}
