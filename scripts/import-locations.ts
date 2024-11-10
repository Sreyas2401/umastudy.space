import { db } from "~/server/db";
import { BLDG_CODES, BLDG_NAMES, LIVE_API_URL } from "./common";
import { buildings, rooms } from "~/server/db/schema";
import path from "path";
import { file } from "bun";

type Location = {
  id: string;
  description: string;
};

type ListLocationRow = {
  contextId: number;
  row: unknown[];
  pages?: number;
  count?: number;
};

type ListLocationResponse = {
  cacheId: number;
  page: number;
  page_size: number;
  rows: ListLocationRow[];
};

async function getLocations(page = 1, objId = 0, pageSize = 100) {
  const reqUrl = new URL(`${LIVE_API_URL}/list/listdata.json`);

  reqUrl.searchParams.set("compsubject", "location");
  reqUrl.searchParams.set("sort", "max_capacity");
  reqUrl.searchParams.set("order", "asc");
  reqUrl.searchParams.set("page", page.toString());
  reqUrl.searchParams.set("page_size", pageSize.toString());
  reqUrl.searchParams.set("obj_cache_accl", objId.toString());

  const response = await fetch(reqUrl);
  const data = (await response.json()) as ListLocationResponse;
  return data;
}

async function getAllLocations(): Promise<Location[]> {
  let rawLocations: ListLocationRow[] = [];
  let page = 1;
  let objId = 0;

  const initialLocationsReq = await getLocations(page, objId);

  rawLocations = rawLocations.concat(initialLocationsReq.rows);
  objId = initialLocationsReq.cacheId;

  const totalPages = initialLocationsReq.rows[0]!.pages!;

  while (page <= totalPages) {
    const moreLocationsReq = await getLocations(page, objId);

    rawLocations = rawLocations.concat(moreLocationsReq.rows);

    page++;
  }

  const locations: Location[] = rawLocations.map((rawLocation) => {
    return {
      id: (rawLocation.row[0]! as { itemName: string }).itemName,
      description: rawLocation.row[1]! as string,
    };
  });

  return locations;
}

async function scrapeLocations() {
  const locations = await getAllLocations();

  //Bun.write(path.join(__dirname, "locations.json"), JSON.stringify(locations));

  // const locations: Location[] = await file(
  //   path.join(__dirname, "locations.json"),
  // ).json() as unknown as Location[];

  const locationsByBldg = locations.reduce(
    (acc, location) => {
      const bldg = BLDG_CODES.find((bldgCode) =>
        location.id.startsWith(bldgCode),
      );

      if (bldg) {
        acc[bldg] = [...(acc[bldg] ?? []), location.id.slice(bldg.length)];
      }

      return acc;
    },
    {} as Record<string, string[]>,
  );

  await db
    .insert(buildings)
    .values(
      Object.keys(locationsByBldg).map((bldg) => ({
        id: bldg,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        name: BLDG_NAMES[bldg as keyof typeof BLDG_NAMES],
      })),
    )
    .onConflictDoNothing();

  const locationRooms: (typeof rooms.$inferInsert)[] = Object.entries(
    locationsByBldg,
  ).flatMap(([bldg, rooms]) =>
    rooms.map((room) => ({
      id: room,
      building: bldg,
    })),
  );

  try {
    await db.insert(rooms).values(locationRooms).onConflictDoNothing();
  } catch (err) {
    console.error(err);
  }

  console.log("Imported buildings and rooms");
  
  process.exit(0);
}

await scrapeLocations();
