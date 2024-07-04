// cypress/integration/fetchFolders.spec.ts
/* global cy */
import { DB_URL } from "@/src/libs/constants";
import { FolderType } from "@/src/libs/types";
import { fetchFolders } from "@/src/utils/apiCalls/folder/fetchFolders";

describe("fetchFolders API utility", () => {
  const projectId = 132;

  beforeEach(() => {
    // Ensure each test starts with fresh intercepts
    cy.intercept(
      "GET",
      `${DB_URL}/api/folders/by-project/?project=${projectId}&type=Favorite`,
      (req) => {
        req.reply({
          statusCode: 200,
          body: [
            {
              id: 316,
              name: "Project Favorite Queries",
              type: "Favorite",
              project: projectId,
            },
          ],
        });
      }
    ).as("fetchFavoriteFolders");

    cy.intercept(
      "GET",
      `${DB_URL}/api/folders/by-project/?project=${projectId}&type=Custom`,
      (req) => {
        req.reply({
          statusCode: 200,
          body: [
            {
              id: 315,
              name: "Project Custom Queries",
              type: "Custom",
              project: projectId,
            },
          ],
        });
      }
    ).as("fetchCustomFolders");
  });

  it("fetches and transforms Favorite folders correctly", async () => {
    const folderType: FolderType = "Favorite";

    const result = await fetchFolders(projectId, folderType);

    // Verify the result
    expect(result).to.deep.equal([
      {
        folderId: 316,
        folderName: "Project Favorite Queries",
        folderType: "Favorite",
      },
    ]);
  });

  it("fetches and transforms Custom folders correctly", async () => {
    const folderType: FolderType = "Custom";

    const result = await fetchFolders(projectId, folderType);

    // Verify the result
    expect(result).to.deep.equal([
      {
        folderId: 315,
        folderName: "Project Custom Queries",
        folderType: "Custom",
      },
    ]);
  });

  it("handles fetch error correctly for Favorite folders", async () => {
    const invalidProjectId = 9999; // Assume this project ID does not exist

    // Mock an error response for Favorite type
    cy.intercept(
      "GET",
      `${DB_URL}/api/folders/by-project/?project=${invalidProjectId}&type=Favorite`,
      (req) => {
        req.reply({
          statusCode: 400,
          body: ["Error: A Project with this ID does not exist."],
        });
      }
    ).as("fetchFavoriteFoldersError");

    const result = await fetchFolders(invalidProjectId, "Favorite");

    // Verify the result is null in case of an error
    expect(result).to.be.null;
  });

  it("handles fetch error correctly for Custom folders", async () => {
    const invalidProjectId = 9999; // Assume this project ID does not exist

    // Mock an error response for Custom type
    cy.intercept(
      "GET",
      `${DB_URL}/api/folders/by-project/?project=${invalidProjectId}&type=Custom`,
      (req) => {
        req.reply({
          statusCode: 400,
          body: ["Error: A Project with this ID does not exist."],
        });
      }
    ).as("fetchCustomFoldersError");

    const result = await fetchFolders(invalidProjectId, "Custom");

    // Verify the result is null in case of an error
    expect(result).to.be.null;
  });
});
