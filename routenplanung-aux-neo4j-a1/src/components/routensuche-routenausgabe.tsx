"use client";

import { Card, CardHeader, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowRight, ArrowDown, Accessibility } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import {DijkstraRouteResult} from "../lib/queries"; 

// Typdefinition für einen einzelnen Stop (basierend auf deinem Rückgabeobjekt)
interface Stop {
  trip_id: string;
  stop_id: string;
  route_id: string;
  route_short_name: string;
  departure: string;
  route_long_name: string;
  wheelchair_boarding: number;
  name: string;
}

// Typdefinition für die gruppierten Stops pro trip_id
interface GroupedTrip {
  trip_id: string;
  stops: Stop[];
}


// Hilfsfunktion, um die stops nach trip_id zu gruppieren
function groupStopsByTrip(stops: Stop[]): GroupedTrip[] {
  const groups = stops.reduce((acc, stop) => {
    if (!acc[stop.trip_id]) {
      acc[stop.trip_id] = [];
    }
    acc[stop.trip_id].push(stop);
    return acc;
  }, {} as { [key: string]: Stop[] });

  return Object.entries(groups).map(([trip_id, stops]) => ({ trip_id, stops }));
}

/*
function filterSingleStopGroups(groups: GroupedTrip[]): GroupedTrip[] {
  if (groups.length <= 1) {
    return groups;
  }
  return groups.filter(group => group.stops.length > 1);
}
*/

// Wandelt einen HH:MM:SS-Zeitstring in Minuten um (Sekunden werden ignoriert)
function timeStringToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

// Berechnet für einen gruppierten Trip die Fahrtdauer in Minuten:
// Differenz zwischen der ersten und der letzten Abfahrtszeit innerhalb des Trips
function getGroupDuration(group: GroupedTrip): number {
  if (group.stops.length === 0) return 0;
  const firstDeparture = group.stops[0].departure;
  const lastDeparture = group.stops[group.stops.length - 1].departure;
  return timeStringToMinutes(lastDeparture) - timeStringToMinutes(firstDeparture);
}


// Hilfsfunktion, um ein Zeitfenster anzuzeigen
function formatTimeRange(departure: string, arrival: string): string {
  return `${departure} - ${arrival} Uhr`;
}

// Hilfsfunktion, um eine Minutenanzahl in ein lesbares Format (Std + Min) umzuwandeln
function formatDuration(totalMinutes: number): string {
  if (totalMinutes >= 60) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return (
      hours +
      " Stunde" +
      (hours > 1 ? "n" : "") +
      (minutes > 0 ? " " + minutes + " Min" : "")
    );
  }
  return totalMinutes + " Min";
}

function toNumberIfNeo4jInt(val: number | { low: number }): number {
  if (typeof val === "number") {
    // Ist schon eine Zahl
    return val;
  } else if (val && typeof val === "object" && "low" in val) {
    // Neo4j Integer-Objekt
    return val.low;
  }
  // Fallback
  return 0;
}

interface RoutenausgabeProps {
  route: DijkstraRouteResult;
}


// Routenausgabe-Komponente
export default function Routenausgabe({ route }: RoutenausgabeProps) {
  //const totalDuration = trams.reduce((sum, tram) => sum + tram.duration, 0);
  const [showDetails, setShowDetails] = useState(false);

    // Aus den übergebenen Daten extrahieren wir:
    const earliestDeparture = route.departureTime; // z. B. "08:02:00"
    const latestArrival = route.arrivalTime;         // z. B. "09:26:00"
    const routeDuration = route.routeDuration; 
    const travelDuration = route.totalTravelDuration;     // z. B. 90 Minuten

    const numericRouteDuration =
    typeof routeDuration === "number" ? routeDuration : toNumberIfNeo4jInt(routeDuration);
  const numericTravelDuration =
    typeof travelDuration === "number" ? travelDuration : toNumberIfNeo4jInt(travelDuration);


      // Gruppiere das stops-Array anhand der trip_id
  const groupedTrips = groupStopsByTrip(route.stops);
  //groupedTrips = filterSingleStopGroups(groupedTrips);
  // Anzahl der distinct trip_ids minus 1 ergibt die Anzahl der Umstiege
  const transfers = groupedTrips.length > 0 ? groupedTrips.length - 1 : 0;


  const totalGroupDuration = groupedTrips.reduce((sum, group) => sum + getGroupDuration(group), 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap gap-8 routenausgabe-header">
          <span>{formatTimeRange(earliestDeparture, latestArrival)}</span>
          <span className="divider">|</span>
          <span>Reisedauer: {formatDuration(numericRouteDuration)} - Gesamtdauerr: {formatDuration(numericTravelDuration)}</span>
          <span className="divider">|</span>
          <span>Umstiege: {transfers}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-9 gap-4 routenausgabe-grid">
          <div className="col-span-7 flex gap-1 routenausgabe-trams">
            {groupedTrips.map((group) => {

              const groupDuration = getGroupDuration(group);
              const widthPercentage = groupedTrips.length === 1 ? 100 : totalGroupDuration > 0 ? (groupDuration / totalGroupDuration) * 100 : 0;
              return(
              <Button
                key={group.trip_id}
                style={{ width: `${widthPercentage}%` }} // hier wird die breite gesetzt aber ich glaub das passt noch nicht
                variant="outline"
                className="border-blue-500 border-2 hover:bg-background hover:text-foreground cursor-default"
              >
                S{group.stops[0].route_short_name} <br />
              </Button>
              );
})}
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
          <RouteInDetail routeDetails={groupedTrips} />
        </CardContent>
      )}
    </Card>
  );
}


interface RouteInDetailProps{
  routeDetails: GroupedTrip[];
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
      {routeDetails.map((group, index) => {

        const firstStop = group.stops[0];
        const lastStop = group.stops[group.stops.length - 1];

                // Berechne Umstiegszeit, falls es eine nächste Gruppe gibt
                let transferTimeStr = "";
                if (index < routeDetails.length - 1) {
                  const nextFirstDeparture = routeDetails[index + 1].stops[0].departure;
                  const diffMinutes = timeStringToMinutes(nextFirstDeparture) - timeStringToMinutes(lastStop.departure);
                  transferTimeStr = `Umstiegszeit: ${formatDuration(diffMinutes)}`;
                } else {
                  transferTimeStr = `Ankunftszeit: ${lastStop.departure}`;
                }

        return(
        <React.Fragment key={index}>
          <Card
            className="route-card flex flex-col"
            style={cardWidth ? { width: cardWidth } : {}}
          >
            <CardHeader className="pb-1">
              <h3 className="text-sm font-semibold">Linie: {firstStop.route_short_name}</h3>
            </CardHeader>
            <CardContent className="flex flex-col flex-1 pt-1 pb-1">
              
              <div className="space-y-1">
                {group.stops.map((stop, i) => (
                  <div key={i} className="text-xs flex gap-1">
                    <span>{stop.departure}:</span>
                    <span>{stop.name}</span>
                    {toNumberIfNeo4jInt(stop.wheelchair_boarding) === 1 && (
                      <Accessibility className="h-4 w-4 text-green-600"></Accessibility>
                    )}
                    {toNumberIfNeo4jInt(stop.wheelchair_boarding) === 2 && (
                      <Accessibility className="h-4 w-4 text-red-600"></Accessibility>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="pt-1">
              <div className="text-xs font-bold">
                {transferTimeStr}
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
        );
    })}
    </div>
  );
}
