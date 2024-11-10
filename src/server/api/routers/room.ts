import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { eq, getTableColumns, sql } from "drizzle-orm";
import { eventRooms, events, rooms } from "~/server/db/schema";

export const roomRouter = createTRPCRouter({
  getRoomsForBuilding: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const rooms = await ctx.db.query.rooms.findMany({
        where: (rooms, { eq }) => eq(rooms.building, input),
      });

      return rooms;
    }),
  getUpcomingEventsForRoom: publicProcedure
    .input(z.object({ building: z.string(), room: z.string() }))
    .query(async ({ ctx, input }) => {
      const roomEvents = await ctx.db
        .select({ ...getTableColumns(events) })
        .from(events)
        .innerJoin(eventRooms, eq(events.id, eventRooms.eventId))
        .where(
          sql`${eventRooms.building} = ${input.building} and ${eventRooms.roomId} = ${input.room} and ${events.startsAt} > ${new Date()}`,
        );

      return roomEvents;
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

      return availableRooms;
    }),
});
