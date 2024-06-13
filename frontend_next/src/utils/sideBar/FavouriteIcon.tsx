import React, { useState } from "react";
import { StarIcon } from "@heroicons/react/24/outline";
import QueryIcon from "./QueryIcon";
import FolderQueries from "./FolderQueries";

export default function FavoriteIcon({ collapsed }: { collapsed: boolean }) {
  return (
    <FolderQueries type="Favorite" icon={StarIcon} collapsed={collapsed} />
  );
}
