import React, { useState } from "react";
import { StarIcon } from "@heroicons/react/24/outline";
import QueryIcon from "../../../../utils/sideBar/QueryIcon";

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
        type="Favorite"
        icon={StarIcon}
        collapsed={collapsed}
        projectId={projectId}
      />
    </div>
  );
}
