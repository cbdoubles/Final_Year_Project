// GraphToolBoxContainer.tsx
import React from "react";
import GraphToolBox from "./GraphToolBox";
import { useGraphDataContext } from "./GraphDataContext";

const GraphToolBoxContainer: React.FC = () => {
  const {
    layoutName,
    setLayoutName,
    nodeSize,
    setNodeSize,
    nodeColor,
    setNodeColor,
    nodeShape,
    setNodeShape,
    fontSize,
    setFontSize,
    edgeWidth,
    setEdgeWidth,
    edgeColor,
    setEdgeColor,
    edgeStyle,
    setEdgeStyle,
    showLabels,
    setShowLabels,
    bgColor,
    setBgColor,
    layouts,
    nodeShapes,
    edgeStyles,
  } = useGraphDataContext();

  return (
    <GraphToolBox
      layoutName={layoutName}
      setLayoutName={setLayoutName}
      nodeSize={nodeSize}
      setNodeSize={setNodeSize}
      nodeColor={nodeColor}
      setNodeColor={setNodeColor}
      nodeShape={nodeShape}
      setNodeShape={setNodeShape}
      fontSize={fontSize}
      setFontSize={setFontSize}
      edgeWidth={edgeWidth}
      setEdgeWidth={setEdgeWidth}
      edgeColor={edgeColor}
      setEdgeColor={setEdgeColor}
      edgeStyle={edgeStyle}
      setEdgeStyle={setEdgeStyle}
      showLabels={showLabels}
      setShowLabels={setShowLabels}
      bgColor={bgColor}
      setBgColor={setBgColor}
      layouts={layouts}
      nodeShapes={nodeShapes}
      edgeStyles={edgeStyles}
    />
  );
};

export default GraphToolBoxContainer;
