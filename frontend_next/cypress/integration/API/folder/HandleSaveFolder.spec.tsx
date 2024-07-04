/* global cy */
import { DB_URL } from "@/src/libs/constants";
import { FolderType } from "@/src/libs/types";
import { handleSaveFolder } from "@/src/utils/apiCalls/folder/handleSaveFolder";

describe("handleSaveFolder API utility", () => {
  const projectId = 132;
  const customFolderName = "Custom Test Folder";
  const favoriteFolderName = "Favorite Test Folder";

  const testCases = [
    { folderName: customFolderName, folderType: "Custom" as FolderType },
    { folderName: favoriteFolderName, folderType: "Favorite" as FolderType },
  ];

  testCases.forEach(({ folderName, folderType }) => {
    describe(`when saving a ${folderType} folder`, () => {
      beforeEach(() => {
        // Mock the fetch API for successful folder creation
        cy.intercept("POST", `${DB_URL}/api/folders/`, (req) => {
          req.reply({
            statusCode: 201,
            body: {
              id: 400,
              name: folderName,
              type: folderType,
              project: projectId,
            },
          });
        }).as("handleSaveFolder");
      });

      it(`saves a new ${folderType} folder successfully`, async () => {
        const result = await handleSaveFolder(
          folderName,
          folderType,
          projectId
        );

        // Verify the result
        expect(result).to.deep.equal({
          folderId: 400,
          folderName,
          folderType,
        });
      });

      it(`handles save ${folderType} folder error correctly`, async () => {
        const errorMessage = "Folder name already in use";

        // Mock an error response for folder creation
        cy.intercept("POST", `${DB_URL}/api/folders/`, (req) => {
          req.reply({
            statusCode: 400,
            body: { error: errorMessage },
          });
        }).as("handleSaveFolderError");

        const result = await handleSaveFolder(
          folderName,
          folderType,
          projectId
        );

        // Verify the result is null in case of an error
        expect(result).to.be.null;

        // Verify the toast error message
        cy.get(".Toastify__toast--error").should("contain", errorMessage);
      });
    });
  });
});
