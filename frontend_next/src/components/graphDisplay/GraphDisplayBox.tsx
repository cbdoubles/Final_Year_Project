import React, { useEffect, useRef } from "react";
import cytoscape, { Core, Stylesheet } from "cytoscape";
import { GraphNode, GraphEdge } from "./GraphType";

export type NodeShape =
  | "rectangle"
  | "roundrectangle"
  | "ellipse"
  | "triangle"
  | "pentagon"
  | "hexagon"
  | "heptagon"
  | "octagon"
  | "star"
  | "diamond"
  | "vee"
  | "rhomboid"
  | "polygon";

export type EdgeStyle =
  | "haystack"
  | "straight"
  | "bezier"
  | "unbundled-bezier"
  | "segments"
  | "taxi";

interface GraphDisplayBoxProps {
  graphData: { nodes: GraphNode[]; edges: GraphEdge[] };
  layoutName: string;
  nodeColor: string;
  nodeSize: number;
  nodeShape: NodeShape;
  fontSize: number;
  edgeColor: string;
  edgeWidth: number;
  showLabels: boolean;
  edgeStyle: EdgeStyle;
  bgColor: string;
}

const GraphDisplayBox: React.FC<GraphDisplayBoxProps> = ({
  graphData,
  layoutName,
  nodeColor,
  nodeSize,
  nodeShape,
  fontSize,
  edgeColor,
  edgeWidth,
  showLabels,
  edgeStyle,
  bgColor,
}) => {
  const cyRef = useRef<HTMLDivElement>(null);
  const cyInstance = useRef<Core | null>(null);

  const styleSheet: Stylesheet[] = [
    {
      selector: "node",
      style: {
        shape: nodeShape,
        backgroundColor: nodeColor,
        width: nodeSize,
        height: nodeSize,
        label: showLabels ? "data(label)" : "",
        "overlay-padding": "6px",
        "z-index": 10,
        "text-outline-color": nodeColor,
        "text-outline-width": "2px",
        color: "white",
        "font-size": fontSize,
      },
    },
    {
      selector: "node:selected",
      style: {
        "border-width": "6px",
        "border-color": "#AAD8FF",
        "border-opacity": 0.5,
        "background-color": "#77828C",
        width: 50,
        height: 50,
        "text-outline-color": "#77828C",
        "text-outline-width": 8,
      },
    },
    {
      selector: "edge",
      style: {
        width: edgeWidth,
        "line-color": edgeColor,
        "target-arrow-color": edgeColor,
        "target-arrow-shape": "triangle",
        "curve-style": edgeStyle,
        label: showLabels ? "data(label)" : "",
      },
    },
  ];

  useEffect(() => {
    if (cyRef.current && !cyInstance.current) {
      cyInstance.current = cytoscape({
        container: cyRef.current,
        elements: graphData,
        style: styleSheet,
        layout: { name: layoutName },
      });

      cyInstance.current.on("tap", "node", (evt) => {
        const node = evt.target;
        console.log("Node tapped", node.data());
      });
    } else if (cyInstance.current) {
      cyInstance.current.elements().remove();
      cyInstance.current.add(graphData);
      cyInstance.current.layout({ name: layoutName }).run();
      cyInstance.current.style().fromJson(styleSheet).update();
    }
  }, [
    graphData,
    layoutName,
    nodeColor,
    nodeSize,
    nodeShape,
    fontSize,
    edgeColor,
    edgeWidth,
    showLabels,
    edgeStyle,
    bgColor,
  ]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          marginTop: "5px",
          backgroundColor: bgColor,
          width: "95%",
          height: "630px",
          padding: "5px",
          borderRadius: "15px",
        }}
        ref={cyRef}
      />
    </div>
  );
};

export default GraphDisplayBox;
