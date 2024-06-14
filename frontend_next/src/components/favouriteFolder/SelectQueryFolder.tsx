import React from "react";
import GenericListDisplay from "@/src/components/home/selectExistingProject/GenericListDisplay";
import { fetchFolders } from "@/utils/sideBar/folderFetches/fetchFolders";
import { handleEditFolder } from "@/utils/sideBar/folderFetches/handleEditFolder";
import { handleDeleteFolder } from "@/utils/sideBar/folderFetches/handleDeleteFolder";
import { ProjectType, QueryFolderType } from "@/src/libs/types";

interface SelectQueryFolderProps {
  projectId: number;
  type: string;
}

const SelectQueryFolder = ({ projectId, type }: SelectQueryFolderProps) => {
  const handleElementClick = (element: QueryFolderType) => {
    // Custom click logic, if needed
    console.log("Element clicked:", element);
  };

  const handleEditSubmit = (
    event: React.FormEvent,
    element: QueryFolderType,
    setEditingElement: React.Dispatch<
      React.SetStateAction<QueryFolderType | null>
    >,
    setElements: React.Dispatch<React.SetStateAction<QueryFolderType[]>>,
    elements: QueryFolderType[],
    prevStateElement: QueryFolderType
  ) => {
    // Custom edit submit logic
    // const setProjectName = (name: string) => {
    //   console.log("Project name set to:", name);
    // };
    handleEditFolder(
      event,
      element,
      setEditingElement,
      setElements,
      elements,
      prevStateElement // Using element itself as the previous state for simplicity
    );
  };

  const handleDeleteConfirm = (
    deletingElement: QueryFolderType | null,
    setDeletingElement: React.Dispatch<
      React.SetStateAction<QueryFolderType | null>
    >,
    setElements: React.Dispatch<React.SetStateAction<QueryFolderType[]>>,
    elements: QueryFolderType[]
  ) => {
    // Custom delete confirm logic
    handleDeleteFolder(
      deletingElement,
      setDeletingElement,
      setElements,
      elements
    );
  };

  const renderElementName = (element: QueryFolderType) => element.folderName;

  const getPropertyValue = (element: QueryFolderType) => element.folderId;

  return (
    <GenericListDisplay<QueryFolderType>
      fetchElements={(setElements) =>
        fetchFolders(setElements, projectId, type)
      }
      onElementClick={handleElementClick}
      onEditSubmit={handleEditSubmit}
      onDeleteConfirm={handleDeleteConfirm}
      renderElementName={renderElementName}
      propertyName="folderName"
      getPropertyValue={getPropertyValue}
      propertyKey="folderId"
    />
  );
};

export default SelectQueryFolder;
