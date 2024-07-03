import { ProjectType } from "@/src/libs/types";

/**
 * Handle edit submit
 *
 * @description
 * This function updates the name of a specified project on the server. It returns the updated project object if successful,
 * or throws an error if the update fails.
 *
 * @param {number} projectId - The ID of the project to be updated.
 * @param {string} projectName - The new name of the project.
 * @returns {Promise<ProjectType>} A promise that resolves to the updated project object if the update is successful.
 * @throws {Error} Throws an error if the update fails.
 */
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
