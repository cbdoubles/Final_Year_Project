import React, { useState, useEffect} from "react";
import "./style.css";
import CytoscapeComponent from "react-cytoscapejs";
import { layouts } from './layouts.tsx'

export default function App() {
  const [width, setWith] = useState("100%");
  const [height, setHeight] = useState("400px");
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [layout, setLayout] = useState(layouts['grid']); // default to 'grid' layout
  const [selectedFile, setSelectedFile] = useState();
  const apiUrl = 'http://127.0.0.1:8000/api/graphData';
  const sendToAPI = 'http://127.0.0.1:8000/download_file/';


  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const csrftoken = getCookie('csrftoken');

  const handleFileUpload = event => {
    const file = event.target.files[0];
    setSelectedFile(file);
  
    const formData = new FormData();
    formData.append('json_file', file);
  
    fetch(sendToAPI, {
      method: 'POST',
      body: formData,
      headers: {
        'X-CSRFToken': csrftoken
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('File uploaded successfully:', data);
    })
    .catch(error => {
      console.error('Error uploading file:', error);
    });
  };

  useEffect(() => {
    // Replace this URL with the URL of your Django API
    //const apiUrl = import.meta.env.VITE_API_URL;
  
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        // Convert the data to the format expected by Cytoscape
        const nodes = data.nodes.map(node => ({ data: { id: node.elementId, label: node.name ? node.name : node.elementId } }));
        const edges = data.edges
          .filter(edge => edge.source && edge.target) // Ensure that both start and end are not null
          .map(edge => ({ data: { source: edge.source, target: edge.target, label: edge.label ? edge.label : '' } }));
        const graphData = { nodes, edges };
        console.log(graphData);
        setGraphData(graphData);
        const layoutName = chooseLayout(nodes.length, edges.length);
        setLayout({
          ...layouts[layoutName],
          fit: false, // Set fit to false to allow the graph to expand
        });
        })
      .catch(error => console.error("Error fetching data: ", error));
  }, []);

  function chooseLayout(nodesCount, edgesCount) {
    if (nodesCount < 50 && edgesCount < 50) {
      return 'grid';
    } else if (nodesCount < 100 && edgesCount < 100) {
      return 'circle';
    } else if (nodesCount < 200 && edgesCount < 200) {
      return 'breadthfirst';
    } else if (nodesCount < 300 && edgesCount < 300) {
      return 'klay';
    } else if (nodesCount < 400 && edgesCount < 400) {
      return 'fcose';
    } else if (nodesCount < 500 && edgesCount < 500) {
      return 'cose';
    } else if (nodesCount < 600 && edgesCount < 600) {
      return 'cola';
    } else if (nodesCount < 700 && edgesCount < 700) {
      return 'dagre';
    } else {
      return 'elk_random'; // default to 'elk_random' layout for larger graphs
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
        fontSize: 20
      }
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
        "text-outline-width": 8
      }
    },
    {
      selector: "node[type='device']",
      style: {
        shape: "rectangle"
      }
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
        "label": "data(label)"
      }
    }
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
            backgroundColor: "#f5f6fe"
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
            cy={cy => {
              myCyRef = cy;

              console.log("EVT", cy);

              cy.on("tap", "node", evt => {
                var node = evt.target;
                console.log("EVT", evt);
                console.log("TARGET", node.data());
                console.log("TARGET TYPE", typeof node[0]);
              });
            }}
            abc={console.log("myCyRef", myCyRef)}
          />
        </div>
      </div>
    </>
  );
}

