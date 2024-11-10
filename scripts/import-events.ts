import { addDays, format, startOfWeek } from "date-fns";
import { BLDG_CODES, LIVE_API_URL } from "./common";
import { db } from "~/server/db";
import {
  eventRooms as eventRoomsTable,
  events as eventsTable,
} from "~/server/db/schema";
import path from "path";
import { file } from "bun";

function fmtDate(date: Date) {
  return format(date, "yyyy-MM-dd");
}

type Subject = {
  itemId: number;
  itemName: string;
  itemId2: number;
  itemTypeId: number;
};

type Reservation = {
  event_id: number;
  has_registration: number; // 0 or 1
  all_day: number; // 0 or 1
  event_name: string;
  rsrv_start_dt: string;
  rsrv_end_dt: string;
  profile_name: string;
  calendar_date: string;
  subject: Subject[];
};

type EventDay = {
  date: string;
  month_name: string;
  rsrv: Reservation[];
};

type EventListResponse = {
  root: {
    comptype: string;
    obj_id: number;
    last_id: number;
    days_per_row: number;
    weekday: string[];
    page: number;
    lastupdate: string;
    events: EventDay[];
  };
};

async function getEvents(
  startDate: Date,
  endDate: Date,
  lastId = -1,
  objId = 0,
): Promise<EventListResponse["root"]> {
  const reqUrl = new URL(`${LIVE_API_URL}/home/calendar/calendardata.json`);

  reqUrl.searchParams.set("mode", "pro");
  reqUrl.searchParams.set("obj_cache_accl", objId.toString());
  reqUrl.searchParams.set("start_dt", fmtDate(startDate));
  reqUrl.searchParams.set("end_dt", fmtDate(endDate));
  reqUrl.searchParams.set("comptype", "calendar");
  reqUrl.searchParams.set("sort", "evdates_event_name");
  reqUrl.searchParams.set("compsubject", "event");
  reqUrl.searchParams.set("last_id", lastId.toString());

  if (lastId >= 0) {
    reqUrl.searchParams.set("page", "1");
  }

  const response = await fetch(reqUrl);
  const { root: data } = (await response.json()) as EventListResponse;

  return data;
}

async function getTotalEvents(startDate: Date, endDate: Date, objId: number) {
  const reqUrl = new URL(`${LIVE_API_URL}/home/calendar/calhasmore.json`);

  reqUrl.searchParams.set("mode", "pro");
  reqUrl.searchParams.set("start_dt", fmtDate(startDate));
  reqUrl.searchParams.set("end_dt", fmtDate(endDate));
  reqUrl.searchParams.set("obj_cache_accl", objId.toString());
  reqUrl.searchParams.set("compsubject", "event");

  const response = await fetch(reqUrl);
  const data = (await response.json()) as { hasMore: number[] };

  return data.hasMore;
}

async function getAllEventsForWeek(startDate: Date) {
  const endDate = addDays(startDate, 7);

  const initialEventsReq = await getEvents(startDate, endDate);
  const totalEvents = await getTotalEvents(
    startDate,
    endDate,
    initialEventsReq.obj_id,
  );

  const dayEvents = await Promise.all(
    initialEventsReq.events.map(async (eventDay, i) => {
      const date = new Date(eventDay.date);

      const totalEventCount = totalEvents[i]!;
      let dayReservations: Reservation[] = [];

      let lastId = 0;

      while (dayReservations.length < totalEventCount) {
        const moreEventsReq = await getEvents(
          date,
          date,
          lastId,
          initialEventsReq.obj_id,
        );

        dayReservations = dayReservations.concat(moreEventsReq.events[0]!.rsrv);
        lastId = moreEventsReq.last_id;
      }

      return dayReservations;
    }),
  );

  return dayEvents.flatMap((dayEvents) => dayEvents);
}

async function importEvents() {
  console.log("Importing events");

  const start = startOfWeek(new Date());

  const [week1Events, week2Events, week3Events, week4Events] =
    await Promise.all(
      [start, addDays(start, 7), addDays(start, 14), addDays(start, 21)].map(
        async (startDate) => {
          const events = await getAllEventsForWeek(startDate);
          return events;
        },
      ),
    );

  const events = [
    ...(week1Events ?? []),
    ...(week2Events ?? []),
    ...(week3Events ?? []),
    ...(week4Events ?? []),
  ];

  // Bun.write(path.join(__dirname, "events.json"), JSON.stringify(events));

  // const events: Reservation[] = (await file(
  //   path.join(__dirname, "events.json"),
  // ).json()) as unknown as Reservation[];

  console.log(`Importing ${events.length} events`);

  const eventRoomsByEvent: Record<
    string,
    (typeof eventRoomsTable.$inferInsert)[]
  > = {};

  const missingRoomCodes = new Set<string>();

  const uniqueReservationIds = new Set<string>();
  const reservations: (typeof eventsTable.$inferInsert)[] = events
    .map((rsv) => {
      if (!rsv.subject) {
        return null;
      }

      if (uniqueReservationIds.has(`${rsv.event_id}${rsv.rsrv_start_dt}`)) {
        return null;
      }

      uniqueReservationIds.add(`${rsv.event_id}${rsv.rsrv_start_dt}`);

      const roomCodes = rsv.subject.map((s) => s.itemName);

      eventRoomsByEvent[rsv.event_id] = [];

      for (const roomCode of roomCodes) {
        const bldgCode = BLDG_CODES.find((bldgCode) =>
          roomCode.startsWith(bldgCode),
        );

        if (bldgCode) {
          eventRoomsByEvent[rsv.event_id]!.push({
            eventId: rsv.event_id,
            roomId: roomCode.slice(bldgCode.length),
            building: bldgCode,
          });
        } else {
          missingRoomCodes.add(roomCode);
        }
      }

      const reservation: typeof eventsTable.$inferInsert = {
        liveEventId: rsv.event_id,
        name: rsv.event_name,
        startsAt: new Date(rsv.rsrv_start_dt),
        endsAt: new Date(rsv.rsrv_end_dt),
      };

      return reservation;
    })
    .filter((rsv) => rsv !== null);

  console.log(`Missing room codes`, [...missingRoomCodes]);

  console.log(`Importing ${uniqueReservationIds.size} unique reservations`);

  let totalInserted = 0;

  while (reservations.length > 0) {
    const batch = reservations.splice(0, 1000);

    const inserted = await db
      .insert(eventsTable)
      .values(batch)
      .onConflictDoNothing()
      .returning({ id: eventsTable.id, liveEventId: eventsTable.liveEventId });

    totalInserted += inserted.length;

    if (inserted.length === 0) continue;

    const roomReservations = inserted.flatMap((i) => {
      const rooms = eventRoomsByEvent[i.liveEventId]!;

      rooms.forEach((r) => (r.eventId = i.id));

      return rooms;
    });

    await db
      .insert(eventRoomsTable)
      .values(roomReservations)
      .onConflictDoNothing();
  }

  console.log(`Imported ${totalInserted} new events`);
  process.exit(0);
}

await importEvents();
