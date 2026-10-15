import { PageHeader } from "@/shared/layout/page-header";
import { DevotionalForm } from "@/features/devotionals/components/devotional-form";
import { NoDatabase } from "@/shared/ui/states";
import { adminStore } from "@/features/auth/utils/session";

export async function NewDevotionalPage() {
  return (
    <>
      <PageHeader
        title="Write devotional"
        back={{ href: "/admin/devotionals", label: "All devotionals" }}
      />
      {(await adminStore()) ? <DevotionalForm /> : <NoDatabase />}
    </>
  );
}
