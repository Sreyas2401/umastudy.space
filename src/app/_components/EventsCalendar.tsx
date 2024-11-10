"use client";

import { addWeeks, endOfMonth, format, startOfDay } from "date-fns";
import { ArrowRight, CalendarIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import { cn } from "~/lib/utils";

export type Event = {
  id: number;
  name: string;
  startsAt: Date;
  endsAt: Date;
};

export default function EventsCalendar({ events }: { events: Event[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const today = useRef<Date>(startOfDay(new Date()));
  const [date, setDate] = useState<Date | undefined>(new Date());

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (params.has(name)) {
        params.delete(name);
      }

      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  useEffect(() => {
    router.push(
      pathname + "?" + createQueryString("from", date?.toISOString() ?? ""),
    );
  }, [date, createQueryString, router, pathname]);

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-[280px] justify-start text-left font-normal",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
            required={true}
            disabled={{
              before: today.current,
              after: endOfMonth(addWeeks(today.current, 1)),
            }}
          />
        </PopoverContent>
      </Popover>
      <Separator />
      <ScrollArea>
        {events.map((event) => (
          <div key={event.id}>
            <Card>
              <CardHeader>{event.name}</CardHeader>
              <CardContent>
                <p>
                  {format(event.startsAt, "hh:mm bb")} to {format(event.endsAt, "hh:mm bb")}
                </p>
              </CardContent>
            </Card>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
}
