// GraphDisplayBoxContainer.tsx
import React from "react";
import GraphDisplayBox from "./GraphDisplayBox";
import { useGraphDataContext } from "./GraphDataContext";
import { validateEdgeStyle, validateNodeShape } from "./utils";

const GraphDisplayBoxContainer: React.FC = () => {
  const {
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
  } = useGraphDataContext();

  return (
    <GraphDisplayBox
      graphData={graphData}
      layoutName={layoutName}
      nodeColor={nodeColor}
      nodeSize={nodeSize}
      nodeShape={validateNodeShape(nodeShape)}
      fontSize={fontSize}
      edgeColor={edgeColor}
      edgeWidth={edgeWidth}
      showLabels={showLabels}
      edgeStyle={validateEdgeStyle(edgeStyle)}
      bgColor={bgColor}
    />
  );
};

export default GraphDisplayBoxContainer;
