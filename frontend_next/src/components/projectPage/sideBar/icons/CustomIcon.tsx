import { ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline";
import React from "react";

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
      collapsed={collapsed}
      icon={ClipboardDocumentCheckIcon}
      projectId={projectId}
      type="Custom"
    />
  );
}
