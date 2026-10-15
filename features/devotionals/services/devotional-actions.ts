"use server";

import { redirect } from "next/navigation";
import { requireAdmin, sessionStore } from "@/features/auth/utils/session";
import { refreshSite } from "@/shared/db/site-content";
import { ISO_DATE, slugify, text, type FormState } from "@/utils/form";

export async function saveDevotional(_: FormState, form: FormData): Promise<FormState> {
  await requireAdmin(); // before reading anything, so a signed-out visitor is redirected
  const original = text(form, "originalSlug");
  const title = text(form, "title");
  const date = text(form, "date");
  const ref = text(form, "scriptureRef");
  const scriptureText = text(form, "scriptureText");
  const body = text(form, "body")
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s*\n\s*/g, " ").trim())
    .filter(Boolean);
  const prayer = text(form, "prayer");

  if (!title) return { error: "Give the devotional a title." };
  if (!ISO_DATE.test(date)) return { error: "Choose the date it is for." };
  if (!ref || !scriptureText) return { error: "Add the Bible reference and the verse." };
  if (!body.length) return { error: "Write the devotional text." };
  if (!prayer) return { error: "Add a closing prayer." };

  try {
    const store = await sessionStore();
    let slug = original;
    if (!slug) {
      const base = slugify(title) || "devotional";
      const taken = new Set((await store.listDevotionals()).map((d) => d.slug));
      slug = base;
      for (let n = 2; taken.has(slug); n++) slug = `${base}-${n}`;
    }
    await store.saveDevotional({
      slug,
      title,
      date,
      scripture: { ref, text: scriptureText },
      body,
      prayer,
      published: form.get("published") === "on",
    });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Couldn't save the devotional." };
  }
  refreshSite();
  redirect("/admin/devotionals?saved=1");
}

export async function deleteDevotional(form: FormData) {
  await (await sessionStore()).deleteDevotional(text(form, "slug"));
  refreshSite();
  redirect("/admin/devotionals?deleted=1");
}
