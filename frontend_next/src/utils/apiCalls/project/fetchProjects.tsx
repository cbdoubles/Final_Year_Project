import { DB_URL } from "@/src/libs/constants";
import { ProjectType, ProjectTypeFetch } from "@/src/libs/types";

/**
 * Fetch projects
 *
 * @description
 * This function fetches the list of projects from the server. It transforms the fetched data
 * into an array of ProjectType objects.
 *
 * @returns {Promise<ProjectType[]>} A promise that resolves to an array of ProjectType objects.
 */
export const fetchProjects = async () => {
  try {
    const response = await fetch(`${DB_URL}/api/projects/`);
    const data: ProjectTypeFetch[] = await response.json();

    const transformedData: ProjectType[] = data.map((project) => ({
      projectId: Number(project.id),
      projectName: project.name,
      graphName: project.file_name,
    }));

    return transformedData;
  } catch (error) {
    console.error("Error fetching elements:", error);
  }
};
