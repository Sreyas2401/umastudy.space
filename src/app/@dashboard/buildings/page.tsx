import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import { api } from "~/trpc/server";

export default async function Buildings() {
  const buildings = await api.building.getBuildings();

  return (
    <ScrollArea>
      {buildings.map((building) => (
        <div key={building.id} className="text-center px-2">
          {building.name}
          <Separator />
        </div>
      ))}
    </ScrollArea>
  );
}
