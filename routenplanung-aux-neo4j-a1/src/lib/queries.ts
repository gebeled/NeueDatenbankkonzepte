import { getNeo4jSession } from "./neo4j";


/*
interface RouteResult {
  trip_id: string;
  route_short_name: string;
  route_long_name: string;
  departure_time: string;
  arrival_time: string;
}
*/  

export interface DijkstraRouteResult {
  total_duration_minutes: number;
  route: string[];
  used_trips: string[];
  durations: number[];
  arrival_times: string[];
  departure_times: string[];
}



export async function getAllStops() {
    const session = getNeo4jSession();
    try {
      const result = await session.run("MATCH (s:Stop) RETURN s.name");
      return result.records.map(record => record.get("s.name"));
    } catch (error) {
      console.error("Error fetching stops:", error);
      throw error;
    } finally {
      await session.close();
    }
}


  /*
// Routensuche anhand Start, Ziel, Datum und Uhrzeit
export async function findRoutes(startStation: string, endStation: string, date: string, time: string): Promise<RouteResult[]> {
  const session = getNeo4jSession();

  try {
    const result = await session.run(
      `
      MATCH (start:Stop {stop_name: $startStation})
      MATCH (end:Stop {stop_name: $endStation})
      MATCH (start)-[st1:STOP_TIME]->(trip:Trip)-[:OPERATES_ON]->(route:Route),
            (end)-[st2:STOP_TIME]->(trip),
            (trip)-[:OPERATES_ON]->(service:Service)
      WHERE 
          date($date) >= date(service.start_date) 
          AND date($date) <= date(service.end_date) 
          AND (
            (date($date).dayOfWeek = 1 AND service.monday = "1") OR
            (date($date).dayOfWeek = 2 AND service.tuesday = "1") OR
            (date($date).dayOfWeek = 3 AND service.wednesday = "1") OR
            (date($date).dayOfWeek = 4 AND service.thursday = "1") OR
            (date($date).dayOfWeek = 5 AND service.friday = "1") OR
            (date($date).dayOfWeek = 6 AND service.saturday = "1") OR
            (date($date).dayOfWeek = 7 AND service.sunday = "1")
          )
          AND st1.departure_time >= $time
      RETURN DISTINCT 
          trip.trip_id AS trip_id,
          route.route_short_name AS route_short_name,
          route.route_long_name AS route_long_name,
          st1.departure_time AS departure_time,
          st2.arrival_time AS arrival_time
      ORDER BY st1.departure_time
      LIMIT 5
      `,
      { startStation, endStation, date, time }
    );

    const routes: RouteResult[] = result.records.map((record) => ({
      trip_id: record.get("trip_id"),
      route_short_name: record.get("route_short_name"),
      route_long_name: record.get("route_long_name"),
      departure_time: record.get("departure_time"),
      arrival_time: record.get("arrival_time"),
    }));

    return routes;
  } catch (error) {
    console.error("Fehler bei Routensuche:", error);
    throw error;
  } finally {
    await session.close();
  }
}
*/


// Routensuche anhand Start, Ziel, Datum und Uhrzeit
export async function findRoutes(
  startStation: string,
  endStation: string,
  date: string,   // z. B. "2025-03-28"
  time: string    // z. B. "08:00:00"
): Promise<DijkstraRouteResult[]> {
  const session = getNeo4jSession();

  try {
    const result = await session.run(
      `
      // Parameter übernehmen und Abfahrtszeit in Minuten berechnen
      WITH $startStation AS startName, $endStation AS endName, $time AS departureTime, $date AS inputDate
      WITH startName, endName, departureTime,
           (toInteger(split(departureTime, ":")[0]) * 60 + toInteger(split(departureTime, ":")[1])) AS minDepartureMinutes,
           inputDate

      // Hole die Stop-Knoten anhand des Namens
      MATCH (startStop:Stop {name: startName})
      MATCH (endStop:Stop {name: endName})
      WITH startStop.stop_id AS startStopId, endStop.stop_id AS endStopId, minDepartureMinutes, inputDate

      // Finde gültige Start-StopVisits, deren Trip auch an dem Tag läuft
      MATCH (startSV:StopVisit)-[:BELONGS_TO]->(trip:Trip)-[:OPERATES_ON]->(service:Service)
      WHERE startSV.stop_id = startStopId 
        AND startSV.departure_minutes >= minDepartureMinutes
        AND date(inputDate) >= date(service.start_date)
        AND date(inputDate) <= date(service.end_date)
        AND (
            (date(inputDate).dayOfWeek = 1 AND service.monday = "1") OR
            (date(inputDate).dayOfWeek = 2 AND service.tuesday = "1") OR
            (date(inputDate).dayOfWeek = 3 AND service.wednesday = "1") OR
            (date(inputDate).dayOfWeek = 4 AND service.thursday = "1") OR
            (date(inputDate).dayOfWeek = 5 AND service.friday = "1") OR
            (date(inputDate).dayOfWeek = 6 AND service.saturday = "1") OR
            (date(inputDate).dayOfWeek = 7 AND service.sunday = "1")
        )
      WITH startStopId, endStopId, minDepartureMinutes, inputDate, startSV

      // Ziel-StopVisits anhand der Zielstop_id
      MATCH (ziel:StopVisit)
      WHERE ziel.stop_id = endStopId

      // Suche über NEXT und TRANSFER-Beziehungen den kürzesten Pfad (basierend auf der 'duration')
      CALL apoc.algo.dijkstra(startSV, ziel, 'NEXT>|TRANSFER>', 'duration') YIELD path, weight
      WITH path, weight
      ORDER BY weight ASC
      LIMIT 3

      RETURN 
        weight AS total_duration_minutes,
        [n IN nodes(path) | n.stop_id + "@" + n.departure] AS route,
        [rel IN relationships(path) | rel.trip_id] AS used_trips,
        [rel IN relationships(path) | rel.duration] AS durations,
        [n IN nodes(path) | n.arrival] AS arrival_times,
        [n IN nodes(path) | n.departure] AS departure_times
      `,
      { startStation, endStation, date, time }
    );

    const routes: DijkstraRouteResult[] = result.records.map((record) => ({
      total_duration_minutes: record.get("total_duration_minutes"),
      route: record.get("route"),
      used_trips: record.get("used_trips"),
      durations: record.get("durations"),
      arrival_times: record.get("arrival_times"),
      departure_times: record.get("departure_times"),
    }));

    return routes;
  } catch (error) {
    console.error("Fehler bei Routensuche:", error);
    throw error;
  } finally {
    await session.close();
  }
}


