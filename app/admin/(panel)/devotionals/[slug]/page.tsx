import { notFound } from "next/navigation";
import DevotionalForm from "@/components/admin/DevotionalForm";
import { NoDatabase, PageTitle } from "@/components/admin/Parts";
import { adminStore } from "@/lib/admin-auth";
import type { RegistrationStatus } from "@/lib/db";

export const metadata = { title: "Edit devotional" };

export default async function EditDevotional({ params }: { params: Promise<{ slug: string }> }) {
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
