import React, { useState } from "react";
import { FolderType } from "@/src/libs/types";
import UIButton, { UIButtonProps } from "@/src/utils/ui/UIButton";

interface SelectProps {
  handleClick: () => void;
  collapsed?: boolean;
  type: FolderType;
  icon:
    | React.ComponentType<React.SVGProps<SVGSVGElement>>
    | React.FunctionComponent<UIButtonProps>; // Updated icon prop type
}

const QueryIconButton: React.FC<SelectProps> = ({
  handleClick,
  collapsed,
  type,
  icon: Icon,
}) => {
  console.log("printing type");
  console.log(type);
  return (
    <>
      {UIButton !== Icon ? (
        <button
          onClick={handleClick}
          className="w-full flex relative h-12 items-center justify-start gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium text-black hover:bg-sky-100 hover:text-blue-600 md:justify-start md:p-2 md:px-3"
        >
          <div className="flex items-center gap-2">
            <Icon className="w-6" />
            {!collapsed && (
              <p className="hidden md:block text-left truncate overflow-ellipsis">
                {type}
              </p>
            )}
          </div>
        </button>
      ) : (
        <Icon onClick={handleClick}>Select type</Icon>
      )}
    </>
  );
};

export default QueryIconButton;
