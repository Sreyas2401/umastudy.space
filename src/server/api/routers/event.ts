import { endOfDay, startOfDay } from "date-fns";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { eventRooms } from "~/server/db/schema";

export const eventRouter = createTRPCRouter({
  getEventsForDate: publicProcedure
    .input(z.object({ date: z.date() }))
    .query(async ({ ctx, input }) => {
      const inputDate = new Date(input.date);

      const events = await ctx.db.query.events.findMany({
        where: (events, { between }) =>
          between(events.startsAt, startOfDay(inputDate), endOfDay(inputDate)),
        orderBy: (events, { asc }) => [asc(events.startsAt)],
        with: {
          rooms: true,
        },
      });

      return events;
    }),
  getEventRooms: publicProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      const rooms = await ctx.db
        .select()
        .from(eventRooms)
        .where(eq(eventRooms.eventId, input));

      return rooms;
    }),
});
