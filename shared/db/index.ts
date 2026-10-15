import "server-only";
import { fileStore } from "@/shared/db/file-store";
import type { Store } from "@/shared/db/store";

export type { Store } from "@/shared/db/store";

/**
 * The storage the admin area uses, or null when none is connected.
 *
 * No database is chosen yet. Until one is, local development (and `CMS_LOCAL_STORE=1`) uses a
 * JSON file of test data, and the live site runs read-only from each feature's starter content
 * (its data/ folder) with the Join form in preview mode. To go live, implement `Store` (shared/db/store.ts) for the chosen database and
 * return it here when its environment variables are set.
 */
export function getStore(): Store | null {
  if (process.env.CMS_LOCAL_STORE === "1" || process.env.NODE_ENV === "development")
    return fileStore;
  return null;
}
