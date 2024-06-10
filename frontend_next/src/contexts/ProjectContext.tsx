import React, { createContext, useContext, useMemo, useState } from "react";

type ProjectContextType = {
  projectId: string;
  setProjectId: (projectId: string) => void;
  projectName: string;
  setProjectName: (projectName: string) => void;
};

export const ProjectContext = createContext<ProjectContextType>({
  projectId: "", // Default value for projectId
  setProjectId: () => {},
  projectName: "", // Default value for projectName
  setProjectName: () => {},
});

export const ProjectPropsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [projectId, setProjectId] = useState<string>("");
  const [projectName, setProjectName] = useState<string>("");

  const value = useMemo(
    () => ({
      projectId,
      setProjectId,
      projectName,
      setProjectName,
    }),
    [projectId, projectName]
  );

  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
};

export const useProjectProps = () => useContext(ProjectContext);
