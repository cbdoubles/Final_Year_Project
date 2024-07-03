import { UserPlusIcon, UserMinusIcon } from "@heroicons/react/24/outline";
import React from "react";

import { useProps } from "@/src/contexts/PropsContext";

/**
 * SwitchModeIcon Component
 *
 * @description
 * This component renders a button to switch between advanced and basic modes. It displays different icons and text
 * based on the current mode. The component uses the advancedMode and setAdvancedMode values from PropsContext.
 *
 * @props
 * @param {boolean} collapsed - Boolean prop to control if the sidebar is collapsed.
 */
export default function SwitchModeIcon({ collapsed }: { collapsed: boolean }) {
  const { advancedMode, setAdvancedMode } = useProps();

  const LinkIcon = advancedMode ? UserPlusIcon : UserMinusIcon;
  const modeName = advancedMode
    ? "Switch to Basic Mode"
    : "Switch to Advanced Mode";

  /**
   * Render the component
   *
   * @description
   * Renders a button that toggles the advanced mode. The button includes an icon and a text label
   * that change based on the current mode. The text label is only displayed when the sidebar is not collapsed.
   *
   * @returns {JSX.Element} The rendered button component.
   */
  return (
    <button
      className="w-full flex h-[48px] relative grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium text-black hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
      onClick={() => setAdvancedMode(!advancedMode)}
    >
      <LinkIcon className="w-6" />
      {!collapsed && (
        <p className="hidden md:block text-left truncate overflow-ellipsis absolute right-[12px] left-[44px]">
          {modeName}
        </p>
      )}
    </button>
  );
}
