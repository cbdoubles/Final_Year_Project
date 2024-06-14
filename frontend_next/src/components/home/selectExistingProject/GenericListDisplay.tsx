import React, { useState, useEffect } from "react";
import ProjectItem, { ProjectItemProps } from "./ProjectItem";

type GenericListDisplayProps<T> = {
  fetchElements: (
    setElements: React.Dispatch<React.SetStateAction<T[]>>
  ) => void;
  onElementClick?: (element: T) => void;
  onEditSubmit: (
    event: React.FormEvent,
    element: T,
    setEditingElement: React.Dispatch<React.SetStateAction<T | null>>,
    setElements: React.Dispatch<React.SetStateAction<T[]>>,
    elements: T[],
    prevStateElement: T
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
  renderProjectItem?: (props: ProjectItemProps<T>) => JSX.Element;
};

function GenericListDisplay<T>({
  fetchElements,
  onElementClick,
  onEditSubmit,
  onDeleteConfirm,
  renderElementName,
  propertyKey,
  propertyName,
  getPropertyValue,
  renderProjectItem = (props) => <ProjectItem {...props} />,
}: GenericListDisplayProps<T>) {
  const [elements, setElements] = useState<T[]>([]);
  const [selectedElement, setSelectedElement] = useState<T | null>(null);
  const [editingElement, setEditingElement] = useState<T | null>(null);
  const [deletingElement, setDeletingElement] = useState<T | null>(null);

  useEffect(() => {
    fetchElements(setElements);
  }, [fetchElements]);

  return (
    <div>
      {elements.map((element) =>
        renderProjectItem({
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
        })
      )}
    </div>
  );
}

export default GenericListDisplay;
