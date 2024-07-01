// utils.ts
import { NodeShape, EdgeStyle } from "./GraphDisplayBox";

export const validateNodeShape = (shape: string): NodeShape => {
  const validShapes: NodeShape[] = [
    "rectangle",
    "roundrectangle",
    "ellipse",
    "triangle",
    "pentagon",
    "hexagon",
    "heptagon",
    "octagon",
    "star",
    "diamond",
    "vee",
    "rhomboid",
    "polygon",
  ];
  return validShapes.includes(shape as NodeShape)
    ? (shape as NodeShape)
    : "ellipse"; // default to 'ellipse'
};

export const validateEdgeStyle = (style: string): EdgeStyle => {
  const validStyles: EdgeStyle[] = [
    "haystack",
    "straight",
    "bezier",
    "unbundled-bezier",
    "segments",
    "taxi",
  ];
  return validStyles.includes(style as EdgeStyle)
    ? (style as EdgeStyle)
    : "straight"; // default to 'straight'
};
