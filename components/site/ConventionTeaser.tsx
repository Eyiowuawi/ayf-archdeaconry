import { Arrow, ButtonLink } from "@/components/ui/Button";
import { Countdown } from "@/components/ui/Motion";
import { CONVENTION, formatNaira } from "@/lib/content/convention";

/** Compact convention card: theme, countdown and the registration call to action. */
export default function ConventionTeaser() {
  const c = CONVENTION;
  return (
    <div className="grid gap-8 rounded-card border border-line bg-surface p-6 shadow-lift sm:p-8 md:grid-cols-[1.3fr_1fr] md:items-center">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{c.edition}</p>
        <p className="mt-3 font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
          “{c.theme}”
          <span className="ml-3 align-middle text-sm font-sans font-semibold tracking-normal text-ink-muted">{c.themeRef}</span>
        </p>
        <p className="mt-3 text-sm text-ink-muted">
          {c.startDate ? c.datesLabel : "Dates to be announced"} · {c.city} · {formatNaira(c.fee)} per delegate
        </p>
      </div>
      <div className="flex flex-col items-start gap-5 md:items-end">
        <Countdown start={c.startDate} end={c.endDate} pendingLabel="Dates coming soon" tone="light" />
        <ButtonLink href="/convention" variant="sun">
          Convention details <Arrow />
        </ButtonLink>
      </div>
    </div>
  );
}
