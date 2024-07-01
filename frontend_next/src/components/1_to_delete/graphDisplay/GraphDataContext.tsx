import React, { createContext, useContext } from "react";
import useGraphData from "./UseGraphData";

// Define the type for the props
type GraphDataProviderProps = React.PropsWithChildren<{}>;

const GraphDataContext = createContext<
  ReturnType<typeof useGraphData> | undefined
>(undefined);

export const GraphDataProvider: React.FC<GraphDataProviderProps> = ({
  children,
}) => {
  const graphData = useGraphData();
  return (
    <GraphDataContext.Provider value={graphData}>
      {children}
    </GraphDataContext.Provider>
  );
};

export const useGraphDataContext = () => {
  const context = useContext(GraphDataContext);
  if (context === undefined) {
    throw new Error(
      "useGraphDataContext must be used within a GraphDataProvider"
    );
  }
  return context;
};
