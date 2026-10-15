import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface PageHeaderProps {
  /** Every word renders in ink except the last, which renders in the primary colour. */
  title: string;
  description?: ReactNode;
  /** Controls (buttons, filters) to the right of the heading; on phones they drop beneath it. */
  actions?: ReactNode;
  /** A link back to the page this one was opened from, shown above the heading. */
  back?: { href: string; label: string };
  /** False renders the whole title in ink. */
  accent?: boolean;
}

/** Two-tone page heading used at the top of every admin page. */
export function PageHeader({ title, description, actions, back, accent = true }: PageHeaderProps) {
  const words = title.trim().split(/\s+/);
  const highlight = accent && words.length > 1 ? (words.pop() ?? "") : "";
  const lead = words.join(" ");

  const heading = (
    <div>
      {back && (
        <Link
          href={back.href}
          className="mb-3 inline-flex items-center gap-1.5 text-sm text-ink-muted no-underline transition-colors hover:text-ink"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          {back.label}
        </Link>
      )}
      <h1 className="text-2xl font-semibold text-ink">
        {lead}
        {highlight && <span className="text-primary"> {highlight}</span>}
      </h1>
      {description && <div className="mt-1 text-sm text-ink-muted">{description}</div>}
    </div>
  );

  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
      {heading}
      {actions && (
        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">{actions}</div>
      )}
    </div>
  );
}
