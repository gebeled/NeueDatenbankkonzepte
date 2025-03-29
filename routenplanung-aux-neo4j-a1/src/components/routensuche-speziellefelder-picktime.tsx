"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Calendar as Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Uhrzeit auswählen
export function RoutensuchePicktime({
  className,
  onTimeSelected,
  ...props
}: {
  className?: string;
  onTimeSelected: (time: string) => void;
}) {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  // Default-Uhrzeit berechnen (aktuelle Zeit)
  const getCurrentTime = (): string => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const defaultTime = getCurrentTime();

  useEffect(() => {
    if (selectedTime === null) {
      setSelectedTime(defaultTime);
      onTimeSelected(defaultTime);
    }
  }, [selectedTime, onTimeSelected, defaultTime]);

  // Neue Sortierfunktion: ausgewählte Zeit + alles danach
  const getSortedTimes = (startTime: string) => {
    const index = times.findIndex((t) => t === startTime);
    return [...times.slice(index), ...times.slice(0, index)];
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-[100px] justify-between", className)}
          {...props}
        >
          {selectedTime}
          <ChevronDown className="h-4 w-4 ml-2 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[100px] h-64 overflow-y-auto p-0">
        <Command>
          <CommandList>
            <CommandGroup>
              {getSortedTimes(selectedTime || defaultTime).map((time) => (
                <CommandItem
                  key={time}
                  value={time}
                  onSelect={() => {
                    setSelectedTime(time);
                    setOpen(false);
                    onTimeSelected(time);
                  }}
                  className="cursor-pointer w-full"
                >
                  {time}
                  {selectedTime === time && (
                    <Check className="ml-auto h-4 w-4 text-blue-500" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// Alle Minuten eines Tages generieren
const times = Array.from({ length: 1440 }, (_, i) => {
  const hours = String(Math.floor(i / 60)).padStart(2, "0");
  const minutes = String(i % 60).padStart(2, "0");
  return `${hours}:${minutes}`;
});
