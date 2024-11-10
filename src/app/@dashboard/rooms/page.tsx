import { addHours } from "date-fns";
import AvailableRoom from "~/app/_components/rooms/AvailableRoom";
import { ScrollArea } from "~/components/ui/scroll-area";
import { api } from "~/trpc/server";

export default async function Rooms() {
  const date = new Date();
  const availableRooms = await api.room.getAvailableRooms({
    from: date.toISOString(),
    to: addHours(date, 6).toISOString(),
  });

  return (
    <div>
      <ScrollArea>
        {availableRooms.map((room) => (
          <div key={`${room.building}-${room.id}`}>
            <AvailableRoom building={room.building} room={room.id} />
          </div>
        ))}
      </ScrollArea>
    </div>
  );
}
