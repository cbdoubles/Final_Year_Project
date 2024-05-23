// import { StarIcon } from "@heroicons/react/24/outline"
// /*import DefaultIcon from  '/public/sidebarImages/defaulticon.png';*/

// //Detail for icon
// const properties = {
//   name: "Favourite",
//   href: "/projectpage/favourite",
//   icon: StarIcon
// }

// export default function Favourite() {
//   const LinkIcon = properties.icon
//   return (
//     <a
//       key={properties.name}
//       href={properties.href}
//       className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium text-black hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
//     >
//       <LinkIcon className="w-6" />
//       <p className="hidden md:block">{properties.name}</p>
//     </a>
//   )
// }

import React, { useState } from "react"
import FolderTest from "@/src/components/favouriteFolder/FolderTest"
import { StarIcon } from "@heroicons/react/24/outline"

// Detail for icon
const properties = {
  name: "Favourite",
  icon: StarIcon
}

const items = [
  {
    employee: "Szymon",
    favorites: ["favourite1", "favourite2", "favourite3", "favourite4"]
  },
  { employee: "Geri", favorites: ["favourite1", "favourite2"] },
  { employee: "Caolán", favorites: ["favourite1"] }
]

export default function Favourite() {
  const [showSelect, setShowSelect] = useState(false)
  const LinkIcon = properties.icon

  const handleClick = () => {
    setShowSelect(true)
  }

  const handleClose = () => {
    setShowSelect(false)
  }

  return (
    <>
      <a
        key={properties.name}
        onClick={handleClick}
        className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium text-black hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
      >
        <LinkIcon className="w-6" />
        <p className="hidden md:block">{properties.name}</p>
      </a>
      {showSelect && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-5 rounded shadow-lg relative">
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
            >
              X
            </button>
            <FolderTest
              title="Select a Favorite query"
              items={items}
              type="favorite"
            />
          </div>
        </div>
      )}
    </>
  )
}
