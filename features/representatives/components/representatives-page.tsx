import { ParishTracker } from "@/features/representatives/components/parish-tracker";
import { ARCHDEACONRIES } from "@/shared/data/parishes";
import { getFillData } from "@/features/representatives/services/github-store";
import type { FillData } from "@/features/representatives/types";
import "@/features/representatives/components/tracker.css";

export async function RepresentativesPage() {
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
