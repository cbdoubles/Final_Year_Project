import React, { ReactNode } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faStar } from "@fortawesome/free-solid-svg-icons"

// Define the Props interface to type the onClick function
type FavouritesButtonProps = {
  onClick: () => void
  children: ReactNode // Specify the onClick as a function that returns void
}

// Create the Favorites Button component using the Props interface
const FavouritesButton: React.FC<FavouritesButtonProps> = ({ onClick }) => {
  return (
    <button onClick={onClick} className="favorites-button">
      <FontAwesomeIcon icon={faStar} /> Add to Favorites
    </button>
  )
}

export default FavouritesButton
