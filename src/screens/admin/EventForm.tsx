"use client";

import Link from "next/link";
import { startTransition, useActionState, useState, type FormEvent, type ReactNode } from "react";
import { saveEvent, type FormState } from "@/lib/actions/admin";
import { Button } from "@/design-system/Button";
import { Checkbox } from "@/design-system/Checkbox";
import { FieldHint, FieldRow, Optional } from "@/design-system/Field";
import { Input } from "@/design-system/Input";
import { Label } from "@/design-system/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/design-system/Select";
import { Textarea } from "@/design-system/Textarea";
import { PRESET_FIELDS, customQuestionsText } from "@/lib/eventFields";
import { EVENT_LEVELS, toLagosInput } from "@/lib/events";
import type { EventRecord } from "@/types";

function Section({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <section className="border-t border-line pt-6 first-of-type:border-t-0 first-of-type:pt-0">
      <h2 className="font-display text-lg font-extrabold">{title}</h2>
      {hint && <p className="mb-4 text-sm text-ink-muted">{hint}</p>}
      <div className={hint ? "" : "mt-4"}>{children}</div>
    </section>
  );
}

function CheckRow({ id, name, value, defaultChecked, onCheckedChange, children }: {
  id: string;
  name: string;
  value?: string;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  children: ReactNode;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <Checkbox
        id={id}
        name={name}
        value={value}
        defaultChecked={defaultChecked}
        onCheckedChange={onCheckedChange ? (c) => onCheckedChange(c === true) : undefined}
        className="mt-0.5"
      />
      <label htmlFor={id} className="text-sm font-semibold">{children}</label>
    </div>
  );
}

