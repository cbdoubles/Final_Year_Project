import React from "react";
import { ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline";
import QueryIcon from "../../../../utils/sideBar/QueryIcon";

export default function CustomIcon({
  collapsed,
  projectId,
}: {
  collapsed: boolean;
  projectId: number;
}) {
  return (
    <QueryIcon
      type="Custom"
      icon={ClipboardDocumentCheckIcon}
      collapsed={collapsed}
      projectId={projectId}
    />
  );
}
