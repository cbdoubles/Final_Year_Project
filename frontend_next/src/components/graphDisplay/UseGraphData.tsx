// useGraphData.ts
import { useState, useEffect } from "react";
import { GraphNode, GraphEdge } from "./GraphType";

const mockData = {
  nodes: [
    { data: { id: "1", label: "Node 1" } },
    { data: { id: "2", label: "Node 2" } },
    { data: { id: "3", label: "Node 3" } },
    { data: { id: "4", label: "Node 4" } },
  ],
  edges: [
    { data: { source: "1", target: "2", label: "e1" } },
    { data: { source: "1", target: "3", label: "e2" } },
    { data: { source: "3", target: "4", label: "e3" } },
  ],
};

const UseGraphData = () => {
  const [graphData, setGraphData] = useState<{
    nodes: GraphNode[];
    edges: GraphEdge[];
  }>({
    nodes: [],
    edges: [],
  });
  const [layoutName, setLayoutName] = useState<string>("grid");
  const [nodeSize, setNodeSize] = useState(30);
  const [nodeColor, setNodeColor] = useState("#4a56a6");
  const [edgeColor, setEdgeColor] = useState("#AAD8FF");
  const [nodeShape, setNodeShape] = useState("ellipse");
  const [fontSize, setFontSize] = useState(20);
  const [edgeWidth, setEdgeWidth] = useState(3);
  const [showLabels, setShowLabels] = useState(true);
  const [edgeStyle, setEdgeStyle] = useState("bezier");
  const [bgColor, setBgColor] = useState("#c5c7c7");

  const layouts = ["grid", "circle", "breadthfirst", "cose"];
  const nodeShapes = [
    "ellipse",
    "rectangle",
    "roundrectangle",
    "triangle",
    "pentagon",
    "hexagon",
    "heptagon",
    "octagon",
  ];
  const edgeStyles = ["bezier", "unbundled-bezier", "haystack", "segments"];

  useEffect(() => {
    const data = mockData;
    const nodes = data.nodes.map((node) => ({
      data: {
        id: node.data.id,
        label: node.data.label,
      },
    }));
    const edges = data.edges
      .filter((edge) => edge.data.source && edge.data.target)
      .map((edge) => ({
        data: {
          source: edge.data.source,
          target: edge.data.target,
          label: edge.data.label ? edge.data.label : "",
        },
      }));
    setGraphData({ nodes, edges });
  }, []);

  return {
    graphData,
    layoutName,
    setLayoutName,
    nodeSize,
    setNodeSize,
    nodeColor,
    setNodeColor,
    edgeColor,
    setEdgeColor,
    nodeShape,
    setNodeShape,
    fontSize,
    setFontSize,
    edgeWidth,
    setEdgeWidth,
    showLabels,
    setShowLabels,
    edgeStyle,
    setEdgeStyle,
    bgColor,
    setBgColor,
    layouts,
    nodeShapes,
    edgeStyles,
  };
};

export default UseGraphData;
