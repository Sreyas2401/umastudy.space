import Link from "next/link";
import { type BLDG_CODES, BLDG_NAMES } from "~/app/utils/buildingMap";
import { Separator } from "~/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { api } from "~/trpc/server";

export default async function Building({
  params,
}: {
  params: Promise<{ bldg: string }>;
}) {
  const { bldg } = await params;

  const bldgRooms = await api.room.getRoomsForBuilding(bldg);

  return (
    <div>
      <div className="mb-5 text-center">
        <p className="">{BLDG_NAMES[bldg as (typeof BLDG_CODES)[number]]}</p>
        <Separator />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Room</TableHead>
            <TableHead>Availability</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bldgRooms.map((room) => (
            <TableRow
              key={`${room.building}-${room.id}`}
              className="px-2 text-center hover:bg-gray-100"
            >
              <TableCell>
                <Link href={`/buildings/${room.building}/rooms/${room.id}`}>
                  {room.id}{" "}
                </Link>
              </TableCell>
              <TableCell>
                <p className="rounded-full text-center">{room.available}</p>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
