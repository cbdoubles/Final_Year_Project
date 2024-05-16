import React, { useState } from "react"
import FavouritesButton from "./FavoriteButton"
import RunButton from "./RunButton"
import CypherButton from "./CypherButton"

const QueryTextbox: React.FC = () => {
  const [query, setQuery] = useState("")

  const handleShowQuery = () => {
    // Add logic to show cypher query
    alert(`Cypher Query: ${query}`)
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
        placeholder="Select a favorite result query, custom query or default query"
      />
      <div className="query-textbox-buttons">
        <CypherButton onClick={handleShowQuery}>Show Cypher Query</CypherButton>
        <RunButton onClick={handleRunQuery}>Run</RunButton>
        <FavouritesButton onClick={handleFavourite}>Favourite</FavouritesButton>
      </div>
    </div>
  )
}

export default QueryTextbox
