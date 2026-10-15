import { PageHeader } from "@/shared/layout/page-header";
import { EventForm } from "@/features/events/components/event-form";
import { NoDatabase } from "@/shared/ui/states";
import { adminStore } from "@/features/auth/utils/session";

export async function NewEventPage() {
  return (
    <>
      <PageHeader title="Add event" back={{ href: "/admin/events", label: "All events" }} />
      {(await adminStore()) ? <EventForm /> : <NoDatabase />}
    </>
  );
}
