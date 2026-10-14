"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { FieldError, FieldRow, Fieldset, Input, Label, Notice, Select } from "@/components/ui/Form";
import { CONVENTION, PAYMENT, formatNaira } from "@/lib/content/convention";
import type { Archdeaconry } from "@/lib/parishes";

// Delegate registrations are not stored yet: this validates and previews only.
// When the records database exists, upload the two files and POST the rest in `handleSubmit`,
// then flip this flag.
const SAVES_ENABLED = false;

const MAX_PROOF_BYTES = 4 * 1024 * 1024;
const PROOF_TYPES = ["image/png", "image/jpeg", "application/pdf"];
const PHONE_RE = /^\+?[0-9 ()-]{7,20}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Values = {
  fullName: string;
  email: string;
  phone: string;
  gender: "" | "Male" | "Female";
  guest: boolean;
  archdeaconry: string;
  parishId: string;
  homeChurch: string;
  reference: string;
  photo: File | null;
  proof: File | null;
  agree: boolean;
};

const EMPTY: Values = {
  fullName: "",
  email: "",
  phone: "",
  gender: "",
  guest: false,
  archdeaconry: "",
  parishId: "",
  homeChurch: "",
  reference: "",
  photo: null,
  proof: null,
  agree: false,
};

type Errors = Partial<Record<keyof Values, string>>;

function validate(v: Values): Errors {
  const e: Errors = {};
  if (v.fullName.trim().split(/\s+/).length < 2) e.fullName = "Enter your first name and surname.";
  if (!EMAIL_RE.test(v.email.trim())) e.email = "Enter a valid email address; your ticket is sent here.";
  if (!PHONE_RE.test(v.phone.trim())) e.phone = "Enter a phone number, e.g. 0803 123 4567.";
  if (!v.gender) e.gender = "Choose one; hostels are allocated by gender.";
  if (v.guest) {
    if (!v.homeChurch.trim()) e.homeChurch = "Tell us your church.";
  } else {
    if (!v.archdeaconry) e.archdeaconry = "Choose your archdeaconry.";
    if (!v.parishId) e.parishId = "Choose your parish.";
  }
  if (!v.photo) e.photo = "Add a passport photo.";
  else if (!v.photo.type.startsWith("image/")) e.photo = "The photo must be an image.";
  if (v.reference.trim().length < 6) e.reference = "Enter the reference from your bank transfer.";
  if (!v.proof) e.proof = "Upload your payment receipt.";
  else if (!PROOF_TYPES.includes(v.proof.type)) e.proof = "Use a PNG, JPG or PDF file.";
  else if (v.proof.size > MAX_PROOF_BYTES) e.proof = "That file is over 4 MB. Try a screenshot instead.";
  if (!v.agree) e.agree = "Please confirm to continue.";
  return e;
}

function fileSize(bytes: number) {
  return bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;
}

