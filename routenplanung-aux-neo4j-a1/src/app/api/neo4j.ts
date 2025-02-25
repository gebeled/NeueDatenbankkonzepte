import type { NextApiRequest, NextApiResponse } from "next";
import neo4j from "neo4j-driver";

const driver = neo4j.driver(
  process.env.NEO4J_URI!,
  neo4j.auth.basic(process.env.NEO4J_USERNAME!, process.env.NEO4J_PASSWORD!)
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Only GET requests allowed" });
  }

  const session = driver.session();
  try {
    const result = await session.run("MATCH (n) RETURN n LIMIT 10"); // Beispiel-Query
    const nodes = result.records.map(record => record.get("n").properties);
    res.status(200).json({ nodes });
  } catch (error) {
    console.error("Neo4j Query Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await session.close();
  }
}
