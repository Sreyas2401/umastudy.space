import EventsCalendar from "~/app/_components/EventsCalendar";
import { ScrollArea } from "~/components/ui/scroll-area";
import { api } from "~/trpc/server";

export default async function BuildingRoom({
  params,
  searchParams,
}: {
  params: Promise<{ bldg: string; roomId: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const { bldg, roomId } = await params;
  const { from = new Date().toISOString() } = await searchParams;

  const upcomingEvents = await api.room.getUpcomingEventsForRoom({
    building: bldg,
    room: roomId,
    from,
  });

  return (
    <div>
      <p>Building: {bldg}</p>
      <p>Room: {roomId}</p>
      <EventsCalendar events={upcomingEvents} />
    </div>
  );
}
