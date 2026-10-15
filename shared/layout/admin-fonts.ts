import { Geist, Geist_Mono, Manrope } from "next/font/google";
import { cn } from "@/utils/utils";

// The admin dashboard uses plug-admin-dashboard's fonts: Geist for text and headings,
// Manrope on buttons and Geist Mono for codes. The public website keeps its own fonts.
const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

/**
 * Put on the root element of an admin page, and on anything it portals out of that root
 * (menus, drawers), so the theme's font tokens point at the admin fonts.
 */
export const adminFonts = cn(
  geist.variable,
  geistMono.variable,
  manrope.variable,
  "font-sans [--font-body:var(--font-geist)] [--font-heading:var(--font-geist)] [--font-action:var(--font-manrope)] [--font-code:var(--font-geist-mono)]"
);
