import React, { useState, useEffect } from "react";
import ProjectItem from "./ProjectItem";
import { ProjectType } from "@/src/libs/types";
import { fetchProjects } from "@/src/utils/apiCalls/project/fetchProjects";

type SelectExistingProjectProps = {};

const SelectExistingProject: React.FC<SelectExistingProjectProps> = ({}) => {
  const [elements, setElements] = useState<ProjectType[]>([]);
  const [selectedElement, setSelectedElement] = useState<ProjectType | null>(null);
  const [editingElement, setEditingElement] = useState<ProjectType | null>(null);
  const [deletingElement, setDeletingElement] = useState<ProjectType | null>(null);

  useEffect(() => {
    onLoad();
  }, []);

  const onLoad = async () => {
    const result = await fetchProjects();

    if (result) {
      setElements(result);
    }
  };

  return (
    <div className="h-auto overflow-auto">
      {elements.map((element) => (
        <ProjectItem
          key={element.projectId}
          element={element}
          selectedElement={selectedElement}
          setSelectedElement={setSelectedElement}
          setElements={setElements}
          elements={elements}
          editingElement={editingElement}
          setEditingElement={setEditingElement}
          deletingElement={deletingElement}
          setDeletingElement={setDeletingElement}
        />
      ))}
    </div>
  );
};

export default SelectExistingProject;
