"use client";

import { useMemo, useState, type ReactNode } from "react";
import { UserCodeNote } from "@/screens/site/UserCodeNote";
import { submitRegistration } from "@/lib/actions/registration";
import { Button } from "@/design-system/Button";
import { Checkbox } from "@/design-system/Checkbox";
import { FieldError, FieldHint, FieldRow, Fieldset, Notice, Optional } from "@/design-system/Field";
import { Input } from "@/design-system/Input";
import { Label } from "@/design-system/Label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/design-system/Select";
import type { Archdeaconry } from "@/lib/parishes";
import { EDUCATION_LEVELS, ageOn, validateRegistration } from "@/lib/registrations";
import type { RegistrationErrors, RegistrationInput } from "@/types";


const EMPTY: RegistrationInput = {
  firstName: "",
  surname: "",
  gender: "",
  dateOfBirth: "",
  phone: "",
  email: "",
  educationLevel: "",
  archdeaconry: "",
  parishId: "",
  occupation: "",
  guardianName: "",
  guardianPhone: "",
  consent: false,
};

export function RegistrationForm({
  archdeaconries,
  initialParishId,
  savesEnabled,
  onRegistered,
  submitLabel = <>Count me in <span aria-hidden="true">→</span></>,
}: {
  archdeaconries: Archdeaconry[];
  /** True when a database is connected and submissions are saved; otherwise the form is a preview. */
  savesEnabled: boolean;
  /** Pre-selects a parish, e.g. when arriving from the homepage parish finder. */
  initialParishId?: string;
  /** Called with the new member's user code instead of showing the welcome screen (used by event registration). */
  onRegistered?: (userCode: string) => void;
  submitLabel?: ReactNode;
}) {
  const [values, setValues] = useState<RegistrationInput>(() => {
    const arch = initialParishId
      ? archdeaconries.find((a) => a.parishes.some((p) => p.id === initialParishId))
      : undefined;
    return arch ? { ...EMPTY, archdeaconry: arch.name, parishId: initialParishId! } : EMPTY;
  });
  const [errors, setErrors] = useState<RegistrationErrors>({});
  const [submitted, setSubmitted] = useState<RegistrationInput | null>(null);
  const [userCode, setUserCode] = useState("");
  const [sending, setSending] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);

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

  async function handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    setFailure(null);
    const found = validateRegistration(values);
    setErrors(found);
    const firstBad = Object.keys(found)[0];
    if (firstBad) {
      document.getElementById(`reg-${firstBad}`)?.focus();
      return;
    }
    if (savesEnabled) {
      setSending(true);
      const res = await submitRegistration(values).catch(() => null);
      setSending(false);
      if (!res?.ok) {
        if (res?.errors) setErrors(res.errors);
        setFailure(res?.message ?? (res?.errors ? "Please check the highlighted fields." : "Something went wrong. Please try again."));
        return;
      }
      if (onRegistered) {
        onRegistered(res.userCode);
        return;
      }
      setUserCode(res.userCode);
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
          {savesEnabled ? `Welcome to the family, ${submitted.firstName}!` : `Looking good, ${submitted.firstName}!`}
        </h2>
        {savesEnabled ? (
          <>
            <p>Your registration has been received. Your parish youth leaders will be in touch.</p>
            {userCode && <UserCodeNote code={userCode} />}
          </>
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
          <dt className="font-bold text-ink-muted">Education</dt>
          <dd>{submitted.educationLevel}</dd>
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
      {!savesEnabled && (
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
            <Select value={values.gender} onValueChange={(v) => set("gender", v as RegistrationInput["gender"])}>
              <SelectTrigger {...a11y("gender")}>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
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
          <Label htmlFor="reg-educationLevel">Level of education</Label>
          <Select value={values.educationLevel}
            onValueChange={(v) => set("educationLevel", v as RegistrationInput["educationLevel"])}>
            <SelectTrigger {...a11y("educationLevel")}>
              <SelectValue placeholder="Select your level" />
            </SelectTrigger>
            <SelectContent>
              {EDUCATION_LEVELS.map((l) => (
                <SelectItem key={l} value={l}>{l}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.educationLevel ? err("educationLevel") : <FieldHint>Where you are now, or the highest you completed.</FieldHint>}
        </div>
        <div className={field}>
          <Label htmlFor="reg-occupation">School or occupation <Optional /></Label>
          <Input {...a11y("occupation")}
            value={values.occupation} onChange={(e) => set("occupation", e.target.value)} />
        </div>
      </Fieldset>

      <Fieldset legend="Your church">
        <div className={field}>
          <Label htmlFor="reg-archdeaconry">Archdeaconry</Label>
          <Select value={values.archdeaconry} onValueChange={(v) => set("archdeaconry", v)}>
            <SelectTrigger {...a11y("archdeaconry")}>
              <SelectValue placeholder="Select your archdeaconry" />
            </SelectTrigger>
            <SelectContent>
              {archdeaconries.map((a) => (
                <SelectItem key={a.name} value={a.name}>{a.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {err("archdeaconry")}
        </div>
        <div className={field}>
          <Label htmlFor="reg-parishId">Parish</Label>
          <Select value={values.parishId} disabled={!values.archdeaconry} onValueChange={(v) => set("parishId", v)}>
            <SelectTrigger {...a11y("parishId")}>
              <SelectValue placeholder={values.archdeaconry ? "Select your parish" : "Choose an archdeaconry first"} />
            </SelectTrigger>
            <SelectContent>
              {parishes.map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
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
        <Checkbox {...a11y("consent")} className="mt-0.5" checked={values.consent}
          onCheckedChange={(c) => set("consent", c === true)} />
        <label htmlFor="reg-consent" className="text-sm">
          I agree that the Anglican Youth Fellowship may keep these details to contact me about
          fellowship activities.
        </label>
      </div>
      {err("consent")}

      {failure && (
        <p role="alert" className="mt-5 rounded-xl border border-danger-line bg-danger-soft px-4 py-3 text-sm text-danger">
          {failure}
        </p>
      )}
      <Button type="submit" className="mt-6 w-full py-4 text-lg" disabled={sending}>
        {sending ? "Sending…" : submitLabel}
      </Button>
    </form>
  );
}
