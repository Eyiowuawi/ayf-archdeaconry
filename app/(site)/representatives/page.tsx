import type { Metadata } from "next";
import { RepresentativesPage } from "@/features/representatives/components/representatives-page";

export const metadata: Metadata = { title: "Parish Representatives" };
export const dynamic = "force-dynamic";

export default RepresentativesPage;
