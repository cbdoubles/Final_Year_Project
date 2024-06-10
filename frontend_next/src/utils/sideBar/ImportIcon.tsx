import { ArrowDownTrayIcon } from "@heroicons/react/24/outline"
import Link from "next/link"

//Detail for icon
const properties = {
  name: "Import",
  href: "/Import",
  icon: ArrowDownTrayIcon 
}

export default function ImportIcon({ collapsed }: { collapsed: boolean }) {
  const ImportIcon = properties.icon
  return (
    <Link
      key={properties.name}
      href={properties.href}
      className="flex h-[48px] grow items-center justify-center relative gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium text-black hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
    >
      <ImportIcon className="w-6" />
      {!collapsed && (
        <p className="hidden md:block text-left truncate overflow-ellipsis absolute right-[12px] left-[44px]">
      
        </p>
      )}
    </Link>
  )
}
