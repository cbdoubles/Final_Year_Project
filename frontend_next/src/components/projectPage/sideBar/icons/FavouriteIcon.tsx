import { StarIcon } from "@heroicons/react/24/outline";
import React from "react";

import QueryIcon from "../../../../utils/sideBar/QueryIcon";

/**
 * FavoriteIcon Component
 *
 * @description
 * Renders a favorite icon using the QueryIcon component. This component is designed to visually represent a favorite item,
 * such as a project or a file, in the UI. It uses the StarIcon from Heroicons to symbolize the favorite status.
 *
 * @props
 * @param {boolean} collapsed - Indicates if the sidebar or container holding the icon is collapsed.
 * @param {number} projectId - The ID of the project associated with the favorite icon.
 */

export default function FavoriteIcon({
  collapsed,
  projectId,
}: {
  collapsed: boolean;
  projectId: number;
}) {
  return (
    <div data-testid="favorite-button">
      <QueryIcon
        collapsed={collapsed}
        icon={StarIcon}
        projectId={projectId}
        type="Favorite"
      />
    </div>
  );
}
