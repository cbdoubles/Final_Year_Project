import SelectGroup from "@/src/components/favouriteFolder/SelectGroup"
import { MouseEvent } from "react"

const items = [
  {
    employee: "Szymon",
    favorites: ["favourite1", "favourite2", "favourite3", "favourite4"]
  },
  { employee: "Geri", favorites: ["favourite1"] },
  { employee: "Caolán", favorites: ["favourite1"] }
]

function Select() {
  // Event handler
  const handleClick = (event: MouseEvent) => console.log(event)

  // Button click handler
  const handleButtonClick = () => {
    console.log("Select Query button clicked")
  }

  // Trash bin click handler
  const handleTrashClick = (favorite: string) => {
    console.log(`Trash bin clicked for ${favorite}`)
  }

  return (
    <>
      <div className="bg-slate-600 text-center py-3 text-lg font-bold text-white">
        Select a Favourite Query
      </div>
      {items.length === 0 ? (
        <p>No query found</p>
      ) : (
        <div>
          {items.map((item) => (
            <SelectGroup
              key={`select_group_${item.employee}`}
              item={item}
              handlerClick={handleClick}
              handlerTrashClick={handleTrashClick}
            />
          ))}
        </div>
      )}
      <div className="flex justify-end">
        <button
          className="tr text-black bg-orange-400 border-solid border-orange-400 border-2 rounded-xl px-7 py-1 font-bold mr-3 mt-1 hover:bg-orange-200"
          onClick={handleButtonClick}
        >
          Select query
        </button>
      </div>
    </>
  )
}

export default Select
