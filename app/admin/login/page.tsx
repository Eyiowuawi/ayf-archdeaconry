import type { Metadata } from "next";
import { LoginPage } from "@/features/auth/components/login-page";

export const metadata: Metadata = { title: "Sign in" };
export const dynamic = "force-dynamic";

export default LoginPage;
