import { ProjectType } from "@/src/libs/types";

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
      console.log("File saved:", selectedFile.name);

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
