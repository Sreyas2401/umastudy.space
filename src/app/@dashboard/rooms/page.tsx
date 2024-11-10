import { addHours } from "date-fns";
import AvailableBuilding from "~/app/_components/buildings/AvailableBuilding";

import { Accordion } from "~/components/ui/accordion";
import { ScrollArea } from "~/components/ui/scroll-area";
import { api } from "~/trpc/server";

export default async function Rooms() {
  const date = new Date();
  const availableRooms = await api.room.getAvailableRooms({
    from: date.toISOString(),
    to: addHours(date, 6).toISOString(),
  });

  const groupedByBuilding = availableRooms.reduce(
    (acc, room) => {
      if (!acc[room.building]) {
        acc[room.building] = [room];
      } else {
        acc[room.building]!.push(room);
      }

      return acc;
    },
    {} as Record<string, typeof availableRooms>,
  );

  return (
    <div>
      <ScrollArea>
        <Accordion type="single" collapsible>
          {Object.entries(groupedByBuilding)
            .sort((a, b) => b[1].length - a[1].length)
            .map(([building, rooms]) => (
              <div key={building}>
                <AvailableBuilding building={building} rooms={rooms} />
              </div>
            ))}
        </Accordion>
      </ScrollArea>
    </div>
  );
}
