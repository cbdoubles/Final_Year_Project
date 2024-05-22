import React, { useState } from "react";
import { UserCircleIcon, UserPlusIcon, UserMinusIcon } from "@heroicons/react/24/outline";

export default function SwitchMode() {
  // State to manage the current icon
  const [isUserPlus, setIsUserPlus] = useState(true);
  
  // State to manage the current mode name
  const [modeName, setModeName] = useState("Switch to Basic Mode");

  // Function to handle the icon switch and mode name change
  const handleSwitchMode = () => {
    setIsUserPlus(prevState => !prevState);
    setModeName(prevName => (prevName === "Switch to Basic Mode" ? "Switch to Advanced Mode" : "Switch to Basic Mode"));
  };

  const LinkIcon = isUserPlus ? UserPlusIcon : UserMinusIcon;

  return (
    <a
      onClick={handleSwitchMode}
      className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium text-black hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
    >
      <LinkIcon className="w-6" />
      <p className="hidden md:block">{modeName}</p>
    </a>
  );
}
