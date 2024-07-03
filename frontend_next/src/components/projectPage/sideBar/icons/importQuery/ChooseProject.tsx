import React from "react";

import { ProjectType } from "@/src/libs/types";

type ChooseProjectProps = {
  projects: ProjectType[] | null;
  selectedProject: ProjectType | null;
  setSelectedProject: (project: ProjectType | null) => void;
};

/**
 * ChooseProject Component
 *
 * @description
 * This component renders a list of projects and allows the user to select a project. The selected project is highlighted,
 * and the selection is managed through the setSelectedProject function.
 *
 * @props
 * @param {ProjectType[] | null} projects - The list of projects to display.
 * @param {ProjectType | null} selectedProject - The currently selected project.
 * @param {(project: ProjectType | null) => void} setSelectedProject - Function to set the selected project.
 */
const ChooseProject: React.FC<ChooseProjectProps> = ({
  projects,
  selectedProject,
  setSelectedProject,
}) => {
  /**
   * Handle project click
   *
   * @description
   * Sets the selected project when a project is clicked.
   *
   * @param {ProjectType | null} project - The project that was clicked.
   */
  const handleQueryClick = (project: ProjectType | null) => {
    setSelectedProject(project);
  };
  /**
   * Render the component
   *
   * @description
   * Renders a list of projects. Each project is displayed as a clickable item, and the selected project is highlighted.
   *
   * @returns {JSX.Element} The rendered list of projects.
   */
  return (
    <div>
      {projects &&
        projects.map((project) => (
          <div
            key={project.projectId}
            className={`flex justify-between items-center text-black p-2 cursor-pointer ${
              selectedProject === project ? "bg-gray-200" : ""
            }`}
            data-testid="select-existing-project-modal"
            onClick={() => handleQueryClick(project)}
          >
            <span>{project.projectName}</span>
          </div>
        ))}
    </div>
  );
};

export default ChooseProject;
