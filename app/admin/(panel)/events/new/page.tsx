import EventForm from "@/components/admin/EventForm";
import { NoDatabase, PageTitle } from "@/components/admin/Parts";
import { adminStore } from "@/lib/admin-auth";
import type { RegistrationStatus } from "@/lib/db";

export const metadata = { title: "Add event" };

export default async function NewEvent() {
  return (
    <>
      <PageTitle>Add event</PageTitle>
      {(await adminStore()) ? <EventForm /> : <NoDatabase />}
    </>
  );
}
