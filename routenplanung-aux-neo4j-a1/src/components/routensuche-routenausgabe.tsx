"use client";

import { Card, CardHeader, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowRight, ArrowDown } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import {DijkstraRouteResult} from "../lib/queries"; 


// Typdefinitionen
interface Tram {
  name: string;
  duration: number;
}

interface Stop {
  time: string;
  name: string;
}

interface RouteDetail {
  tramName: string;
  stops: Stop[];
  transferTime?: string;
  arrivalTime?: string;
}

interface RoutenausgabeProps {
  trams: Tram[];
  routeDetails: RouteDetail[];
}

// Hilfsfunktionen
function formatTimeRange(departure: string, arrival: string): string {
  return `${departure} - ${arrival} Uhr`;
}

function formatDuration(totalMinutes: number): string {
  if (totalMinutes >= 60) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return hours + " Stunde" + (hours > 1 ? "n" : "") + (minutes > 0 ? " " + minutes + " Min" : "");
  }
  return totalMinutes + " Min";
}

interface RoutenausgabeProps {
  route: DijkstraRouteResult;
}


// Routenausgabe-Komponente
export default function Routenausgabe({ route }: RoutenausgabeProps) {
  //const totalDuration = trams.reduce((sum, tram) => sum + tram.duration, 0);
  const [showDetails, setShowDetails] = useState(false);

  // Berechne früheste Abfahrtszeit und späteste Ankunftszeit aus den Arrays.
  // Angenommen, die Zeiten liegen im Format "HH:MM:SS" vor – bei 24-Stunden-Zeiten funktioniert ein lexikographischer Vergleich.
  const sortedDepartures = [...route.departure_times].sort();
  const sortedArrivals = [...route.arrival_times].sort();
  const earliestDeparture = sortedDepartures[0] || "";
  const latestArrival = sortedArrivals[sortedArrivals.length - 1] || "";

  // Anzahl der Umstiege = Anzahl der verwendeten Trips minus 1 (als Platzhalter)
  const transfers = route.used_trips.length > 0 ? route.used_trips.length - 1 : 0;

  // Für die Tram-Buttons: Wir nehmen hier eine gleichmäßige Aufteilung an
  const segmentCount = route.used_trips.length;
  const segmentWidth = segmentCount > 0 ? 100 / segmentCount : 100;


  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap gap-8 routenausgabe-header">
          <span>{formatTimeRange(earliestDeparture, latestArrival)}</span>
          <span className="divider">|</span>
          <span>Dauer: {formatDuration(route.total_duration_minutes)}</span>
          <span className="divider">|</span>
          <span>Umstiege: {transfers}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-9 gap-4 routenausgabe-grid">
          <div className="col-span-7 flex gap-1 routenausgabe-trams">
            {route.used_trips.map((trip, index) => (
              <Button
                key={index}
                style={{ width: `${segmentWidth}` }} // hier wird die breite gesetzt aber ich glaub das passt noch nicht
                variant="outline"
                className="border-blue-500 border-2 hover:bg-background hover:text-foreground cursor-default"
              >
                {trip}
              </Button>
            ))}
          </div>
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
          <RouteInDetail routeDetails={route.route} />
        </CardContent>
      )}
    </Card>
  );
}

// Typdefinition für RouteInDetail-Komponente
interface RouteInDetailProps {
  routeDetails: string[];
}

// RouteInDetail-Komponente --> die passst noch gar nicht weil ich nicht weiß wie genau die daten ausgegeben werden
export function RouteInDetail({ routeDetails }: RouteInDetailProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (containerRef.current) {
      const cards = containerRef.current.querySelectorAll<HTMLElement>(".route-card");
      let max = 0;
      cards.forEach((card) => {
        const width = card.offsetWidth;
        if (width > max) {
          max = width;
        }
      });
      if (max > 0) {
        setCardWidth(max);
      }
    }
  }, [routeDetails]);

  return (
    <div ref={containerRef} className="flex flex-wrap items-stretch gap-4 route-in-detail-container justify-center">
      {routeDetails.map((tram, index) => (
        <React.Fragment key={index}>
          <Card
            className="route-card flex flex-col"
            style={cardWidth ? { width: cardWidth } : {}}
          >
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






// so war es voher und hat mit der Version von routensuche-stationeneingabe die ebenfalls ausgegraut ist super funktioniert 

/*
"use client";

import { Card, CardHeader, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowRight, ArrowDown } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

// Typdefinitionen
interface Tram {
  name: string;
  duration: number;
}

interface Stop {
  time: string;
  name: string;
}

interface RouteDetail {
  tramName: string;
  stops: Stop[];
  transferTime?: string;
  arrivalTime?: string;
}

interface RoutenausgabeProps {
  trams: Tram[];
  routeDetails: RouteDetail[];
}

// Routenausgabe-Komponente
export default function Routenausgabe({ trams, routeDetails }: RoutenausgabeProps) {
  const totalDuration = trams.reduce((sum, tram) => sum + tram.duration, 0);
  const [showDetails, setShowDetails] = useState(false);

  return (
    <Card>
      <CardHeader>
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
          <RouteInDetail routeDetails={routeDetails} />
        </CardContent>
      )}
    </Card>
  );
}

// Typdefinition für RouteInDetail-Komponente
interface RouteInDetailProps {
  routeDetails: RouteDetail[];
}

// RouteInDetail-Komponente
export function RouteInDetail({ routeDetails }: RouteInDetailProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (containerRef.current) {
      const cards = containerRef.current.querySelectorAll<HTMLElement>(".route-card");
      let max = 0;
      cards.forEach((card) => {
        const width = card.offsetWidth;
        if (width > max) {
          max = width;
        }
      });
      if (max > 0) {
        setCardWidth(max);
      }
    }
  }, [routeDetails]);

  return (
    <div ref={containerRef} className="flex flex-wrap items-stretch gap-4 route-in-detail-container justify-center">
      {routeDetails.map((tram, index) => (
        <React.Fragment key={index}>
          <Card
            className="route-card flex flex-col"
            style={cardWidth ? { width: cardWidth } : {}}
          >
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
*/