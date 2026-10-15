import type { Metadata } from "next";
import { EventsPage } from "@/features/events/components/events-page";

export const metadata: Metadata = { title: "Events" };
export const revalidate = 3600;

export default EventsPage;
