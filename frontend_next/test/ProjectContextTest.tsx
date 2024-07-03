import React from "react";

import { useProjectProps } from "@/src/contexts/ProjectContext";

// Test component to interact with ProjectContext
export const TestComponent = () => {
  const {
    projectId,
    setProjectId,
    projectName,
    setProjectName,
    graphName,
    setGraphName,
    resetProject,
  } = useProjectProps();

  return (
    <div>
      <div>
        <span id="project-id">Project ID: {projectId}</span>
        <button id="set-project-id" onClick={() => setProjectId(42)}>
          Set Project ID to 42
        </button>
      </div>
      <div>
        <span id="project-name">Project Name: {projectName}</span>
        <button
          id="set-project-name"
          onClick={() => setProjectName("Test Project")}
        >
          Set Project Name
        </button>
      </div>
      <div>
        <span id="graph-name">Graph Name: {graphName}</span>
        <button id="set-graph-name" onClick={() => setGraphName("Test Graph")}>
          Set Graph Name
        </button>
      </div>
      <button id="reset-project" onClick={resetProject}>
        Reset Project
      </button>
    </div>
  );
};
