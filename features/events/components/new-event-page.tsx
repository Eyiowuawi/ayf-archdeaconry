import { EventForm } from "@/features/events/components/event-form";
import { NoDatabase, PageTitle } from "@/shared/ui/states";
import { adminStore } from "@/features/auth/utils/session";

export async function NewEventPage() {
  return (
    <>
      <PageTitle>Add event</PageTitle>
      {(await adminStore()) ? <EventForm /> : <NoDatabase />}
    </>
  );
}
