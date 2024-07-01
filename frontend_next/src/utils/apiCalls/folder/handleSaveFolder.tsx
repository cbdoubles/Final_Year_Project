import { QueryFolderType, FolderType, QueryType } from "@/src/libs/types";
import { toast } from "react-toastify";

export const handleSaveFolder = async (
  foldeName: string,
  folderType: FolderType,
  projectId: number
): Promise<QueryFolderType | null> => {
  try {
    const response = await fetch(`http://localhost:8000/api/folders/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        project: projectId,
        name: foldeName,
        type: folderType,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Unknown error");
    }
    console.log("Saved folder in backend");
    console.log(response);

    const responseData = await response.json();
    const newFolder: QueryFolderType = {
      folderId: responseData.id,
      folderName: responseData.name,
      folderType: responseData.type,
    };
    console.log("newfolder in handlesave");
    console.log(newFolder);

    return newFolder; // Return true if update was successful
  } catch (error) {
    console.error("Error saving folder:", error);
    toast.error("Folder name already in use");
    return null; // Return false if any error occurs during update
  }
  return null;
};
