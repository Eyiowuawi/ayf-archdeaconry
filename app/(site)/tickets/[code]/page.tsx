import type { Metadata } from "next";
import { TicketPage } from "@/features/events/components/ticket-page";

export const metadata: Metadata = { title: "Your ticket", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default TicketPage;
