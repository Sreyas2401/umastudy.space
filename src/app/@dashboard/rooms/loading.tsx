import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";

export default function RoomsLoading() {
  return (
    <div>
      {[...Array.from({ length: 10 })].map((_, i) => (
        <div key={i}>
          <Skeleton className="w-100 h-20 rounded-xl" />
          <Separator />
        </div>
      ))}
    </div>
  );
}
