import React, { useState, useEffect } from "react";

import ProjectItem from "./ProjectItem";

import { ProjectType } from "@/src/libs/types";
import { fetchProjects } from "@/src/utils/apiCalls/project/fetchProjects";

type SelectExistingProjectProps = {
  selectedElement: ProjectType | null;
  setSelectedElement: React.Dispatch<React.SetStateAction<ProjectType | null>>;
};

/**
 * SelectExistingProject Component
 *
 * @description
 * This component renders a list of existing projects as ProjectItem components. It manages state for the list of projects,
 * the selected project, the project being edited, and the project being deleted. It fetches projects from an API
 * endpoint on component mount and passes down necessary props to each ProjectItem component for rendering and interaction.
 *
 * @props
 * No props are passed directly to this component.
 *
 * @state
 * @typedef {ProjectType[]} elements - State to store the list of project elements fetched from the API.
 * @typedef {ProjectType | null} selectedElement - State to store the currently selected project element.
 * @typedef {ProjectType | null} editingElement - State to store the project element currently being edited (null if no editing in progress).
 * @typedef {ProjectType | null} deletingElement - State to store the project element currently being deleted (null if no deletion in progress).
 */
const SelectExistingProject: React.FC<SelectExistingProjectProps> = ({
  selectedElement,
  setSelectedElement,
}) => {
  const [elements, setElements] = useState<ProjectType[]>([]);
  const [editingElement, setEditingElement] = useState<ProjectType | null>(
    null
  );
  const [deletingElement, setDeletingElement] = useState<ProjectType | null>(
    null
  );

  /**
   * Fetches projects from the API endpoint on component mount.
   */
  useEffect(() => {
    onLoad();
  }, []);

  /**
   * Handles fetching projects from the API.
   */
  const onLoad = async () => {
    const result = await fetchProjects();
    if (result) {
      setElements(result);
    }
  };

  return (
    <div
      className="h-auto overflow-auto"
      data-testid="select-exising-project-modal"
    >
      {elements.map((element) => (
        <ProjectItem
          key={element.projectId}
          deletingElement={deletingElement}
          editingElement={editingElement}
          element={element}
          elements={elements}
          selectedElement={selectedElement}
          setDeletingElement={setDeletingElement}
          setEditingElement={setEditingElement}
          setElements={setElements}
          setSelectedElement={setSelectedElement}
        />
      ))}
    </div>
  );
};

export default SelectExistingProject;
