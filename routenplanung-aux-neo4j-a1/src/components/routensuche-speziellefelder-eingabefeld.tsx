"use client";

import * as React from "react";
import { useState, useEffect} from "react";
import { Calendar as Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Eingabefeld für S-Bahn Stationen
export function RoutensucheEingabefeld({ className, text, image: Icon, onStationSelected, hasError = false, ...props }: { className?: string , text?: string, image?: React.ElementType; onStationSelected: (station: string) => void, hasError?: boolean }) {
  
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");
    const [stations, setStations] = useState<{ value: string, label: string }[]>([]);

      // Fetch S-Bahn-Stationen aus der API
  useEffect(() => {
    async function fetchStations() {
      try {
        const response = await fetch("/api/stops");
        const data = await response.json();
        const stationList = data.stops.map((station: string) => ({
          value: station.toLowerCase().replace(/\s+/g, "-"), // Slug-Format
          label: station
        }));
        setStations(stationList);
      } catch (error) {
        console.error("Fehler beim Laden der S-Bahn-Stationen:", error);
      }
    }

    fetchStations();
  }, []);

  const handleSelect = (currentValue: string) => {
    const newValue = currentValue === value ? "" : currentValue;
    setValue(newValue);
    setOpen(false);

    const station = stations.find((s) => s.value === newValue);
    if (station) {
      onStationSelected(station.label); // <-- Callback mit Station-Name
    }
  };
  
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("w-[350px] justify-between", hasError ? "border border-red-500" : "", className)}
            {...props}
          >
            <div className="flex items-center space-x-2">
              {Icon && <Icon className="h-5 w-5"/>}
            <span>{value ? stations.find((station) => station.value === value)?.label : text}</span>
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className={cn("w-[350px] p-0", className)}>
          <Command>
            <CommandInput placeholder={text} />
            <CommandList>
              <CommandEmpty>No station found.</CommandEmpty>
              <CommandGroup>
                {stations.map((station) => (
                  <CommandItem
                    key={station.value}
                    value={station.value}
                    onSelect={handleSelect}
                  >
                    <Check
                      className={cn("mr-2 h-4 w-4", value === station.value ? "opacity-100" : "opacity-0")}
                    />
                    {station.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
  
  