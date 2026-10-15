import { notFound } from "next/navigation";
import { DevotionalForm } from "@/screens/admin/DevotionalForm";
import { NoDatabase, PageTitle } from "@/design-system/States";
import { adminStore } from "@/lib/adminAuth";
import type { RegistrationStatus } from "@/lib/db";

export const metadata = { title: "Edit devotional" };

export async function EditDevotional({ params }: { params: Promise<{ slug: string }> }) {
  const store = await adminStore();
  if (!store) return (<><PageTitle>Edit devotional</PageTitle><NoDatabase /></>);
  const devotional = await store.getDevotional((await params).slug);
  if (!devotional) notFound();
  return (
    <>
      <PageTitle>Edit devotional</PageTitle>
      <DevotionalForm devotional={devotional} />
    </>
  );
}
