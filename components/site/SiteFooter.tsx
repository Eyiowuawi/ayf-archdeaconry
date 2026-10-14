import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="sitefooter">
      <div className="sitecontainer footergrid">
        <div>
          <p className="footername">Anglican Youth Fellowship</p>
          <p className="footermuted">Diocese of Egba, Church of Nigeria (Anglican Communion)</p>
        </div>
        <ul className="footerlinks">
          <li><Link href="/events">Events</Link></li>
          <li><Link href="/devotionals">Devotionals</Link></li>
          <li><Link href="/register">Join the fellowship</Link></li>
          <li><Link href="/representatives">Parish representatives</Link></li>
        </ul>
      </div>
    </footer>
  );
}
