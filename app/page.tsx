import ParishTracker from "@/components/ParishTracker";
import { ARCHDEACONRIES } from "@/lib/parishes";
import { getFillData } from "@/lib/github-store";
import type { FillData } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function Page() {
  let initialData: FillData = {};
  let loadError: string | null = null;
  try {
    initialData = await getFillData();
  } catch (err: any) {
    loadError = err?.message || "Could not load the current list.";
  }

  return (
    <ParishTracker
      archdeaconries={ARCHDEACONRIES}
      initialData={initialData}
      initialError={loadError}
    />
  );
}
