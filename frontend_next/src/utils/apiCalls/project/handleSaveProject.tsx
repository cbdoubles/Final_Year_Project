import { toast } from "react-toastify";

import { DB_URL } from "@/src/libs/constants";
import { ProjectType } from "@/src/libs/types";

/**
 * Handle save project
 *
 * @description
 * This function creates a new project on the server. It uploads a file, assigns a name to the file, and sets the project name.
 * It returns the created project object if successful, or throws an error if it fails.
 *
 * @param {File} selectedFile - The file to be uploaded.
 * @param {string} fileName - The name of the file to be saved.
 * @param {string} newProjectName - The name of the new project.
 * @returns {Promise<ProjectType>} A promise that resolves to the created project object if the upload is successful.
 * @throws {Error} Throws an error if the upload fails.
 */
const handleSaveProject = async (
  selectedFile: File,
  fileName: string,
  newProjectName: string
): Promise<ProjectType> => {
  const formData = new FormData();
  formData.append("file", selectedFile);
  formData.append("file_name", fileName);
  formData.append("name", newProjectName);

  const response = await fetch(`${DB_URL}/api/projects/`, {
    method: "POST",
    body: formData,
  });

  const result = await response.json();

  if (response.ok) {
    const project: ProjectType = {
      projectId: Number(result.id),
      projectName: result.name,
      graphName: result.file_name,
    };

    return project;
  } else {
    console.error("Error in response:", result);
    throw new Error(result.error || "Project name already in use");
  }
};

export default handleSaveProject;
