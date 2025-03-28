'use client';

import { useState } from "react";
import { Button } from "./ui/button";
import { MoveRight, MapPin } from "lucide-react";
import {RoutensucheEingabefeld} from "./routensuche-speziellefelder-eingabefeld";
import {RoutensuchePickdate} from "./routensuche-speziellefelder-pickdate";
import {RoutensuchePicktime} from "./routensuche-speziellefelder-picktime";
import {RoutensucheCheckboxFilter} from "./routensuche-speziellefelder-checkboxfilter";


export default function Stationeneingabe({onStartStationSelected, onEndStationSelected, onDateSelected, onTimeSelected, startError = false, endError = false}: {onStartStationSelected: (station: string) => void, onEndStationSelected: (station: string) => void, onDateSelected: (date: Date) => void, onTimeSelected: (time: string) => void, startError?: boolean, endError?: boolean}) {

    const[showFilters, setShowFilters] = useState(false);

    const filterOptions = [
      "Schnellste Route auswählen",
      "Minimale Anzahl an Umstiegen",
      "Barrierefreies Reise durchgehend möglich"
    ];

    const [selectedFilter, setSelectedFilter] = useState<string>(filterOptions[0]);

    const lineOptions = [
      "Linie 1",
      "Linie 2",
      "Linie 3",
      "Linie 4",
      "Linie 6"
    ];

    const [selectedLine, setSelectedLine] = useState<string[]>([...lineOptions]);

    const toggleLine = (line: string) => {
      setSelectedLine((prev) => {
        if (prev.includes(line)) {
          return prev.filter(item => item !== line);
        } else {
          return [...prev, line];
        }
      });
    };

  return (
    <div className="w-full">
      <div className="grid sm:grid-cols-[1fr_auto] grid-cols-1 gap-4 w-full items-center">
        <div className="flex items-center gap-4 flex-wrap">
          <RoutensucheEingabefeld text="Startstation auswählen" image={MapPin} onStationSelected={onStartStationSelected} hasError={startError}></RoutensucheEingabefeld>
          <MoveRight className="h-6 w-6 text-gray-600 hidden sm:block"></MoveRight>
          <RoutensucheEingabefeld text="Zielstation auswählen" image={MapPin} onStationSelected={onEndStationSelected} hasError={endError}></RoutensucheEingabefeld>
        </div>
      </div>
      <div className="grid sm:grid-cols-[1fr_auto] grid-cols-1 gap-4 w-full items-center mt-3">
        <div className="flex items-center gap-4 flex-wrap">
          <RoutensuchePickdate onDateSelected={onDateSelected}></RoutensuchePickdate>
          <RoutensuchePicktime onTimeSelected={onTimeSelected}></RoutensuchePicktime>
        </div>
        <div className="flex justify-end w-full">
          <Button variant="outline" className="w-full sm:w-auto" onClick={() => setShowFilters((prev) => !prev)}>
            {showFilters ? "Filteroptionen ausblenden" : "Filteroptionen einblenden"}
          </Button>
        </div>
      </div>
{showFilters && (
    <div className="mt-8">
      <div className="flex flex-wrap gap-4">
        {filterOptions.map(option => (
          <RoutensucheCheckboxFilter key={option} text={option} checked={selectedFilter === option} onChange={() => setSelectedFilter(option)}
          />
        ))}
      </div>
      <div className="mt-3">
        <p className="text-sm font-medium">Nur folgende Linien berücksichtigen: </p>
        <div className="flex flex-wrap gap-4 mt-3">
          {lineOptions.map(line => (
            <RoutensucheCheckboxFilter key={line} text={line} checked={selectedLine.includes(line)} onChange={() => toggleLine(line)}
            />
          ))}
        </div>
        </div>
        </div>
      )}
      </div>   
  );
}   
