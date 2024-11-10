import { redirect } from "next/navigation";

export default async function BuildingRooms({
  params,
}: {
  params: Promise<{ bldg: string }>;
}) {
  const { bldg } = await params;
  return redirect(`/buildings/${bldg}`);
}
