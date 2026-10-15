import { EventForm } from "@/screens/admin/EventForm";
import { NoDatabase, PageTitle } from "@/design-system/States";
import { adminStore } from "@/lib/adminAuth";
import type { RegistrationStatus } from "@/lib/db";

export const metadata = { title: "Add event" };

export async function NewEvent() {
  return (
    <>
      <PageTitle>Add event</PageTitle>
      {(await adminStore()) ? <EventForm /> : <NoDatabase />}
    </>
  );
}
