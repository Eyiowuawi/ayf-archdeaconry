// Youth members, who join through the public Join form.

export type EducationLevel =
  | "Primary school"
  | "Junior secondary (JSS)"
  | "Senior secondary (SSS)"
  | "OND / NCE"
  | "HND / Bachelor's degree"
  | "Postgraduate"
  | "Not in school";

/** What the public Join form sends. */
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

export type RegistrationStatus = "pending" | "approved" | "rejected";

/** A stored member. `userCode` is the system-generated code members use to find their record. */
export type Registration = Omit<RegistrationInput, "gender" | "educationLevel"> & {
  id: string;
  userCode: string;
  gender: "Male" | "Female";
  educationLevel: EducationLevel;
  status: RegistrationStatus;
  /** Answers to event questions, keyed by EventField.key. */
  extra?: Record<string, string>;
  createdAt: string; // ISO timestamp
  updatedAt: string;
};

export type RegistrationErrors = Partial<Record<keyof RegistrationInput, string>>;
