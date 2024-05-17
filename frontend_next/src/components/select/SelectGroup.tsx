import { SelectGroupInterface } from "@/src/libs/interfaces"
import { useState, MouseEvent } from "react"
import { LuTrash2, LuFolder, LuCornerDownRight } from "react-icons/lu"

const SelectGroup = ({
  item,
  handlerClick,
  handlerTrashClick
}: {
  item: SelectGroupInterface
  handlerClick: (event: MouseEvent) => void
  handlerTrashClick: (favorite: string) => void
}) => {
  const [open, setOpen] = useState(true)

  return (
    <div className={"bg-sky-600"}>
      <button
        onClick={() => setOpen(!open)}
        className="cursor-pointer text-white flex items-center gap-1"
      >
        <LuFolder className="ml-2 text-white" />
        {item.employee}
      </button>
      {item.favorites.length > 0 && open && (
        <div className="w-full">
          {item.favorites.map((favorite, key) => (
            <div
              className={`w-full flex items-center px-8 justify-between ${
                key % 2 === 0 ? "bg-sky-100" : "bg-white"
              }`}
              key={favorite}
              onClick={handlerClick}
            >
              <button className="flex gap-1 items-center">
                <LuCornerDownRight className="text-gray-600" />
                <p className="cursor-pointer text-black capitalize">
                  {favorite}
                </p>
              </button>
              <LuTrash2
                className="mr-10 text-black"
                onClick={() => handlerTrashClick(favorite)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SelectGroup
