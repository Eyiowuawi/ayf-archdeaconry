import { notFound } from "next/navigation";
import { EventForm } from "@/screens/admin/EventForm";
import { NoDatabase, PageTitle } from "@/design-system/States";
import { adminStore } from "@/lib/adminAuth";

export const metadata = { title: "Edit event" };

export async function EditEvent({ params }: { params: Promise<{ slug: string }> }) {
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
