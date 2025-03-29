import { getNeo4jSession } from "./neo4j";

/*
interface RouteResult {
  trip_id: string;
  route_short_name: string;
  route_long_name: string;
  departure_time: string;
  arrival_time: string;
}

export interface DijkstraRouteResult {
  total_duration_minutes: number;
  route: string[];
  used_trips: string[];
  durations: number[];
  arrival_times: string[];
  departure_times: string[];
}
*/

// Das Interface, angepasst an die Query-Ausgabe:
export interface DijkstraRouteResult {
  totalTravelDuration: number;
  departureTime: string;
  arrivalTime: string;
  routeDuration: number;
  stops: Array<{
    trip_id: string;
    route_id: string;
    route_short_name: string;
    route_long_name: string;
    stop_id: string;
    departure: string;
  }>;
}


export async function getAllStops() {
  const session = getNeo4jSession();
  try {
    const result = await session.run("MATCH (s:Stop) RETURN s.name AS name, s.stop_id AS stop_id");
    return result.records.map((record) => ({
      name: record.get("name"),
      stop_id: record.get("stop_id"),
    }));
  } catch (error) {
    console.error("Error fetching stops:", error);
    throw error;
  } finally {
    await session.close();
  }
}


// Routensuche anhand Start, Ziel, Datum und Uhrzeit
export async function findRoutes(
  startStation: string,
  endStation: string,
  date: string, // z. B. "2025-03-28"
  time: string  // z. B. "08:00:00"
): Promise<DijkstraRouteResult[]> {
  const session = getNeo4jSession();

  try {
    const result = await session.run(
      `
WITH $startStation AS startStopId,
     $endStation AS endStopId,
     $time AS depTimeStr,
     $date AS inputDate
     
// Umrechnung der Abfahrtszeit in Minuten ab 0:00 Uhr
WITH startStopId, endStopId, depTimeStr, inputDate,
     duration.between(time("00:00:00"), time(depTimeStr)).minutes AS departureTimeMinutes
     
// Berechne das Latest-Time-Limit als 120 Minuten nach der Abfahrtszeit
WITH startStopId, endStopId, depTimeStr, inputDate, departureTimeMinutes,
     (departureTimeMinutes + 120) AS latestTimeLimit

// Ermittlung des Wochentags (als Zahl) und Umwandlung in einen String
WITH startStopId, endStopId, inputDate, latestTimeLimit, departureTimeMinutes,
     date(inputDate).dayOfWeek AS dayOfWeekNum
WITH startStopId, endStopId, inputDate, latestTimeLimit, departureTimeMinutes,
     CASE dayOfWeekNum
         WHEN 1 THEN "monday"
         WHEN 2 THEN "tuesday"
         WHEN 3 THEN "wednesday"
         WHEN 4 THEN "thursday"
         WHEN 5 THEN "friday"
         WHEN 6 THEN "saturday"
         WHEN 7 THEN "sunday"
     END AS dayOfWeek

// Ermittlung des aktiven Service anhand des Datums
MATCH (service:Service)
WHERE date(
        substring(service.start_date, 0, 4) + "-" +
        substring(service.start_date, 4, 2) + "-" +
        substring(service.start_date, 6, 2)
      ) <= date(inputDate)
  AND date(
        substring(service.end_date, 0, 4) + "-" +
        substring(service.end_date, 4, 2) + "-" +
        substring(service.end_date, 6, 2)
      ) >= date(inputDate)
  AND service[dayOfWeek] = 1
WITH startStopId, endStopId, departureTimeMinutes, service.service_id AS validServiceId, latestTimeLimit

// Suche des Start-StopVisit-Knotens (mit Abfahrtszeit >= departureTimeMinutes)
MATCH (startVisit:StopVisit)-[:BELONGS_TO]->(trip:Trip {service_id: validServiceId})
WHERE startVisit.stop_id = startStopId 
  AND startVisit.departure_minutes >= departureTimeMinutes
WITH startVisit, validServiceId, endStopId, latestTimeLimit, departureTimeMinutes

// Suche des Ziel-StopVisit-Knotens
MATCH (endVisit:StopVisit)-[:BELONGS_TO]->(trip2:Trip {service_id: validServiceId})
WHERE endVisit.stop_id = endStopId
WITH startVisit, endVisit, latestTimeLimit, departureTimeMinutes

// Direkt den Dijkstra-Algorithmus aufrufen – mit Filter auf relevante gerichtete Beziehungen
CALL apoc.algo.dijkstra(
  startVisit, 
  endVisit, 
  "NEXT>|TRANSFER>", 
  "duration"
) YIELD path, weight AS dijkstraWeight

// Extrahiere den ersten und letzten Knoten des Pfades
WITH path, dijkstraWeight, head(nodes(path)) AS firstNode, last(nodes(path)) AS lastNode, departureTimeMinutes, latestTimeLimit
WHERE lastNode.arrival_minutes <= latestTimeLimit

// Berechne die Wartezeit: Differenz zwischen tatsächlicher Abfahrt des ersten Knotens und gewünschter Abfahrtszeit
WITH path, dijkstraWeight, firstNode, lastNode, (firstNode.departure_minutes - departureTimeMinutes) AS waitTime
// Gesamtzeit = Wartezeit + von Dijkstra berechnete Fahrzeit
WITH path, toInteger(dijkstraWeight + waitTime) AS overallDuration, firstNode, lastNode

// Extrahiere Abfahrts- und Ankunftszeiten sowie die reine Route-Dauer
WITH path, overallDuration, 
     firstNode.departure AS departureTime, 
     lastNode.arrival AS arrivalTime, 
     (lastNode.arrival_minutes - firstNode.departure_minutes) AS routeDuration

// Sammle zugehörige Trip- und Routeninformationen für alle StopVisits im Pfad
UNWIND nodes(path) AS sv
MATCH (sv)-[:BELONGS_TO]->(trip)-[:USES_ROUTE]->(route:Route)
WITH path, overallDuration, departureTime, arrivalTime, routeDuration,
     collect({
         trip_id: trip.trip_id, 
         route_id: route.route_id, 
         route_short_name: route.route_short_name, 
         route_long_name: route.route_long_name, 
         stop_id: sv.stop_id, 
         departure: sv.departure
     }) AS stops
RETURN
       overallDuration AS totalTravelDuration, 
       departureTime, 
       arrivalTime, 
       routeDuration,
       stops
ORDER BY totalTravelDuration ASC
LIMIT 3
      `,
      { startStation, endStation, date, time }
    );

    const routes: DijkstraRouteResult[] = result.records.map((record) => ({
      //path: record.get("path"),
      totalTravelDuration: record.get("totalTravelDuration"),
      departureTime: record.get("departureTime"),
      arrivalTime: record.get("arrivalTime"),
      routeDuration: record.get("routeDuration"),
      stops: record.get("stops")
    }));

    return routes;
  } catch (error) {
    console.error("Fehler bei Routensuche:", error);
    throw error;
  } finally {
    await session.close();
  }
}

