import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getStore } from "@/lib/db";

// Admin sign-in: one shared password (ADMIN_PASSWORD) and a signed, http-only session cookie.
// Good enough to start; swap for per-person accounts when the database is chosen.

const COOKIE = "ayf_admin";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export function adminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}

function secret(): string {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "";
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

export function passwordMatches(input: string): boolean {
  return adminConfigured() && same(input, process.env.ADMIN_PASSWORD!);
}

export async function startSession() {
  const expires = Math.floor(Date.now() / 1000) + MAX_AGE;
  (await cookies()).set(COOKIE, `${expires}.${sign(String(expires))}`, {
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

export async function isAdmin(): Promise<boolean> {
  if (!adminConfigured()) return false;
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!raw) return false;
  const [expires, sig] = raw.split(".");
  if (!expires || !sig || Number(expires) < Date.now() / 1000) return false;
  return same(sig, sign(expires));
}

/** Call at the top of every admin page and action. */
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}

/** The store for an admin page, after checking the visitor is signed in. Use in every admin page. */
export async function adminStore() {
  await requireAdmin();
  return getStore();
}
