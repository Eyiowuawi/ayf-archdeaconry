import type { Role } from "@/features/auth/utils/session";

/** How the signed-in account is named in the admin header and sidebar. */
export interface AdminAccount {
  name: string;
  label: string;
  initials: string;
}

export function accountFor(role: Role): AdminAccount {
  return role === "demo"
    ? { name: "Demo account", label: "Sample data only", initials: "DA" }
    : { name: "Administrator", label: "Diocese of Egba", initials: "AD" };
}
