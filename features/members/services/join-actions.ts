"use server";

import { getStore } from "@/shared/db";
import { ARCHDEACONRIES } from "@/shared/data/parishes";
import { EDUCATION_LEVELS, validateRegistration } from "@/features/members/utils/registrations";
import type { RegistrationErrors, RegistrationInput } from "@/features/members/types";

export type SubmitResult =
  { ok: true; userCode: string } | { ok: false; errors?: RegistrationErrors; message?: string };

const KEYS: (keyof RegistrationInput)[] = [
  "firstName",
  "surname",
  "gender",
  "dateOfBirth",
  "phone",
  "email",
  "educationLevel",
  "archdeaconry",
  "parishId",
  "occupation",
  "guardianName",
  "guardianPhone",
];

/** Saves a Join form submission after checking it again on the server. */
export async function submitRegistration(raw: RegistrationInput): Promise<SubmitResult> {
  const store = getStore();
  if (!store) return { ok: false, message: "Online registration isn't open yet." };

  // Keep only known fields, as trimmed strings.
  const input = Object.fromEntries(
    KEYS.map((k) => [
      k,
      typeof raw?.[k] === "string" ? (raw[k] as string).trim().slice(0, 200) : "",
    ])
  ) as unknown as RegistrationInput;
  input.consent = raw?.consent === true;

  const errors = validateRegistration(input);
  if (input.gender && input.gender !== "Male" && input.gender !== "Female")
    errors.gender = "Choose one.";
  if (input.educationLevel && !EDUCATION_LEVELS.includes(input.educationLevel as never))
    errors.educationLevel = "Choose your level of education.";
  const arch = ARCHDEACONRIES.find((a) => a.name === input.archdeaconry);
  if (!arch) errors.archdeaconry = "Choose your archdeaconry.";
  else if (!arch.parishes.some((p) => p.id === input.parishId))
    errors.parishId = "Choose your parish.";
  if (Object.keys(errors).length) return { ok: false, errors };

  try {
    const member = await store.createRegistration(input);
    return { ok: true, userCode: member.userCode };
  } catch {
    return { ok: false, message: "Something went wrong saving your details. Please try again." };
  }
}
