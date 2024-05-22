// CreateNewProjectButton.tsx
import React, { ReactNode } from "react"

type StartNewProjectButtonProps = {
  onClick: () => void
  children?: ReactNode
}

const StartNewProjectButton: React.FC<StartNewProjectButtonProps> = ({
  onClick,
  children
}) => {
  return (
    <button
      onClick={onClick}
      className="run-button"
      style={{ backgroundColor: "#2488A8", color: "white" }}
    >
      {children || "Start new project"}
    </button>
  )
}

export default StartNewProjectButton
