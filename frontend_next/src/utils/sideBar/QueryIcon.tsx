import React, { useState } from "react"
import FolderTest from "@/src/components/favouriteFolder/FolderTest"
import { GlobeAsiaAustraliaIcon } from "@heroicons/react/24/outline"

// Detail for icon (assuming this was meant to be here based on previous context)
const properties = {
  name: "Default",
  icon: GlobeAsiaAustraliaIcon
}

interface Item {
  employee: string
  favorites: string[]
}

interface SelectProps {
  items: Item[]
  type: "Default" | "Custom" | "Favorite"
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>> // Updated icon prop type
}

const QueryFolderIcon: React.FC<SelectProps> = ({
  items,
  type,
  icon: Icon
}) => {
  const [showSelect, setShowSelect] = useState(false)

  const handleClick = () => {
    setShowSelect(true)
  }

  const handleClose = () => {
    setShowSelect(false)
  }

  return (
    <>
      <button
        onClick={handleClick}
        className="w-full flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium text-black hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
      >
        <Icon className="w-6" />
        <p className="hidden md:block">{type}</p>
      </button>
      {showSelect && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-show">
          <div className="bg-white p-5 rounded shadow-lg relative">
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
            >
              X
            </button>
            <FolderTest
              title={`Select a ${type} query`}
              items={items}
              type="default"
            />
          </div>
        </div>
      )}
    </>
  )
}

export default QueryFolderIcon
