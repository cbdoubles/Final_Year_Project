import React, { useState } from "react";
import { StarIcon } from "@heroicons/react/24/outline";
import QueryIcon from "./QueryIcon";

export default function FavoriteIcon({ collapsed }: { collapsed: boolean }) {
  return <QueryIcon type="Favorite" icon={StarIcon} collapsed={collapsed} />;
}
