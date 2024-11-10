import { endOfDay, startOfDay } from "date-fns";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

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
});
