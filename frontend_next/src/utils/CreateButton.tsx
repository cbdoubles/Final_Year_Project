import React, { ReactNode } from "react"
import { FiFile } from "react-icons/fi"

interface CreateButtonProps {
  onClick: () => void
  children: ReactNode
}

const CreateButton: React.FC<CreateButtonProps> = ({ onClick }) => {
  return (
    <button onClick={onClick} className="create-button">
      <FiFile className="icon" />
      Create
    </button>
  )
}

export default CreateButton
