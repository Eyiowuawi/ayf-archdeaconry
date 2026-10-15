import { BreadcrumbLabel } from "@/shared/layout/breadcrumb-label";
import { PageHeader } from "@/shared/layout/page-header";
import { notFound } from "next/navigation";
import { EventForm } from "@/features/events/components/event-form";
import { NoDatabase } from "@/shared/ui/states";
import { adminStore } from "@/features/auth/utils/session";

export async function EditEventPage({ params }: { params: Promise<{ slug: string }> }) {
  const store = await adminStore();
  if (!store)
    return (
      <>
        <PageHeader title="Edit event" />
        <NoDatabase />
      </>
    );
  const event = await store.getEvent((await params).slug);
  if (!event) notFound();
  return (
    <>
      <BreadcrumbLabel path={`/admin/events/${event.slug}`} label={event.title} />
      <PageHeader title="Edit event" back={{ href: "/admin/events", label: "All events" }} />
      <EventForm event={event} />
    </>
  );
}
