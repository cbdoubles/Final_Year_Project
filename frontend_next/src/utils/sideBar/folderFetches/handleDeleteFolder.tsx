import { QueryFolderType } from "@/src/libs/types";

export const handleDeleteFolder = async (
  deletingElement: QueryFolderType | null,
  setDeletingElement: React.Dispatch<React.SetStateAction<QueryFolderType | null>>,
  setElements: React.Dispatch<React.SetStateAction<QueryFolderType[]>>,
  elements: QueryFolderType[]
): Promise<void> => {
  if (deletingElement) {
    // try {
    //   const response = await fetch(
    //     `http://localhost:8000/api/projects/${deletingElement.projectId}/`,
    //     {
    //       method: "DELETE",
    //     }
    //   );

    //   if (!response.ok) {
    //     const errorData = await response.json();
    //     throw new Error(errorData.error || "Unknown error");
    //   } else {
    //     const updatedElements = elements.filter(
    //       (el) => el.projectId !== deletingElement.projectId
    //     );
    //     setElements(updatedElements);
    //     setDeletingElement(null);
    //   }
    // } catch (error) {
    //   console.error("Error deleting project:", error);
    // }
    const updatedElements = elements.filter(
      (el) => el.folderId !== deletingElement.folderId
    );
    setElements(updatedElements);
    setDeletingElement(null);
  }
};
