import React, { MouseEvent } from "react"
import SelectGroup from "@/src/components/favouriteFolder/SelectGroup"

interface Item {
  employee: string
  favorites: string[]
}

interface SelectProps {
  title: string
  items: Item[]
  type: "Default" | "Custom" | "Favorite"
  canBeShared: boolean
}

const FolderTest: React.FC<SelectProps> = ({
  title,
  items,
  type,
  canBeShared
}) => {
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
    <div>
      {items.length === 0 ? (
        <p>No query found</p>
      ) : (
        <div>
          {items.map((item) => (
            <SelectGroup
              key={`select_group_${item.employee}`}
              item={item}
              type={type}
              canBeShared={canBeShared}
              handlerClick={handleClick}
              handlerTrashClick={handleTrashClick}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default FolderTest
