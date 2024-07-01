import React, { useState } from "react";
import UIButton from "@/src/utils/ui/UIButton";
import QueryIcon from "@/src/utils/sideBar/QueryIcon";
import { FolderType } from "@/src/libs/types";

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
  return (
    <QueryIcon
      type={type}
      icon={UIButton}
      projectId={projectId}
      onCloseSelectFolder={onCloseSelectFolder}
      onCloseChooseProject={onCloseChooseProject}
    />
  );
}
