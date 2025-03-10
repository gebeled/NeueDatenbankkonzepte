"use client";

import Stationeneingabe from "../components/routensuche-stationeneingabe";
import Routenausgabe from "../components/routensuche-routenausgabe";
import { Card, CardHeader, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { TrainFront } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";

export default function Routensuche() {
  const [showRouts, setShowRouts] = useState(false);
  const [routes, setRoutes] = useState([]);

  const [startStation, setStartStation] = useState("");
  const [endStation, setEndStation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const handleSearch = async () => {
    try{
    const response = await fetch("/api/routes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ startStation, endStation, date, time }),
  });
    
  if (!response.ok) {
    throw new Error("API-Antwort nicht OK");
  }

  const data = await response.json();
  setRoutes(data.routes);    // Setze API-Ergebnisse in state
  setShowRouts(true);        // Anzeigen der Routenausgabe aktivieren
} catch (error) {
  console.error("Fehler beim Abrufen der Routen:", error);
}
  }
  
  /*
  const routes = [
    {
      id: 1,
      trams: [
        { name: "1", duration: 60 },
        { name: "2", duration: 30 },
        { name: "3", duration: 90 },
        { name: "4", duration: 45 },
        { name: "5", duration: 15 },
      ],
      routeDetails: [
        {
          tramName: "Tram 1",
          stops: [
            { time: "13:00", name: "Haltestelle A" },
            { time: "13:10", name: "Haltestelle B" },
            { time: "13:20", name: "Haltestelle C" },
          ],
          transferTime: "5 Minuten",
        },
        {
          tramName: "Tram 2",
          stops: [
            { time: "13:25", name: "Haltestelle D" },
            { time: "13:35", name: "Haltestelle E" },
          ],
          transferTime: "3 Minuten",
        },
        {
          tramName: "Tram 3",
          stops: [
            { time: "13:38", name: "Haltestelle F" },
            { time: "13:50", name: "Haltestelle G" },
            { time: "14:00", name: "Haltestelle H" },
          ],
          transferTime: "2 Minuten",
        },
        {
          tramName: "Tram 4",
          stops: [
            { time: "14:03", name: "Haltestelle I" },
            { time: "14:15", name: "Haltestelle J" },
          ],
          transferTime: "14:20",
        },
        {
          tramName: "Tram 5",
          stops: [
            { time: "14:20", name: "Haltestelle K" },
          ],
          arrivalTime: "14:25",
        }

      ],
    },
    {
      id: 2,
      trams: [
        { name: "4", duration: 50 },
        { name: "2", duration: 40 },
        { name: "9a", duration: 80 },
      ],
      routeDetails: [
        {
          tramName: "Tram 4",
          stops: [
            { time: "12:00", name: "Station X" },
            { time: "12:10", name: "Station Y" },
          ],
          transferTime: "4 Minuten",
        },
        {
          tramName: "Tram 2",
          stops: [
            { time: "12:15", name: "Station Z" },
          ],
          arrivalTime: "12:20",
        },
        {
          tramName: "Tram 9a",
          stops: [
            { time: "12:20", name: "Station A" },
            { time: "12:30", name: "Station B" },
            { time: "12:40", name: "Station C" },
          ],
          arrivalTime: "12:40",
        },
      ],
    },
  ];
*/

  return (
    <div className="px-4 sm:px-6 flex justify-center">
      <Card className="w-full max-w-[1200px]">
        <CardHeader className="flex flex-row flex-nowrap justify-start gap-4 w-full">
          <TrainFront className="h-6 w-6 text-blue-500"></TrainFront>
          <h1>Routen suchen</h1>
        </CardHeader>
        <CardContent className="flex flex-col items-center ">
          <Stationeneingabe
          onStartStationSelected={(station) => setStartStation(station)}
          onEndStationSelected={(station) => setEndStation(station)}
          onDateSelected={(selectedDate) => setDate(format(selectedDate, "yyyy-MM-dd"))}
          onTimeSelected={(selectedTime) => setTime(selectedTime)}
          />
        </CardContent>
        <CardContent className="flex justify-end w-full">
          <Button
            className="w-full sm:w-auto"
            onClick={handleSearch}
          >
            Suche starten
          </Button>
        </CardContent>
        {showRouts && (
          <CardContent className="border-t border-gray-200 mt-4 pt-4">
            {/*
            <div className="space-y-8">
              {routes.map((route) => (
                <Routenausgabe
                  key={route.id}
                  trams={route.trams}
                  routeDetails={route.routeDetails}
                />
              ))}
            </div>
            */}
          </CardContent>
        )}
      </Card>
    </div>
  );
}

