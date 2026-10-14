"use client";

import { useMemo, useState } from "react";
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

export default function RegistrationForm({ archdeaconries }: { archdeaconries: Archdeaconry[] }) {
  const [values, setValues] = useState<RegistrationInput>(EMPTY);
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
      <div className="formdone" role="status">
        <h2>{SAVES_ENABLED ? `Welcome, ${submitted.firstName}!` : "Your details look good"}</h2>
        {SAVES_ENABLED ? (
          <p>Your registration has been received. Your parish youth leaders will be in touch.</p>
        ) : (
          <p>
            Online registration isn&apos;t switched on yet, so these details were <b>not saved</b>.
            Until it opens, please register with your parish youth president.
          </p>
        )}
        <dl className="summarylist">
          <dt>Name</dt>
          <dd>{submitted.firstName} {submitted.surname}</dd>
          <dt>Parish</dt>
          <dd>{parishName}<br /><span className="muted">{submitted.archdeaconry}</span></dd>
          <dt>Phone</dt>
          <dd>{submitted.phone}</dd>
        </dl>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            setValues(EMPTY);
            setSubmitted(null);
          }}
        >
          Start again
        </button>
      </div>
    );
  }

  const err = (k: keyof RegistrationInput) =>
    errors[k] ? (
      <p className="fielderr" id={`reg-${k}-err`}>{errors[k]}</p>
    ) : null;
  const a11y = (k: keyof RegistrationInput) => ({
    id: `reg-${k}`,
    "aria-invalid": errors[k] ? true : undefined,
    "aria-describedby": errors[k] ? `reg-${k}-err` : undefined,
  });

  return (
    <form className="regform" onSubmit={handleSubmit} noValidate>
      {!SAVES_ENABLED && (
        <p className="previewnote">
          <b>Preview:</b> online registration opens soon. You can try the form, but details are not saved yet.
        </p>
      )}

      <fieldset>
        <legend>About you</legend>
        <div className="fieldrow">
          <div className="field">
            <label htmlFor="reg-firstName">First name</label>
            <input {...a11y("firstName")} className="input" autoComplete="given-name"
              value={values.firstName} onChange={(e) => set("firstName", e.target.value)} />
            {err("firstName")}
          </div>
          <div className="field">
            <label htmlFor="reg-surname">Surname</label>
            <input {...a11y("surname")} className="input" autoComplete="family-name"
              value={values.surname} onChange={(e) => set("surname", e.target.value)} />
            {err("surname")}
          </div>
        </div>
        <div className="fieldrow">
          <div className="field">
            <label htmlFor="reg-gender">Gender</label>
            <select {...a11y("gender")} className="input" value={values.gender}
              onChange={(e) => set("gender", e.target.value as RegistrationInput["gender"])}>
              <option value="">Select</option>
              <option>Male</option>
              <option>Female</option>
            </select>
            {err("gender")}
          </div>
          <div className="field">
            <label htmlFor="reg-dateOfBirth">Date of birth</label>
            <input {...a11y("dateOfBirth")} className="input" type="date" autoComplete="bday"
              value={values.dateOfBirth} onChange={(e) => set("dateOfBirth", e.target.value)} />
            {err("dateOfBirth")}
          </div>
        </div>
        <div className="fieldrow">
          <div className="field">
            <label htmlFor="reg-phone">Phone number</label>
            <input {...a11y("phone")} className="input" type="tel" autoComplete="tel" inputMode="tel"
              value={values.phone} onChange={(e) => set("phone", e.target.value)} />
            {err("phone")}
          </div>
          <div className="field">
            <label htmlFor="reg-email">Email <span className="optional">(optional)</span></label>
            <input {...a11y("email")} className="input" type="email" autoComplete="email"
              value={values.email} onChange={(e) => set("email", e.target.value)} />
            {err("email")}
          </div>
        </div>
        <div className="field">
          <label htmlFor="reg-occupation">School or occupation <span className="optional">(optional)</span></label>
          <input {...a11y("occupation")} className="input"
            value={values.occupation} onChange={(e) => set("occupation", e.target.value)} />
        </div>
      </fieldset>

      <fieldset>
        <legend>Your church</legend>
        <div className="field">
          <label htmlFor="reg-archdeaconry">Archdeaconry</label>
          <select {...a11y("archdeaconry")} className="input" value={values.archdeaconry}
            onChange={(e) => set("archdeaconry", e.target.value)}>
            <option value="">Select your archdeaconry</option>
            {archdeaconries.map((a) => (
              <option key={a.name} value={a.name}>{a.name}</option>
            ))}
          </select>
          {err("archdeaconry")}
        </div>
        <div className="field">
          <label htmlFor="reg-parishId">Parish</label>
          <select {...a11y("parishId")} className="input" value={values.parishId}
            disabled={!values.archdeaconry} onChange={(e) => set("parishId", e.target.value)}>
            <option value="">{values.archdeaconry ? "Select your parish" : "Choose an archdeaconry first"}</option>
            {parishes.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          {err("parishId")}
        </div>
      </fieldset>

      {isMinor && (
        <fieldset>
          <legend>Parent or guardian</legend>
          <p className="fieldhint">Because you are under 18, please add a parent or guardian&apos;s details.</p>
          <div className="fieldrow">
            <div className="field">
              <label htmlFor="reg-guardianName">Full name</label>
              <input {...a11y("guardianName")} className="input"
                value={values.guardianName} onChange={(e) => set("guardianName", e.target.value)} />
              {err("guardianName")}
            </div>
            <div className="field">
              <label htmlFor="reg-guardianPhone">Phone number</label>
              <input {...a11y("guardianPhone")} className="input" type="tel" inputMode="tel"
                value={values.guardianPhone} onChange={(e) => set("guardianPhone", e.target.value)} />
              {err("guardianPhone")}
            </div>
          </div>
        </fieldset>
      )}

      <div className="field checkfield">
        <input {...a11y("consent")} type="checkbox" checked={values.consent}
          onChange={(e) => set("consent", e.target.checked)} />
        <label htmlFor="reg-consent">
          I agree that the Anglican Youth Fellowship may keep these details to contact me about
          fellowship activities.
        </label>
      </div>
      {err("consent")}

      <button type="submit" className="btn btn-primary btn-block">Register</button>
    </form>
  );
}
