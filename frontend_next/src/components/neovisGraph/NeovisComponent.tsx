import React, { useEffect, useRef } from "react";

const NeovisComponent: React.FC<{ query: string }> = ({ query }) => {
  const visRef = useRef<HTMLDivElement>(null);
  const cypherRef = useRef<any>(null);

  useEffect(() => {
    const draw = async () => {
      const { default: NeoVis } = await import("neovis.js/dist/neovis.js");

      const config = {
        containerId: visRef.current?.id || "",
        neo4j: {
          serverUrl: "bolt://localhost:7687",
          serverUser: "neo4j",
          serverPassword: "letmein",
        },
        visConfig: {
          edges: {
            arrows: {
              to: { enabled: true },
            },
            font: {
              size: 12,
              color: "#000000",
              strokeWidth: 3,
              strokeColor: "#ffffff",
            },
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
        labels: {
          Person: {
            label: "name",
            size: "degree",
            community: "community",
          },
        },
        relationships: {
          INTERACTS: {
            thickness: "weight",
            caption: "type",
          },
        },
        initialCypher: "MATCH (n) RETURN n",
        nonFlat: true,
      };

      const viz = new NeoVis(config as any);
      viz.render();

      cypherRef.current = viz;
      // Disable physics after stabilization
      viz.network?.on("stabilized", () => {
        if (viz.network) {
          viz.network.setOptions({ physics: { enabled: false } });
        }
      });

      console.log(viz);
    };

    draw();
  }, []);

  useEffect(() => {
    console.log("useEffect ran");
    console.log("Query is:", query);
    console.log("cypherRef.current is:", cypherRef.current);

    if (query && cypherRef.current) {
      console.log("Calling cypherRef.current.clearNetwork()");
      cypherRef.current.clearNetwork();
      console.log("Calling cypherRef.current.updateWithCypher(query)");
      cypherRef.current.renderWithCypher(query);
    } else {
      console.log(
        "Did not call cypherRef.current.clearNetwork() or cypherRef.current.updateWithCypher(query)"
      );
    }
  }, [query]);

  return (
    <div id="viz" ref={visRef} style={{ width: "100%", height: "600px" }} />
  );
};

export default NeovisComponent;
