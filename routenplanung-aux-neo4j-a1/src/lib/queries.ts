import { getNeo4jSession } from "./neo4j";

// Das Interface, angepasst an die Query-Ausgabe der Routenberechnung:
export interface DijkstraRouteResult {
  totalTravelDuration: number;
  departureTime: string;
  arrivalTime: string;
  routeDuration: number;
  transferCount: number;
  stops: Array<{
    trip_id: string;
    route_id: string;
      wheelchair_boarding: number;
    route_short_name: string;
    route_long_name: string;
    stop_id: string;
    departure: string;
    name: string;

  }>;
}

// Funktion zum Abrufen aller S-Bahn-Stationen
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


// Funktion zur Routenberechnung
export async function findRoutes(
  startStation: string,
  endStation: string,
  date: string, 
  time: string,  
  wheelchair_boarding: boolean,
  fewchanges: boolean, 
  allowedRoutes: string[] 
): Promise<DijkstraRouteResult[]> {
  const session = getNeo4jSession();

  try {
    const result = await session.run(      
      `
// Eingabeparameter
WITH $startStation AS startStopId,
     $endStation AS endStopId,
     $time AS depTimeStr,
     $date AS inputDate,
     $wheelchair_boarding AS includeWheelchairInfo,
     //true AS includeWheelchairInfo,
     $fewchanges AS useTransferOptimization,
     1 AS maxTransfers,
     $allowedRoutes AS allowedRouteShortNames 

// Zeitumrechnung
WITH startStopId, endStopId, depTimeStr, inputDate, includeWheelchairInfo, useTransferOptimization, maxTransfers, allowedRouteShortNames,
     duration.between(time("00:00:00"), time(depTimeStr)).minutes AS departureTimeMinutes
WITH startStopId, endStopId, depTimeStr, inputDate, departureTimeMinutes, includeWheelchairInfo, useTransferOptimization, maxTransfers, allowedRouteShortNames,
     (departureTimeMinutes + 500) AS latestTimeLimit

// Wochentag ermitteln
WITH startStopId, endStopId, inputDate, latestTimeLimit, departureTimeMinutes, includeWheelchairInfo, useTransferOptimization, maxTransfers, allowedRouteShortNames,
     date(inputDate).dayOfWeek AS dayOfWeekNum
WITH startStopId, endStopId, inputDate, latestTimeLimit, departureTimeMinutes, includeWheelchairInfo, useTransferOptimization, maxTransfers, allowedRouteShortNames,
     CASE dayOfWeekNum
         WHEN 1 THEN "monday"
         WHEN 2 THEN "tuesday"
         WHEN 3 THEN "wednesday"
         WHEN 4 THEN "thursday"
         WHEN 5 THEN "friday"
         WHEN 6 THEN "saturday"
         WHEN 7 THEN "sunday"
     END AS dayOfWeek

// Aktive Services an diesem Tag ermitteln
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
WITH collect(service.service_id) AS validServiceIds, startStopId, endStopId, departureTimeMinutes, latestTimeLimit, includeWheelchairInfo, useTransferOptimization, maxTransfers, allowedRouteShortNames

// Markiere gültige StopVisit-Knoten mit temp-Flag
CALL {
  WITH validServiceIds, allowedRouteShortNames
  MATCH (sv:StopVisit)-[:BELONGS_TO]->(trip:Trip)-[:USES_ROUTE]->(route:Route)
  WHERE trip.service_id IN validServiceIds AND route.route_short_name IN allowedRouteShortNames
  SET sv.allowed = true
  RETURN count(*) AS markedNodes
}

// Wähle Start- und Zielknoten aus den erlaubten
MATCH (startVisit:StopVisit {stop_id: startStopId})
WHERE startVisit.allowed = true AND startVisit.departure_minutes >= departureTimeMinutes

MATCH (endVisit:StopVisit {stop_id: endStopId})
WHERE endVisit.allowed = true

// Dijkstra auf dem erlaubten Subgraphen
CALL apoc.algo.dijkstra(startVisit, endVisit, "NEXT>|TRANSFER>", "duration")
YIELD path, weight AS dijkstraWeight

WITH path, dijkstraWeight,
     head(nodes(path)) AS firstNode, 
     last(nodes(path)) AS lastNode,
     size([r IN relationships(path) WHERE type(r) = "TRANSFER"]) AS transferCount,
     departureTimeMinutes, latestTimeLimit, includeWheelchairInfo, useTransferOptimization, maxTransfers, allowedRouteShortNames

// Prüfe, dass alle Knoten erlaubte Routen haben
WITH path, dijkstraWeight, firstNode, lastNode, transferCount, departureTimeMinutes, latestTimeLimit, includeWheelchairInfo, useTransferOptimization, maxTransfers, allowedRouteShortNames,
     [n IN nodes(path) | head([(n)-[:BELONGS_TO]->(:Trip)-[:USES_ROUTE]->(r:Route) | r.route_short_name])] AS routeShortNames
WHERE ALL(r IN routeShortNames WHERE r IS NULL OR r IN allowedRouteShortNames)
  AND lastNode.arrival_minutes <= latestTimeLimit
  AND (NOT useTransferOptimization OR transferCount <= maxTransfers)

// Wartezeit und Gesamtdauer berechnen
WITH path, (firstNode.departure_minutes - departureTimeMinutes) AS waitTime, dijkstraWeight, firstNode, lastNode, transferCount,
     includeWheelchairInfo, useTransferOptimization

WITH path, (dijkstraWeight + waitTime) AS overallDuration, firstNode, lastNode, transferCount,
     includeWheelchairInfo, useTransferOptimization

// Zeiten extrahieren
WITH path, overallDuration, firstNode.departure AS departureTime, lastNode.arrival AS arrivalTime,
     (lastNode.arrival_minutes - firstNode.departure_minutes) AS routeDuration, transferCount,
     includeWheelchairInfo, useTransferOptimization

// Sammle Trip- & Routeninfos je StopVisit
UNWIND nodes(path) AS sv
MATCH (sv)-[:BELONGS_TO]->(trip:Trip)-[:USES_ROUTE]->(route:Route)
MATCH (stop:Stop {stop_id: sv.stop_id})
WITH path, overallDuration, departureTime, arrivalTime, routeDuration, transferCount, useTransferOptimization,
     collect({
         trip_id: trip.trip_id,
         route_id: route.route_id,
         route_short_name: route.route_short_name,
         route_long_name: route.route_long_name,
         stop_id: sv.stop_id,
         name: stop.name,
         departure: substring(sv.departure, 0, 5),
         wheelchair_boarding: CASE WHEN includeWheelchairInfo THEN stop.wheelchair_boarding ELSE NULL END
     }) AS stops

// Aufräumen (temporäres Flag entfernen)
CALL {
  MATCH (sv:StopVisit)
  REMOVE sv.allowed
  RETURN count(*) AS cleaned
}

RETURN path,
       overallDuration AS totalTravelDuration,
       substring(departureTime, 0, 5) AS departureTime,
       substring(arrivalTime, 0, 5) AS arrivalTime,
       routeDuration,
       transferCount,
       stops
ORDER BY 
  CASE WHEN useTransferOptimization THEN transferCount ELSE overallDuration END ASC,
  overallDuration ASC
LIMIT 3
      `,
      { startStation, endStation, date, time, wheelchair_boarding, fewchanges, allowedRoutes }
    );

    const routes: DijkstraRouteResult[] = result.records.map((record) => ({
      totalTravelDuration: record.get("totalTravelDuration"),
      departureTime: record.get("departureTime"),
      arrivalTime: record.get("arrivalTime"),
      routeDuration: record.get("routeDuration"),
      transferCount: record.get("transferCount"),
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

