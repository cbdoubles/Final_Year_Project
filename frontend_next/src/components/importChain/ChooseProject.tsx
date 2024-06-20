import React from "react";
import { ProjectType } from "@/src/libs/types";

type ChooseProjectProps = {
  projects: ProjectType[] | null;
  selectedProject: ProjectType | null;
  setSelectedProject: (project: ProjectType | null) => void;
};

const ChooseProject: React.FC<ChooseProjectProps> = ({
  projects,
  selectedProject,
  setSelectedProject,
}) => {
  console.log("Folders passed to SelectFolder:", projects);

  const handleQueryClick = (project: ProjectType | null) => {
    setSelectedProject(project);
  };

  return (
    <div>
      {projects &&
        projects.map((project) => (
          <div
            key={project.projectId}
            data-testid="select-existing-project-modal"
            className={`flex justify-between items-center text-black p-2 cursor-pointer ${
              selectedProject === project ? "bg-gray-200" : ""
            }`}
            onClick={() => handleQueryClick(project)}
          >
            <span>{project.projectName}</span>
          </div>
        ))}
    </div>
  );
};

export default ChooseProject;
