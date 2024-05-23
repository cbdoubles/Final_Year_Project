import React, { useRef, useState } from "react"

type StartNewProjectProps = {
  isVisable: boolean
  onClose: () => void
}

const StartNewProject: React.FC<StartNewProjectProps> = ({
  isVisable,
  onClose
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null)

  if (!isVisable) return null

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFileName(file.name)
    }
  }

  const handleSave = () => {
    // Implement the save functionality here
    console.log("File saved:", selectedFileName)
  }

  const handleClose = () => {
    setSelectedFileName(null)
    onClose()
  }

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-25 backdrop-blur-sm">
      <div className="relative">
        <div className="bg-white p-2 rounded w-[600px]">
          <button
            className="text-black text-xl absolute top-2 right-2 bg-transparent border-none"
            onClick={handleClose}
          >
            X
          </button>
          <div className="p-4 text-gray-700">
            <h2 className="text-2xl mb-4">New Project</h2>
            <form>
              <label className="block mb-2 text-lg">
                Project Name:
                <input
                  type="text"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </label>
              {selectedFileName && (
                <div className="mt-4 text-gray-700">
                  <strong>Selected file:</strong> {selectedFileName}
                </div>
              )}
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  onClick={handleButtonClick}
                >
                  Select File
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
                {selectedFileName && (
                  <button
                    type="button"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StartNewProject
