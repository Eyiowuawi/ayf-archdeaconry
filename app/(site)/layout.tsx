import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="site">
      <SiteHeader />
      <main className="sitemain">{children}</main>
      <SiteFooter />
    </div>
  );
}
