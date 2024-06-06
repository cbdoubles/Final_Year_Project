import React, { useRef, useState } from "react";
import UIButton from "../ui/UIButton";
type SelectFileProps = {};

const SelectFile: React.FC<SelectFileProps> = ({}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [newProjectName, setNewProjectName] = useState("");
  const sendToAPIToUpload = "http://127.0.0.1:8000/upload_file/";

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      setFile(file);
    }
  };

  const handleSave = () => {
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const sqlData = new FormData();
    sqlData.append("name", newProjectName);
    sqlData.append("file_type", file.type);
    sqlData.append("file_path", file);

    fetch("http://localhost:8000/api/projects/", {
      method: "POST",
      body: sqlData,
    })
      .then((response) => response.json())
      .then((data) => {
        // Fetch the project id from the response
        const projectId = data.id;

        // Send a POST request to the process_file view with the project id
        fetch(`http://localhost:8000/api/projects/${projectId}/process_file/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ file_name: file.name, file_type: file.type }), // Send the file name and type in the request body
        })
          .then((response) => response.json())
          .then((data) => {
            // Handle the response from the process_file view
            const uploadData = new FormData();
            uploadData.append("file", file);
            uploadData.append("project_id", projectId);
            fetch(sendToAPIToUpload, {
              method: "POST",
              body: uploadData,
            });
            console.log(data);
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <>
      <div data-testid="start-new-project-modal">
        <label className="block mb-2 text-lg text-black">
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
          <UIButton onClick={handleButtonClick}>Select File</UIButton>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          {selectedFileName && <UIButton onClick={handleSave}>Save</UIButton>}
        </div>
      </div>
    </>
  );
};

export default SelectFile;
