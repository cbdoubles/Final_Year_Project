import { toast } from "react-toastify";
import { ProjectType } from "@/src/libs/types";

const handleSaveProject = async (
  selectedFile: File,
  fileName: string,
  newProjectName: string
): Promise<ProjectType> => {
  const formData = new FormData();
  formData.append("file", selectedFile);
  formData.append("file_name", fileName);
  formData.append("name", newProjectName);

  try {
    const response = await fetch(`http://localhost:8000/api/projects/`, {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (response.ok) {
      console.log("File saved:", result);

      const project: ProjectType = {
        projectId: Number(result.id),
        projectName: result.name,
        graphName: result.file_name,
      };

      return project;
    } else {
      console.error("Error in response:", result);
      toast.error(result.error || "Project name already in use");
      throw new Error(result.error || "Project name already in use");
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    toast.error("Error uploading file");
    throw error;
  }
};

export default handleSaveProject;