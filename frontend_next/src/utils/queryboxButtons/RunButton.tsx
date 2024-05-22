import React, { ReactNode } from "react"

// Define the Props interface to type the onClick function
type RunButtonProps = {
  onClick: () => void
  children: ReactNode // Specify the onClick as a function that returns void
}

// Create the Favorites Button component using the Props interface
const RunButton: React.FC<RunButtonProps> = ({ onClick }) => {
  return (
    <button onClick={onClick} className="run-button">
      Run
    </button>
  )
}

export default RunButton
