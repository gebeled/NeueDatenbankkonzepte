import { getNeo4jSession } from "./neo4j";



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

  
export async function getRouteById(routeId: string) {
  const session = getNeo4jSession();
  try {
    const result = await session.run(
      "MATCH (r:Route {route_id: $routeId}) RETURN r",
      { routeId }
    );
    return result.records.length > 0 ? result.records[0].get("r").properties : null;
  } catch (error) {
    console.error("Error fetching route:", error);
    throw error;
  } finally {
    await session.close();
  }
}
