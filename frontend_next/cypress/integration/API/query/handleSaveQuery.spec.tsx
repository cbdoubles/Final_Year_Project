/* global cy */
import { toast } from "react-toastify";

import { DB_URL } from "@/src/libs/constants";
import { QueryFolderType } from "@/src/libs/types";
import { handleSaveQuery } from "@/src/utils/apiCalls/query/handleSaveQuery";

describe("handleSaveQuery API utility", () => {
  const queryName = "New Query";
  const cyphertext = "MATCH (n) RETURN n";
  const natLang = "Return all nodes";
  const folder: QueryFolderType = {
    folderId: 1,
    folderName: "Favorites",
    folderType: "Favorite",
  };
  const projectId = 123;

  beforeEach(() => {
    // Ensure each test starts with a fresh intercept
    cy.intercept("POST", `${DB_URL}/api/favorite-queries/`, {
      statusCode: 201,
      body: {
        id: 1,
        name: queryName,
        cypher_query: cyphertext,
        natural_language_query: natLang,
      },
    }).as("saveFavoriteQuery");

    cy.intercept("POST", `${DB_URL}/api/custom-queries/`, {
      statusCode: 201,
      body: {
        id: 2,
        name: queryName,
        cypher_query: cyphertext,
        natural_language_query: natLang,
      },
    }).as("saveCustomQuery");

    // Mock toast notification
    cy.stub(toast, "error").as("toastError");
  });

  it("successfully saves a query to Favorite folder", async () => {
    const result = await handleSaveQuery(
      queryName,
      cyphertext,
      natLang,
      folder,
      projectId
    );

    // Verify the result
    expect(result).to.deep.equal({
      queryId: 1,
      queryName: queryName,
      cypherQuery: cyphertext,
      natLang: natLang,
    });
  });

  it("handles save error gracefully", async () => {
    // Mock an error response
    cy.intercept("POST", `${DB_URL}/api/favorite-queries/`, {
      statusCode: 500,
      body: { error: "Internal Server Error" },
    }).as("saveFavoriteQueryError");

    const result = await handleSaveQuery(
      queryName,
      cyphertext,
      natLang,
      folder,
      projectId
    );

    // Verify the result
    expect(result).to.be.null;
    // Verify toast error was called
    cy.get("@toastError").should(
      "be.calledOnceWithExactly",
      "Invalid query input (possible duplicate or empty fields)"
    );
  });

  it("handles null folderType gracefully", async () => {
    const nullFolder: QueryFolderType = {
      folderId: 2,
      folderName: "Custom",
      folderType: null,
    };

    const result = await handleSaveQuery(
      queryName,
      cyphertext,
      natLang,
      nullFolder,
      projectId
    );

    // Verify the result
    expect(result).to.be.null;
    // Verify toast error was called
    cy.get("@toastError").should(
      "be.calledOnceWithExactly",
      "Invalid query input (possible duplicate or empty fields)"
    );
  });
});
