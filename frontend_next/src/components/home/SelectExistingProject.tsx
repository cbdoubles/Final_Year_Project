import React, { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faPencilAlt,
  faTrashAlt,
  faTimes
} from "@fortawesome/free-solid-svg-icons"

type SelectExistingProjectProps = {
  onClose: () => void
}

const SelectExistingProject: React.FC<SelectExistingProjectProps> = ({
  onClose
}) => {
  console.log("SelectExistingProject")
  type Element = {
    name: string
    value: string
  }

  const handleClose = () => {
    console.log("Close button clicked")
    onClose()
    // Implement your close functionality here
  }

  const [elements, setElements] = useState<Element[]>([
    { name: "Element 1", value: "Object1" },
    { name: "Element 2", value: "Object2" },
    { name: "Element 3", value: "Object3" }
  ])
  const [selectedElements, setSelectedElements] = useState<Element[]>([])
  const [editingElement, setEditingElement] = useState<Element | null>(null)
  const [deletingElement, setDeletingElement] = useState<Element | null>(null)

  const handleElementClick = (element: Element) => {
    if (!selectedElements.find((el) => el.value === element.value)) {
      setSelectedElements([...selectedElements, element])
      // Here you can add the code to request the object from the backend using element.value
    }
  }

  const handleIconClick1 = (element: Element) => {
    setEditingElement(element)
  }

  const handleIconClick2 = (element: Element) => {
    setDeletingElement(element)
  }

  const handleEditChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    element: Element
  ) => {
    // Update the name of the element
    const updatedElements = elements.map((el) =>
      el.value === element.value ? { ...el, name: event.target.value } : el
    )
    setElements(updatedElements)
  }

  const handleEditSubmit = (
    event: React.FormEvent<HTMLFormElement>,
    element: Element
  ) => {
    event.preventDefault()
    // Submit the changes here
    console.log(`Updated name for ${element.name}`)
    setEditingElement(null)
  }

  const handleDeleteConfirm = () => {
    // Delete the element here
    console.log(`Deleted ${deletingElement?.name}`)
    setDeletingElement(null)
  }

  const handleDeleteCancel = () => {
    setDeletingElement(null)
  }

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-100 text-gray-800 w-4/5 max-h-90 overflow-y-auto p-5 rounded-lg relative">
        <button
          className="text-black text-xl absolute top-2 right-2 bg-transparent border-none"
          onClick={handleClose}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <h1 className="text-blue-500 text-center border-b border-blue-500">
          Select New Project
        </h1>
        <h2>Select Elements</h2>
        {elements.map((element, index) => (
          <div
            key={index}
            className={`flex justify-between items-center ${
              index % 2 === 0 ? "even-element" : ""
            }`}
          >
            {editingElement && editingElement.value === element.value ? (
              <form onSubmit={(event) => handleEditSubmit(event, element)}>
                <input
                  type="text"
                  value={element.name}
                  onChange={(event) => handleEditChange(event, element)}
                  autoFocus
                  className="focus:outline-none"
                />
              </form>
            ) : (
              <span onClick={() => handleElementClick(element)}>
                {element.name}
              </span>
            )}
            <div>
              <FontAwesomeIcon
                icon={faPencilAlt}
                onClick={() => handleIconClick1(element)}
              />
              <FontAwesomeIcon
                icon={faTrashAlt}
                onClick={() => handleIconClick2(element)}
              />
            </div>
          </div>
        ))}
        <h2>Selected Elements</h2>
        {selectedElements.map((element, index) => (
          <div key={index}>{element.name}</div>
        ))}
      </div>
      {deletingElement && (
        <div className="absolute top-1/3 left-1/4 w-1/2 h-2/5 bg-blue-600 flex flex-col items-center justify-center z-50 rounded-2xl">
          <h2 className="text-2xl text-center">
            This will delete the project. Are you sure?
          </h2>
          <div className="absolute bottom-5 w-full flex justify-between px-5">
            <button
              className="bg-orange-500 text-xl px-5 py-2 rounded-full"
              onClick={handleDeleteCancel}
            >
              Cancel
            </button>
            <button
              className="bg-orange-500 text-xl px-5 py-2 rounded-full"
              onClick={handleDeleteConfirm}
            >
              Yes
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default SelectExistingProject
