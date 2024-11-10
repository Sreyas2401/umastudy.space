export default function AvailableRoom({
  building,
  room,
}: {
  building: string;
  room: string;
}) {
  return (
    <div>
      {building} - {room}
    </div>
  );
}
