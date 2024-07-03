import { ProjectType } from "@/src/libs/types";

/**
 * Upload file to a project
 *
 * @description
 * This function uploads a file to a specified project on the server. It returns the updated project
 * object if the upload is successful, or throws an error if it fails.
 *
 * @param {number} projectId - The ID of the project to upload the file to.
 * @param {File} selectedFile - The file to be uploaded.
 * @param {string} fileName - The name of the file to be saved.
 * @returns {Promise<ProjectType>} A promise that resolves to the updated project object if the upload is successful.
 * @throws {Error} Throws an error if the upload fails.
 */
export async function uploadFile(
  projectId: number,
  selectedFile: File,
  fileName: string
): Promise<ProjectType> {
  const formData = new FormData();
  formData.append("file", selectedFile);
  formData.append("file_name", fileName);

  try {
    const response = await fetch(
      `http://localhost:8000/api/projects/${projectId}/`,
      {
        method: "PATCH",
        body: formData,
      }
    );

    const result = await response.json();

    if (response.ok) {
      const project: ProjectType = {
        projectId: Number(result.id),
        projectName: result.name,
        graphName: result.file_name,
      };

      return project;
    } else {
      throw new Error("Failed to upload file");
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}
