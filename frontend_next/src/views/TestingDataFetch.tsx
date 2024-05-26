import React, { useEffect, useState } from "react"

interface Project {
  id: number
  name: string
}

const TestingDataFetch: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([])

  //   useEffect(() => {
  //     fetch("http://localhost:8000/api/projects/")
  //       .then((response) => response.json())
  //       .then((data) => setProjects(data))
  //   }, [])

  useEffect(() => {
    fetch("http://localhost:8000/api/projects/")
      .then((response) => response.json())
      .then((data) => {
        console.log("Received data from API:", data)
        if (Array.isArray(data)) {
          setProjects(data)
        } else {
          console.error("API response is not an array:", data)
        }
      })
  }, [])

  console.log(projects)

  return (
    <div>
      <h1>Projects</h1>
      <ul>
        {projects.map((project) => (
          <li key={project.id}>{project.name}</li>
        ))}
      </ul>
    </div>
  )
}

export default TestingDataFetch
