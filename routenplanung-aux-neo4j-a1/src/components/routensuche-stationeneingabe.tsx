'use client';

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { MoveRight, MapPin } from "lucide-react";
import {RoutensucheEingabefeld} from "./routensuche-speziellefelder-eingabefeld";
import {RoutensuchePickdate} from "./routensuche-speziellefelder-pickdate";
import {RoutensuchePicktime} from "./routensuche-speziellefelder-picktime";
import {RoutensucheCheckboxFilter} from "./routensuche-speziellefelder-checkboxfilter";


export default function Stationeneingabe({onStartStationSelected, onEndStationSelected, onDateSelected, onTimeSelected, onFilterValuesChange, startError = false, endError = false}: {onStartStationSelected: (station: string) => void, onEndStationSelected: (station: string) => void, onDateSelected: (date: Date) => void, onTimeSelected: (time: string) => void, onFilterValuesChange: (filters: {fewchanges: boolean; wheelchair_boarding: boolean; allowedRoutes: string[]}) => void, startError?: boolean, endError?: boolean}) {

    const[showFilters, setShowFilters] = useState(false);

    const routeOptions = ["Schnellste Route auswählen", "Minimale Anzahl an Umstiegen"];
    const [selectedRouteOption, setSelectedRouteOption] = useState<string>(routeOptions[0]);
  
    // Unabhängiger Filter: Barrierefreies Reisen
    const [wheelchairBoarding, setWheelchairBoarding] = useState<boolean>(false);
  
    // Linien-Optionen: Standardmäßig alle ausgewählt
    const lineOptions = ["1", "2", "3", "3FU", "4", "6"];
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

    
      // Wenn sich Filterwerte ändern, wird onFilterValuesChange aufgerufen.
  useEffect(() => {
    onFilterValuesChange({
      fewchanges: selectedRouteOption === "Minimale Anzahl an Umstiegen",
      wheelchair_boarding: wheelchairBoarding,
      allowedRoutes: selectedLine,
    }); 
  }, [selectedRouteOption, wheelchairBoarding, selectedLine]);




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
        {routeOptions.map(option => (
          <RoutensucheCheckboxFilter key={option} text={option} checked={selectedRouteOption === option} onChange={() => setSelectedRouteOption(option)}
          />
        ))}
        <RoutensucheCheckboxFilter text="Barrierefreies Reisen kennzeichnen" checked={wheelchairBoarding} onChange={() => setWheelchairBoarding((prev) => !prev)} />
      </div>
      <div className="mt-3">
        <p className="text-sm font-medium">Nur folgende Linien berücksichtigen: </p>
        <div className="flex flex-wrap gap-4 mt-3">
          {lineOptions.map(line => (
            <RoutensucheCheckboxFilter key={line} text={`Linie ${line}`} checked={selectedLine.includes(line)} onChange={() => toggleLine(line)}
            />
          ))}
        </div>
        </div>
        </div>
      )}
      </div>   
  );
}   
