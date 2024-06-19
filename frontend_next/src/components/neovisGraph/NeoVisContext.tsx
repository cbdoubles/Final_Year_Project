// NeoVisContext.tsx
import React, { createContext, useContext, useState } from "react";

interface ToolBoxItem {
  displayedNodeLabels: string[];
  displayedEdgeTypes: string[];
}

interface NeoVisContextProps {
  nodeSize: number;
  edgeWidth: number;
  fontSize: number;
  colorMapState: Record<string, string>;
  items: ToolBoxItem;
  setNodeSize: React.Dispatch<React.SetStateAction<number>>;
  setEdgeWidth: React.Dispatch<React.SetStateAction<number>>;
  setFontSize: React.Dispatch<React.SetStateAction<number>>;
  setColorMapState: React.Dispatch<
    React.SetStateAction<Record<string, string>>
  >;
  setItems: React.Dispatch<React.SetStateAction<ToolBoxItem>>;
}

export const NeoVisContext = createContext<NeoVisContextProps | undefined>(
  undefined
);

export const NeoVisProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [nodeSize, setNodeSize] = useState<number>(15);
  const [edgeWidth, setEdgeWidth] = useState<number>(2);
  const [fontSize, setFontSize] = useState<number>(12);
  const [colorMapState, setColorMapState] = useState<Record<string, string>>(
    {}
  );
  const [items, setItems] = useState<ToolBoxItem>({
    displayedNodeLabels: [],
    displayedEdgeTypes: [],
  });

  return (
    <NeoVisContext.Provider
      value={{
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
      }}
    >
      {children}
    </NeoVisContext.Provider>
  );
};

export const useNeoVisContext = (): NeoVisContextProps => {
  const context = useContext(NeoVisContext);
  if (!context) {
    throw new Error("useNeoVisContext must be used within a NeoVisProvider");
  }
  return context;
};
