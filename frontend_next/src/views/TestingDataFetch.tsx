// import React, { useEffect, useState } from "react"

// interface Project {
//   id: number
//   name: string
// }

// const TestingDataFetch: React.FC = () => {
//   const [projects, setProjects] = useState<Project[]>([])

//   //   useEffect(() => {
//   //     fetch("http://localhost:8000/api/projects/")
//   //       .then((response) => response.json())
//   //       .then((data) => setProjects(data))
//   //   }, [])

//   useEffect(() => {
//     fetch("http://localhost:8000/api/projects/")
//       .then((response) => response.json())
//       .then((data) => {
//         console.log("Received data from API:", data)
//         if (Array.isArray(data)) {
//           setProjects(data)
//         } else {
//           console.error("API response is not an array:", data)
//         }
//       })
//   }, [])

//   console.log(projects)

//   return (
//     <div>
//       <h1>Projects</h1>
//       <ul>
//         {projects.map((project) => (
//           <li key={project.id}>{project.name}</li>
//         ))}
//       </ul>
//     </div>
//   )
// }

// export default TestingDataFetch

// import React, { useEffect, useState, FormEvent, ChangeEvent } from "react"

// interface Project {
//   id: number
//   name: string
// }

// const TestingDataFetch: React.FC = () => {
//   const [projects, setProjects] = useState<Project[]>([])
//   const [newProjectName, setNewProjectName] = useState("")
//   const [file, setFile] = useState<File | null>(null)
//   const [fileType, setFileType] = useState("")
//   const [editProjectId, setEditProjectId] = useState<number | null>(null)
//   const [editProjectName, setEditProjectName] = useState("")

//   useEffect(() => {
//     fetch("http://localhost:8000/api/projects/")
//       .then((response) => response.json())
//       .then((data) => {
//         console.log("Received data from API:", data)
//         if (Array.isArray(data)) {
//           setProjects(data)
//         } else {
//           console.error("API response is not an array:", data)
//         }
//       })
//   }, [])

//   const handleNewProjectNameChange = (event: ChangeEvent<HTMLInputElement>) => {
//     setNewProjectName(event.target.value)
//   }

//   const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
//     if (event.target.files && event.target.files.length > 0) {
//       setFile(event.target.files[0])
//     }
//   }

//   const handleFileTypeChange = (event: ChangeEvent<HTMLInputElement>) => {
//     setFileType(event.target.value)
//   }

//   const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
//     event.preventDefault()

//     if (!file) {
//       alert("Please select a file to upload.")
//       return
//     }

//     const formData = new FormData()
//     formData.append("name", newProjectName)
//     formData.append("file_type", fileType)
//     formData.append("file", file)

//     fetch("http://localhost:8000/api/projects/", {
//       method: "POST",
//       body: formData
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         console.log("Created new project:", data)
//         setProjects([...projects, data])
//         setNewProjectName("")
//         setFile(null)
//         setFileType("")
//       })
//   }

//   const handleEditProjectNameChange = (
//     event: ChangeEvent<HTMLInputElement>
//   ) => {
//     setEditProjectName(event.target.value)
//   }

//   const handleEditButtonClick = (project: Project) => {
//     setEditProjectId(project.id)
//     setEditProjectName(project.name)
//   }

//   const handleEditFormSubmit = (event: FormEvent<HTMLFormElement>) => {
//     event.preventDefault()

//     if (editProjectId === null) return

//     fetch(`http://localhost:8000/api/projects/${editProjectId}/`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({ name: editProjectName })
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         console.log("Updated project:", data)
//         setProjects(
//           projects.map((project) =>
//             project.id === editProjectId ? data : project
//           )
//         )
//         setEditProjectId(null)
//         setEditProjectName("")
//       })
//   }

//   const handleDeleteButtonClick = (projectId: number) => {
//     fetch(`http://localhost:8000/api/projects/${projectId}/`, {
//       method: "DELETE"
//     }).then((response) => {
//       if (response.ok) {
//         setProjects(projects.filter((project) => project.id !== projectId))
//         console.log("Deleted project:", projectId)
//       } else {
//         console.error("Failed to delete project:", projectId)
//       }
//     })
//   }

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold mb-4">Projects</h1>
//       <ul className="mb-4">
//         {projects.map((project) => (
//           <li
//             key={project.id}
//             className="text-lg flex justify-between items-center"
//           >
//             {project.name}
//             <div>
//               <button
//                 onClick={() => handleEditButtonClick(project)}
//                 className="ml-4 px-2 py-1 bg-yellow-500 text-white rounded"
//               >
//                 Edit
//               </button>
//               <button
//                 onClick={() => handleDeleteButtonClick(project.id)}
//                 className="ml-2 px-2 py-1 bg-red-500 text-white rounded"
//               >
//                 Delete
//               </button>
//             </div>
//           </li>
//         ))}
//       </ul>
//       {editProjectId !== null && (
//         <form onSubmit={handleEditFormSubmit} className="space-y-4 mb-4">
//           <label className="block">
//             <span className="text-gray-700">Edit project name:</span>
//             <input
//               type="text"
//               value={editProjectName}
//               onChange={handleEditProjectNameChange}
//               className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-300 text-black"
//             />
//           </label>
//           <button
//             type="submit"
//             className="px-4 py-2 bg-green-500 text-white font-semibold rounded-md shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//           >
//             Update Project
//           </button>
//         </form>
//       )}
//       <form onSubmit={handleFormSubmit} className="space-y-4">
//         <label className="block">
//           <span className="text-gray-700">New project name:</span>
//           <input
//             type="text"
//             value={newProjectName}
//             onChange={handleNewProjectNameChange}
//             className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-300 text-black"
//           />
//         </label>
//         <label className="block">
//           <span className="text-gray-700">File Type:</span>
//           <input
//             type="text"
//             value={fileType}
//             onChange={handleFileTypeChange}
//             className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-300 text-black"
//           />
//         </label>
//         <label className="block">
//           <span className="text-gray-700">Upload File:</span>
//           <input
//             type="file"
//             onChange={handleFileChange}
//             className="mt-1 block w-full text-black"
//           />
//         </label>
//         <button
//           type="submit"
//           className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//         >
//           Create Project
//         </button>
//       </form>
//     </div>
//   )
// }

