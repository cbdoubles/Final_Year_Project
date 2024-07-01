// import React, { useState, useEffect } from "react"

// import { GraphNode, GraphEdge } from "./GraphType"
// import GraphDisplayBox from "./GraphDisplayBox"
// import GraphToolBox from "./GraphToolBox"

// const mockData = {
//   nodes: [
//     { data: { id: "1", label: "Node 1" } },
//     { data: { id: "2", label: "Node 2" } },
//     { data: { id: "3", label: "Node 3" } },
//     { data: { id: "4", label: "Node 4" } }
//   ],
//   edges: [
//     { data: { source: "1", target: "2", label: "e1" } },
//     { data: { source: "1", target: "3", label: "e2" } },
//     { data: { source: "3", target: "4", label: "e3" } }
//   ]
// }

// const Visualization = () => {
//   const [graphData, setGraphData] = useState<{
//     nodes: GraphNode[]
//     edges: GraphEdge[]
//   }>({
//     nodes: [],
//     edges: []
//   })
//   const [layoutName, setLayoutName] = useState<string>("grid")
//   const [nodeSize, setNodeSize] = useState(30)
//   const [nodeColor, setNodeColor] = useState("#4a56a6")
//   const [edgeColor, setEdgeColor] = useState("#AAD8FF")
//   const [nodeShape, setNodeShape] = useState("ellipse")
//   const [fontSize, setFontSize] = useState(20)
//   const [edgeWidth, setEdgeWidth] = useState(3)
//   const [showLabels, setShowLabels] = useState(true)
//   const [edgeStyle, setEdgeStyle] = useState("bezier")
//   const [bgColor, setBgColor] = useState("#ffffff")

//   const layouts = ["grid", "circle", "breadthfirst", "cose"]
//   const nodeShapes = [
//     "ellipse",
//     "rectangle",
//     "roundrectangle",
//     "triangle",
//     "pentagon",
//     "hexagon",
//     "heptagon",
//     "octagon"
//   ]
//   const edgeStyles = ["bezier", "unbundled-bezier", "haystack", "segments"]

//   useEffect(() => {
//     const data = mockData
//     const nodes = data.nodes.map((node) => ({
//       data: {
//         id: node.data.id,
//         label: node.data.label
//       }
//     }))
//     const edges = data.edges
//       .filter((edge) => edge.data.source && edge.data.target)
//       .map((edge) => ({
//         data: {
//           source: edge.data.source,
//           target: edge.data.target,
//           label: edge.data.label ? edge.data.label : ""
//         }
//       }))
//     setGraphData({ nodes, edges })
//   }, [])

//   return (
//     <div>
//       <GraphDisplayBox
//         graphData={graphData}
//         layoutName={layoutName}
//         nodeColor={nodeColor}
//         nodeSize={nodeSize}
//         nodeShape={nodeShape}
//         fontSize={fontSize}
//         edgeColor={edgeColor}
//         edgeWidth={edgeWidth}
//         showLabels={showLabels}
//         edgeStyle={edgeStyle}
//         bgColor={bgColor}
//       />
//       <GraphToolBox
//         layoutName={layoutName}
//         setLayoutName={setLayoutName}
//         nodeSize={nodeSize}
//         setNodeSize={setNodeSize}
//         nodeColor={nodeColor}
//         setNodeColor={setNodeColor}
//         nodeShape={nodeShape}
//         setNodeShape={setNodeShape}
//         fontSize={fontSize}
//         setFontSize={setFontSize}
//         edgeWidth={edgeWidth}
//         setEdgeWidth={setEdgeWidth}
//         edgeColor={edgeColor}
//         setEdgeColor={setEdgeColor}
//         edgeStyle={edgeStyle}
//         setEdgeStyle={setEdgeStyle}
//         showLabels={showLabels}
//         setShowLabels={setShowLabels}
//         bgColor={bgColor}
//         setBgColor={setBgColor}
//         layouts={layouts}
//         nodeShapes={nodeShapes}
//         edgeStyles={edgeStyles}
//       />
//     </div>
//   )
// }

// export default Visualization

// Visualization.tsx
import React from "react";
// import GraphDisplayBoxContainer from "./GraphDisplayBoxContainer";
import GraphToolBoxContainer from "./GraphToolBoxContainer";
import { GraphDataProvider } from "./GraphDataContext";

const Visualization: React.FC = () => {
  return (
    <GraphDataProvider>
      <div>
        {/* <GraphDisplayBoxContainer /> */}
        <GraphToolBoxContainer />
      </div>
    </GraphDataProvider>
  );
};

export default Visualization;
