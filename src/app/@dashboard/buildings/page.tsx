import Link from "next/link";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import { api } from "~/trpc/server";

export default async function Buildings() {
  const buildings = await api.building.getBuildings();

  return (
    <ScrollArea>
      {buildings.map((building) => (
        <Link key={building.id} href={`/buildings/${building.id}`}>
          <div className="px-2 text-center hover:bg-gray-100">
            {building.name}
            <Separator />
          </div>
        </Link>
      ))}
    </ScrollArea>
  );
}
