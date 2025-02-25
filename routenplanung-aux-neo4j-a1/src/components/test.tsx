"use client";

import { useEffect, useState } from "react";

export default function Test() {
  interface Node {
    id: string;
    label: string;
    // Add other properties as needed
  }

  const [nodes, setNodes] = useState<Node[]>([]);

  useEffect(() => {
    fetch("/api/neo4j")
      .then(res => res.json())
      .then(data => setNodes(data.nodes))
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  return (
    <div>
      <h1>Neo4j Daten</h1>
      <ul>
        {nodes.map((node, index) => (
          <li key={index}>{JSON.stringify(node)}</li>
        ))}
      </ul>
    </div>
  );
}