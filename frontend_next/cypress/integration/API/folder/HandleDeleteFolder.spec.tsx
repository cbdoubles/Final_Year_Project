// cypress/integration/handleDeleteFolder.spec.ts
/* global cy */
import { DB_URL } from "@/src/libs/constants";
import { QueryFolderType } from "@/src/libs/types";
import { handleDeleteFolder } from "@/src/utils/apiCalls/folder/handleDeleteFolder";

describe("handleDeleteFolder API utility", () => {
  const customFolder: QueryFolderType = {
    folderId: 315,
    folderName: "Test Custom Folder",
    folderType: "Custom",
  };

  const favoriteFolder: QueryFolderType = {
    folderId: 316,
    folderName: "Test Favorite Folder",
    folderType: "Favorite",
  };

  const testCases = [
    { deletingFolder: customFolder, folderType: "Custom" },
    { deletingFolder: favoriteFolder, folderType: "Favorite" },
  ];

  testCases.forEach(({ deletingFolder, folderType }) => {
    beforeEach(() => {
      // Mock the fetch API for successful folder deletion
      cy.intercept(
        "DELETE",
        `${DB_URL}/api/folders/${deletingFolder.folderId}/`,
        (req) => {
          req.reply({
            statusCode: 204, // No Content
          });
        }
      ).as(`handleDeleteFolder_${folderType}`);
    });

    it(`deletes a ${folderType} folder successfully`, async () => {
      const result = await handleDeleteFolder(deletingFolder);

      // Verify the result
      expect(result).to.be.true;
    });

    it(`handles delete ${folderType} folder error correctly`, async () => {
      const errorMessage = "Error deleting folder";

      // Mock an error response for folder deletion
      cy.intercept(
        "DELETE",
        `${DB_URL}/api/folders/${deletingFolder.folderId}/`,
        (req) => {
          req.reply({
            statusCode: 400,
            body: { error: errorMessage },
          });
        }
      ).as(`handleDeleteFolderError_${folderType}`);

      const result = await handleDeleteFolder(deletingFolder);

      // Verify the result is false in case of an error
      expect(result).to.be.false;

      // Verify the console error message
      cy.window().then((win) => {
        cy.stub(win.console, "error").as("consoleError");
        handleDeleteFolder(deletingFolder);
        cy.get("@consoleError").should(
          "be.calledWith",
          "Error deleting folder:",
          sinon.match.any
        );
      });
    });

    it(`returns false if deletingFolder is null (${folderType} folder)`, async () => {
      const result = await handleDeleteFolder(null);

      // Verify the result is false when deletingFolder is null
      expect(result).to.be.false;
    });
  });
});
