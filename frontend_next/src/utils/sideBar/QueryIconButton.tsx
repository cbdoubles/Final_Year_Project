import React from "react";
import { FolderType } from "@/src/libs/types";
import UIButton, { UIButtonProps } from "@/src/utils/ui/UIButton";

/**
 * @description
 * QueryIconButton Component
 * This component renders a button with an icon. If the provided icon is not UIButton, it renders a standard button with the icon and type label.
 * Otherwise, it renders the UIButton component. This allows for a flexible implementation that can adapt based on the provided icon.
 *
 * @props
 * @param {Function} handleClick - Function to be called when the button is clicked.
 * @param {boolean} [collapsed=false] - State to control the visibility of the type label. If true, the label is hidden.
 * @param {FolderType} type - The type of folder, used as the label next to the icon when not collapsed.
 * @param {React.ComponentType<React.SVGProps<SVGSVGElement>> | React.FunctionComponent<UIButtonProps>} icon - The icon to be displayed on the button. Can be a standard SVG icon or a UIButton.
 *
 */

interface SelectProps {
  handleClick: () => void;
  collapsed?: boolean;
  type: FolderType;
  icon:
    | React.ComponentType<React.SVGProps<SVGSVGElement>>
    | React.FunctionComponent<UIButtonProps>;
}

const QueryIconButton: React.FC<SelectProps> = ({
  collapsed,
  type,
  icon: Icon,
  handleClick,
}) => {
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
