import React from "react";
import { LuPenSquare } from "react-icons/lu";

import DeleteModal from "./DeleteModal";
import EditForm from "./EditForm";

import { useProjectProps } from "@/src/contexts/ProjectContext";
import { ProjectType } from "@/src/libs/types";

type ProjectItemProps = {
  element: ProjectType;
  selectedElement: ProjectType | null;
  setSelectedElement: React.Dispatch<React.SetStateAction<ProjectType | null>>;
  setElements: React.Dispatch<React.SetStateAction<ProjectType[]>>;
  elements: ProjectType[];
  editingElement: ProjectType | null;
  setEditingElement: React.Dispatch<React.SetStateAction<ProjectType | null>>;
  deletingElement: ProjectType | null;
  setDeletingElement: React.Dispatch<React.SetStateAction<ProjectType | null>>;
};

/**
 * ProjectItem Component
 *
 * @description
 * This component represents an individual project item in a list. It displays the project's name and provides options
 * for editing and deleting the project. It allows selecting the project to view details and manages state for
 * editing and deleting actions.
 *
 * @props
 * @param {ProjectType} element - The project element to display.
 * @param {ProjectType | null} selectedElement - Currently selected project element (null if no selection).
 * @param {React.Dispatch<React.SetStateAction<ProjectType | null>>} setSelectedElement - Function to set the selected project element.
 * @param {React.Dispatch<React.SetStateAction<ProjectType[]>>} setElements - Function to update the list of project elements.
 * @param {ProjectType | null} editingElement - Currently editing project element (null if no editing in progress).
 * @param {React.Dispatch<React.SetStateAction<ProjectType | null>>} setEditingElement - Function to set the project currently being edited.
 * @param {ProjectType | null} deletingElement - Currently deleting project element (null if no deletion in progress).
 * @param {React.Dispatch<React.SetStateAction<ProjectType | null>>} setDeletingElement - Function to set the project currently being deleted.
 *
 * @state
 * No additional state managed within this component.
 */

const ProjectItem: React.FC<ProjectItemProps> = ({
  element,
  selectedElement,
  setSelectedElement,
  setElements,
  elements,
  editingElement,
  setEditingElement,
  deletingElement,
  setDeletingElement,
}) => {
  const { setProjectId, setProjectName, setGraphName } = useProjectProps();

  /**
   * Handles click event on the project item.
   * Sets the selected project element and updates context values for project details.
   */
  const handleElementClick = () => {
    setSelectedElement(element);
    setProjectId(element.projectId);
    setProjectName(element.projectName);
    setGraphName(element.graphName);
  };

  /**
   * Handles click event on the edit icon.
   * Sets the editing element to allow editing of the project name.
   */
  const handleEditClick = () => {
    setEditingElement(element);
  };

  return (
    <div
      className={`flex justify-between items-center text-black p-2 cursor-pointer ${
        selectedElement?.projectId === element.projectId ? "bg-gray-200" : ""
      }`}
      data-testid="select-existing-project-modal"
      onClick={handleElementClick}
    >
      {editingElement && editingElement.projectId === element.projectId ? (
        <EditForm
          element={element}
          elements={elements}
          setEditingElement={setEditingElement}
          setElements={setElements}
        />
      ) : (
        <span>{element.projectName}</span>
      )}
      <div className="flex">
        <LuPenSquare onClick={handleEditClick} />
        <DeleteModal
          deletingProject={deletingElement}
          project={element}
          projects={elements}
          setDeletingProject={setDeletingElement}
          setProjects={setElements}
        />
      </div>
    </div>
  );
};

export default ProjectItem;
