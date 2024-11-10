"use client";

import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";

function MainNav({ pathname }: { pathname: string }) {
  return (
    <nav className="flex h-full w-full columns-2 justify-center gap-6">
      <Tabs defaultValue="buildings" value={pathname.slice(1)}>
        <TabsList>
          <TabsTrigger value="buildings">
            <Link href="/buildings">Buildings</Link>
          </TabsTrigger>
          <TabsTrigger value="rooms">
            <Link href="/rooms">Rooms</Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </nav>
  );
}

function BuildingNav() {
  const { bldg, roomId } = useParams();

  return (
    <div>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link href={"/buildings"}>Buildings</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <Link href={`/buildings/${bldg as string}`}>Building</Link>
          </BreadcrumbItem>
          {roomId && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>Room</BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}

export default function DashboardRoutes() {
  const pathname = usePathname();

  const isBuildings = pathname === "/buildings";
  const isRooms = pathname === "/rooms";

  return isBuildings || isRooms ? (
    <MainNav pathname={pathname} />
  ) : (
    <BuildingNav />
  );
}
