// Shape of a youth membership registration. The public Join form produces `RegistrationInput`;
// the future records database / admin dashboard should store it as a `Registration` record.

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
