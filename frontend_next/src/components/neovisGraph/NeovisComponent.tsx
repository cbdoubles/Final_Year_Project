import React, { useEffect, useRef, useState } from "react";

const NEO4J_URL = "bolt://localhost:7687";
const NEO4J_USER = "neo4j";
const NEO4J_PASSWORD = "letmein";

// TODO - Modify the queries to check for projectid
const getLabels = async () => {
  const neo4j = await import("neo4j-driver");
  const driver = neo4j.driver(
    NEO4J_URL,
    neo4j.auth.basic(NEO4J_USER, NEO4J_PASSWORD)
  );
  const session = driver.session();
  let result = await session.run(
    "MATCH (n) UNWIND labels(n) AS label RETURN DISTINCT label"
  );

  if (result.records.length === 0) {
    result = await session.run(
      "MATCH (n) UNWIND properties(n).labels AS label RETURN DISTINCT label"
    );
  }
  session.close();
  driver.close();
  return result.records.map((record) => record.get("label"));
};

// TODO - Modify the queries to check for projectid
const getRelationshipTypes = async () => {
  const neo4j = await import("neo4j-driver");
  const driver = neo4j.driver(
    NEO4J_URL,
    neo4j.auth.basic(NEO4J_USER, NEO4J_PASSWORD)
  );
  const session = driver.session();
  const result = await session.run("CALL db.relationshipTypes()");
  session.close();
  driver.close();
  return result.records.map((record) => record.get("relationshipType"));
};

const generateRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const NeovisComponent: React.FC<{ query: string }> = ({ query }) => {
  const visRef = useRef<HTMLDivElement>(null);
  const cypherRef = useRef<any>(null);

  const [labelsConfig, setLabelsConfig] = useState([]);
  const [relationshipTypes, setRelationshipTypes] = useState([]);

  useEffect(() => {
    Promise.all([getLabels(), getRelationshipTypes()]).then(
      ([labels, types]) => {
        const labelsConfig = labels.reduce((acc, label) => {
          return {
            ...acc,
            [label]: {
              label: label,
              color: generateRandomColor(),
            },
          };
        }, {});

        const relationshipsConfig = types.reduce((acc, type) => {
          return {
            ...acc,
            [type]: {
              label: type,
              caption: true,
              color: generateRandomColor(),
            },
          };
        }, {});
        console.log("labels", labels);
        console.log("types", types);
        setLabelsConfig(labelsConfig);
        setRelationshipTypes(relationshipsConfig);
        console.log("labelsConfig", labelsConfig);
        console.log("relationshipsConfig", relationshipsConfig);
      }
    );

    const draw = async () => {
      const NeoVis = await import("neovis.js");

      const config = {
        containerId: visRef.current?.id || "",
        neo4j: {
          serverUrl: NEO4J_URL, // Replace with your Neo4j instance URL
          serverUser: NEO4J_USER, // Replace with your Neo4j credentials
          serverPassword: NEO4J_PASSWORD, // Replace with your Neo4j credentials
        },
        labels: labelsConfig,
        relationships: relationshipTypes,
        visConfig: {
          edges: {
            arrows: {
              to: { enabled: true },
            },
            width: 2, // Adjust this value to increase the thickness of the edges
            font: {
              size: 12,
              color: "#000000",
              strokeWidth: 3,
              strokeColor: "#ffffff",
              align: "middle",
            },
            label: "roles",
            labelHighlightBold: true,
          },
          nodes: {
            shape: "dot",
            size: 15,
            font: {
              size: 16,
              color: "#000000",
            },
            labelHighlightBold: true,
          },
          physics: {
            enabled: true,
            solver: "forceAtlas2Based",
            stabilization: {
              enabled: true,
              iterations: 10,
              fit: true,
            },
            forceAtlas2Based: {
              gravitationalConstant: -50,
              centralGravity: 0.005,
              springLength: 230,
              springConstant: 0.18,
            },
            maxVelocity: 50,
            minVelocity: 0.1,
            timestep: 0.5,
            adaptiveTimestep: true,
          },
        },
        initialCypher: "MATCH (n)-[r]->(m) RETURN n, r, m LIMIT 500",
        nonFlat: false, // Set nonFlat to false
      };

      const viz = new NeoVis.default(config as any);
      viz.render();

      cypherRef.current = viz;

      // Disable physics after stabilization
      viz.network?.on("stabilized", () => {
        if (viz.network) {
          viz.network.setOptions({ physics: { enabled: false } });
        }
      });
    };

    draw();
  }, []);

  useEffect(() => {
    if (query && cypherRef.current) {
      cypherRef.current.clearNetwork();
      cypherRef.current.renderWithCypher(query);
    }
  }, [query]);

  return (
    <div id="viz" ref={visRef} style={{ width: "100%", height: "600px" }} />
  );
};

export default NeovisComponent;
