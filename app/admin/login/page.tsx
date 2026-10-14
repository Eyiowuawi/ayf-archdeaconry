import { redirect } from "next/navigation";
import LoginForm from "@/components/admin/LoginForm";
import Logo from "@/components/site/Logo";
import { getRole } from "@/lib/admin-auth";

export const metadata = { title: "Sign in" };
export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await getRole()) redirect("/admin");
  return (
    <main className="grid min-h-dvh place-items-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <Logo className="mb-4 size-16 shadow-md" />
          <h1 className="font-display text-3xl font-extrabold tracking-tight">AYF Admin</h1>
          <p className="mt-1 text-sm text-ink-muted">Diocese of Egba</p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
