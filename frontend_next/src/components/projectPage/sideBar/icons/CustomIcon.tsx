import React from "react";
import { ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline";
import QueryIcon from "../../../../utils/sideBar/QueryIcon";

//Defininig the component variables
export default function CustomIcon({
  collapsed,
  projectId,
}: {
  collapsed: boolean;
  projectId: number;
}) {
  //Return the QueryIcon component with the Custom type and ClipboardDocumentCheckIcon
  return (
    <QueryIcon
      type="Custom"
      icon={ClipboardDocumentCheckIcon}
      collapsed={collapsed}
      projectId={projectId}
    />
  );
}
