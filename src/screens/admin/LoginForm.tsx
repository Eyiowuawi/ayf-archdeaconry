"use client";

import { useActionState } from "react";
import { login, type FormState } from "@/lib/actions/admin";
import { Button } from "@/design-system/Button";
import { Input } from "@/design-system/Input";
import { Label } from "@/design-system/Label";

export function LoginForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(login, {});
  return (
    <form action={action} className="rounded-card border border-line bg-surface p-6 shadow-card">
      <Label htmlFor="email">Email</Label>
      <Input id="email" name="email" type="text" autoComplete="username" inputMode="email" required autoFocus className="mb-4" />
      <Label htmlFor="password">Password</Label>
      <Input id="password" name="password" type="password" autoComplete="current-password" required
        aria-invalid={state.error ? true : undefined} aria-describedby={state.error ? "login-error" : undefined} />
      {state.error && <p id="login-error" className="mt-1.5 text-[0.82rem] text-danger">{state.error}</p>}
      <Button type="submit" className="mt-5 w-full" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
