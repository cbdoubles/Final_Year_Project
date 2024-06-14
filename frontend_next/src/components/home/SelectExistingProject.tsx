import React, { useState, useEffect } from "react";
import ProjectItem from "./selectExistingProject/ProjectItem";
import { Element } from "@/src/libs/types";
import { fetchElements } from "@/src/utils/home/selectExistingProject/fetchProjects";

type SelectExistingProjectProps = {};

const SelectExistingProject: React.FC<SelectExistingProjectProps> = ({}) => {
  const [elements, setElements] = useState<Element[]>([]);
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);
  const [editingElement, setEditingElement] = useState<Element | null>(null);
  const [deletingElement, setDeletingElement] = useState<Element | null>(null);

  useEffect(() => {
    onLoad();
  }, []);

  const onLoad = async () => {
    const result = await fetchElements();

    if (result) {
      setElements(result);
    }
  };

  return (
    <div>
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
