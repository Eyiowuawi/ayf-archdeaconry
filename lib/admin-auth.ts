import "server-only";
import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getStore, type Store } from "@/lib/db";
import { demoStore } from "@/lib/db/demo-store";

// Admin sign-in.
//
// Two kinds of account:
// - The DEMO account below works on every deployment with no setup. It only ever sees sample
//   data (lib/db/demo-store.ts), never real registrations, because its password is public.
// - The ADMIN account uses the ADMIN_PASSWORD environment variable and sees the real data.
//   Replace both with per-person accounts once a database is connected.
//
// Sessions are a signed, http-only cookie.

export type Role = "admin" | "demo";

export const DEMO_ACCOUNT = { email: "demo@ayfegba.org", password: "AYFdemo2026" } as const;
const ADMIN_EMAIL = "admin";

const COOKIE = "ayf_admin";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

// The signing key must stay private, so it never falls back to a value written in this public
// repo: it comes from a private environment variable, or a random key that lasts until restart.
const RANDOM_KEY = randomBytes(32).toString("hex");
function secret(): string {
  const fromEnv = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || process.env.GITHUB_TOKEN;
  return fromEnv ? createHash("sha256").update(`ayf-admin-session:${fromEnv}`).digest("hex") : RANDOM_KEY;
}

function sign(value: string): string {
  return createHmac("sha256", secret()).update(value).digest("base64url");
}

function same(a: string, b: string): boolean {
  // Compare fixed-length digests so the comparison takes the same time whatever the input.
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

/** The role for these credentials, or null if they don't match an account. */
export function checkCredentials(email: string, password: string): Role | null {
  const e = email.trim().toLowerCase();
  if (same(e, DEMO_ACCOUNT.email) && same(password, DEMO_ACCOUNT.password)) return "demo";
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (adminPassword && same(e, ADMIN_EMAIL) && same(password, adminPassword)) return "admin";
  return null;
}

export async function startSession(role: Role) {
  const expires = Math.floor(Date.now() / 1000) + MAX_AGE;
  const value = `${role}.${expires}`;
  (await cookies()).set(COOKIE, `${value}.${sign(value)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function endSession() {
  (await cookies()).delete(COOKIE);
}

/** The signed-in role, or null. */
export async function getRole(): Promise<Role | null> {
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!raw) return null;
  const [role, expires, sig] = raw.split(".");
  if ((role !== "admin" && role !== "demo") || !expires || !sig) return null;
  if (Number(expires) < Date.now() / 1000) return null;
  return same(sig, sign(`${role}.${expires}`)) ? role : null;
}

/** Call at the top of every admin page and action. Returns the signed-in role. */
export async function requireAdmin(): Promise<Role> {
  const role = await getRole();
  if (!role) redirect("/admin/login");
  return role;
}

/** The store for this role: sample data for the demo account, the real one for admins. */
export function storeFor(role: Role): Store | null {
  return role === "demo" ? demoStore : getStore();
}

/** The store for an admin page, after checking the visitor is signed in. Use in every admin page. */
export async function adminStore(): Promise<Store | null> {
  return storeFor(await requireAdmin());
}
