import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";

export default function BuildingRoomLoading() {
  return (
    <div>
      <Skeleton className="h-[100] rounded-xl" />
      <Separator />
    </div>
  );
}
