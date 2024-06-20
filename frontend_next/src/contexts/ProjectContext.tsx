import React, { createContext, useContext, useMemo, useState } from "react";

type ProjectContextType = {
  projectId: number;
  setProjectId: (projectId: number) => void;
  projectName: string;
  setProjectName: (projectName: string) => void;
  graphName: string;
  setGraphName: (graphName: string) => void;
};

export const ProjectContext = createContext<ProjectContextType>({
  projectId: 1, // Default value for projectId
  setProjectId: () => {},
  projectName: "", // Default value for projectName
  setProjectName: () => {},
  graphName: "", // Default value for graphName
  setGraphName: () => {},
});

export const ProjectPropsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [projectId, setProjectId] = useState<number>(1);
  const [projectName, setProjectName] = useState<string>("");
  const [graphName, setGraphName] = useState<string>("");

  const value = useMemo(
    () => ({
      projectId,
      setProjectId,
      projectName,
      setProjectName,
      graphName,
      setGraphName,
    }),
    [projectId, projectName, graphName]
  );

  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
};

export const useProjectProps = () => useContext(ProjectContext);
