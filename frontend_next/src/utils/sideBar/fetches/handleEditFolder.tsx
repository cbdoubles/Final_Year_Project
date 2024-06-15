import { QueryFolderType } from "@/src/libs/types";
import { toast } from "react-toastify";

export const handleEditFolder = async (
  folder: QueryFolderType,
  prevElementState: QueryFolderType
): Promise<QueryFolderType> => {
  try {
    const formData = new FormData();
    formData.append("name", folder.folderName);

    const response = await fetch(
      `http://localhost:8000/api/folders/${folder.folderId}/`,
      {
        method: "PATCH",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Unknown error");
    } else {
      console.log("update sent and fine");
      console.log(folder);
      return folder;
    }
  } catch (error) {
    console.error("Error updating project name:", error);
    toast.error("Name already in use");
    return prevElementState;
  }
};
