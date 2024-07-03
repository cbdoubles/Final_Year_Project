import React from "react";

import { FolderType } from "@/src/libs/types";
import QueryIcon from "@/src/utils/sideBar/QueryIcon";
import UIButton from "@/src/utils/ui/UIButton";

/**
 * ImportQueriesFolders Component
 *
 * @description
 * This component renders the `QueryIcon` component with the provided folder type, project ID,
 * and callback functions for closing folder selection and project selection.
 *
 * @props
 * @param {FolderType} type - The type of folder (e.g., Custom, Favorite).
 * @param {number} projectId - The ID of the project.
 * @param {() => void} onCloseSelectFolder - Callback function to handle closing the folder selection.
 * @param {() => void} onCloseChooseProject - Callback function to handle closing the project selection.
 */
export default function ImportQueriesFolders({
  type,
  projectId,
  onCloseSelectFolder,
  onCloseChooseProject,
}: {
  type: FolderType;
  projectId: number;
  onCloseSelectFolder: () => void;
  onCloseChooseProject: () => void;
}) {
  /**
   * Render the component
   *
   * @description
   * Renders the `QueryIcon` component with the provided props.
   *
   * @returns {JSX.Element} The rendered `QueryIcon` component.
   */
  return (
    <QueryIcon
      icon={UIButton}
      projectId={projectId}
      type={type}
      onCloseChooseProject={onCloseChooseProject}
      onCloseSelectFolder={onCloseSelectFolder}
    />
  );
}
