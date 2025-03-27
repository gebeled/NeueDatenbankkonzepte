import { getNeo4jSession } from "./neo4j";



interface RouteResult {
  trip_id: string;
  route_short_name: string;
  route_long_name: string;
  departure_time: string;
  arrival_time: string;
}


export async function getAllStops() {
    const session = getNeo4jSession();
    try {
      const result = await session.run("MATCH (s:Stop) RETURN s.stop_name");
      return result.records.map(record => record.get("s.stop_name"));
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
  date: string,
  time: string
): Promise<RouteResult[]> {
  const session = getNeo4jSession();

  try {
    const result = await session.run(
      `
      MATCH (start:Stop {stop_name: $startStation})
      MATCH (end:Stop {stop_name: $endStation})
      MATCH (start)-[st1:STOP_TIME]->(trip:Trip)<-[st2:STOP_TIME]-(end),
            (trip)-[:OPERATES_ON]->(route:Route),
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
          // Nur Verbindungen, wo der Start tatsächlich vor dem End-Stop liegt
          AND st1.stop_sequence < st2.stop_sequence
          // Abfahrtszeit >= gesuchte Zeit
          AND st1.departure_time >= $time
      RETURN DISTINCT
          trip.trip_id AS trip_id,
          route.route_short_name AS route_short_name,
          route.route_long_name AS route_long_name,
          st1.departure_time AS departure_time,
          st2.arrival_time AS arrival_time
      ORDER BY st1.departure_time
      LIMIT 10
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
