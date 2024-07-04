import { DB_URL } from "@/src/libs/constants";
import { FolderType, QueryType } from "@/src/libs/types";
import { handleDeleteQuery } from "@/src/utils/apiCalls/query/handleDeleteQuery";

describe("handleDeleteQuery API utility", () => {
  const deletingQuery: QueryType = {
    queryId: 1,
    queryName: "Test Query",
    cypherQuery: "MATCH (n) RETURN n",
    natLang: "Return all nodes",
  };
  const folderType: FolderType = "Favorite"; // Assuming we start with testing Favorite folderType

  beforeEach(() => {
    // Ensure each test starts with a fresh intercept
    cy.intercept(
      "DELETE",
      `${DB_URL}/api/favorite-queries/${deletingQuery.queryId}/`,
      {
        statusCode: 200,
        body: { message: "Query deleted successfully" },
      }
    ).as("deleteFavoriteQuery");

    cy.intercept(
      "DELETE",
      `${DB_URL}/api/custom-queries/${deletingQuery.queryId}/`,
      {
        statusCode: 200,
        body: { message: "Query deleted successfully" },
      }
    ).as("deleteCustomQuery");
  });

  it("successfully deletes a query from Favorite folder", async () => {
    const result = await handleDeleteQuery(deletingQuery, folderType);

    // Verify the result
    expect(result).to.be.true;
  });

  it("handles deletion error gracefully", async () => {
    // Mock an error response
    cy.intercept(
      "DELETE",
      `${DB_URL}/api/favorite-queries/${deletingQuery.queryId}/`,
      {
        statusCode: 500,
        body: { error: "Internal Server Error" },
      }
    ).as("deleteFavoriteQueryError");

    const result = await handleDeleteQuery(deletingQuery, folderType);

    // Verify the result
    expect(result).to.be.false;
  });

  it("handles null deletingQuery gracefully", async () => {
    const nullDeletingQuery: QueryType | null = null;

    const result = await handleDeleteQuery(nullDeletingQuery, folderType);

    // Verify the result
    expect(result).to.be.false;
  });

  it("handles null folderType gracefully", async () => {
    const nullFolderType: FolderType = null;

    const result = await handleDeleteQuery(deletingQuery, nullFolderType);

    // Verify the result
    expect(result).to.be.false;
  });
});
