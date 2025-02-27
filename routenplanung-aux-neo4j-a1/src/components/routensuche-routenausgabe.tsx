"use client";

import { Card, CardHeader, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowRight, ArrowDown } from "lucide-react";
import React, { useState } from "react";

export default function Routenausgabe() {
  const trams = [
    { name: "Tram 1", duration: 60 },
    { name: "Tram 2", duration: 30 },
    { name: "Tram 3", duration: 90 },
    { name: "Tram 4", duration: 45 },
  ];

  // Berechne die Gesamtzeit
  const totalDuration = trams.reduce((sum, tram) => sum + tram.duration, 0);

  const [showDetails, setShowDetails] = useState(false);

  return (
    <Card>
      <CardHeader>
        {/* Zusätzliche Klasse: routenausgabe-header */}
        <div className="flex flex-wrap gap-8 routenausgabe-header">
          <span>13:00 - 14:00 Uhr</span>
          <span className="divider">|</span>
          <span>Dauer: 1 Stunde</span>
          <span className="divider">|</span>
          <span>Umstiege: 1</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-9 gap-4 routenausgabe-grid">
          {/* Zusätzliche Klasse: routenausgabe-trams */}
          <div className="col-span-7 flex gap-1 routenausgabe-trams">
            {trams.map((tram, index) => (
              <Button
                key={index}
                style={{ width: `${(tram.duration / totalDuration) * 100}%` }}
                variant="outline"
                className="border-blue-500 border-2 hover:bg-background hover:text-foreground cursor-default"
              >
                {tram.name}
              </Button>
            ))}
          </div>
          {/* Zusätzliche Klasse: routenausgabe-details-button */}
          <Button
            className="col-span-2 routenausgabe-details-button"
            onClick={() => setShowDetails((prev) => !prev)}
          >
            {showDetails ? "Details ausblenden" : "Details anzeigen"}
          </Button>
        </div>
      </CardContent>
      {showDetails && (
        <CardContent>
          <RouteInDetail />
        </CardContent>
      )}
    </Card>
  );
}

// ------------------

export function RouteInDetail() {
  // Beispiel-Daten
  const routeDetails = [
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
      arrivalTime: "14:20", // Letzte Card: Ankunftszeit
    },
  ];

  return (
    // Zusätzliche Klasse: route-in-detail-container
    <div className="flex items-stretch gap-4 route-in-detail-container">
      {routeDetails.map((tram, index) => (
        <React.Fragment key={index}>
          <Card className="flex-1 flex flex-col">
            <CardHeader className="pb-1">
              <h3 className="text-sm font-semibold">{tram.tramName}</h3>
            </CardHeader>
            <CardContent className="flex flex-col flex-1 pt-1 pb-1">
              <div className="space-y-1">
                {tram.stops.map((stop, i) => (
                  <div key={i} className="text-xs">
                    <span>{stop.time}:</span> <span>{stop.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="pt-1">
              <div className="text-xs font-bold">
                {index < routeDetails.length - 1
                  ? `Umstiegszeit: ${tram.transferTime}`
                  : `Ankunftszeit: ${tram.arrivalTime}`}
              </div>
            </CardFooter>
          </Card>
          {/* Pfeile: Normalzustand = ArrowRight; für kleines Display = ArrowDown */}
          {index < routeDetails.length - 1 && (
            <div className="flex items-center arrow-container">
              <ArrowRight className="h-6 w-6 text-gray-500 arrow-right" />
              <ArrowDown className="h-6 w-6 text-gray-500 arrow-down hidden" />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
