import React from "react"
import { UserPlusIcon, UserMinusIcon } from "@heroicons/react/24/outline"
import { useProps } from "@/src/contexts/PropsContext"
import Link from "next/link"
import Button from "../Button"

export default function SwitchModeIcon() {
  const { advancedMode, setAdvancedMode } = useProps()

  const LinkIcon = advancedMode ? UserPlusIcon : UserMinusIcon
  const modeName = advancedMode
    ? "Switch to Basic Mode"
    : "Switch to Advanced Mode"

  return (
    <button
      onClick={() => setAdvancedMode(!advancedMode)}
      className="w-full flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium text-black hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
    >
      <LinkIcon className="w-6" />
      <p className="hidden md:block">{modeName}</p>
    </button>
  )
}
