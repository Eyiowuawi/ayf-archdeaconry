import Link from "next/link";
import type { ComponentType, ReactNode } from "react";
import { cardBase, cardLift } from "@/shared/ui/card";
import { cn } from "@/utils/utils";

export interface KpiCardProps {
  title: string;
  value: ReactNode;
  /** The badge in the top-right corner. */
  icon?: ComponentType<{ className?: string }>;
  /** Caption shown below the value. */
  description?: string;
  /** Tints the card to flag something that needs attention. */
  highlight?: boolean;
  href?: string;
  className?: string;
}

/** The standard metric card: title and big value top-left, icon badge top-right, caption under. */
export function KpiCard({
  title,
  value,
  icon: Icon,
  description,
  highlight,
  href,
  className,
}: KpiCardProps) {
  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-ink-muted">{title}</p>
          <p className="mt-1.5 text-2xl font-semibold leading-none tabular-nums text-ink">
            {value}
          </p>
        </div>
        {Icon && (
          <span
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-lg",
              highlight ? "bg-danger-soft text-danger" : "bg-sun/15 text-sun"
            )}
          >
            <Icon className="size-4" />
          </span>
        )}
      </div>
      {description && <p className="mt-3 text-xs text-ink-muted">{description}</p>}
    </>
  );
  const classes = cn(
    cardBase,
    "block p-5 text-ink no-underline",
    highlight && "border-danger-line bg-danger-soft/40",
    className
  );
  return href ? (
    <Link href={href} className={cn(classes, cardLift)}>
      {body}
    </Link>
  ) : (
    <div className={classes}>{body}</div>
  );
}
