import { NextResponse } from "next/server";
import neo4j from "neo4j-driver";

const driver = neo4j.driver(
  process.env.NEO4J_URI!,
  neo4j.auth.basic(process.env.NEO4J_USERNAME!, process.env.NEO4J_PASSWORD!)
);

export async function GET() {
  const session = driver.session();
  try {
    const result = await session.run("MATCH (n) RETURN n LIMIT 10");
    const nodes = result.records.map(record => record.get("n").properties);
    return NextResponse.json({ nodes });
  } catch (error) {
    console.error("Neo4j Query Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  } finally {
    await session.close();
  }
}
