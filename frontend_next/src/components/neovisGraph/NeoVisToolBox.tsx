import React, { useState } from "react";
import { Card, CardHeader, CardBody } from "@nextui-org/card";
import { useNeoVisContext } from "./NeoVisContext";

interface ToolBoxProps {
  title: string;
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

  const filterDisplayedItems = (labels: string[]) => {
    return labels.filter((label) => colorMapState[label] !== undefined);
  };

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
        <div>
          <h5>Displayed Node Labels:</h5>
          {filterDisplayedItems(items.displayedNodeLabels).map((label) => (
            <div key={label} className="relative inline-block m-2">
              <button
                style={{
                  borderRadius: "50px",
                  backgroundColor: colorMapState[label] || "#000000",
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
              {selectedButton === label && (
                <input
                  type="color"
                  value={colorMapState[label] || "#000000"}
                  onChange={handleColorChange}
                  className="absolute top-0 left-0 z-10"
                  style={{ transform: "translate(-50%, -50%)" }}
                />
              )}
            </div>
          ))}
        </div>
        <div>
          <h5>Displayed Edge Types:</h5>
          {filterDisplayedItems(items.displayedEdgeTypes).map((type) => (
            <div key={type} className="relative inline-block m-2">
              <button
                style={{
                  borderRadius: "50px",
                  backgroundColor: colorMapState[type] || "#000000",
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
              {selectedButton === type && (
                <input
                  type="color"
                  value={colorMapState[type] || "#000000"}
                  onChange={handleColorChange}
                  className="absolute top-0 left-0 z-10"
                  style={{ transform: "translate(-50%, -50%)" }}
                />
              )}
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};

export default NeoVisToolBox;
