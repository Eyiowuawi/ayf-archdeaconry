import { DevotionalForm } from "@/screens/admin/DevotionalForm";
import { NoDatabase, PageTitle } from "@/design-system/States";
import { adminStore } from "@/lib/adminAuth";
import type { RegistrationStatus } from "@/lib/db";

export const metadata = { title: "Write devotional" };

export async function NewDevotional() {
  return (
    <>
      <PageTitle>Write devotional</PageTitle>
      {(await adminStore()) ? <DevotionalForm /> : <NoDatabase />}
    </>
  );
}
