import Link from "next/link";
import SiteNav from "./SiteNav";

export default function SiteHeader() {
  return (
    <header className="siteheader">
      <div className="sitecontainer siteheader-inner">
        <Link href="/" className="brand">
          <span className="brandmark" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="18" height="18">
              <path d="M10.5 2h3v6.5H20v3h-6.5V22h-3V11.5H4v-3h6.5z" fill="currentColor" />
            </svg>
          </span>
          <span className="brandtext">
            <span className="brandname">Anglican Youth Fellowship</span>
            <span className="brandsub">Diocese of Egba</span>
          </span>
        </Link>
        <SiteNav />
      </div>
    </header>
  );
}
