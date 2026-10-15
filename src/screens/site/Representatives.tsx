import { ParishTracker } from "@/screens/site/ParishTracker";
import { ARCHDEACONRIES } from "@/lib/parishes";
import { getFillData } from "@/lib/githubStore";
import type { FillData } from "@/types";
import type { Metadata } from "next";
import "@/screens/site/tracker.css";

export const metadata: Metadata = { title: "Parish Representatives" };

export async function Representatives() {
  let initialData: FillData = {};
  let loadError: string | null = null;
  try {
    initialData = await getFillData();
  } catch (err: any) {
    loadError = err?.message || "Could not load the current list.";
  }

  return (
    <div className="tracker">
      <ParishTracker
        archdeaconries={ARCHDEACONRIES}
        initialData={initialData}
        initialError={loadError}
      />
    </div>
  );
}
