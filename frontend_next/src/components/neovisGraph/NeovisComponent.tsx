import React, { useEffect, useRef } from "react";

const NeovisComponent: React.FC<{ query: string }> = ({ query }) => {
  const visRef = useRef<HTMLDivElement>(null);
  const cypherRef = useRef<any>(null);

  useEffect(() => {
    const draw = async () => {
      const NeoVis = await import("neovis.js");

      const config = {
        containerId: visRef.current?.id || "",
        neo4j: {
          serverUrl: "bolt://localhost:7687", // Replace with your Neo4j instance URL
          serverUser: "neo4j", // Replace with your Neo4j credentials
          serverPassword: "letmein", // Replace with your Neo4j credentials
        },
        labels: {
          Person: {
            label: "name",
          },
          Movie: {
            label: "title",
          },
        },
        relationships: {
          ACTED_IN: {
            label: "roles",
            caption: true,
            [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
              function: {
                title: (edge: any) => {
                  return `Roles: ${edge.properties.roles.join(", ")}`;
                },
              },
            },
          },
          DIRECTED: {
            label: "DIRECTED",
            caption: true,
            [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
              function: {
                title: (edge: any) => {
                  return "Directed";
                },
              },
            },
          },
          PRODUCED: {
            label: "PRODUCED",
            caption: true,
            [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
              function: {
                title: (edge: any) => {
                  return "Produced";
                },
              },
            },
          },
        },
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
