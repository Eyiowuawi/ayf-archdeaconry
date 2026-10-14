"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { FieldError, FieldRow, Fieldset, Input, Label, Notice, Optional, Select } from "@/components/ui/Form";
import type { Archdeaconry } from "@/lib/parishes";

// Registrations are not stored yet: this form validates and previews only.
// When the youth records database exists, POST `RegistrationInput` to it in `handleSubmit`
// and flip this flag so the "preview" notice disappears.
const SAVES_ENABLED = false;

export type RegistrationInput = {
  firstName: string;
  surname: string;
  gender: "" | "Male" | "Female";
  dateOfBirth: string;
  phone: string;
  email: string;
  archdeaconry: string;
  parishId: string;
  occupation: string;
  guardianName: string;
  guardianPhone: string;
  consent: boolean;
};

const EMPTY: RegistrationInput = {
  firstName: "",
  surname: "",
  gender: "",
  dateOfBirth: "",
  phone: "",
  email: "",
  archdeaconry: "",
  parishId: "",
  occupation: "",
  guardianName: "",
  guardianPhone: "",
  consent: false,
};

type Errors = Partial<Record<keyof RegistrationInput, string>>;

function ageOn(dob: string, today = new Date()): number | null {
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return null;
  let age = today.getFullYear() - d.getFullYear();
  const m = today.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--;
  return age;
}

const PHONE_RE = /^\+?[0-9 ()-]{7,20}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(v: RegistrationInput): Errors {
  const e: Errors = {};
  if (!v.firstName.trim()) e.firstName = "Enter your first name.";
  if (!v.surname.trim()) e.surname = "Enter your surname.";
  if (!v.gender) e.gender = "Choose one.";
  const age = v.dateOfBirth ? ageOn(v.dateOfBirth) : null;
  if (age === null) e.dateOfBirth = "Enter your date of birth.";
  else if (age < 10 || age > 45) e.dateOfBirth = "Check this date: members are usually 10 to 45 years old.";
  if (!PHONE_RE.test(v.phone.trim())) e.phone = "Enter a phone number, e.g. 0803 123 4567.";
  if (v.email.trim() && !EMAIL_RE.test(v.email.trim())) e.email = "Check this email address.";
  if (!v.archdeaconry) e.archdeaconry = "Choose your archdeaconry.";
  if (!v.parishId) e.parishId = "Choose your parish.";
  if (age !== null && age < 18) {
    if (!v.guardianName.trim()) e.guardianName = "A parent or guardian's name is needed for under-18s.";
    if (!PHONE_RE.test(v.guardianPhone.trim())) e.guardianPhone = "Enter a parent or guardian's phone number.";
  }
  if (!v.consent) e.consent = "Please confirm to continue.";
  return e;
}

