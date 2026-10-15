import { notFound } from "next/navigation";
import { EventForm } from "@/features/events/components/event-form";
import { NoDatabase, PageTitle } from "@/shared/ui/states";
import { adminStore } from "@/features/auth/utils/session";

export async function EditEventPage({ params }: { params: Promise<{ slug: string }> }) {
  const store = await adminStore();
  if (!store)
    return (
      <>
        <PageTitle>Edit event</PageTitle>
        <NoDatabase />
      </>
    );
  const event = await store.getEvent((await params).slug);
  if (!event) notFound();
  return (
    <>
      <PageTitle>Edit event</PageTitle>
      <EventForm event={event} />
    </>
  );
}
