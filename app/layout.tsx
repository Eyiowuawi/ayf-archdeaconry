import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Anglican Youth Fellowship — Diocese of Egba",
    template: "%s — AYF, Diocese of Egba",
  },
  description:
    "Anglican Youth Fellowship, Diocese of Egba: events, devotionals and membership registration for youths across every parish and archdeaconry.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
