import React, { useEffect, useRef, useState } from "react";
import InfoCard from "./InfoCard";
import neo4j from "neo4j-driver";

const NEO4J_URL = "bolt://localhost:7687";
const NEO4J_USER = "neo4j";
const NEO4J_PASSWORD = "letmein";

const driver = neo4j.driver(
  NEO4J_URL,
  neo4j.auth.basic(NEO4J_USER, NEO4J_PASSWORD)
);

const NeovisComponent: React.FC<{ query: string }> = ({ query }) => {
  const visRef = useRef<HTMLDivElement>(null);
  const cypherRef = useRef<any>(null);
  const colorMap: Record<string, string> = {};

  const [hoveredItem, setHoveredItem] = useState<any>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  useEffect(() => {
    const draw = async () => {
      const NeoVis = await import("neovis.js");
      const { NeoVisEvents } = await import("neovis.js");

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
                  return generateColorMap(label);
                },
              },
            },
          };
        }

        return transformedNodesLabels;
      };

      const getLabels = async () => {
        const session = driver.session();
        try {
          let result = await session.run(
            "MATCH (n) UNWIND labels(n) AS label RETURN DISTINCT label"
          );
          const labels = result.records.map((record) => record.get("label"));
          return transformLabels(labels);
        } finally {
          await session.close();
        }
      };

      const generateColorMap = (label: string) => {
        if (!colorMap[label]) {
          colorMap[label] = generateRandomColor();
        }
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

      const transformRelationshipTypes = (relationshipTypes: string[]) => {
        const transformedRelationshipTypes: Record<string, any> = {};

        for (let i = 0; i < relationshipTypes.length; i++) {
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
                  return generateColorMap(relationshipType);
                },
              },
            },
          };
        }

        return transformedRelationshipTypes;
      };

      const getRelationshipTypes = async () => {
        const session = driver.session();
        try {
          const result = await session.run("CALL db.relationshipTypes()");
          const relationshipTypes = result.records.map((record) =>
            record.get("relationshipType")
          );
          return transformRelationshipTypes(relationshipTypes);
        } finally {
          await session.close();
        }
      };

      const labelsConfig = await getLabels();
      const relationshipsConfig = await getRelationshipTypes();

      const config = {
        containerId: visRef.current?.id || "",
        neo4j: {
          serverUrl: NEO4J_URL,
          serverUser: NEO4J_USER,
          serverPassword: NEO4J_PASSWORD,
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
            smooth: {
              enabled: true,
              type: "dynamic",
            },
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
          interaction: {
            hover: true,
          },
        },
        initialCypher: "MATCH (n)-[r]->(m) RETURN n, r, m LIMIT 70",
        nonFlat: false,
      };

      const viz = new NeoVis.default(config as any);

      viz.render();

      cypherRef.current = viz;

      const setupListeners = () => {
        if (viz.network) {
          viz.network.on("stabilized", () => {
            viz.network?.setOptions({ physics: { enabled: false } });
          });

          viz.network.on("hoverNode", (params) => {
            const nodeId = params.node;
            console.log("hoverNode", nodeId); // Debug log
            setHoveredItem(nodeId);
          });

          viz.network.on("blurNode", () => {
            setHoveredItem(null);
          });

          viz.network.on("hoverEdge", (params) => {
            const edgeId = params.edge;
            console.log("hoverEdge", edgeId); // Debug log
            setHoveredItem(edgeId);
          });

          viz.network.on("blurEdge", () => {
            setHoveredItem(null);
          });

          viz.network.on("click", (params) => {
            const nodeId = params.nodes[0];
            const edgeId = params.edges[0];
            if (nodeId) {
              console.log("clickNode", nodeId); // Debug log
              setSelectedItem(nodeId);
            } else if (edgeId) {
              console.log("clickEdge", edgeId); // Debug log
              setSelectedItem(edgeId);
            }
          });

          viz.network.on("doubleClick", async (params) => {
            const nodeId = params.nodes[0];
            if (nodeId) {
              const query = `MATCH (n)-[r]->(m) WHERE ID(n) = ${nodeId} RETURN n, r, m`;
              console.log("doubleClickNode", nodeId, query); // Debug log

              const session = driver.session();
              try {
                const result = await session.run(query);
                const records = result.records;
                const nodes = records.map((record) => record.get("n"));
                const relationships = records.map((record) => record.get("r"));
                const connectedNodes = records.map((record) => record.get("m"));
                cypherRef.current.updateWithCypher(query);
                viz.network?.setOptions({ physics: { enabled: true } });
                viz.network?.on("stabilized", () => {
                  viz.network?.setOptions({ physics: { enabled: false } });
                });
              } finally {
                await session.close();
                console.log("done doubleclick");
              }
            }
          });
        } else {
          // Retry setup after a short delay
          setTimeout(setupListeners, 100);
        }
      };

      viz.registerOnEvent(NeoVisEvents.CompletionEvent, setupListeners);
    };

    draw();
  }, []);

  useEffect(() => {
    if (query && cypherRef.current) {
      cypherRef.current.updateWithCypher(query);
    }
  }, [query]);

  const downloadPNG = () => {
    const scale = 4; // Scale factor for higher resolution
  
    // Get the canvas and its context
    const canvas = visRef.current.querySelector('canvas');
    if (canvas) {
      const width = canvas.width * scale;
      const height = canvas.height * scale;
      const largeCanvas = document.createElement('canvas');
      largeCanvas.width = width;
      largeCanvas.height = height;
      const context = largeCanvas.getContext('2d');
  
      // Clear the canvas for transparency
      context.clearRect(0, 0, width, height);
  
      // Draw the original canvas on the larger canvas
      context.scale(scale, scale);
      context.drawImage(canvas, 0, 0);
  
      // Create the download link
      const image = largeCanvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
      const link = document.createElement('a');
      link.download = 'neovis-graph.png';
      link.href = image;
      link.click();
    }
  };

  return (
    <div className="flex flex-row">
      <div id="viz" ref={visRef} style={{ width: "75%", height: "600px" }} />
      <button onClick={downloadPNG}>Export PNG</button>
      <div style={{ width: "25%", paddingLeft: "10px" }}>
        <InfoCard title="Hovered Item" item={hoveredItem} />
        <InfoCard title="Selected Item" item={selectedItem} />
      </div>
    </div>
  );
};

export default NeovisComponent;
