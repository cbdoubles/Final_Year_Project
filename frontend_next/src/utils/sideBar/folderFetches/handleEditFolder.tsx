import { QueryFolderType } from "@/src/libs/types";
// import { useProjectProps } from "@/src/contexts/ProjectContext";

export const handleEditFolder = async (
  event: React.FormEvent,
  element: QueryFolderType,
  setEditingElement: React.Dispatch<
    React.SetStateAction<QueryFolderType | null>
  >,
  setElements: React.Dispatch<React.SetStateAction<QueryFolderType[]>>,
  elements: QueryFolderType[],
  prevElementState: QueryFolderType
): Promise<void> => {
  event.preventDefault();
  setEditingElement(null);

  try {
    const formData = new FormData();
    formData.append("name", element.folderName);
    console.log("starting to handle");

    const response = await fetch(
      `http://localhost:8000/api/projects/${element.folderId}/`,
      {
        method: "PATCH",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Unknown error");
    }
  } catch (error) {
    console.error("Error updating project name:", error);

    const updatedElements = elements.map((el) =>
      el.folderId === prevElementState.folderId ? prevElementState : el
    );
    setElements(updatedElements);
    console.log(updatedElements);
  }
};
