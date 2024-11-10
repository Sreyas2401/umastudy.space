import { api } from "~/trpc/server";

export default async function BuildingRoom({
  params,
}: {
  params: Promise<{ bldg: string; roomId: string }>;
}) {
  const { bldg, roomId } = await params;

  const upcomingEvents = await api.room.getUpcomingEventsForRoom({
    building: bldg,
    room: roomId,
  });

  return (
    <div>
      <p>Building: {bldg}</p>
      <p>Room: {roomId}</p>
    </div>
  );
}
