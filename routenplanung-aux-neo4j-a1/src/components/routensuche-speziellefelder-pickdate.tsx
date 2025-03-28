"use client";

import * as React from "react";
import { useEffect } from "react";
import { format } from "date-fns";
import { useState } from "react";
import { Calendar as CalendarIcon} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";


// Datum auswählen
export function RoutensuchePickdate({ className, onDateSelected, ...props }: { className?: string, onDateSelected: (date: Date) => void }) {

  const [date, setDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    if (date) {
      onDateSelected(date);
    }
  }, [date, onDateSelected]);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      onDateSelected(selectedDate);
    }
  };
  
  
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
          <Calendar mode="single" selected={date} onSelect={handleDateSelect} required initialFocus />
        </PopoverContent>
      </Popover>
    );
  }