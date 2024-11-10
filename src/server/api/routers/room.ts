import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { and, eq, getTableColumns, sql } from "drizzle-orm";
import { eventRooms, events, rooms } from "~/server/db/schema";
import { addDays, addMinutes, subMinutes } from "date-fns";
import { BLDG_CODES } from "~/app/utils/buildingMap";

export const roomRouter = createTRPCRouter({
  getRoomsForBuilding: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const now = new Date();

      const sq = ctx.db
        .select({
          roomId: eventRooms.roomId,
          building: eventRooms.building,
          availability: sql<"Available" | "Unavailable">`CASE 
            WHEN COUNT(${events.id}) > 0 THEN 'Unavailable' 
            ELSE 'Available' 
          END`.as("availability"),
        })
        .from(eventRooms)
        .innerJoin(
          events,
          and(
            eq(eventRooms.eventId, events.id),
            sql`${events.startsAt} < ${addMinutes(now, 30).toISOString()} and ${events.endsAt} > ${subMinutes(now, 15).toISOString()}`,
          ),
        )
        .where(eq(eventRooms.building, input))
        .groupBy(eventRooms.roomId, eventRooms.building)
        .as("room_occupation");

      const bldgRooms = await ctx.db
        .select({
          ...getTableColumns(rooms),
          available: sql<
            "Available" | "Unavailable"
          >`COALESCE(${sq.availability}, 'Available')`,
        })
        .from(rooms)
        .leftJoin(
          sq,
          and(eq(rooms.id, sq.roomId), eq(rooms.building, sq.building)),
        )
        .where(eq(rooms.building, input))
        .orderBy(rooms.id);

      return bldgRooms;
    }),
  getUpcomingEventsForRoom: publicProcedure
    .input(
      z.object({
        building: z.string(),
        room: z.string(),
        from: z.string().datetime(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const now = input.from ? new Date(input.from) : new Date();
      const until = addDays(now, 1);

      const upcomingRoomEvents = await ctx.db
        .select({ ...getTableColumns(events) })
        .from(events)
        .innerJoin(eventRooms, eq(events.id, eventRooms.eventId))
        .where(
          sql`${eventRooms.building} = ${input.building} 
          and ${eventRooms.roomId} = ${input.room}
          and ((${events.startsAt} between ${now.toISOString()} and ${until.toISOString()})
           or (${events.endsAt} between ${now.toISOString()} and ${until.toISOString()}))`,
        );

      return upcomingRoomEvents;
    }),
  getAvailableRooms: publicProcedure
    .input(z.object({ from: z.string().datetime(), to: z.string().datetime() }))
    .query(async ({ ctx, input }) => {
      const unavailableRooms = ctx.db
        .select()
        .from(eventRooms)
        .innerJoin(events, eq(eventRooms.eventId, events.id))
        .where(
          sql`${events.startsAt} < ${input.to} and ${events.endsAt} > ${input.from}`,
        )
        .as("unavailable_rooms");

      const availableRooms = await ctx.db
        .select({ ...getTableColumns(rooms) })
        .from(rooms)
        .leftJoin(
          unavailableRooms,
          eq(rooms.id, unavailableRooms.event_rooms.roomId),
        )
        .groupBy(rooms.building, rooms.id)
        .having(() => sql`count(${unavailableRooms.events.id}) = 0`);

      return availableRooms.filter((r) =>
        BLDG_CODES.includes(r.building as (typeof BLDG_CODES)[number]),
      );
    }),
});
