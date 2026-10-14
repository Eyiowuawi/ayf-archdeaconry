import "server-only";
import { fileStore } from "./file-store";
import type { Store } from "./types";

export type { DevotionalRecord, EventRecord, RegistrationStatus, Store } from "./types";

/**
 * The storage the admin area uses, or null when none is connected.
 *
 * No database is chosen yet. Until one is, local development (and `CMS_LOCAL_STORE=1`) uses a
 * JSON file of test data, and the live site runs read-only from lib/content with the Join form
 * in preview mode. To go live, implement `Store` (lib/db/types.ts) for the chosen database and
 * return it here when its environment variables are set.
 */
export function getStore(): Store | null {
  if (process.env.CMS_LOCAL_STORE === "1" || process.env.NODE_ENV === "development") return fileStore;
  return null;
}
