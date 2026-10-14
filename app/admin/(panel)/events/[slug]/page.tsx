import { notFound } from "next/navigation";
import EventForm from "@/components/admin/EventForm";
import { NoDatabase, PageTitle } from "@/components/admin/Parts";
import { adminStore } from "@/lib/admin-auth";
import type { RegistrationStatus } from "@/lib/db";

export const metadata = { title: "Edit event" };

export default async function EditEvent({ params }: { params: Promise<{ slug: string }> }) {
  const store = await adminStore();
  if (!store) return (<><PageTitle>Edit event</PageTitle><NoDatabase /></>);
  const event = await store.getEvent((await params).slug);
  if (!event) notFound();
  return (
    <>
      <PageTitle>Edit event</PageTitle>
      <EventForm event={event} />
    </>
  );
}
