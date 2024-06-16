import React, { useState } from "react";
import { FolderType } from "@/src/libs/types";

interface SelectProps {
  handleClick: () => void;
  collapsed?: boolean;
  type: FolderType;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; // Updated icon prop type
}

const QueryIconButton: React.FC<SelectProps> = ({
  handleClick,
  collapsed,
  type,
  icon: Icon,
}) => {
  return (
    <>
      <button
        onClick={handleClick}
        className="w-full flex relative h-[48px] grow items-center justify-start gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium text-black hover:bg-sky-100 hover:text-blue-600 md:justify-start md:p-2 md:px-3"
      >
        <Icon className="w-6" />
        {!collapsed && (
          <p className="hidden md:block text-left truncate overflow-ellipsis absolute right-[12px] left-[44px]">
            {type}
          </p>
        )}
      </button>
    </>
  );
};

export default QueryIconButton;
