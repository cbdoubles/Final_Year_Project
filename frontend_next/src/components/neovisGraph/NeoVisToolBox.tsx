import React, { useState } from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { useNeoVisContext } from "./NeoVisContext";

interface ToolBoxProps {
  title: string;
  //items: ToolBoxItem;
  //colorMap: Record<string, string>;
}

const NeoVisToolBox: React.FC<ToolBoxProps> = ({ title }) => {
  const {
    nodeSize,
    edgeWidth,
    fontSize,
    colorMapState,
    items,
    setNodeSize,
    setEdgeWidth,
    setFontSize,
    setColorMapState,
    setItems,
  } = useNeoVisContext();

  const [selectedButton, setSelectedButton] = useState<string | null>(null);

  const handleColorChange = (color: any) => {
    if (selectedButton) {
      setColorMapState({
        ...colorMapState,
        [selectedButton]: color.target.value,
      });
    }
  };

  if (!items) {
    return null;
  }
  return (
    <Card className="py-4">
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <h4 className="font-bold text-large">{title}</h4>
      </CardHeader>
      <CardBody className="overflow-visible py-2">
        <label>
          Node Size: {nodeSize}
          <input
            type="range"
            min="1"
            max="100"
            value={nodeSize}
            onChange={(e) => setNodeSize(Number(e.target.value))}
          />
        </label>
        {/* <label>
            Node Color:
            <input
              type="color"
              value={nodeColor}
              onChange={(e) => setNodeColor(e.target.value)}
            />
          </label> */}
        <label>
          Font Size: {fontSize}
          <input
            type="range"
            min="1"
            max="100"
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
          />
        </label>
        <label>
          Edge Width: {edgeWidth}
          <input
            type="range"
            min="1"
            max="100"
            value={edgeWidth}
            onChange={(e) => setEdgeWidth(Number(e.target.value))}
          />
        </label>
        {/* <label>
            Edge Color:
            <input
              type="color"
              value={edgeColor}
              onChange={(e) => setEdgeColor(e.target.value)}
            />
          </label> */}
        <div>
          <h5>Displayed Node Labels:</h5>
          {items.displayedNodeLabels.map((label) => (
            <button
              key={label}
              style={{
                borderRadius: "50px",
                backgroundColor: colorMapState[label],
                border: "none",
                color: "white",
                padding: "10px 24px",
                textAlign: "center",
                textDecoration: "none",
                display: "inline-block",
                fontSize: "16px",
                margin: "4px 2px",
                cursor: "pointer",
              }}
              onClick={() => setSelectedButton(label)}
            >
              {label}
            </button>
          ))}
        </div>
        <div>
          <h5>Displayed Edge Types:</h5>
          {items.displayedEdgeTypes.map((type) => (
            <button
              key={type}
              style={{
                borderRadius: "50px",
                backgroundColor: colorMapState[type],
                border: "none",
                color: "white",
                padding: "10px 24px",
                textAlign: "center",
                textDecoration: "none",
                display: "inline-block",
                fontSize: "16px",
                margin: "4px 2px",
                cursor: "pointer",
              }}
              onClick={() => setSelectedButton(type)}
            >
              {type}
            </button>
          ))}
        </div>
        {selectedButton && (
          <input
            type="color"
            value={colorMapState[selectedButton] || "#000000"}
            onChange={handleColorChange}
          />
        )}
      </CardBody>
    </Card>
  );
};
export default NeoVisToolBox;
