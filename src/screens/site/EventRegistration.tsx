"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { completeRegistration, lookupMember, startRegistration, type MemberMatch } from "@/lib/actions/eventRegistration";
import { Arrow, Button } from "@/design-system/Button";
import { FieldError, Notice } from "@/design-system/Field";
import { Input } from "@/design-system/Input";
import { Label } from "@/design-system/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/design-system/Select";
import { Textarea } from "@/design-system/Textarea";
import { cn } from "@/lib/cn";
import type { Archdeaconry } from "@/lib/parishes";
import { RegistrationForm } from "@/screens/site/RegistrationForm";
import { UserCodeNote } from "@/screens/site/UserCodeNote";
import type { EventField } from "@/types";

type Step =
  | { name: "find" }
  | { name: "new" }
  | { name: "pick"; matches: MemberMatch[] }
  | { name: "details"; memberId: string; firstName: string; missing: EventField[] }
  | { name: "already"; firstName: string; ticketCode: string };

const panel = "rounded-card border border-line bg-surface p-5 shadow-card sm:p-7";

/**
 * Registering for an event: returning members look themselves up by user code or phone number;
 * new members fill the Join form first. Either way they are then asked only for the event's
 * details they have never given, and land on their ticket.
 */
export function EventRegistration({ slug, archdeaconries, savesEnabled }: {
  slug: string;
  archdeaconries: Archdeaconry[];
  savesEnabled: boolean;
}) {
  const router = useRouter();
  const [step, setStep] = useState<Step>({ name: "find" });
  const [query, setQuery] = useState("");
  const [newCode, setNewCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function finish(q: string, memberId: string, given: Record<string, string>) {
    const res = await completeRegistration(slug, q, memberId, given).catch(() => null);
    if (res?.ok) {
      router.push(`/tickets/${res.ticketCode}?new=1`);
      return true;
    }
    if (res?.errors) setErrors(res.errors);
    setMessage(res?.message ?? (res?.errors ? "Please fill in the highlighted details." : "Something went wrong. Please try again."));
    return false;
  }

  async function begin(q: string, memberId: string) {
    const res = await startRegistration(slug, q, memberId).catch(() => null);
    if (!res?.ok) {
      setMessage(res?.message ?? "Something went wrong. Please try again.");
      return;
    }
    if (res.ticketCode) setStep({ name: "already", firstName: res.firstName, ticketCode: res.ticketCode });
    else if (!res.missing.length) await finish(q, memberId, {});
    else setStep({ name: "details", memberId, firstName: res.firstName, missing: res.missing });
  }

  async function find(q: string) {
    setBusy(true);
    setMessage("");
    const res = await lookupMember(slug, q).catch(() => null);
    if (!res?.ok) setMessage(res?.message ?? "Something went wrong. Please try again.");
    else if (res.matches.length === 1) await begin(q, res.matches[0].id);
    else setStep({ name: "pick", matches: res.matches });
    setBusy(false);
  }

  async function pick(memberId: string) {
    setBusy(true);
    setMessage("");
    await begin(query, memberId);
    setBusy(false);
  }

  async function submitDetails(e: FormEvent<HTMLFormElement>, memberId: string) {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    setErrors({});
    const ok = await finish(query, memberId, answers);
    if (!ok) setBusy(false);
  }

  const failure = message && (
    <Notice role="alert" className="mt-4">{message}</Notice>
  );

  if (step.name === "new") {
    return (
      <div>
        <p className="mb-4 text-ink-muted">
          First, join the fellowship. You&apos;ll get a user code, so next time you can register for events in seconds.{" "}
          <button type="button" className="font-bold text-primary underline" onClick={() => setStep({ name: "find" })}>
            I&apos;ve registered before
          </button>
        </p>
        <RegistrationForm
          archdeaconries={archdeaconries}
          savesEnabled={savesEnabled}
          submitLabel={<>Continue <span aria-hidden="true">→</span></>}
          onRegistered={(code) => {
            setNewCode(code);
            setQuery(code);
            void find(code);
          }}
        />
        {failure}
      </div>
    );
  }

  if (step.name === "already") {
    return (
      <div className={panel}>
        <h3 className="font-display text-2xl font-extrabold">You&apos;re already registered, {step.firstName}.</h3>
        <p className="mt-2 text-ink-muted">Your ticket is ready. Show it at the entrance.</p>
        <Button asChild className="mt-5">
          <Link href={`/tickets/${step.ticketCode}`}>View my ticket <Arrow /></Link>
        </Button>
      </div>
    );
  }

  if (step.name === "details") {
    return (
      <form className={panel} onSubmit={(e) => submitDetails(e, step.memberId)} noValidate>
        {newCode && <UserCodeNote code={newCode} />}
        <h3 className="font-display text-2xl font-extrabold">Almost there, {step.firstName}.</h3>
        <p className="mb-5 mt-1 text-ink-muted">This event needs a few details we don&apos;t have yet.</p>
        {step.missing.map((f) => {
          const id = `ev-${f.key}`;
          const set = (v: string) => setAnswers((a) => ({ ...a, [f.key]: v }));
          const a11y = {
            id,
            "aria-invalid": errors[f.key] ? true : undefined,
            "aria-describedby": errors[f.key] ? `${id}-err` : undefined,
          };
          return (
            <div key={f.key} className="mb-4">
              <Label htmlFor={id}>{f.label}</Label>
              {f.type === "select" ? (
                <Select value={answers[f.key] ?? ""} onValueChange={set}>
                  <SelectTrigger {...a11y}><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {f.options?.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                  </SelectContent>
                </Select>
              ) : f.type === "textarea" ? (
                <Textarea {...a11y} rows={3} value={answers[f.key] ?? ""} onChange={(e) => set(e.target.value)} />
              ) : (
                <Input {...a11y} type={f.type} value={answers[f.key] ?? ""} onChange={(e) => set(e.target.value)} />
              )}
              <FieldError id={`${id}-err`}>{errors[f.key]}</FieldError>
            </div>
          );
        })}
        <Button type="submit" disabled={busy}>{busy ? "Registering…" : <>Get my ticket <Arrow /></>}</Button>
        {failure}
      </form>
    );
  }

  return (
    <div className={panel}>
      <div role="tablist" aria-label="Have you registered before?" className="mb-6 inline-flex rounded-full bg-surface-muted p-1">
        {[
          { label: "I've registered before", active: true, go: () => undefined },
          { label: "I'm new to AYF", active: false, go: () => { setMessage(""); setStep({ name: "new" }); } },
        ].map((t) => (
          <button
            key={t.label}
            type="button"
            role="tab"
            aria-selected={t.active}
            onClick={t.go}
            className={cn(
              "rounded-full px-4 py-2 font-display text-sm font-bold transition-colors",
              t.active ? "bg-ink text-canvas" : "text-ink-muted hover:text-ink"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {step.name === "pick" ? (
        <div>
          <h3 className="mb-3 font-display text-xl font-extrabold">Which one is you?</h3>
          <ul className="grid gap-2">
            {step.matches.map((m) => (
              <li key={m.id}>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => pick(m.id)}
                  className="w-full rounded-xl border-2 border-line px-4 py-3 text-left font-semibold transition-colors hover:border-primary"
                >
                  {m.label}
                </button>
              </li>
            ))}
          </ul>
          <button type="button" className="mt-4 text-sm font-bold text-primary underline" onClick={() => setStep({ name: "find" })}>
            Search again
          </button>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (query.trim()) void find(query);
          }}
        >
          <Label htmlFor="ev-lookup">Your user code or phone number</Label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              id="ev-lookup"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="AYF-XXXXXX or 0803 123 4567"
              autoComplete="tel"
            />
            <Button type="submit" disabled={busy || !query.trim()} className="shrink-0">
              {busy ? "Looking…" : "Find me"}
            </Button>
          </div>
          <p className="mt-2 text-sm text-ink-muted">Your user code was shown when you joined. Your phone number works too.</p>
        </form>
      )}
      {failure}
    </div>
  );
}
