import React, { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPencilAlt, faTrashAlt } from "@fortawesome/free-solid-svg-icons"

const SelectExistingProject = () => {
  console.log("SelectExistingProject")
  type Element = {
    name: string
    value: string
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
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999
      }}
    >
      <div
        style={{
          backgroundColor: "#f8f9fa",
          color: "#212529",
          width: "80%",
          maxHeight: "90%",
          overflowY: "auto",
          padding: "20px",
          borderRadius: "10px"
        }}
      >
        <h1
          style={{
            color: "#007bff",
            textAlign: "center",
            borderBottom: "1px solid #007bff"
          }}
        >
          Select New Project
        </h1>
        <h2>Select Elements</h2>
        {elements.map((element, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            {editingElement && editingElement.value === element.value ? (
              <form onSubmit={(event) => handleEditSubmit(event, element)}>
                <input
                  type="text"
                  value={element.name}
                  onChange={(event) => handleEditChange(event, element)}
                  autoFocus
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
        <div
          style={{
            position: "absolute",
            top: "35%",
            left: "25%",
            width: "50%",
            height: "20%",
            backgroundColor: "lightblue",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            borderRadius: "20%"
          }}
        >
          <h2 style={{ fontSize: "2em", textAlign: "center" }}>
            This will delete the project. Are you sure?
          </h2>
          <div
            style={{
              position: "absolute",
              bottom: "20px",
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              padding: "0 20px"
            }}
          >
            <button
              style={{
                backgroundColor: "orange",
                fontSize: "1.5em",
                padding: "10px 20px",
                borderRadius: "50px"
              }}
              onClick={handleDeleteCancel}
            >
              Cancel
            </button>
            <button
              style={{
                backgroundColor: "orange",
                fontSize: "1.5em",
                padding: "10px 20px",
                borderRadius: "50px"
              }}
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
