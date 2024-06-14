// // ProjectItem.tsx
// import React from "react";
// import { LuTrash2, LuPenSquare } from "react-icons/lu";
// import EditForm from "./EditForm";
// import DeleteModal from "./DeleteModal";
// import { useProjectProps } from "@/src/contexts/ProjectContext";
// import { Element } from "@/src/libs/types";

// type ProjectItemProps = {
//   element: Element;
//   selectedElement: Element | null;
//   setSelectedElement: React.Dispatch<React.SetStateAction<Element | null>>;
//   setElements: React.Dispatch<React.SetStateAction<Element[]>>;
//   elements: Element[];
//   editingElement: Element | null;
//   setEditingElement: React.Dispatch<React.SetStateAction<Element | null>>;
//   deletingElement: Element | null;
//   setDeletingElement: React.Dispatch<React.SetStateAction<Element | null>>;
// };

// const ProjectItem: React.FC<ProjectItemProps> = ({
//   element,
//   selectedElement,
//   setSelectedElement,
//   setElements,
//   elements,
//   editingElement,
//   setEditingElement,
//   deletingElement,
//   setDeletingElement,
// }) => {
//   const { setProjectId, setProjectName } = useProjectProps();

//   const handleElementClick = () => {
//     setSelectedElement(element);
//     setProjectId(element.projectId);
//     setProjectName(element.projectName);
//   };

//   const handleIconClick1 = () => {
//     setEditingElement(element);
//   };

//   return (
//     <div
//       data-testid="select-existing-project-modal"
//       className={`flex justify-between items-center text-black p-2 cursor-pointer ${
//         selectedElement?.projectId === element.projectId ? "bg-gray-200" : ""
//       }`}
//       onClick={handleElementClick}
//     >
//       {editingElement && editingElement.projectId === element.projectId ? (
//         <EditForm
//           element={element}
//           setEditingElement={setEditingElement}
//           setElements={setElements}
//           elements={elements}
//         />
//       ) : (
//         <span>{element.projectName}</span>
//       )}
//       <div className="flex">
//         <LuPenSquare onClick={handleIconClick1} />
//         <DeleteModal
//           element={element}
//           deletingElement={deletingElement}
//           setDeletingElement={setDeletingElement}
//           setElements={setElements}
//           elements={elements}
//         />
//       </div>
//     </div>
//   );
// };

// export default ProjectItem;

import React from "react";
import { LuTrash2, LuPenSquare } from "react-icons/lu";
import EditForm from "./EditForm";
import DeleteModal from "./DeleteModal";

export type ProjectItemProps<T> = {
  element: T;
  selectedElement: T | null;
  setSelectedElement: React.Dispatch<React.SetStateAction<T | null>>;
  setElements: React.Dispatch<React.SetStateAction<T[]>>;
  elements: T[];
  editingElement: T | null;
  setEditingElement: React.Dispatch<React.SetStateAction<T | null>>;
  deletingElement: T | null;
  setDeletingElement: React.Dispatch<React.SetStateAction<T | null>>;
  onElementClick?: (element: T) => void;
  onEditSubmit: (
    event: React.FormEvent,
    element: T,
    setEditingElement: React.Dispatch<React.SetStateAction<T | null>>,
    setElements: React.Dispatch<React.SetStateAction<T[]>>,
    elements: T[],
    prevStateElement: T
    // setProjectName: (name: string) => void
  ) => void;
  onDeleteConfirm: (
    deletingElement: T | null,
    setDeletingElement: React.Dispatch<React.SetStateAction<T | null>>,
    setElements: React.Dispatch<React.SetStateAction<T[]>>,
    elements: T[]
  ) => void;
  renderElementName: (element: T) => string;
  propertyKey: keyof T;
  propertyName: keyof T;
  getPropertyValue: (element: T) => number;
};

function ProjectItem<T>({
  element,
  selectedElement,
  setSelectedElement,
  setElements,
  elements,
  editingElement,
  setEditingElement,
  deletingElement,
  setDeletingElement,
  onElementClick,
  onEditSubmit,
  onDeleteConfirm,
  renderElementName,
  propertyKey,
  propertyName,
  getPropertyValue,
}: ProjectItemProps<T>) {
  const handleElementClick = () => {
    setSelectedElement(element);
    if (onElementClick) {
      onElementClick(element);
    }
  };

  const handleEditOnClick = () => {
    setEditingElement(element);
  };

  return (
    <div
      data-testid="select-existing-project-modal"
      className={`flex justify-between items-center text-black p-2 cursor-pointer ${
        selectedElement?.[propertyKey] === element[propertyKey]
          ? "bg-gray-200"
          : ""
      }`}
      onClick={handleElementClick}
    >
      {editingElement?.[propertyKey] === element[propertyKey] ? (
        <EditForm
          element={element}
          setEditingElement={setEditingElement}
          setElements={setElements}
          elements={elements}
          onEditSubmit={onEditSubmit}
          propertyKey={propertyKey}
          propertyName={propertyName}
          getPropertyValue={getPropertyValue}
          renderElementName={renderElementName}
        />
      ) : (
        <span>{renderElementName(element)}</span>
      )}
      <div className="flex">
        <LuPenSquare onClick={handleEditOnClick} />
        <DeleteModal
          element={element}
          deletingElement={deletingElement}
          setDeletingElement={setDeletingElement}
          setElements={setElements}
          elements={elements}
          onDeleteConfirm={onDeleteConfirm}
        />
      </div>
    </div>
  );
}

export default ProjectItem;
