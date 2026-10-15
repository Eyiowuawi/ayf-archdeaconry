"use server";

import { revalidatePath } from "next/cache";
import { sessionStore } from "@/features/auth/utils/session";
import type { RegistrationStatus } from "@/features/members/types";
import { text } from "@/utils/form";

const STATUSES: RegistrationStatus[] = ["pending", "approved", "rejected"];

export async function setRegistrationStatus(form: FormData) {
  const store = await sessionStore();
  const status = text(form, "status") as RegistrationStatus;
  if (!STATUSES.includes(status)) return;
  await store.setRegistrationStatus(text(form, "id"), status);
  revalidatePath("/admin", "layout");
}

export async function deleteRegistration(form: FormData) {
  await (await sessionStore()).deleteRegistration(text(form, "id"));
  revalidatePath("/admin", "layout");
}