// export default TestingDataFetch

//--------------------------------------------------------------------

// import React, { useEffect, useState, FormEvent, ChangeEvent } from "react"

// interface Project {
//   id: number
//   name: string
// }

// const TestingDataFetch: React.FC = () => {
//   const [projects, setProjects] = useState<Project[]>([])
//   const [newProjectName, setNewProjectName] = useState("")
//   const [file, setFile] = useState<File | null>(null)
//   const [fileType, setFileType] = useState("")
//   const [editProjectId, setEditProjectId] = useState<number | null>(null)
//   const [editProjectName, setEditProjectName] = useState("")

//   useEffect(() => {
//     fetch("http://localhost:8000/api/projects/")
//       .then((response) => response.json())
//       .then((data) => {
//         console.log("Received data from API:", data)
//         if (Array.isArray(data)) {
//           setProjects(data)
//         } else {
//           console.error("API response is not an array:", data)
//         }
//       })
//   }, [])

//   const handleNewProjectNameChange = (event: ChangeEvent<HTMLInputElement>) => {
//     setNewProjectName(event.target.value)
//   }

//   const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
//     if (event.target.files && event.target.files.length > 0) {
//       setFile(event.target.files[0])
//     }
//   }

//   const handleFileTypeChange = (event: ChangeEvent<HTMLInputElement>) => {
//     setFileType(event.target.value)
//   }

//   const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
//     event.preventDefault()

//     if (!file) {
//       alert("Please select a file to upload.")
//       return
//     }

//     const formData = new FormData()
//     formData.append("name", newProjectName)
//     formData.append("file_type", fileType)
//     formData.append("file_path", file)

//     fetch("http://localhost:8000/api/projects/", {
//       method: "POST",
//       body: formData
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         console.log("Created new project:", data)
//         setProjects([...projects, data])
//         setNewProjectName("")
//         setFile(null)
//         setFileType("")
//       })
//   }

//   const handleEditProjectNameChange = (
//     event: ChangeEvent<HTMLInputElement>
//   ) => {
//     setEditProjectName(event.target.value)
//   }

//   const handleEditButtonClick = (project: Project) => {
//     setEditProjectId(project.id)
//     setEditProjectName(project.name)
//   }

//   const handleEditFormSubmit = (event: FormEvent<HTMLFormElement>) => {
//     event.preventDefault()

//     if (editProjectId === null) return

//     fetch(`http://localhost:8000/api/projects/${editProjectId}/`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({ name: editProjectName })
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         console.log("Updated project:", data)
//         setProjects(
//           projects.map((project) =>
//             project.id === editProjectId ? data : project
//           )
//         )
//         setEditProjectId(null)
//         setEditProjectName("")
//       })
//   }

