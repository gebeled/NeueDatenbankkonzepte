"use client";

import {
    RoutensucheCheckboxFilter,
  RoutensucheEingabefeld,
  RoutensuchePickdate,
  RoutensuchePicktime,
} from "./routensuche-speziellefelder";
import { Card, CardHeader, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { MoveRight, TrainFront, MapPin } from "lucide-react";
import { useState } from "react";

export default function Routensuche() {
  return (
    <div className="px-4 sm:px-6 flex justify-center">
      <Card className="w-full max-w-[1200px]">
        <CardHeader className="flex flex-row flex-nowrap justify-start gap-4 w-full">
            <TrainFront className="h-6 w-6 text-blue-500"></TrainFront>
          <h1>Routen suchen</h1>
        </CardHeader>
        <CardContent className="flex flex-col items-center ">
          <Stationeneingabe></Stationeneingabe>
        </CardContent>
        <CardFooter>
          <div className="flex justify-end w-full">
            <Button className="w-full sm:w-auto">Suche starten</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

function Stationeneingabe() {

    const[showFilters, setShowFilters] = useState(false);

  return (
    <div className="w-full">
      <div className="grid sm:grid-cols-[1fr_auto] grid-cols-1 gap-4 w-full items-center">
        <div className="flex items-center gap-4 flex-wrap">
          <RoutensucheEingabefeld text="Startstation auswählen" image={MapPin}></RoutensucheEingabefeld>
          <MoveRight className="h-6 w-6 text-gray-600 hidden sm:block"></MoveRight>
          <RoutensucheEingabefeld text="Zielstation auswählen" image={MapPin}></RoutensucheEingabefeld>
        </div>
      </div>
      <div className="grid sm:grid-cols-[1fr_auto] grid-cols-1 gap-4 w-full items-center mt-3">
        <div className="flex items-center gap-4 flex-wrap">
          <RoutensuchePickdate></RoutensuchePickdate>
          <RoutensuchePicktime></RoutensuchePicktime>
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
