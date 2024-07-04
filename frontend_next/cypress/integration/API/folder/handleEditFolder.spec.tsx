// cypress/integration/handleEditFolder.spec.ts
/* global cy */
import { DB_URL } from "@/src/libs/constants";
import { QueryFolderType } from "@/src/libs/types";
import { handleEditFolder } from "@/src/utils/apiCalls/folder/handleEditFolder";

describe("handleEditFolder API utility", () => {
  const folderId = 316; // Example folder ID
  const updatedFolderName = "Updated Test Folder";
  const projectId = 132;

  const folder: QueryFolderType = {
    folderId,
    folderName: updatedFolderName,
    folderType: "Custom",
  };

  const prevElementState: QueryFolderType = {
    folderId,
    folderName: "Original Test Folder",
    folderType: "Custom",
  };

  beforeEach(() => {
    // Mock the fetch API for successful folder edit
    cy.intercept("PATCH", `${DB_URL}/api/folders/${folderId}/`, (req) => {
      req.reply({
        statusCode: 200,
        body: {
          id: folderId,
          name: updatedFolderName,
          type: "Custom",
          project: projectId,
        },
      });
    }).as("handleEditFolder");
  });

  it("edits a folder successfully", async () => {
    const result = await handleEditFolder(folder, prevElementState);

    // Verify the result
    expect(result).to.deep.equal({
      folderId,
      folderName: updatedFolderName,
      folderType: "Custom",
    });
  });

  it("handles edit folder error correctly", async () => {
    const errorMessage = "Name already in use";

    // Mock an error response for folder edit
    cy.intercept("PATCH", `${DB_URL}/api/folders/${folderId}/`, (req) => {
      req.reply({
        statusCode: 400,
        body: { error: errorMessage },
      });
    }).as("handleEditFolderError");

    const result = await handleEditFolder(folder, prevElementState);

    // Verify the result is the previous state in case of an error
    expect(result).to.deep.equal(prevElementState);

    // Verify the toast error message
    cy.get(".Toastify__toast--error").should("contain", errorMessage);
  });
});
