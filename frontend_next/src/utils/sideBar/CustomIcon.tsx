import React, { useState } from "react";
import { ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline";
import QueryIcon from "./QueryIcon";
import FolderQueries from "./FolderQueries";

export default function CustomICon({ collapsed }: { collapsed: boolean }) {
  return (
    <FolderQueries
      type="Custom"
      icon={ClipboardDocumentCheckIcon}
      collapsed={collapsed}
    />
  );
}
