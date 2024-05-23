// SelectExistingProjectButton.tsx
import React from "react"

type SelectExistingProjectButton = {
  onClick: () => void
}

const SelectExistingProjectButton: React.FC<SelectExistingProjectButton> = ({
  onClick
}) => {
  return (
    <button
      onClick={onClick}
      className="run-button"
      style={{ backgroundColor: "#2488A8", color: "white" }}
    >
      Select existing project
    </button>
  )
}

export default SelectExistingProjectButton
