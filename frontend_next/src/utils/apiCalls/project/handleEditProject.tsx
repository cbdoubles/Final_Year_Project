import { ProjectType } from "@/src/libs/types";
import { toast } from "react-toastify";

export const handleEditSubmit = async (
  projectId: number,
  projectName: string
): Promise<ProjectType> => {
  const formData = new FormData();
  formData.append("name", projectName);

  const response = await fetch(
    `http://localhost:8000/api/projects/${projectId}/`,
    {
      method: "PATCH",
      body: formData,
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Unknown error");
  }

  const updatedProject: ProjectType = await response.json();
  return updatedProject;
};