import React, { useState, useEffect, useRef } from "react";
import "./style.css";
import CytoscapeComponent from "react-cytoscapejs";
import { layouts } from "./layouts.tsx";
import "@neo4j-cypher/codemirror/css/cypher-codemirror.css";
import { CypherEditor } from "@neo4j-cypher/react-codemirror";

export default function App() {
  const [width] = useState("100%");
  const [height] = useState("400px");
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [layout, setLayout] = useState(layouts["grid"]); // default to 'grid' layout
  const [selectedFile, setSelectedFile] = useState();
  const apiUrl = "http://127.0.0.1:8000/api/graphData";
  const sendToAPI = "http://127.0.0.1:8000/upload_file/";
  const runCypherQuery = "http://127.0.0.1:8000/run_query/";
  const saveCypherQuery = "http://127.0.0.1:8000/cypher_query/";
  const cypherEditorRef = useRef();
  const [editorValue, setEditorValue] = useState("");
  const editorProps = {
    lint: true,
    autocompleteOpen: true,
    value: editorValue,
  };

  useEffect(() => {
    if (cypherEditorRef.current) {
      const editor = cypherEditorRef.current;
      console.log(editor.editorRef);
      console.log(editor);
    }
  }, [cypherEditorRef]);

  const handleEditorChange = (newValue) => {
    console.log("New value:", newValue);
    setEditorValue(newValue);
  };

  //change it so that it displays the result in the cytoscape window
  const runQuery = async () => {
    console.log(editorValue);
    const response = await fetch(runCypherQuery, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: editorValue }),
    });

    // Parse the response as JSON
    const data = await response.json();
    console.log(data);
    try {
      let run_nodes = [];
      let run_edges = [];

      data.nodes.forEach((node) => {
        const { id, ...otherProperties } = node.properties;
        run_nodes.push({
          data: {
            id: node.element_id,
            label: node.labels[0], // Assuming there's at least one label
            ...node.otherProperties,
            ...node.data,
          },
        });
      });
      console.log(run_nodes);
      data.edges.forEach((edge) => {
        if (
          run_nodes.find((n) => n.data.id === edge.start_node.element_id) &&
          run_nodes.find((n) => n.data.id === edge.end_node.element_id)
        ) {
          run_edges.push({
            data: {
              id: edge.element_id,
              source: edge.start_node.element_id,
              target: edge.end_node.element_id,
              label: edge.type,
              ...edge.properties,
            },
          });
        } else {
          console.error("Edge with non-existent source or target:", edge);
        }
      });
      // Combine nodes and edges into one array
      let graphRunData = { nodes: run_nodes, edges: run_edges };
      console.log(graphRunData);

      // Update the graph data
      setGraphData(graphRunData);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const saveQuery = () => {
    fetch(saveCypherQuery, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cypher_query: editorValue,
        save: true,
      }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    const formData = new FormData();
    formData.append("json_file", file);

    fetch(sendToAPI, {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        console.log("Response status: ", response.status);
        console.log("Response ok: ", response.ok);
        console.log("Content-Type: ", response.headers.get("Content-Type"));
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        //result is in binary as it is a file
        return response.blob();
      })
      .then((blob) => {
        console.log("File uploaded successfully:", blob);
        // Fetch the data after the file has been uploaded
        return fetch(apiUrl);
      })
      .then((response) => {
        console.log("Raw response: ", response);
        return response.json();
      })
      .then(processGraphData)
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const processGraphData = (data) => {
    console.log(data);
    const nodes = data.nodes.map((node) => {
      const { id, ...otherProperties } = node;
      return {
        data: {
          id: node.elementId,
          label: node.name ? node.name : node.labels[0], // Assuming there's at least one label or node name
          ...otherProperties,
        },
      };
    });

    const edges = data.edges
      .filter((edge) => edge.source && edge.target) // Ensure that both start and end are not null
      .map((edge) => {
        if (
          nodes.find((n) => n.data.id === edge.source) &&
          nodes.find((n) => n.data.id === edge.target)
        ) {
          return {
            data: {
              id: edge.id,
              source: edge.source,
              target: edge.target,
              label: edge.label,
              ...edge,
            },
          };
        }
        return null; // Return null if the condition is not met
      })
      .filter((edge) => edge !== null); // Filter out null values
    const graphData = { nodes, edges };
    console.log(graphData);
    setGraphData(graphData);
    const layoutName = chooseLayout(nodes.length, edges.length);
    setLayout({
      ...layouts[layoutName],
      fit: false, // Set fit to false to allow the graph to expand
    });
  };

  //commented as it duplicates data we will upload data only through upload file for the demo
  // useEffect(() => {
  //   fetch(apiUrl)
  //     .then((response) => response.json())
  //     .then(processGraphData)
  //     .catch((error) => console.error("Error fetching data: ", error));
  // }, []);

  //the logic should be fixed
  function chooseLayout(nodesCount, edgesCount) {
    if (nodesCount < 50 && edgesCount < 50) {
      return "grid";
    } else if (nodesCount < 100 && edgesCount < 100) {
      return "circle";
    } else if (nodesCount < 200 && edgesCount < 200) {
      return "breadthfirst";
    } else if (nodesCount < 300 && edgesCount < 300) {
      return "klay";
    } else if (nodesCount < 400 && edgesCount < 400) {
      return "fcose";
    } else if (nodesCount < 500 && edgesCount < 500) {
      return "cose";
    } else if (nodesCount < 600 && edgesCount < 600) {
      return "cola";
    } else if (nodesCount < 700 && edgesCount < 700) {
      return "dagre";
    } else {
      return "elk_random"; // default to 'elk_random' layout for larger graphs
    }
  }

  const styleSheet = [
    {
      selector: "node",
      style: {
        backgroundColor: "#4a56a6",
        width: 30,
        height: 30,
        label: "data(label)",

        // "width": "mapData(score, 0, 0.006769776522008331, 20, 60)",
        // "height": "mapData(score, 0, 0.006769776522008331, 20, 60)",
        // "text-valign": "center",
        // "text-halign": "center",
        "overlay-padding": "6px",
        "z-index": "10",
        //text props
        "text-outline-color": "#4a56a6",
        "text-outline-width": "2px",
        color: "white",
        fontSize: 20,
      },
    },
    {
      selector: "node:selected",
      style: {
        "border-width": "6px",
        "border-color": "#AAD8FF",
        "border-opacity": "0.5",
        "background-color": "#77828C",
        width: 50,
        height: 50,
        //text props
        "text-outline-color": "#77828C",
        "text-outline-width": 8,
      },
    },
    {
      selector: "node[type='device']",
      style: {
        shape: "rectangle",
      },
    },
    {
      selector: "edge",
      style: {
        width: 3,
        // "line-color": "#6774cb",
        "line-color": "#AAD8FF",
        "target-arrow-color": "#6774cb",
        "target-arrow-shape": "triangle",
        "curve-style": "bezier",
        label: "data(label)",
      },
    },
  ];

  let myCyRef;

  return (
    <>
      <div>
        <input type="file" onChange={handleFileUpload} />
        {selectedFile && <p>File selected: {selectedFile.name}</p>}
      </div>
      <div>
        <h1>Cytoscape example</h1>
        <div
          style={{
            border: "1px solid",
            backgroundColor: "#f5f6fe",
          }}
        >
          <CytoscapeComponent
            elements={CytoscapeComponent.normalizeElements(graphData)}
            // pan={{ x: 200, y: 200 }}
            style={{ width: width, height: height }}
            zoomingEnabled={true}
            maxZoom={3}
            minZoom={0.1}
            autounselectify={false}
            boxSelectionEnabled={true}
            layout={layout}
            stylesheet={styleSheet}
            cy={(cy) => {
              myCyRef = cy;

              console.log("EVT", cy);

              cy.on("tap", "node", function (evt) {
                const node = evt.target;
                // Display the data of the node in a popup
                alert(JSON.stringify(node.data(), null, 2));
              });
              cy.on("tap", "edge", function (evt) {
                const edge = evt.target;
                // Display the data of the edge in a popup
                alert(JSON.stringify(edge.data(), null, 2));
              });
            }}
            abc={console.log("myCyRef", myCyRef)}
          />
        </div>
      </div>
      <div>
        <h1>Cypher Editor</h1>
        <CypherEditor
          ref={cypherEditorRef}
          onValueChanged={handleEditorChange}
          {...editorProps}
        />
      </div>
      <button onClick={saveQuery}>Save</button>
      <button onClick={runQuery}>Run</button>
    </>
  );
}
