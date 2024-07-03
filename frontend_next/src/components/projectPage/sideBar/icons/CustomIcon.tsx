import { ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline";
import React from "react";

import QueryIcon from "../../../../utils/sideBar/QueryIcon";

/**
 * CustomIcon Component
 *
 * @description
 * Renders a custom icon using the QueryIcon component. This component is specifically designed to represent a custom item,
 * such as a document or a specific type of file, in the UI. It utilizes the ClipboardDocumentCheckIcon from Heroicons
 * to symbolize the custom status or action.
 *
 * @props
 * @param {boolean} collapsed - Indicates if the sidebar or container holding the icon is collapsed, affecting the icon's visibility or style.
 * @param {number} projectId - The ID of the project associated with the custom icon. This can be used to apply specific actions or navigate to the project.
 */

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
