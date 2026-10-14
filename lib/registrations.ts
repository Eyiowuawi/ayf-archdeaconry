// Shape of a youth membership registration. The public Join form produces `RegistrationInput`;
// the admin area stores it as a `Registration` record (see lib/db).

export const EDUCATION_LEVELS = [
  "Primary school",
  "Junior secondary (JSS)",
  "Senior secondary (SSS)",
  "OND / NCE",
  "HND / Bachelor's degree",
  "Postgraduate",
  "Not in school",
] as const;

export type EducationLevel = (typeof EDUCATION_LEVELS)[number];

export type RegistrationInput = {
  firstName: string;
  surname: string;
  gender: "" | "Male" | "Female";
  dateOfBirth: string;
  phone: string;
  email: string;
  educationLevel: "" | EducationLevel;
  archdeaconry: string;
  parishId: string;
  occupation: string;
  guardianName: string;
  guardianPhone: string;
  consent: boolean;
};

/** A stored registration, as the admin dashboard will list and manage it. */
export type Registration = Omit<RegistrationInput, "gender" | "educationLevel"> & {
  id: string;
  gender: "Male" | "Female";
  educationLevel: EducationLevel;
  status: "pending" | "approved" | "rejected";
  createdAt: string; // ISO timestamp
  updatedAt: string;
};

export type RegistrationErrors = Partial<Record<keyof RegistrationInput, string>>;

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
  else if (age < 10 || age > 45) e.dateOfBirth = "Check this date: members are usually 10 to 45 years old.";
  if (!PHONE_RE.test(v.phone.trim())) e.phone = "Enter a phone number, e.g. 0803 123 4567.";
  if (v.email.trim() && !EMAIL_RE.test(v.email.trim())) e.email = "Check this email address.";
  if (!v.educationLevel) e.educationLevel = "Choose your level of education.";
  if (!v.archdeaconry) e.archdeaconry = "Choose your archdeaconry.";
  if (!v.parishId) e.parishId = "Choose your parish.";
  if (age !== null && age < 18) {
    if (!v.guardianName.trim()) e.guardianName = "A parent or guardian's name is needed for under-18s.";
    if (!PHONE_RE.test(v.guardianPhone.trim())) e.guardianPhone = "Enter a parent or guardian's phone number.";
  }
  if (!v.consent) e.consent = "Please confirm to continue.";
  return e;
}
