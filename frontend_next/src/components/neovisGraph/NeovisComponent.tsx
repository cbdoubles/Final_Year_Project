// NeovisComponent.tsx
import React, { useEffect, useRef, useState } from "react";
import InfoCard from "./InfoCard";
import neo4j from "neo4j-driver";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { useNeoVisContext } from "@/components/neovisGraph/NeoVisContext";

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

  const {
    nodeSize,
    edgeWidth,
    fontSize,
    colorMapState,
    items,
    layout,
    setNodeSize,
    setEdgeWidth,
    setFontSize,
    setColorMapState,
    setItems,
    setLayout,
  } = useNeoVisContext();

  const [hoveredItem, setHoveredItem] = useState<any>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [nodeClasses, setNodeClasses] = useState<string[]>([]);
  const [edgeClasses, setEdgeClasses] = useState<string[]>([]);
  const [config, setConfig] = useState<any>(null);
  const [isCardCollapsed, setIsCardCollapsed] = useState<boolean>(false);
  const [tableData, setTableData] = useState<any[]>([]);
  const [isTableView, setIsTableView] = useState<boolean>(false);

  const getNodeProperties = async (nodeId: number) => {
    const session = driver.session();
    try {
      const result = await session.run(
        "MATCH (n) WHERE ID(n) = $nodeId RETURN properties(n) AS properties",
        { nodeId }
      );
      if (result.records.length > 0) {
        return result.records[0].get("properties");
      }
      return null;
    } finally {
      await session.close();
    }
  };

  const getEdgeProperties = async (edgeId: number) => {
    const session = driver.session();
    try {
      const result = await session.run(
        "MATCH ()-[r]->() WHERE ID(r) = $edgeId RETURN properties(r) AS properties",
        { edgeId }
      );
      if (result.records.length > 0) {
        return result.records[0].get("properties");
      }
      return null;
    } finally {
      await session.close();
    }
  };

  const runQuery = async (cypherQuery: string) => {
    const session = driver.session();
    try {
      const result = await session.run(cypherQuery);
      return result;
    } finally {
      await session.close();
    }
  };

  const checkForTableData = (result: any) => {
    if (result.records.length > 0) {
      const firstRecord = result.records[0];
      const keys = firstRecord.keys;
      const isTable = keys.length > 0 && !firstRecord.get(keys[0]).labels;
      return isTable;
    }
    return false;
  };

  const destroyNeovisInstance = () => {
    if (cypherRef.current) {
      cypherRef.current.clearNetwork();
      cypherRef.current = null;
    }
  };

  useEffect(() => {
    if (!isTableView) {
      const draw = async () => {
        destroyNeovisInstance(); // Clean up any existing Neovis instance before drawing

        const { default: NeoVis, NeoVisEvents } = await import("neovis.js");

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
            setNodeClasses(labels); // Set node classes
            setItems((prevItems) => ({
              ...prevItems,
              displayedNodeLabels: labels,
            })); // Update items with node labels
            return transformLabels(labels);
          } finally {
            await session.close();
          }
        };

        const generateColorMap = (label: string) => {
          if (!colorMap[label]) {
            colorMap[label] = generateRandomColor();
          }
          setColorMapState((prevState) => ({
            ...prevState,
            [label]: colorMap[label],
          })); // Update colorMapState
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
            setEdgeClasses(relationshipTypes); // Set edge classes
            setItems((prevItems) => ({
              ...prevItems,
              displayedEdgeTypes: relationshipTypes,
            })); // Update items with edge types
            return transformRelationshipTypes(relationshipTypes);
          } finally {
            await session.close();
          }
        };

        const labelsConfig = await getLabels();
        const relationshipsConfig = await getRelationshipTypes();

        const layoutConfig =
          layout === "hierarchical"
            ? {
                hierarchical: {
                  enabled: true,
                  direction: "UD", // UD for top-down, LR for left-right, DU for bottom-up, RL for right-left
                  sortMethod: "directed", // Directed sorting
                  nodeSpacing: 400,
                },
              }
            : {
                hierarchical: false,
              };

        const initialConfig = {
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
              width: edgeWidth,
              font: {
                size: fontSize,
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
              size: nodeSize,
              font: {
                size: fontSize,
                color: "#000000",
              },
              labelHighlightBold: true,
            },
            layout: layoutConfig,
            physics: {
              enabled: layout !== "hierarchical",
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
          initialCypher: query,
          nonFlat: false,
        };

        setConfig(initialConfig);

        if (visRef.current) {
          const viz = new NeoVis(initialConfig as any);
          viz.render();

          cypherRef.current = viz;

          const setupListeners = () => {
            if (viz.network) {
              viz.network.on("hoverNode", async (params) => {
                if (!selectedItem) {
                  const nodeId = params.node;
                  console.log("hoverNode", nodeId); // Debug log
                  const properties = await getNodeProperties(nodeId);
                  setHoveredItem({ id: nodeId, properties, type: "node" });
                }
              });

              viz.network.on("blurNode", () => {
                setHoveredItem(null);
              });

              viz.network.on("hoverEdge", async (params) => {
                if (!selectedItem) {
                  const edgeId = params.edge;
                  console.log("hoverEdge", edgeId); // Debug log
                  const properties = await getEdgeProperties(edgeId);
                  setHoveredItem({ id: edgeId, properties, type: "edge" });
                }
              });

              viz.network.on("blurEdge", () => {
                setHoveredItem(null);
              });

              viz.network.on("click", async (params) => {
                const nodeId = params.nodes[0];
                const edgeId = params.edges[0];
                if (nodeId) {
                  console.log("clickNode", nodeId); // Debug log
                  const properties = await getNodeProperties(nodeId);
                  setSelectedItem({ id: nodeId, properties, type: "node" });
                } else if (edgeId) {
                  console.log("clickEdge", edgeId); // Debug log
                  const properties = await getEdgeProperties(edgeId);
                  setSelectedItem({ id: edgeId, properties, type: "edge" });
                } else {
                  setSelectedItem(null);
                }
              });

              viz.network.on("doubleClick", async (params) => {
                const nodeId = params.nodes[0];
                if (nodeId) {
                  const query = `MATCH (n)-[r]->(m) WHERE ID(n) = ${nodeId} RETURN n, r, m`;
                  const session = driver.session();
                  try {
                    const result = await session.run(query);
                    const records = result.records;
                    const nodes = records.map((record) => record.get("n"));
                    const relationships = records.map((record) =>
                      record.get("r")
                    );
                    const connectedNodes = records.map((record) =>
                      record.get("m")
                    );

                    const nodeLabels = nodes.map((node) => node.labels).flat();
                    const relationshipTypes = relationships.map(
                      (relationship) => relationship.type
                    );

                    // Update items with new node labels and relationship types
                    setItems((prevItems) => ({
                      ...prevItems,
                      displayedNodeLabels: Array.from(
                        new Set([
                          ...prevItems.displayedNodeLabels,
                          ...nodeLabels,
                        ])
                      ),
                      displayedEdgeTypes: Array.from(
                        new Set([
                          ...prevItems.displayedEdgeTypes,
                          ...relationshipTypes,
                        ])
                      ),
                    }));

                    cypherRef.current.updateWithCypher(query);
                  } finally {
                    await session.close();
                  }
                }
              });

              viz.network.on("click", (event) => {
                if (event.nodes.length === 0 && event.edges.length === 0) {
                  setSelectedItem(null);
                }
              });
            } else {
              // Retry setup after a short delay
              setTimeout(setupListeners, 100);
            }
          };

          viz.registerOnEvent(NeoVisEvents.CompletionEvent, setupListeners);
        }
      };

      draw();

      return () => {
        destroyNeovisInstance(); // Ensure cleanup on unmount or query change
      };
    }
  }, [query, isTableView, layout]); // Add layout as a dependency here to re-render the graph

  useEffect(() => {
    if (query) {
      setItems({
        displayedNodeLabels: [],
        displayedEdgeTypes: [],
      });
      runQuery(query).then((result) => {
        const isTable = checkForTableData(result);
        setIsTableView(isTable);

        if (isTable) {
          const tableData = result.records.map((record: any) => {
            const row: Record<string, any> = {};
            record.keys.forEach((key: string) => {
              row[key] = record.get(key);
            });
            return row;
          });
          setTableData(tableData);
        } else if (cypherRef.current) {
          cypherRef.current.render(query);
        }
      });
    }
  }, [query]);

  const renderTable = () => {
    if (tableData.length === 0) {
      return <div>No data to display</div>;
    }
    const headers = Object.keys(tableData[0]);

    return (
      <div className="overflow-auto max-h-[600px]">
        <Table
          aria-label="Example table with static content"
          className="w-full"
        >
          <TableHeader>
            {headers.map((header) => (
              <TableColumn key={header}>{header}</TableColumn>
            ))}
          </TableHeader>
          <TableBody>
            {tableData.map((row, index) => (
              <TableRow key={index}>
                {headers.map((header) => (
                  <TableCell key={header} className="whitespace-pre-wrap">
                    {typeof row[header] === "object" ? (
                      <pre className="whitespace-pre-wrap">
                        {JSON.stringify(row[header], null, 2)}
                      </pre>
                    ) : (
                      row[header]
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  const downloadPNG = () => {
    const scale = 4; // Scale factor for higher resolution

    // Get the canvas and its context
    const canvas = visRef.current?.querySelector("canvas");
    if (canvas) {
      const width = canvas.width * scale;
      const height = canvas.height * scale;
      const largeCanvas = document.createElement("canvas");
      largeCanvas.width = width;
      largeCanvas.height = height;
      const context = largeCanvas.getContext("2d");

      // Clear the canvas for transparency
      context?.clearRect(0, 0, width, height);

      // Draw the original canvas on the larger canvas
      context?.scale(scale, scale);
      context?.drawImage(canvas, 0, 0);

      // Create the download link
      const image = largeCanvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      const link = document.createElement("a");
      link.download = "neovis-graph.png";
      link.href = image;
      link.click();
    }
  };

  const handleCollapse = () => {
    setIsCardCollapsed(!isCardCollapsed);
  };

  useEffect(() => {
    const updateGraphConfig = async () => {
      if (typeof window !== "undefined" && cypherRef.current) {
        const { default: NeoVis } = await import("neovis.js");

        const updatedConfig = {
          ...config,
          visConfig: {
            ...config.visConfig,
            edges: {
              ...config.visConfig.edges,
              width: edgeWidth,
              font: {
                ...config.visConfig.edges.font,
                size: fontSize,
              },
            },
            nodes: {
              ...config.visConfig.nodes,
              size: nodeSize,
              font: {
                ...config.visConfig.nodes.font,
                size: fontSize,
              },
            },
          },
          labels: {
            ...config.labels,
            ...Object.keys(colorMapState).reduce((acc, label) => {
              (acc as any)[label] = {
                ...config.labels[label],
                [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
                  function: {
                    ...config.labels[label]?.[NeoVis.NEOVIS_ADVANCED_CONFIG]
                      ?.function,
                    color: () => colorMapState[label],
                  },
                },
              };
              return acc;
            }, {} as Record<string, any>),
          },
          relationships: {
            ...config.relationships,
            ...Object.keys(colorMapState).reduce((acc, type) => {
              (acc as any)[type] = {
                ...config.relationships[type],
                [NeoVis.NEOVIS_ADVANCED_CONFIG]: {
                  function: {
                    ...config.relationships[type]?.[
                      NeoVis.NEOVIS_ADVANCED_CONFIG
                    ]?.function,
                    color: () => colorMapState[type],
                  },
                },
              };
              return acc;
            }, {} as Record<string, any>),
          },
        };

        cypherRef.current.reinit(updatedConfig);
      }
    };

    updateGraphConfig();
  }, [nodeSize, edgeWidth, fontSize, colorMapState, config]);

  return (
    <div className="relative flex flex-col">
      {isTableView ? (
        renderTable()
      ) : (
        <>
          <div key={query} id="viz" ref={visRef} className="w-full h-[600px]" />
          <div
            className={`absolute top-10 right-10 transition-all ${
              isCardCollapsed ? "w-16" : "w-96"
            }`}
          >
            <InfoCard
              title="Details"
              item={hoveredItem || selectedItem}
              onCollapse={handleCollapse}
              isCollapsed={isCardCollapsed}
            />
          </div>
        </>
      )}
      <button
        onClick={downloadPNG}
        className="absolute top-2 right-2 bg-white rounded shadow p-2"
      >
        Export PNG
      </button>
    </div>
  );
};

export default NeovisComponent;
