// import React, { useState, useEffect } from "react";
// import ProjectItem from "./selectExistingProject/ProjectItem";
// import { Element } from "@/src/libs/types";
// import { fetchElements } from "@/src/utils/home/selectExistingProject/fetchProjects";

// type SelectExistingProjectProps = {};

// const SelectExistingProject: React.FC<SelectExistingProjectProps> = ({}) => {
//   const [elements, setElements] = useState<Element[]>([]);
//   const [selectedElement, setSelectedElement] = useState<Element | null>(null);
//   const [editingElement, setEditingElement] = useState<Element | null>(null);
//   const [deletingElement, setDeletingElement] = useState<Element | null>(null);

//   useEffect(() => {
//     fetchElements(setElements);
//   }, []);

//   return (
//     <div>
//       {elements.map((element) => (
//         <ProjectItem
//           key={element.projectId}
//           element={element}
//           selectedElement={selectedElement}
//           setSelectedElement={setSelectedElement}
//           setElements={setElements}
//           elements={elements}
//           editingElement={editingElement}
//           setEditingElement={setEditingElement}
//           deletingElement={deletingElement}
//           setDeletingElement={setDeletingElement}
//         />
//       ))}
//     </div>
//   );
// };

// export default SelectExistingProject;

import React from "react";
import GenericListDisplay from "./selectExistingProject/GenericListDisplay";
import { fetchProjects } from "@/src/utils/home/selectExistingProject/fetchProjects";
import { handleEditProject } from "@/src/utils/home/selectExistingProject/handleEditProject";
import { handleDeleteProject } from "@/src/utils/home/selectExistingProject/handleDeleteProject";
import { ProjectType } from "@/src/libs/types";
import { useProjectProps } from "@/src/contexts/ProjectContext";

const SelectExistingProject = () => {
  const { projectName, setProjectName, projectId, setProjectId } =
    useProjectProps();

  const handleElementClick = (element: ProjectType) => {
    // Custom click logic, if needed
    console.log("Element clicked:", element);
    setProjectId(element.projectId);
    setProjectName(element.projectName);
  };

  const handleEditSubmit = (
    event: React.FormEvent,
    element: ProjectType,
    setEditingElement: React.Dispatch<React.SetStateAction<ProjectType | null>>,
    setElements: React.Dispatch<React.SetStateAction<ProjectType[]>>,
    elements: ProjectType[],
    prevStateElement: ProjectType
  ) => {
    // Custom edit submit logic
    // const setProjectName = (name: string) => {
    //   console.log("Project name set to:", name);
    // };
    handleEditProject(
      event,
      element,
      setEditingElement,
      setElements,
      elements,
      prevStateElement, // Using element itself as the previous state for simplicity
      setProjectName
    );
  };

  const handleDeleteConfirm = (
    deletingElement: ProjectType | null,
    setDeletingElement: React.Dispatch<React.SetStateAction<ProjectType | null>>,
    setElements: React.Dispatch<React.SetStateAction<ProjectType[]>>,
    elements: ProjectType[]
  ) => {
    // Custom delete confirm logic
    handleDeleteProject(
      deletingElement,
      setDeletingElement,
      setElements,
      elements
    );
  };

  const renderElementName = (element: ProjectType) => element.projectName;

  const getPropertyValue = (element: ProjectType) => element.projectId;

  return (
    <GenericListDisplay<ProjectType>
      fetchElements={fetchProjects}
      onElementClick={handleElementClick}
      onEditSubmit={handleEditSubmit}
      onDeleteConfirm={handleDeleteConfirm}
      renderElementName={renderElementName}
      propertyName="projectName"
      getPropertyValue={getPropertyValue}
      propertyKey="projectId"
    />
  );
};

export default SelectExistingProject;
