import { Dialog } from "~/components/ui/dialog";

export default async function RoomSchedule({
  params,
}: {
  params: Promise<{ bldg: string; roomId: string }>;
}) {
  const {} = await params;
  return <Dialog>Hello room schedule</Dialog>;
}
