import { type RouterOutputs } from "~/trpc/react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import AvailableRoom from "~/app/_components/rooms/AvailableRoom";
import { type BLDG_CODES, BLDG_NAMES } from "~/app/utils/buildingMap";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";

export default function AvailableBuilding({
  building,
  rooms,
}: {
  building: string;
  rooms: RouterOutputs["room"]["getAvailableRooms"];
}) {
  return (
    <AccordionItem value={building} className="hover:bg-gray-100">
      <AccordionTrigger>
        <span className="flex flex-row items-center gap-2">
          <p>{BLDG_NAMES[building as (typeof BLDG_CODES)[number]]}</p>
          <p>({rooms.length})</p>
        </span>
      </AccordionTrigger>
      <AccordionContent>
        <ScrollArea>
          {rooms.map((room) => (
            <div key={`${room.building}-${room.id}`}>
              <AvailableRoom building={room.building} room={room.id} />
              <Separator />
            </div>
          ))}
        </ScrollArea>
      </AccordionContent>
    </AccordionItem>
  );
}
