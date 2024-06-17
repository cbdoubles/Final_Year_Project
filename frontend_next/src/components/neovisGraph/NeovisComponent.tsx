import React, { useEffect, useRef } from "react";

const NEO4J_URL = "bolt://localhost:7687";
const NEO4J_USER = "neo4j";
const NEO4J_PASSWORD = "letmein";

const NeovisComponent: React.FC<{ query: string }> = ({ query }) => {
  const visRef = useRef<HTMLDivElement>(null);
  const cypherRef = useRef<any>(null);
  const colorMap: Record<string, string> = {};

  useEffect(() => {
    const draw = async () => {
      const NeoVis = await import("neovis.js");

      //TODO add map for labels and colors
      const transformLabels = (labels: string[]) => {
        const transformedNodesLabels: Record<string, any> = {};

        for (let i = 0; i < labels.length; i++) {
          const label = labels[i];
          transformedNodesLabels[label] = {
            label: label,
            caption: true,
            [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
              function: {
                label: (node: any) => {
                  return label;
                },
                color: (node: any) => {
                  // Use the generateColor function to get the color for this label
                  return generateColorMap(label);
                },
              },
            },
          };
        }

        console.log(transformedNodesLabels);
        return transformedNodesLabels;
      };

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
        const labels = result.records.map((record) => record.get("label"));
        return transformLabels(labels);
      };

      const generateColorMap = (label: string) => {
        // If the color for this label is not in the map, generate a new one
        if (!colorMap[label]) {
          colorMap[label] = generateRandomColor();
        }

        // Return the color for this label
        return colorMap[label];
      };

      const generateRandomColor = () => {
        const letters = "0123456789ABCDEF";
        let color = "#";
        for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      };

      //TODO add map for labels and colors
      const transformRelationshipTypes = (relationshipTypes: string[]) => {
        const transformedRelationshipTypes: Record<string, any> = {};

        for (let i = 0; i < relationshipTypes.length; i++) {
          console.log(relationshipTypes[i]);
          const relationshipType = relationshipTypes[i];
          transformedRelationshipTypes[relationshipType] = {
            label: relationshipType,
            caption: true,
            [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
              function: {
                label: (edge: any) => {
                  return relationshipType;
                },
                color: (edge: any) => {
                  // Use the generateColor function to get the color for this relationship type
                  return generateColorMap(relationshipType);
                },
              },
            },
          };
        }

        console.log(transformedRelationshipTypes);
        return transformedRelationshipTypes;
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
        const relationshipTypes = result.records.map((record) =>
          record.get("relationshipType")
        );
        console.log(relationshipTypes);
        return transformRelationshipTypes(relationshipTypes);
      };
      const labelsConfig = await getLabels();
      const relationshipsConfig = await getRelationshipTypes();

      const config = {
        containerId: visRef.current?.id || "",
        neo4j: {
          NEO4J_URL,
          NEO4J_USER,
          NEO4J_PASSWORD,
        },
        labels: labelsConfig,
        relationships: relationshipsConfig,
        visConfig: {
          edges: {
            arrows: {
              to: { enabled: true },
            },
            width: 2,
            font: {
              size: 12,
              color: "#000000",
              strokeWidth: 3,
              strokeColor: "#ffffff",
              align: "middle",
            },
            labelHighlightBold: true,
            smooth: false, // Disable smooth edges for better visibility of labels
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
        nonFlat: false,
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
