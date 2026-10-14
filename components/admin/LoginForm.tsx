"use client";

import { useActionState } from "react";
import { login, type FormState } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(login, {});
  return (
    <form action={action} className="rounded-card border border-line bg-surface p-6 shadow-card">
      <Label htmlFor="password">Admin password</Label>
      <Input id="password" name="password" type="password" autoComplete="current-password" required autoFocus
        aria-invalid={state.error ? true : undefined} aria-describedby={state.error ? "login-error" : undefined} />
      {state.error && <p id="login-error" className="mt-1.5 text-[0.82rem] text-danger">{state.error}</p>}
      <Button type="submit" className="mt-5 w-full" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
