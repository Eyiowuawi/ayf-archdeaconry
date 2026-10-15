import type {
  EducationLevel,
  RegistrationErrors,
  RegistrationInput,
} from "@/features/members/types";

// Rules for the youth membership (Join form) record. The shapes live in features/members/types.

export const EDUCATION_LEVELS: EducationLevel[] = [
  "Primary school",
  "Junior secondary (JSS)",
  "Senior secondary (SSS)",
  "OND / NCE",
  "HND / Bachelor's degree",
  "Postgraduate",
  "Not in school",
];

export function ageOn(dob: string, today = new Date()): number | null {
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return null;
  let age = today.getFullYear() - d.getFullYear();
  const m = today.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--;
  return age;
}

const PHONE_RE = /^\+?[0-9 ()-]{7,20}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Checks a registration; returns an empty object when it is valid. Used in the browser and on the server. */
export function validateRegistration(v: RegistrationInput): RegistrationErrors {
  const e: RegistrationErrors = {};
  if (!v.firstName.trim()) e.firstName = "Enter your first name.";
  if (!v.surname.trim()) e.surname = "Enter your surname.";
  if (!v.gender) e.gender = "Choose one.";
  const age = v.dateOfBirth ? ageOn(v.dateOfBirth) : null;
  if (age === null) e.dateOfBirth = "Enter your date of birth.";
  else if (age < 10 || age > 45)
    e.dateOfBirth = "Check this date: members are usually 10 to 45 years old.";
  if (!PHONE_RE.test(v.phone.trim())) e.phone = "Enter a phone number, e.g. 0803 123 4567.";
  if (v.email.trim() && !EMAIL_RE.test(v.email.trim())) e.email = "Check this email address.";
  if (!v.educationLevel) e.educationLevel = "Choose your level of education.";
  if (!v.archdeaconry) e.archdeaconry = "Choose your archdeaconry.";
  if (!v.parishId) e.parishId = "Choose your parish.";
  if (age !== null && age < 18) {
    if (!v.guardianName.trim())
      e.guardianName = "A parent or guardian's name is needed for under-18s.";
    if (!PHONE_RE.test(v.guardianPhone.trim()))
      e.guardianPhone = "Enter a parent or guardian's phone number.";
  }
  if (!v.consent) e.consent = "Please confirm to continue.";
  return e;
}
