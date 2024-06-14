import React, { useState } from "react";

const CustomQueryForm: React.FC = () => {
  const [projectId, setProjectId] = useState("");
  const [folderId, setFolderId] = useState("");
  const [name, setName] = useState("");
  const [cypherQuery, setCypherQuery] = useState("");
  const [naturalLanguageQuery, setNaturalLanguageQuery] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      project: projectId,
      folder: folderId,
      name,
      cypher_query: cypherQuery,
      natural_language_query: naturalLanguageQuery,
    };

    try {
      const res = await fetch("http://localhost:8000/api/custom_queries/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setResponse(JSON.stringify(data));
    } catch (error) {
      setResponse("Error: " + error);
    }
  };

  return (
    <div>
      <h1>Create Custom Query</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Project ID:
          <input
            type="text"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
          />
        </label>
        <br />
        <label>
          Folder ID:
          <input
            type="text"
            value={folderId}
            onChange={(e) => setFolderId(e.target.value)}
          />
        </label>
        <br />
        <label>
          Query Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <br />
        <label>
          Cypher Query:
          <textarea
            value={cypherQuery}
            onChange={(e) => setCypherQuery(e.target.value)}
          ></textarea>
        </label>
        <br />
        <label>
          Natural Language Query:
          <textarea
            value={naturalLanguageQuery}
            onChange={(e) => setNaturalLanguageQuery(e.target.value)}
          ></textarea>
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
      <p>{response}</p>
    </div>
  );
};

export default CustomQueryForm;
