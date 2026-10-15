"use client";

import Link from "next/link";
import { useActionState } from "react";
import { saveEvent, type FormState } from "@/lib/actions/admin";
import { Button } from "@/design-system/Button";
import { Checkbox } from "@/design-system/Checkbox";
import { FieldHint, FieldRow, Optional } from "@/design-system/Field";
import { Input } from "@/design-system/Input";
import { Label } from "@/design-system/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/design-system/Select";
import { Textarea } from "@/design-system/Textarea";
import { EVENT_LEVELS } from "@/lib/events";
import type { EventRecord } from "@/lib/db/store";

export function EventForm({ event }: { event?: EventRecord }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveEvent, {});
  return (
    <form action={action} className="rounded-card border border-line bg-surface p-5 shadow-card sm:p-7">
      <input type="hidden" name="originalSlug" value={event?.slug ?? ""} />
      <div className="mb-4">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" defaultValue={event?.title} required />
      </div>
      <FieldRow>
        <div className="mb-4">
          <Label htmlFor="date">Date</Label>
          <Input id="date" name="date" type="date" defaultValue={event?.date} required />
        </div>
        <div className="mb-4">
          <Label htmlFor="endDate">End date <Optional /></Label>
          <Input id="endDate" name="endDate" type="date" defaultValue={event?.endDate} />
        </div>
      </FieldRow>
      <FieldRow>
        <div className="mb-4">
          <Label htmlFor="time">Start time <Optional /></Label>
          <Input id="time" name="time" placeholder="e.g. 10:00 am" defaultValue={event?.time} />
        </div>
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
      </FieldRow>
      <div className="mb-4">
        <Label htmlFor="venue">Venue</Label>
        <Input id="venue" name="venue" defaultValue={event?.venue} placeholder="Venue to be announced" required />
      </div>
      <div className="mb-4">
        <Label htmlFor="summary">Summary</Label>
        <Textarea id="summary" name="summary" defaultValue={event?.summary} required />
        <FieldHint>One or two sentences shown on the event card.</FieldHint>
      </div>
      <div className="flex items-center gap-2.5">
        <Checkbox id="published" name="published" defaultChecked={event?.published ?? true} />
        <label htmlFor="published" className="text-sm font-semibold">Show on the website</label>
      </div>
      {state.error && (
        <p role="alert" className="mt-5 rounded-xl border border-danger-line bg-danger-soft px-4 py-3 text-sm text-danger">{state.error}</p>
      )}
      <div className="mt-6 flex flex-wrap gap-3">
        <Button type="submit" disabled={pending}>{pending ? "Saving…" : event ? "Save changes" : "Add event"}</Button>
        <Button asChild variant="secondary"><Link href="/admin/events">Cancel</Link></Button>
      </div>
    </form>
  );
}
