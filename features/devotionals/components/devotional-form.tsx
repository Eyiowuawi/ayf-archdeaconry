"use client";

import Link from "next/link";
import { useActionState } from "react";
import { saveDevotional } from "@/features/devotionals/services/devotional-actions";
import type { FormState } from "@/utils/form";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import { FieldHint, FieldRow } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea";
import type { DevotionalRecord } from "@/features/devotionals/types";

export function DevotionalForm({ devotional: d }: { devotional?: DevotionalRecord }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveDevotional, {});
  return (
    <form
      action={action}
      className="rounded-card border border-line bg-surface p-5 shadow-card sm:p-7"
    >
      <input type="hidden" name="originalSlug" value={d?.slug ?? ""} />
      <FieldRow>
        <div className="mb-4">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" defaultValue={d?.title} required />
        </div>
        <div className="mb-4">
          <Label htmlFor="date">Date</Label>
          <Input id="date" name="date" type="date" defaultValue={d?.date} required />
          <FieldHint>The newest date is featured on the homepage.</FieldHint>
        </div>
      </FieldRow>
      <div className="mb-4">
        <Label htmlFor="scriptureRef">Bible reference</Label>
        <Input
          id="scriptureRef"
          name="scriptureRef"
          placeholder="e.g. Psalm 119:9"
          defaultValue={d?.scripture.ref}
          required
        />
      </div>
      <div className="mb-4">
        <Label htmlFor="scriptureText">Verse</Label>
        <Textarea
          id="scriptureText"
          name="scriptureText"
          className="min-h-20"
          defaultValue={d?.scripture.text}
          required
        />
        <FieldHint>King James Version, so it can be quoted freely.</FieldHint>
      </div>
      <div className="mb-4">
        <Label htmlFor="body">Devotional</Label>
        <Textarea
          id="body"
          name="body"
          className="min-h-56"
          defaultValue={d?.body.join("\n\n")}
          required
        />
        <FieldHint>Leave a blank line between paragraphs.</FieldHint>
      </div>
      <div className="mb-4">
        <Label htmlFor="prayer">Prayer</Label>
        <Textarea
          id="prayer"
          name="prayer"
          className="min-h-20"
          defaultValue={d?.prayer}
          required
        />
      </div>
      <div className="flex items-center gap-2.5">
        <Checkbox id="published" name="published" defaultChecked={d?.published ?? true} />
        <label htmlFor="published" className="text-sm font-semibold">
          Show on the website
        </label>
      </div>
      {state.error && (
        <p
          role="alert"
          className="mt-5 rounded-xl border border-danger-line bg-danger-soft px-4 py-3 text-sm text-danger"
        >
          {state.error}
        </p>
      )}
      <div className="mt-6 flex flex-wrap gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : d ? "Save changes" : "Publish devotional"}
        </Button>
        <Button asChild variant="secondary">
          <Link href="/admin/devotionals">Cancel</Link>
        </Button>
      </div>
    </form>
  );
}
