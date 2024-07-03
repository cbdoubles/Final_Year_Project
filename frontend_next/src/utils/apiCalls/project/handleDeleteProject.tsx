import React from "react";

import { ProjectType } from "@/src/libs/types";

/**
 * Handle delete confirmation
 *
 * @description
 * This function deletes a specified project from the server. If the deletion is successful,
 * it updates the elements state to remove the deleted project and resets the deletingElement state.
 *
 * @param {ProjectType | null} deletingElement - The project to be deleted.
 * @param {React.Dispatch<React.SetStateAction<ProjectType | null>>} setDeletingElement - State setter for the deleting element.
 * @param {React.Dispatch<React.SetStateAction<ProjectType[]>>} setElements - State setter for the list of projects.
 * @param {ProjectType[]} elements - The current list of projects.
 * @returns {Promise<void>} A promise that resolves when the deletion is complete.
 */
export const handleDeleteConfirm = async (
  deletingElement: ProjectType | null,
  setDeletingElement: React.Dispatch<React.SetStateAction<ProjectType | null>>,
  setElements: React.Dispatch<React.SetStateAction<ProjectType[]>>,
  elements: ProjectType[]
): Promise<void> => {
  if (deletingElement) {
    try {
      const response = await fetch(
        `http://localhost:8000/api/projects/${deletingElement.projectId}/`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Unknown error");
      } else {
        const updatedElements = elements.filter(
          (el) => el.projectId !== deletingElement.projectId
        );
        setElements(updatedElements);
        setDeletingElement(null);
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  }
};
