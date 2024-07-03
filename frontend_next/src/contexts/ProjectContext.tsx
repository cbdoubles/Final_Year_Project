import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

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
  setProject: (project: ProjectType) => void;
};

/**
 * ProjectContext
 *
 * @description
 * Context object to manage project-related data such as projectId, projectName, and graphName.
 */
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

/**
 * ProjectPropsProvider
 *
 * @description
 * Provider component that wraps the application with ProjectContext, allowing components to
 * consume and update project data using the useProjectProps hook.
 *
 * @param {React.ReactNode} children - The child components wrapped by ProjectPropsProvider.
 */
export const ProjectPropsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [projectId, setProjectIdState] = useState<number>(0);
  const [projectName, setProjectNameState] = useState<string>("");
  const [graphName, setGraphNameState] = useState<string>("");

  // Wrap setters with functions to handle state and localStorage
  const setProjectId = (projectId: number) => {
    setProjectIdState(projectId);
    localStorage.setItem("projectId", projectId.toString());
  };

  const setProjectName = (projectName: string) => {
    setProjectNameState(projectName);
    localStorage.setItem("projectName", projectName);
  };

  const setGraphName = (graphName: string) => {
    setGraphNameState(graphName);
    localStorage.setItem("graphName", graphName);
  };

  /**
   * resetProject
   *
   * @description
   * Function to reset projectId, projectName, and graphName to their default values.
   */
  const resetProject = () => {
    setProjectId(0);
    setProjectName("");
    setGraphName("");
  };

  /**
   * setProject
   *
   * @description
   * Function to update all project data (projectId, projectName, graphName) at once.
   *
   * @param {ProjectType} project - The new project data containing projectId, projectName, and graphName.
   */
  const setProject = (project: ProjectType) => {
    setProjectId(project.projectId);
    setProjectName(project.projectName);
    setGraphName(project.graphName);
  };

  // Load initial state from localStorage on component mount
  useEffect(() => {
    const storedProjectId = localStorage.getItem("projectId");
    const storedProjectName = localStorage.getItem("projectName");
    const storedGraphName = localStorage.getItem("graphName");

    if (storedProjectId) {
      setProjectIdState(parseInt(storedProjectId, 10));
    }
    if (storedProjectName) {
      setProjectNameState(storedProjectName);
    }
    if (storedGraphName) {
      setGraphNameState(storedGraphName);
    }
  }, []);

  const value = useMemo(
    () => ({
      projectId,
      setProjectId,
      projectName,
      setProjectName,
      graphName,
      setGraphName,
      resetProject,
      setProject,
    }),
    [projectId, projectName, graphName]
  );

  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
};
/**
 * useProjectProps
 *
 * @description
 * Hook to consume the ProjectContext values across components.
 *
 * @returns {ProjectContextType} - Object containing projectId, setProjectId, projectName,
 * setProjectName, graphName, setGraphName, resetProject, and setProject.
 */
export const useProjectProps = () => useContext(ProjectContext);
