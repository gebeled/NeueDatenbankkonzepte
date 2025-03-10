import neo4j from "neo4j-driver";

const driver = neo4j.driver(
  process.env.NEO4J_URI!,
  neo4j.auth.basic(process.env.NEO4J_USERNAME!, process.env.NEO4J_PASSWORD!)
);

// Funktion, um eine neue Session zu bekommen
export function getNeo4jSession() {
  return driver.session();
}

// Funktion, um die Verbindung beim Beenden der App zu schließen
export async function closeNeo4jConnection() {
  await driver.close();
}
