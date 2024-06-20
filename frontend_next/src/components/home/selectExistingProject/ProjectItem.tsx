// ProjectItem.tsx
import React from "react";
import { LuTrash2, LuPenSquare } from "react-icons/lu";
import EditForm from "./EditForm";
import DeleteModal from "./DeleteModal";
import { useProjectProps } from "@/src/contexts/ProjectContext";
import { Element } from "@/src/libs/types";

type ProjectItemProps = {
  element: Element;
  selectedElement: Element | null;
  setSelectedElement: React.Dispatch<React.SetStateAction<Element | null>>;
  setElements: React.Dispatch<React.SetStateAction<Element[]>>;
  elements: Element[];
  editingElement: Element | null;
  setEditingElement: React.Dispatch<React.SetStateAction<Element | null>>;
  deletingElement: Element | null;
  setDeletingElement: React.Dispatch<React.SetStateAction<Element | null>>;
};

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

  const handleElementClick = () => {
    setSelectedElement(element);
    setProjectId(element.projectId);
    setProjectName(element.projectName);
    setGraphName(element.graphName);
  };

  const handleIconClick1 = () => {
    setEditingElement(element);
  };

  return (
    <div
      data-testid="select-existing-project-modal"
      className={`flex justify-between items-center text-black p-2 cursor-pointer ${
        selectedElement?.projectId === element.projectId ? "bg-gray-200" : ""
      }`}
      onClick={handleElementClick}
    >
      {editingElement && editingElement.projectId === element.projectId ? (
        <EditForm
          element={element}
          setEditingElement={setEditingElement}
          setElements={setElements}
          elements={elements}
        />
      ) : (
        <span>{element.projectName}</span>
      )}
      <div className="flex">
        <LuPenSquare onClick={handleIconClick1} />
        <DeleteModal
          element={element}
          deletingElement={deletingElement}
          setDeletingElement={setDeletingElement}
          setElements={setElements}
          elements={elements}
        />
      </div>
    </div>
  );
};

export default ProjectItem;
