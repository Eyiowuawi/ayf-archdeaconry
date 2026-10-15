import { DevotionalForm } from "@/features/devotionals/components/devotional-form";
import { NoDatabase, PageTitle } from "@/shared/ui/states";
import { adminStore } from "@/features/auth/utils/session";

export async function NewDevotionalPage() {
  return (
    <>
      <PageTitle>Write devotional</PageTitle>
      {(await adminStore()) ? <DevotionalForm /> : <NoDatabase />}
    </>
  );
}
