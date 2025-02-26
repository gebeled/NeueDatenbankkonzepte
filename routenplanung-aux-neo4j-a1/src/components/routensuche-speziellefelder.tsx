"use client";

import * as React from "react";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Check, ChevronsUpDown, ChevronDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
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

// Datum auswählen
export function RoutensuchePickdate({ className, ...props }: { className?: string }) {
  const [date, setDate] = useState<Date>();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-[300px] justify-start text-left font-normal", className)}
          {...props}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
      </PopoverContent>
    </Popover>
  );
}

// Uhrzeit auswählen
export function RoutensuchePicktime({ className, ...props }: { className?: string }) {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const now = new Date();
    const currentHours = String(now.getHours()).padStart(2, "0");
    const currentMinutes = String(now.getMinutes()).padStart(2, "0");
    setSelectedTime(`${currentHours}:${currentMinutes}`);
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn("w-[100px] justify-between", className)} {...props}>
          {selectedTime}
          <ChevronDown className="h-4 w-4 ml-2 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[100px] h-64 overflow-y-auto p-0">
        <Command>
          <CommandList>
            <CommandGroup>
              {times.map((time) => (
                <CommandItem
                  key={time}
                  value={time}
                  onSelect={() => {
                    setSelectedTime(time);
                    setOpen(false);
                  }}
                  className="cursor-pointer w-full"
                >
                  {time}
                  {selectedTime === time && <Check className="ml-auto h-4 w-4 text-blue-500" />}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

const times = Array.from({ length: 1440 }, (_, i) => {
  const hours = String(Math.floor(i / 60)).padStart(2, "0");
  const minutes = String(i % 60).padStart(2, "0");
  return `${hours}:${minutes}`;
});

// Eingabefeld für S-Bahn Stationen
export function RoutensucheEingabefeld({ className, text, image: Icon, ...props }: { className?: string , text?: string, image?: React.ElementType }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-[350px] justify-between", className)}
          {...props}
        >
          <div className="flex items-center space-x-2">
            {Icon && <Icon className="h-5 w-5"/>}
          <span>{value ? frameworks.find((framework) => framework.value === value)?.label : text}</span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("w-[350px] p-0", className)}>
        <Command>
          <CommandInput placeholder={text} />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {frameworks.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn("mr-2 h-4 w-4", value === framework.value ? "opacity-100" : "opacity-0")}
                  />
                  {framework.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}


  const frameworks = [
    {
      value: "next.js",
      label: "Next.js",
    },
    {
      value: "sveltekit",
      label: "SvelteKit",
    },
    {
      value: "nuxt.js",
      label: "Nuxt.js",
    },
    {
      value: "remix",
      label: "Remix",
    },
    {
      value: "astro",
      label: "Astro",
    },
  ]

  // Filteroptionen auswählen
  export function RoutensucheCheckboxFilter({ className, text, checked = false, onChange, ...props }: { className?: string, text?: string, checked?: boolean, onChange?: (checked: boolean) => void }) {

    const [isChecked, setIsChecked] = useState(checked);

    const handleChange = () => {
      setIsChecked(!isChecked);
      if (onChange) onChange(!isChecked);
    };

    return (
        <div className={cn("flex items-center space-x-2", className)} {...props}>
          <Checkbox id={text} checked={isChecked} onCheckedChange={handleChange} />
          <Label htmlFor={text}>{text}</Label>
        </div>
    )
  }