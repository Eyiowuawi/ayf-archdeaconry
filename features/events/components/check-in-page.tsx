import { Empty, NoDatabase, PageTitle } from "@/shared/ui/states";
import { adminStore } from "@/features/auth/utils/session";
import { formatEventDate, todayIso } from "@/features/events/utils/events";
import { CheckInScanner } from "@/features/events/components/check-in-scanner";

export async function CheckInPage({ searchParams }: { searchParams: Promise<{ event?: string }> }) {
  const store = await adminStore();
  if (!store)
    return (
      <>
        <PageTitle>Check-in</PageTitle>
        <NoDatabase />
      </>
    );
  const today = todayIso();
  const events = (await store.listEvents())
    .filter((e) => e.registration)
    .sort((a, b) => a.date.localeCompare(b.date));
  const current = events.filter((e) => (e.endDate ?? e.date) >= today);
  const chosen = (await searchParams).event;
  const initial =
    events.find((e) => e.slug === chosen)?.slug ?? current[0]?.slug ?? events.at(-1)?.slug ?? "";

  return (
    <>
      <PageTitle>Check-in</PageTitle>
      {events.length ? (
        <CheckInScanner
          events={[...current, ...events.filter((e) => !current.includes(e)).reverse()].map(
            (e) => ({
              slug: e.slug,
              label: `${e.title} · ${formatEventDate(e)}`,
            })
          )}
          initialEvent={initial}
        />
      ) : (
        <Empty>
          No events take registrations yet. Turn registration on in an event to check people in
          here.
        </Empty>
      )}
    </>
  );
}
