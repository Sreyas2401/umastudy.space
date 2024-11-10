import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { events, eventRooms } from "~/server/db/schema";
import { eq, getTableColumns, sql } from "drizzle-orm";
import { BLDG_CODES } from "~/app/utils/buildingMap";

export const buildingRouter = createTRPCRouter({
  getBuildings: publicProcedure.query(async ({ ctx }) => {
    const buildings = await ctx.db.query.buildings.findMany({
      limit: 100,
    });

    return buildings.filter((b) =>
      BLDG_CODES.includes(b.id as (typeof BLDG_CODES)[number]),
    );
  }),
  getUpcomingEventsForBuilding: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const buildingEvents = await ctx.db
        .select({ ...getTableColumns(events) })
        .from(events)
        .innerJoin(eventRooms, eq(events.id, eventRooms.eventId))
        .where(
          sql`${eventRooms.building} = ${input} and ${events.startsAt} > ${new Date()}`,
        );

      return buildingEvents;
    }),
});
