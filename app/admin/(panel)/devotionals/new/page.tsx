import DevotionalForm from "@/components/admin/DevotionalForm";
import { NoDatabase, PageTitle } from "@/components/admin/Parts";
import { adminStore } from "@/lib/admin-auth";
import type { RegistrationStatus } from "@/lib/db";

export const metadata = { title: "Write devotional" };

export default async function NewDevotional() {
  return (
    <>
      <PageTitle>Write devotional</PageTitle>
      {(await adminStore()) ? <DevotionalForm /> : <NoDatabase />}
    </>
  );
}
