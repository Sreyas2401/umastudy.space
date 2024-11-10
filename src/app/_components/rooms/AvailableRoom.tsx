import Link from "next/link";

export default function AvailableRoom({
  building,
  room,
}: {
  building: string;
  room: string;
}) {
  return (
    <Link href={`/buildings/${building}/rooms/${room}/schedule`}>
      <div className="text-center hover:bg-gray-200">Room {room}</div>
    </Link>
  );
}
