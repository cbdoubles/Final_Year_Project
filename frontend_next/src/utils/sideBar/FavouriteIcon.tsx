import React, { useState } from "react";
import { StarIcon } from "@heroicons/react/24/outline";
import QueryIcon from "./QueryIcon";

export default function FavoriteIcon({ collapsed, projectId }: { collapsed: boolean, projectId: number }) {
  return <QueryIcon type="Favorite" icon={StarIcon} collapsed={collapsed} projectId={projectId} />;
}
