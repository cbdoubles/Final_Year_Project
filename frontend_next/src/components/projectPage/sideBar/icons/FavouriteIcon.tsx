import React from "react";
import { StarIcon } from "@heroicons/react/24/outline";
import QueryIcon from "../../../../utils/sideBar/QueryIcon";

//Defininig the component variables
export default function FavoriteIcon({
  collapsed,
  projectId,
}: {
  collapsed: boolean;
  projectId: number;
}) {
  //Return the QueryIcon component with the Favorite type and StarIcon
  return (
    <QueryIcon
      type="Favorite"
      icon={StarIcon}
      collapsed={collapsed}
      projectId={projectId}
    />
  );
}