//   const handleDeleteButtonClick = (projectId: number) => {
//     fetch(`http://localhost:8000/api/projects/${projectId}/`, {
//       method: "DELETE"
//     }).then((response) => {
//       if (response.ok) {
//         setProjects(projects.filter((project) => project.id !== projectId))
//         console.log("Deleted project:", projectId)
//       } else {
//         console.error("Failed to delete project:", projectId)
//       }
//     })
//   }

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold mb-4">Projects</h1>
//       <ul className="mb-4">
//         {projects.map((project) => (
//           <li
//             key={project.id}
//             className="text-lg flex justify-between items-center"
//           >
//             {project.name}
//             <div>
//               <button
//                 onClick={() => handleEditButtonClick(project)}
//                 className="ml-4 px-2 py-1 bg-yellow-500 text-white rounded"
//               >
//                 Edit
//               </button>
//               <button
//                 onClick={() => handleDeleteButtonClick(project.id)}
//                 className="ml-2 px-2 py-1 bg-red-500 text-white rounded"
//               >
//                 Delete
//               </button>
//             </div>
//           </li>
//         ))}
//       </ul>
//       {editProjectId !== null && (
//         <form onSubmit={handleEditFormSubmit} className="space-y-4 mb-4">
//           <label className="block">
//             <span className="text-gray-700">Edit project name:</span>
//             <input
//               type="text"
//               value={editProjectName}
//               onChange={handleEditProjectNameChange}
//               className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-300 text-black"
//             />
//           </label>
//           <button
//             type="submit"
//             className="px-4 py-2 bg-green-500 text-white font-semibold rounded-md shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//           >
//             Update Project
//           </button>
//         </form>
//       )}
//       <form onSubmit={handleFormSubmit} className="space-y-4">
//         <label className="block">
//           <span className="text-gray-700">New project name:</span>
//           <input
//             type="text"
//             value={newProjectName}
//             onChange={handleNewProjectNameChange}
//             className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-300 text-black"
//           />
//         </label>
//         <label className="block">
//           <span className="text-gray-700">File Type:</span>
//           <input
//             type="text"
//             value={fileType}
//             onChange={handleFileTypeChange}
//             className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-300 text-black"
//           />
//         </label>
//         <label className="block">
//           <span className="text-gray-700">Upload File:</span>
//           <input
//             type="file"
//             onChange={handleFileChange}
//             className="mt-1 block w-full text-black"
//           />
//         </label>
//         <button
//           type="submit"
//           className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//         >
//           Create Project
//         </button>
//       </form>
//     </div>
//   )
// }

// export default TestingDataFetch

// ---------------------------------------------------

import React, { useEffect, useState, FormEvent, ChangeEvent } from "react"

interface Project {
  id: number
  name: string
}

const TestingDataFetch: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [newProjectName, setNewProjectName] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [fileType, setFileType] = useState("")
  const [editProjectId, setEditProjectId] = useState<number | null>(null)
  const [editProjectName, setEditProjectName] = useState("")

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

  const handleNewProjectNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewProjectName(event.target.value)
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0])
    }
  }

  const handleFileTypeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFileType(event.target.value)
  }

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!file) {
      alert("Please select a file to upload.")
      return
    }

    const formData = new FormData()
    formData.append("name", newProjectName)
    formData.append("file_type", fileType)
    formData.append("file_path", file)

    fetch("http://localhost:8000/api/projects/", {
      method: "POST",
      body: formData
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Created new project:", data)
        setProjects([...projects, data])
        setNewProjectName("")
        setFile(null)
        setFileType("")
        // Reset the file input
        const fileInput = document.querySelector<HTMLInputElement>("#fileInput")
        if (fileInput) {
          fileInput.value = ""
        }
      })
  }

  const handleEditProjectNameChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setEditProjectName(event.target.value)
  }

  const handleEditButtonClick = (project: Project) => {
    setEditProjectId(project.id)
    setEditProjectName(project.name)
  }

  const handleEditFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (editProjectId === null) return

    fetch(`http://localhost:8000/api/projects/${editProjectId}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name: editProjectName })
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Updated project:", data)
        setProjects(
          projects.map((project) =>
            project.id === editProjectId ? data : project
          )
        )
        setEditProjectId(null)
        setEditProjectName("")
      })
  }

  const handleDeleteButtonClick = (projectId: number) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      fetch(`http://localhost:8000/api/projects/${projectId}/`, {
        method: "DELETE"
      }).then((response) => {
        if (response.ok) {
          setProjects(projects.filter((project) => project.id !== projectId))
          console.log("Deleted project:", projectId)
        } else {
          console.error("Failed to delete project:", projectId)
        }
      })
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Projects</h1>
      <ul className="mb-4">
        {projects.map((project) => (
          <li
            key={project.id}
            className="text-lg flex justify-between items-center"
          >
            {project.name}
            <div>
              <button
                onClick={() => handleEditButtonClick(project)}
                className="ml-4 px-2 py-1 bg-yellow-500 text-white rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteButtonClick(project.id)}
                className="ml-2 px-2 py-1 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      {editProjectId !== null && (
        <form onSubmit={handleEditFormSubmit} className="space-y-4 mb-4">
          <label className="block">
            <span className="text-gray-700">Edit project name:</span>
            <input
              type="text"
              value={editProjectName}
              onChange={handleEditProjectNameChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-300 text-black"
            />
          </label>
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white font-semibold rounded-md shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            Update Project
          </button>
        </form>
      )}
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <label className="block">
          <span className="text-gray-700">New project name:</span>
          <input
            type="text"
            value={newProjectName}
            onChange={handleNewProjectNameChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-300 text-black"
          />
        </label>
        <label className="block">
          <span className="text-gray-700">File Type:</span>
          <input
            type="text"
            value={fileType}
            onChange={handleFileTypeChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-300 text-black"
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Upload File:</span>
          <input
            type="file"
            onChange={handleFileChange}
            id="fileInput"
            className="mt-1 block w-full text-black"
          />
        </label>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          Create Project
        </button>
      </form>
    </div>
  )
}

export default TestingDataFetch