export default function ConventionRegistrationForm({ archdeaconries }: { archdeaconries: Archdeaconry[] }) {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [done, setDone] = useState<Values | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!values.photo) return setPhotoUrl(null);
    const url = URL.createObjectURL(values.photo);
    setPhotoUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [values.photo]);

  const parishes = useMemo(
    () => archdeaconries.find((a) => a.name === values.archdeaconry)?.parishes ?? [],
    [archdeaconries, values.archdeaconry]
  );

  function set<K extends keyof Values>(key: K, value: Values[K]) {
    setValues((v) => ({ ...v, [key]: value, ...(key === "archdeaconry" ? { parishId: "" } : {}) }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function handleSubmit(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const found = validate(values);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      document.getElementById(`cr-${first}`)?.focus();
      return;
    }
    setDone(values);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const err = (k: keyof Values) => <FieldError id={`cr-${k}-err`}>{errors[k]}</FieldError>;
  const a11y = (k: keyof Values) => ({
    id: `cr-${k}`,
    "aria-invalid": errors[k] ? true : undefined,
    "aria-describedby": errors[k] ? `cr-${k}-err` : undefined,
  });

  if (done) {
    const parish = archdeaconries.flatMap((a) => a.parishes).find((p) => p.id === done.parishId)?.name;
    return (
      <div role="status" className="rounded-card border border-line bg-surface p-6 shadow-lift sm:p-10">
        <div className="flex items-center gap-5">
          {photoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photoUrl} alt="" className="size-20 rounded-full object-cover ring-2 ring-sun" />
          )}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Delegate preview</p>
            <h2 className="mt-1 font-display text-3xl font-medium tracking-tight">{done.fullName}</h2>
          </div>
        </div>
        {SAVES_ENABLED ? (
          <p className="mt-6 text-lg">
            Thank you. Your registration is in for audit; we&apos;ll email your delegate ticket to {done.email} once it&apos;s
            approved.
          </p>
        ) : (
          <p className="mt-6 text-lg">
            Everything checks out, but online registration isn&apos;t switched on yet, so this was <b>not submitted</b>.
            Please register through your archdeaconry youth president for now.
          </p>
        )}
        <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 border-t border-line pt-6 text-[0.95rem]">
          <dt className="text-ink-muted">Church</dt>
          <dd>{done.guest ? `${done.homeChurch} (guest delegate)` : `${parish}, ${done.archdeaconry}`}</dd>
          <dt className="text-ink-muted">Phone</dt>
          <dd>{done.phone}</dd>
          <dt className="text-ink-muted">Reference</dt>
          <dd className="tabular-nums">{done.reference}</dd>
          <dt className="text-ink-muted">Receipt</dt>
          <dd>{done.proof?.name}</dd>
        </dl>
        <Button type="button" variant="secondary" className="mt-8" onClick={() => setDone(null)}>
          Edit details
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {!SAVES_ENABLED && (
        <Notice className="mb-6 bg-surface shadow-card">
          <b>Preview:</b> online registration opens soon. You can try the form, but nothing is submitted yet.
        </Notice>
      )}

      <Fieldset legend="1. Payment">
        <p className="mb-4 text-sm leading-relaxed text-ink-muted">
          The fee is <b className="text-ink">{formatNaira(CONVENTION.fee)}</b>.{" "}
          {PAYMENT.confirmed ? (
            <>
              Transfer it to <b className="text-ink">{PAYMENT.bank} {PAYMENT.accountNumber}</b> ({PAYMENT.accountName}),
              then fill in the reference below.
            </>
          ) : (
            <>Official account details will appear here once confirmed by the Diocesan Secretariat.</>
          )}
        </p>
        <div className="mb-4">
          <Label htmlFor="cr-reference">Transfer reference</Label>
          <Input {...a11y("reference")} autoComplete="off" value={values.reference}
            onChange={(e) => set("reference", e.target.value)} />
          {err("reference")}
        </div>
        <div>
          <Label htmlFor="cr-proof">Payment receipt</Label>
          <label
            className="flex cursor-pointer items-center gap-4 rounded-xl border border-dashed border-line bg-canvas px-4 py-4 transition-colors hover:border-sun"
          >
            <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-full bg-surface-muted text-accent">↑</span>
            <span className="min-w-0 text-sm">
              {values.proof ? (
                <span className="block truncate font-semibold">{values.proof.name} · {fileSize(values.proof.size)}</span>
              ) : (
                <span className="font-semibold">Choose a file</span>
              )}
              <span className="block text-ink-muted">PNG, JPG or PDF, up to 4 MB</span>
            </span>
            <input {...a11y("proof")} type="file" accept=".png,.jpg,.jpeg,.pdf,image/png,image/jpeg,application/pdf"
              className="sr-only" onChange={(e) => set("proof", e.target.files?.[0] ?? null)} />
          </label>
          {err("proof")}
        </div>
      </Fieldset>

      <Fieldset legend="2. About you">
        <div className="mb-4">
          <Label htmlFor="cr-fullName">Full name</Label>
          <Input {...a11y("fullName")} autoComplete="name" value={values.fullName}
            onChange={(e) => set("fullName", e.target.value)} />
          {err("fullName")}
        </div>
        <FieldRow>
          <div className="mb-4">
            <Label htmlFor="cr-email">Email</Label>
            <Input {...a11y("email")} type="email" autoComplete="email" value={values.email}
              onChange={(e) => set("email", e.target.value)} />
            {err("email")}
          </div>
          <div className="mb-4">
            <Label htmlFor="cr-phone">Phone number</Label>
            <Input {...a11y("phone")} type="tel" inputMode="tel" autoComplete="tel" value={values.phone}
              onChange={(e) => set("phone", e.target.value)} />
            {err("phone")}
          </div>
        </FieldRow>
        <div className="mb-4">
          <Label htmlFor="cr-gender">Gender</Label>
          <Select {...a11y("gender")} value={values.gender}
            onChange={(e) => set("gender", e.target.value as Values["gender"])}>
            <option value="">Select</option>
            <option>Male</option>
            <option>Female</option>
          </Select>
          {err("gender")}
        </div>
        <div>
          <Label htmlFor="cr-photo">Passport photo</Label>
          <div className="flex items-center gap-4">
            <div className="grid size-20 shrink-0 place-items-center overflow-hidden rounded-full border border-line bg-surface-muted text-ink-muted">
              {photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photoUrl} alt="Your passport photo" className="size-full object-cover" />
              ) : (
                <svg aria-hidden="true" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="9" r="4" />
                  <path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" />
                </svg>
              )}
            </div>
            <label className="cursor-pointer rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold transition-colors hover:border-sun">
              {values.photo ? "Change photo" : "Take or upload a photo"}
              {/* `capture` opens the front camera on phones; desktops get a file picker. */}
              <input {...a11y("photo")} type="file" accept="image/*" capture="user" className="sr-only"
                onChange={(e) => set("photo", e.target.files?.[0] ?? null)} />
            </label>
          </div>
          {err("photo")}
        </div>
      </Fieldset>

      <Fieldset legend="3. Your church">
        <label className="mb-5 flex items-start gap-3 text-sm">
          <input type="checkbox" checked={values.guest} className="mt-0.5 size-5 accent-primary"
            onChange={(e) => set("guest", e.target.checked)} />
          <span>I&apos;m not Anglican and want to come as a <b>guest delegate</b></span>
        </label>
        {values.guest ? (
          <div>
            <Label htmlFor="cr-homeChurch">Your church</Label>
            <Input {...a11y("homeChurch")} value={values.homeChurch}
              onChange={(e) => set("homeChurch", e.target.value)} />
            {err("homeChurch")}
          </div>
        ) : (
          <>
            <div className="mb-4">
              <Label htmlFor="cr-archdeaconry">Archdeaconry</Label>
              <Select {...a11y("archdeaconry")} value={values.archdeaconry}
                onChange={(e) => set("archdeaconry", e.target.value)}>
                <option value="">Select your archdeaconry</option>
                {archdeaconries.map((a) => (
                  <option key={a.name} value={a.name}>{a.name}</option>
                ))}
              </Select>
              {err("archdeaconry")}
            </div>
            <div>
              <Label htmlFor="cr-parishId">Parish</Label>
              <Select {...a11y("parishId")} value={values.parishId} disabled={!values.archdeaconry}
                onChange={(e) => set("parishId", e.target.value)}>
                <option value="">{values.archdeaconry ? "Select your parish" : "Choose an archdeaconry first"}</option>
                {parishes.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </Select>
              {err("parishId")}
            </div>
          </>
        )}
      </Fieldset>

      <label className="flex items-start gap-3 text-sm">
        <input {...a11y("agree")} type="checkbox" checked={values.agree} className="mt-0.5 size-5 shrink-0 accent-primary"
          onChange={(e) => set("agree", e.target.checked)} />
        <span>
          I confirm these details and my payment are genuine. I understand that fraudulent uploads are cancelled and
          referred to my parish chaplain.
        </span>
      </label>
      {err("agree")}

      <Button type="submit" className="mt-8 w-full py-4">
        Submit registration <span aria-hidden="true">→</span>
      </Button>
    </form>
  );
}
