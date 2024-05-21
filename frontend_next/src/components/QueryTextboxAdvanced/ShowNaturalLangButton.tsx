import React, { ReactNode } from "react"

interface ShowNaturalLangButtonProps {
  onClick: () => void
  children: ReactNode
}

const ShowNaturalLangButton: React.FC<ShowNaturalLangButtonProps> = ({
  onClick
}) => {
  return (
    <button onClick={onClick} className="show-natural-lang-button">
      Show Natural Lang
    </button>
  )
}

export default ShowNaturalLangButton
