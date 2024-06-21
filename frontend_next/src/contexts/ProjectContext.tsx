import React, { createContext, useContext, useMemo, useState } from "react";

// Define the ProjectType
export type ProjectType = {
  projectId: number;
  projectName: string;
  graphName: string;
};

type ProjectContextType = {
  projectId: number;
  setProjectId: (projectId: number) => void;
  projectName: string;
  setProjectName: (projectName: string) => void;
  graphName: string;
  setGraphName: (graphName: string) => void;
  resetProject: () => void;
  setProject: (project: ProjectType) => void; // Add setProject to the context type
};

export const ProjectContext = createContext<ProjectContextType>({
  projectId: 1, // Default value for projectId
  setProjectId: () => {},
  projectName: "", // Default value for projectName
  setProjectName: () => {},
  graphName: "", // Default value for graphName
  setGraphName: () => {},
  resetProject: () => {},
  setProject: () => {}, // Default value for setProject
});

export const ProjectPropsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [projectId, setProjectId] = useState<number>(1);
  const [projectName, setProjectName] = useState<string>("");
  const [graphName, setGraphName] = useState<string>("");

  const resetProject = () => {
    setProjectId(1);
    setProjectName("");
    setGraphName("");
  };

  // Define the setProject function
  const setProject = (project: ProjectType) => {
    setProjectId(project.projectId);
    setProjectName(project.projectName);
    setGraphName(project.graphName);
  };

  const value = useMemo(
    () => ({
      projectId,
      setProjectId,
      projectName,
      setProjectName,
      graphName,
      setGraphName,
      resetProject,
      setProject, // Add setProject to the context value
    }),
    [projectId, projectName, graphName]
  );

  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
};

export const useProjectProps = () => useContext(ProjectContext);
