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
        <RoutensucheCheckboxFilter text="Schnellste Route auswählen" checked={true}></RoutensucheCheckboxFilter>
        <RoutensucheCheckboxFilter text="Minimale Anzahl an Umstiegen"></RoutensucheCheckboxFilter>
        <RoutensucheCheckboxFilter text="Barrierefreies Reise durchgehend möglich"></RoutensucheCheckboxFilter>
      </div>
      <div className="mt-3">
        <p className="text-sm font-medium">Nur folgende Linien berücksichtigen: </p>
        <div className="flex flex-wrap gap-4 mt-3">
        <RoutensucheCheckboxFilter text="Linie 1"></RoutensucheCheckboxFilter>
        <RoutensucheCheckboxFilter text="Linie 2"></RoutensucheCheckboxFilter>
        <RoutensucheCheckboxFilter text="Linie 3"></RoutensucheCheckboxFilter>
        <RoutensucheCheckboxFilter text="Linie 4"></RoutensucheCheckboxFilter>
        <RoutensucheCheckboxFilter text="Linie 6"></RoutensucheCheckboxFilter>
        <RoutensucheCheckboxFilter text="Linie 9a"></RoutensucheCheckboxFilter>
        <RoutensucheCheckboxFilter text="Linie 9b"></RoutensucheCheckboxFilter>
      </div>
        </div>
        </div>
      )}
      </div>
  );
}   