// vielleicht query mit wahl 



/*
export async function findRoutes(
  startStation: string,   // stop_id des Startpunktes
  endStation: string,     // stop_id des Ziels
  date: string,           // z. B. "2025-03-28"
  time: string            // z. B. "08:00:00"
): Promise<DijkstraRouteResult[]> {
  const session = getNeo4jSession();

  // Umrechnung der Abfahrtszeit in Minuten ab Mitternacht
  const timeParts = time.split(":");
  const departureTimeMinutes =
    Number(timeParts[0]) * 60 + Number(timeParts[1]);

  // Formatierung des Datums in "yyyyMMdd" (z. B. "2025-03-28" -> "20250328")
  const formattedDate = date.replace(/-/g, "");

  // Bestimmung des Wochentags als String (z. B. "monday")
  const dateObj = new Date(date);
  // JavaScript: getDay() liefert 0 = Sonntag, 1 = Montag, ... 6 = Samstag
  const dayOfWeekNames = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  const dayOfWeekStr = dayOfWeekNames[dateObj.getDay()];

  try {
    const result = await session.run(
      `
      // Parameter aus der Anwendung übernehmen
      WITH $startStation AS startStopId, 
           $endStation AS endStopId, 
           $departureTimeMinutes AS departureTimeMinutes, 
           $formattedDate AS formattedDate, 
           $dayOfWeekStr AS dayOfWeekStr
      
      // 1. Ermittlung des aktiven Service anhand des Datums und Wochentags
      MATCH (service:Service)
      WHERE service.start_date <= formattedDate 
        AND service.end_date >= formattedDate 
        AND service[dayOfWeekStr] = 1
      WITH startStopId, endStopId, departureTimeMinutes, service.service_id AS validServiceId
      
      // 2. Suche des Start-StopVisit-Knotens (mit Abfahrtszeit >= departureTimeMinutes)
      MATCH (startVisit:StopVisit)-[:BELONGS_TO]->(trip:Trip {service_id: validServiceId})
      WHERE startVisit.stop_id = startStopId 
        AND startVisit.departure_minutes >= departureTimeMinutes
      WITH startVisit, validServiceId, endStopId
      
      // 3. Suche des Ziel-StopVisit-Knotens
      MATCH (endVisit:StopVisit)-[:BELONGS_TO]->(trip2:Trip {service_id: validServiceId})
      WHERE endVisit.stop_id = endStopId
      WITH startVisit, endVisit
      
      // 4. Ermittlung der schnellsten Route mittels Dijkstra
      CALL apoc.algo.dijkstra(startVisit, endVisit, "NEXT|TRANSFER", "duration") YIELD path, weight AS totalDuration
      WITH path, totalDuration, head(nodes(path)) AS firstNode, last(nodes(path)) AS lastNode
      
      // 5. Berechnung der Route-Dauer und Extraktion der Zeiten
      WITH path, totalDuration, 
           firstNode.departure AS departureTime, 
           lastNode.arrival AS arrivalTime, 
           (lastNode.arrival_minutes - firstNode.departure_minutes) AS routeDuration
      
      // 6. Sammeln der zugehörigen Trip- und Routeninformationen
      UNWIND nodes(path) AS sv
      MATCH (sv)-[:BELONGS_TO]->(trip)-[:USES_ROUTE]->(route:Route)
      WITH path, totalDuration, departureTime, arrivalTime, routeDuration,
           collect({
             trip_id: trip.trip_id, 
             route_id: route.route_id, 
             route_short_name: route.route_short_name, 
             route_long_name: route.route_long_name, 
             stop_id: sv.stop_id, 
             departure: sv.departure
           }) AS stops
      RETURN path, 
             totalDuration AS totalTravelDuration, 
             departureTime, 
             arrivalTime, 
             routeDuration, 
             stops
      ORDER BY totalTravelDuration ASC
      LIMIT 1
      `,
      { startStation, endStation, departureTimeMinutes, formattedDate, dayOfWeekStr }
    );

    const routes: DijkstraRouteResult[] = result.records.map((record) => ({
      total_duration_minutes: record.get("totalTravelDuration"),
      departureTime: record.get("departureTime"),
      arrivalTime: record.get("arrivalTime"),
      routeDuration: record.get("routeDuration"),
      stops: record.get("stops"),
      path: record.get("path"),
    }));

    return routes;
  } catch (error) {
    console.error("Fehler bei Routensuche:", error);
    throw error;
  } finally {
    await session.close();
  }
}
*/