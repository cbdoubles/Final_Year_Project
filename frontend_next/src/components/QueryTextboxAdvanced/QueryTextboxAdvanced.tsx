import React, { useState } from "react"
import CreateButton from "../../utils/queryboxButtons/CreateButton"
import ShowNaturalLangButton from "../../utils/queryboxButtons/ShowNaturalLangButton"
import FavouritesButton from "../../utils/queryboxButtons/FavoriteButton"
import RunButton from "../../utils/queryboxButtons/RunButton"

const QueryTextboxAdvanced: React.FC = () => {
  const [query, setQuery] = useState("")

  const handleCreate = () => {
    // Add logic to create something
    console.log("Creating with query:", query)
  }

  const handleShowNaturalLang = () => {
    // Add logic to show natural language equivalent of the query
    alert(`Natural Language Query: ${query}`)
  }

  const handleRunQuery = () => {
    // Add logic to run the query
    console.log("Running query:", query)
  }

  const handleFavourite = () => {
    // Add logic to save the query as a favorite
    console.log("Favouriting query:", query)
  }

  return (
    <div className="query-textbox-container">
      <textarea
        className="query-textbox-textarea"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter your query here"
      />
      <div className="query-textbox-buttons">
        <CreateButton onClick={handleCreate}>Create</CreateButton>
        <ShowNaturalLangButton onClick={handleShowNaturalLang}>
          Show Natural Lang
        </ShowNaturalLangButton>
        <RunButton onClick={handleRunQuery}>Run</RunButton>
        <FavouritesButton onClick={handleFavourite}>Favourite</FavouritesButton>
      </div>
    </div>
  )
}

export default QueryTextboxAdvanced
