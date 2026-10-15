import { notFound } from "next/navigation";
import { DevotionalForm } from "@/features/devotionals/components/devotional-form";
import { NoDatabase, PageTitle } from "@/shared/ui/states";
import { adminStore } from "@/features/auth/utils/session";

export async function EditDevotionalPage({ params }: { params: Promise<{ slug: string }> }) {
  const store = await adminStore();
  if (!store)
    return (
      <>
        <PageTitle>Edit devotional</PageTitle>
        <NoDatabase />
      </>
    );
  const devotional = await store.getDevotional((await params).slug);
  if (!devotional) notFound();
  return (
    <>
      <PageTitle>Edit devotional</PageTitle>
      <DevotionalForm devotional={devotional} />
    </>
  );
}
