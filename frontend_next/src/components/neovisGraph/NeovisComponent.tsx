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
          },
          nodes: {
            shape: "dot",
            size: 15,
          },
          physics: {
            enabled: true,
            solver: "forceAtlas2Based",
            stabilization: {
              enabled: true,
              iterations: 10000, // We can increase the number of iterations to ensure a stable layout
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
          Character: {
            caption: "name",
            size: "degree",
            community: "community",
          },
        },
        relationships: {
          INTERACTS: {
            thickness: "weight",
            caption: true,
          },
        },
        initialCypher:
          "MATCH (bacon:Person {name:'Kevin Bacon'})-[r*1..4]-(hollywood) RETURN DISTINCT hollywood, r",
        nonFlat: true, // Ensure the nonFlat property is explicitly set to true
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
      //this fucker forgets the edges so for example if I run a query that results in 1-2 nodes then rerun it with a full query it would have forgotten the edges
      //only solution I can think of rn is to add a button add edges, that runs MATCH (n1)-[r]->(n2) RETURN n1,r,n2 , so that it returns the full graph
      cypherRef.current.renderWithFunction(query);
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