export function EventForm({ event }: { event?: EventRecord }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveEvent, {});
  const [takesRegistration, setTakesRegistration] = useState(Boolean(event?.registration));
  const picked = new Set(event?.registration?.fields.map((f) => f.key));

  // Submit without React's automatic form reset, so a validation error keeps what was typed.
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    startTransition(() => action(data));
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 rounded-card border border-line bg-surface p-5 shadow-card sm:p-7">
      <input type="hidden" name="originalSlug" value={event?.slug ?? ""} />

      <Section title="The event">
        <div className="mb-4">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" defaultValue={event?.title} required />
        </div>
        <FieldRow>
          <div className="mb-4">
            <Label htmlFor="level">For</Label>
            <Select name="level" defaultValue={event?.level ?? "Diocese"}>
              <SelectTrigger id="level"><SelectValue /></SelectTrigger>
              <SelectContent>
                {EVENT_LEVELS.map((l) => (
                  <SelectItem key={l} value={l}>{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="mb-4">
            <Label htmlFor="venue">Venue</Label>
            <Input id="venue" name="venue" defaultValue={event?.venue} placeholder="Venue to be announced" required />
          </div>
        </FieldRow>
        <div className="mb-4">
          <Label htmlFor="summary">Summary</Label>
          <Textarea id="summary" name="summary" defaultValue={event?.summary} rows={2} required />
          <FieldHint>One or two sentences shown on the event card.</FieldHint>
        </div>
        <div className="mb-4">
          <Label htmlFor="description">Description of the meeting <Optional /></Label>
          <Textarea id="description" name="description" defaultValue={event?.description} rows={6} />
          <FieldHint>Shown on the event&apos;s page. Leave a blank line between paragraphs.</FieldHint>
        </div>
        <div>
          <Label htmlFor="speakers">Speakers <Optional /></Label>
          <Textarea
            id="speakers"
            name="speakers"
            rows={3}
            placeholder={"Ven. A. Example — Archdeacon of Ake\nBro. B. Example — Youth President"}
            defaultValue={event?.speakers?.map((s) => (s.role ? `${s.name} — ${s.role}` : s.name)).join("\n")}
          />
          <FieldHint>One speaker per line, with their role after a dash.</FieldHint>
        </div>
      </Section>

      <Section title="Date and time" hint="For a one-day event, leave the last day empty. Times are Nigerian time.">
        <FieldRow>
          <div className="mb-4">
            <Label htmlFor="date">First day</Label>
            <Input id="date" name="date" type="date" defaultValue={event?.date} required />
          </div>
          <div className="mb-4">
            <Label htmlFor="endDate">Last day <Optional /></Label>
            <Input id="endDate" name="endDate" type="date" defaultValue={event?.endDate} />
          </div>
        </FieldRow>
        <FieldRow>
          <div className="mb-4 sm:mb-0">
            <Label htmlFor="startTime">Starts at <Optional /></Label>
            <Input id="startTime" name="startTime" type="time" defaultValue={event?.startTime} />
          </div>
          <div>
            <Label htmlFor="endTime">Ends at <Optional /></Label>
            <Input id="endTime" name="endTime" type="time" defaultValue={event?.endTime} />
          </div>
        </FieldRow>
      </Section>

      <Section title="Flier" hint="A JPG, PNG or WebP image, or a PDF, up to 4 MB.">
        {event?.flier && (
          <div className="mb-4 flex flex-wrap items-center gap-4">
            {event.flier.type.startsWith("image/") ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={`/uploads/${event.flier.id}`} alt="Current flier" className="h-28 w-auto rounded-xl border border-line object-cover" />
            ) : (
              <a href={`/uploads/${event.flier.id}`} target="_blank" rel="noreferrer" className="text-sm font-bold text-primary">Current flier (PDF)</a>
            )}
            <CheckRow id="removeFlier" name="removeFlier">Remove the current flier</CheckRow>
          </div>
        )}
        <Label htmlFor="flier">{event?.flier ? "Replace with" : "Upload a flier"} <Optional /></Label>
        <Input id="flier" name="flier" type="file" accept="image/jpeg,image/png,image/webp,application/pdf" className="py-2.5" />
      </Section>

      <Section title="Registration" hint="Members register on the event's page and get a ticket to show at the entrance.">
        <CheckRow id="takesRegistration" name="takesRegistration" defaultChecked={takesRegistration} onCheckedChange={setTakesRegistration}>
          Take registrations for this event
        </CheckRow>
        {takesRegistration && (
          <div className="mt-5">
            <FieldRow>
              <div className="mb-4">
                <Label htmlFor="opensAt">Registration opens</Label>
                <Input id="opensAt" name="opensAt" type="datetime-local" defaultValue={event?.registration ? toLagosInput(event.registration.opensAt) : undefined} required />
              </div>
              <div className="mb-4">
                <Label htmlFor="closesAt">Registration closes</Label>
                <Input id="closesAt" name="closesAt" type="datetime-local" defaultValue={event?.registration ? toLagosInput(event.registration.closesAt) : undefined} required />
              </div>
            </FieldRow>
            <fieldset className="mb-4">
              <legend className="mb-1 text-sm font-bold">Extra details this event needs</legend>
              <p className="mb-3 text-sm text-ink-muted">
                Name, phone, parish and the rest of the Join form are always collected. Members are only asked for
                these if they have never given them before.
              </p>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {PRESET_FIELDS.map((f) => (
                  <CheckRow key={f.key} id={`field-${f.key}`} name="fields" value={f.key} defaultChecked={picked.has(f.key)}>
                    {f.label}
                  </CheckRow>
                ))}
              </div>
            </fieldset>
            <Label htmlFor="questions">Other questions <Optional /></Label>
            <Textarea
              id="questions"
              name="questions"
              rows={3}
              placeholder={"Do you need accommodation?: Yes, No\nName of your parish youth president"}
              defaultValue={customQuestionsText(event?.registration?.fields)}
            />
            <FieldHint>One question per line. To offer choices, put them after a colon, separated by commas.</FieldHint>
          </div>
        )}
      </Section>

      <Section title="Website">
        <CheckRow id="published" name="published" defaultChecked={event?.published ?? false}>
          Publish on the website
        </CheckRow>
        <FieldHint>Unpublished events are only visible here in the admin area.</FieldHint>
      </Section>

      {state.error && (
        <p role="alert" className="rounded-xl border border-danger-line bg-danger-soft px-4 py-3 text-sm text-danger">{state.error}</p>
      )}
      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={pending}>{pending ? "Saving…" : event ? "Save changes" : "Add event"}</Button>
        <Button asChild variant="secondary"><Link href="/admin/events">Cancel</Link></Button>
      </div>
    </form>
  );
}