export default function RegistrationForm({
  archdeaconries,
  initialParishId,
}: {
  archdeaconries: Archdeaconry[];
  /** Pre-selects a parish, e.g. when arriving from the homepage parish finder. */
  initialParishId?: string;
}) {
  const [values, setValues] = useState<RegistrationInput>(() => {
    const arch = initialParishId
      ? archdeaconries.find((a) => a.parishes.some((p) => p.id === initialParishId))
      : undefined;
    return arch ? { ...EMPTY, archdeaconry: arch.name, parishId: initialParishId! } : EMPTY;
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState<RegistrationInput | null>(null);

  const parishes = useMemo(
    () => archdeaconries.find((a) => a.name === values.archdeaconry)?.parishes ?? [],
    [archdeaconries, values.archdeaconry]
  );
  const age = values.dateOfBirth ? ageOn(values.dateOfBirth) : null;
  const isMinor = age !== null && age < 18;

  function set<K extends keyof RegistrationInput>(key: K, value: RegistrationInput[K]) {
    setValues((v) => {
      const next = { ...v, [key]: value };
      if (key === "archdeaconry") next.parishId = "";
      return next;
    });
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const found = validate(values);
    setErrors(found);
    const firstBad = Object.keys(found)[0];
    if (firstBad) {
      document.getElementById(`reg-${firstBad}`)?.focus();
      return;
    }
    setSubmitted(values);
  }

  if (submitted) {
    const parishName =
      archdeaconries.flatMap((a) => a.parishes).find((p) => p.id === submitted.parishId)?.name ?? "";
    return (
      <div role="status" className="rounded-card border border-line bg-surface p-6 shadow-lift sm:p-8">
        <div aria-hidden="true" className="mb-4 grid size-14 place-items-center rounded-2xl bg-linear-to-br from-primary via-accent to-sun text-2xl text-white motion-safe:animate-float">✓</div>
        <h2 className="mb-2 font-display text-3xl font-extrabold tracking-tight">
          {SAVES_ENABLED ? `Welcome to the family, ${submitted.firstName}!` : `Looking good, ${submitted.firstName}!`}
        </h2>
        {SAVES_ENABLED ? (
          <p>Your registration has been received. Your parish youth leaders will be in touch.</p>
        ) : (
          <p>
            Online registration isn&apos;t switched on yet, so these details were <b>not saved</b>.
            Until it opens, please register with your parish youth president.
          </p>
        )}
        <dl className="my-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-[0.93rem]">
          <dt className="font-bold text-ink-muted">Name</dt>
          <dd>{submitted.firstName} {submitted.surname}</dd>
          <dt className="font-bold text-ink-muted">Parish</dt>
          <dd>
            {parishName}
            <br />
            <span className="text-ink-muted">{submitted.archdeaconry}</span>
          </dd>
          <dt className="font-bold text-ink-muted">Phone</dt>
          <dd>{submitted.phone}</dd>
        </dl>
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            setValues(EMPTY);
            setSubmitted(null);
          }}
        >
          Start again
        </Button>
      </div>
    );
  }

  const err = (k: keyof RegistrationInput) => <FieldError id={`reg-${k}-err`}>{errors[k]}</FieldError>;
  const a11y = (k: keyof RegistrationInput) => ({
    id: `reg-${k}`,
    "aria-invalid": errors[k] ? true : undefined,
    "aria-describedby": errors[k] ? `reg-${k}-err` : undefined,
  });
  const field = "mb-3";

  return (
    <form onSubmit={handleSubmit} noValidate>
      {!SAVES_ENABLED && (
        <Notice className="mb-5 bg-surface shadow-card">
          <b>Preview:</b> online registration opens soon. You can try the form, but details are not saved yet.
        </Notice>
      )}

      <Fieldset legend="About you">
        <FieldRow>
          <div className={field}>
            <Label htmlFor="reg-firstName">First name</Label>
            <Input {...a11y("firstName")} autoComplete="given-name"
              value={values.firstName} onChange={(e) => set("firstName", e.target.value)} />
            {err("firstName")}
          </div>
          <div className={field}>
            <Label htmlFor="reg-surname">Surname</Label>
            <Input {...a11y("surname")} autoComplete="family-name"
              value={values.surname} onChange={(e) => set("surname", e.target.value)} />
            {err("surname")}
          </div>
        </FieldRow>
        <FieldRow>
          <div className={field}>
            <Label htmlFor="reg-gender">Gender</Label>
            <Select {...a11y("gender")} value={values.gender}
              onChange={(e) => set("gender", e.target.value as RegistrationInput["gender"])}>
              <option value="">Select</option>
              <option>Male</option>
              <option>Female</option>
            </Select>
            {err("gender")}
          </div>
          <div className={field}>
            <Label htmlFor="reg-dateOfBirth">Date of birth</Label>
            <Input {...a11y("dateOfBirth")} type="date" autoComplete="bday"
              value={values.dateOfBirth} onChange={(e) => set("dateOfBirth", e.target.value)} />
            {err("dateOfBirth")}
          </div>
        </FieldRow>
        <FieldRow>
          <div className={field}>
            <Label htmlFor="reg-phone">Phone number</Label>
            <Input {...a11y("phone")} type="tel" autoComplete="tel" inputMode="tel"
              value={values.phone} onChange={(e) => set("phone", e.target.value)} />
            {err("phone")}
          </div>
          <div className={field}>
            <Label htmlFor="reg-email">Email <Optional /></Label>
            <Input {...a11y("email")} type="email" autoComplete="email"
              value={values.email} onChange={(e) => set("email", e.target.value)} />
            {err("email")}
          </div>
        </FieldRow>
        <div className={field}>
          <Label htmlFor="reg-occupation">School or occupation <Optional /></Label>
          <Input {...a11y("occupation")}
            value={values.occupation} onChange={(e) => set("occupation", e.target.value)} />
        </div>
      </Fieldset>

      <Fieldset legend="Your church">
        <div className={field}>
          <Label htmlFor="reg-archdeaconry">Archdeaconry</Label>
          <Select {...a11y("archdeaconry")} value={values.archdeaconry}
            onChange={(e) => set("archdeaconry", e.target.value)}>
            <option value="">Select your archdeaconry</option>
            {archdeaconries.map((a) => (
              <option key={a.name} value={a.name}>{a.name}</option>
            ))}
          </Select>
          {err("archdeaconry")}
        </div>
        <div className={field}>
          <Label htmlFor="reg-parishId">Parish</Label>
          <Select {...a11y("parishId")} value={values.parishId}
            disabled={!values.archdeaconry} onChange={(e) => set("parishId", e.target.value)}>
            <option value="">{values.archdeaconry ? "Select your parish" : "Choose an archdeaconry first"}</option>
            {parishes.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </Select>
          {err("parishId")}
        </div>
      </Fieldset>

      {isMinor && (
        <Fieldset legend="Parent or guardian">
          <p className="mb-2.5 text-sm text-ink-muted">
            Because you are under 18, please add a parent or guardian&apos;s details.
          </p>
          <FieldRow>
            <div className={field}>
              <Label htmlFor="reg-guardianName">Full name</Label>
              <Input {...a11y("guardianName")}
                value={values.guardianName} onChange={(e) => set("guardianName", e.target.value)} />
              {err("guardianName")}
            </div>
            <div className={field}>
              <Label htmlFor="reg-guardianPhone">Phone number</Label>
              <Input {...a11y("guardianPhone")} type="tel" inputMode="tel"
                value={values.guardianPhone} onChange={(e) => set("guardianPhone", e.target.value)} />
              {err("guardianPhone")}
            </div>
          </FieldRow>
        </Fieldset>
      )}

      <div className="flex items-start gap-2.5">
        <input {...a11y("consent")} type="checkbox" checked={values.consent}
          className="mt-0.5 size-5 shrink-0 accent-primary"
          onChange={(e) => set("consent", e.target.checked)} />
        <label htmlFor="reg-consent" className="text-sm">
          I agree that the Anglican Youth Fellowship may keep these details to contact me about
          fellowship activities.
        </label>
      </div>
      {err("consent")}

      <Button type="submit" className="mt-6 w-full py-4 text-lg">Count me in <span aria-hidden="true">→</span></Button>
    </form>
  );
}
