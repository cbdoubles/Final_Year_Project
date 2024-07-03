import React from "react";
import { UserPlusIcon, UserMinusIcon } from "@heroicons/react/24/outline";
import { useProps } from "@/src/contexts/PropsContext";
import Link from "next/link";

export default function SwitchModeIcon({ collapsed }: { collapsed: boolean }) {
  const { advancedMode, setAdvancedMode } = useProps();

  const LinkIcon = advancedMode ? UserPlusIcon : UserMinusIcon;
  const modeName = advancedMode
    ? "Switch to Basic Mode"
    : "Switch to Advanced Mode";

  return (
    <button
      onClick={() => setAdvancedMode(!advancedMode)}
      className="w-full flex h-[48px] relative grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium text-black hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
      data-testid="switch-mode-button"
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
