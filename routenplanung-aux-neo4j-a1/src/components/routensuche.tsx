"use client";

import Stationeneingabe from "../components/routensuche-stationeneingabe";
import Routenausgabe from "../components/routensuche-routenausgabe";
import { Card, CardHeader, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { TrainFront } from "lucide-react";
import { useState } from "react";
import { format} from "date-fns";
import  {DijkstraRouteResult} from "../lib/queries";

export default function Routensuche() {
  const [showRouts, setShowRouts] = useState(false);
  const [routes, setRoutes] = useState<DijkstraRouteResult[]>([]);
  const [loading, setLoading] = useState(false);

  const [startStation, setStartStation] = useState("");
  const [endStation, setEndStation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  
  const [startError, setStartError] = useState(false);
  const [endError, setEndError] = useState(false);

  const handleSearch = async () => {

    setStartError(false);
    setEndError(false);

    if (!startStation || !endStation) {
      if (!startStation) setStartError(true);
      if (!endStation) setEndError(true);
      //alert("Bitte fülle alle Felder aus, bevor du suchst.");
      return;
    }
  
    try {
      setLoading(true);
      console.log("Startstation:", startStation);
      console.log("Endstation:", endStation);
      console.log("Datum:", date);
      console.log("Uhrzeit:", time);
      const response = await fetch("/api/routes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ startStation, endStation, date, time }),
      });
  
      if (!response.ok) {
        throw new Error(`API-Fehler: ${response.status}`);
      }
  
      const data = await response.json();
  
      if (!data.routes || data.routes.length === 0) {
        setRoutes([]);
      } else{
        setRoutes(data.routes);
      }
      setShowRouts(true);
    } catch (error) {
      console.error("Fehler beim Abrufen der Routen:", error);
      alert("Es gab ein Problem mit der Routen-Suche. Bitte versuche es später erneut.");
    } finally {
      setLoading(false);
    }
  };
  
  

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
          startError={startError}
          endError={endError}
          />
        </CardContent>
        <CardContent className="flex justify-end w-full">
          <Button
            className="w-full sm:w-auto"
            onClick={handleSearch}>
            Suche starten
          </Button>
        </CardContent>
        {loading && (
          <CardContent className="border-t border-gray-200 mt-4 pt-4">
            <p className="text-sm">Die optimale Route wird gesucht...</p>
          </CardContent>
        )}
        {showRouts && !loading &&(
          <CardContent className="border-t border-gray-200 mt-4 pt-4">
          {routes.length === 0 ? (
              <p className="text-sm">Es konnte leider keine passende Routen gefunden werden. Bitte versuche eine andere Kombination.</p>
          ) : (
            <div className="space-y-8">
              {routes.map((route, index) => (
                <Routenausgabe
                  key={index}
                  route={route}
                />
              ))}
            </div>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
}





