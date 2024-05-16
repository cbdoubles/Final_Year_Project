import { SelectGroupInterface } from "@/src/libs/interfaces"
import { useState, MouseEvent } from "react"
import { LuTrash2 } from "react-icons/lu"

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
    <div className={"bg-sky-500"}>
      <button
        onClick={() => setOpen(!open)}
        className="cursor-pointer text-white"
      >
        {item.employee}
      </button>
      {item.favorites.length > 0 && open && (
        <div className="w-full">
          {item.favorites.map((favorite, key) => (
            <button
              className={`w-full flex items-center px-10 justify-between ${
                key % 2 === 0 ? "bg-sky-200" : "bg-white"
              }`}
              key={favorite}
              onClick={handlerClick}
            >
              <p className="cursor-pointer text-black">{favorite}</p>
              <LuTrash2
                className="mr-10 text-black"
                onClick={() => handlerTrashClick(favorite)}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default SelectGroup
