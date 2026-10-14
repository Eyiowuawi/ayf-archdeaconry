import type { Metadata, Viewport } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import { themeInitScript } from "@/lib/theme";
import "./globals.css";

const heading = Fraunces({ subsets: ["latin"], variable: "--font-heading", display: "swap", axes: ["opsz", "SOFT"] });
const body = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "Anglican Youth Fellowship — Diocese of Egba",
    template: "%s — AYF, Diocese of Egba",
  },
  description:
    "Anglican Youth Fellowship, Egba Diocese: building a generation of young Anglicans rooted in Christ and equipped for impact. Convention, events, devotionals and membership.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${heading.variable} ${body.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
