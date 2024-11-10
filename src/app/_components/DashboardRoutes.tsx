"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";

export default function DashboardRoutes() {
  const pathname = usePathname();

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
