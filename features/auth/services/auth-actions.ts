"use server";

import { redirect } from "next/navigation";
import { checkCredentials, endSession, startSession } from "@/features/auth/utils/session";
import { text, type FormState } from "@/utils/form";

export async function login(_: FormState, form: FormData): Promise<FormState> {
  const role = checkCredentials(
    text(form, "email"),
    typeof form.get("password") === "string" ? (form.get("password") as string) : ""
  );
  if (!role) {
    await new Promise((r) => setTimeout(r, 800)); // slow down guessing
    return { error: "That email or password isn't right." };
  }
  await startSession(role);
  redirect("/admin");
}

export async function logout() {
  await endSession();
  redirect("/admin/login");
}
