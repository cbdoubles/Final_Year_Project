import React from "react";

interface GraphToolBoxProps {
  layoutName: string;
  setLayoutName: (layout: string) => void;
  nodeSize: number;
  setNodeSize: (size: number) => void;
  nodeColor: string;
  setNodeColor: (color: string) => void;
  nodeShape: string;
  setNodeShape: (shape: string) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  edgeWidth: number;
  setEdgeWidth: (width: number) => void;
  edgeColor: string;
  setEdgeColor: (color: string) => void;
  edgeStyle: string;
  setEdgeStyle: (style: string) => void;
  showLabels: boolean;
  setShowLabels: (show: boolean) => void;
  bgColor: string;
  setBgColor: (color: string) => void;
  layouts: string[];
  nodeShapes: string[];
  edgeStyles: string[];
}

const GraphToolBox: React.FC<GraphToolBoxProps> = ({
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
}) => {
  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ color: "black", fontSize: "20px" }}>Toolbox</h1>
      <div>
        <label>
          Layout: &nbsp;
          <select
            style={{ border: "1px solid black", borderRadius: "5px" }}
            value={layoutName}
            onChange={(e) => setLayoutName(e.target.value)}
          >
            {layouts.map((layout) => (
              <option key={layout} value={layout}>
                {layout}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div>
        <label>
          Node Size: &nbsp;
          <input
            type="range"
            min="10"
            max="100"
            value={nodeSize}
            onChange={(e) => setNodeSize(parseInt(e.target.value))}
          />
        </label>
      </div>
      <div>
        <label>
          Node Color: &nbsp;
          <input
            type="color"
            value={nodeColor}
            onChange={(e) => setNodeColor(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Node Shape: &nbsp;
          <select
            style={{ border: "1px solid black", borderRadius: "5px" }}
            value={nodeShape}
            onChange={(e) => setNodeShape(e.target.value)}
          >
            {nodeShapes.map((shape) => (
              <option key={shape} value={shape}>
                {shape}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div>
        <label>
          Font Size: &nbsp;
          <input
            type="range"
            min="10"
            max="40"
            value={fontSize}
            onChange={(e) => setFontSize(parseInt(e.target.value))}
          />
        </label>
      </div>
      <div>
        <label>
          Edge Width: &nbsp;
          <input
            type="range"
            min="1"
            max="10"
            value={edgeWidth}
            onChange={(e) => setEdgeWidth(parseInt(e.target.value))}
          />
        </label>
      </div>
      <div>
        <label>
          Edge Color: &nbsp;
          <input
            type="color"
            value={edgeColor}
            onChange={(e) => setEdgeColor(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Edge Style: &nbsp;
          <select
            style={{ border: "1px solid black", borderRadius: "5px" }}
            value={edgeStyle}
            onChange={(e) => setEdgeStyle(e.target.value)}
          >
            {edgeStyles.map((style) => (
              <option key={style} value={style}>
                {style}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div>
        <label>
          Show Labels: &nbsp;
          <input
            type="checkbox"
            checked={showLabels}
            onChange={(e) => setShowLabels(e.target.checked)}
          />
        </label>
      </div>
      <div>
        <label>
          Background Color: &nbsp;
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
          />
        </label>
      </div>
    </div>
  );
};

export default GraphToolBox;
