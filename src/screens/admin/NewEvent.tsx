import { EventForm } from "@/screens/admin/EventForm";
import { NoDatabase, PageTitle } from "@/design-system/States";
import { adminStore } from "@/lib/adminAuth";

export const metadata = { title: "Add event" };

export async function NewEvent() {
  return (
    <>
      <PageTitle>Add event</PageTitle>
      {(await adminStore()) ? <EventForm /> : <NoDatabase />}
    </>
  );
}
