import React from "react";
import { ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline";
import QueryIcon from "./QueryIcon";

export default function CustomIcon({ collapsed }: { collapsed: boolean }) {
  return (
    <QueryIcon
      type="Custom"
      icon={ClipboardDocumentCheckIcon}
      collapsed={collapsed}
    />
  );
}
