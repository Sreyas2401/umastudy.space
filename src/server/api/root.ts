import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { eventRouter } from "./routers/event";
import { buildingRouter } from "./routers/building";
import { roomRouter } from "./routers/room";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  event: eventRouter,
  building: buildingRouter,
  room: roomRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
