import { SiteHeader } from "@/shell/SiteHeader";
import { SiteFooter } from "@/shell/SiteFooter";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col overflow-x-clip">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
