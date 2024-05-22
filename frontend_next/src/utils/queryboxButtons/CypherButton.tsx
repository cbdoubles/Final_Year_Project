import React, { ReactNode } from "react"

type CypherButtonProps = {
  onClick: () => void
  children: ReactNode
}

const CypherButton: React.FC<CypherButtonProps> = ({ onClick, children }) => {
  return (
    <button onClick={onClick} className="cypher-button">
      Show Cypher
    </button>
  )
}

export default CypherButton
