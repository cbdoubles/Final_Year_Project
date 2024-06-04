import React, { useState } from "react"
import FolderTest from "@/src/components/favouriteFolder/FolderTest"
import QueryIconButton from "./QueryIconButton"
import UIModal from "@/src/components/ui/UIModal"
import UIButton from "@/src/components/ui/UIButton"

// Detail for icon (assuming this was meant to be here based on previous context)
interface Item {
  employee: string
  favorites: string[]
}

interface SelectProps {
  loadItems: () => Promise<Item[]>
  collapsed: boolean
  type: "Default" | "Custom" | "Favorite" | "Collapse"
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

const QueryIcon: React.FC<SelectProps> = ({
  loadItems,
  collapsed,
  type,
  icon: Icon
}) => {
  const [items, setItems] = useState<Item[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchItems = () => {
    setIsLoading(true)
    loadItems().then((newItems) => {
      setItems(newItems)
      setIsLoading(false)
    })
  }

  // Button click handler
  const handleButtonClick = () => {
    console.log("Select Query button clicked")
  }

  return (
    <>
      <UIModal
        button={({ onOpen }) => (
          <QueryIconButton
            handleClick={() => {
              fetchItems()
              onOpen()
            }}
            collapsed={collapsed}
            type={type}
            icon={Icon}
          />
        )}
        header={
          <>
            <span className="text-primary">Select a query</span>
            <span className="text-sm text-gray-400 font-light leading-none">
              {type}
            </span>
          </>
        }
        body={
          isLoading ? (
            <p className="text-black">Loading</p>
          ) : (
            <FolderTest
              title={`Select a ${type} query`}
              items={items}
              canBeShared={false}
              type="Default"
            />
          )
        }
        footer={({ onClose }) => (
          <UIButton onClick={handleButtonClick}>Select query</UIButton>
        )}
        bodyNoPadding
      ></UIModal>
    </>
  )
}

export default QueryIcon
