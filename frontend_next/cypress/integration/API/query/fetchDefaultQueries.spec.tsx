import { DB_URL } from "@/src/libs/constants";
import { fetchDefaultQueries } from "@/src/utils/apiCalls/query/fetchDefaultQueries";

describe("fetchDefaultQueries API utility", () => {
  beforeEach(() => {
    // Ensure each test starts with a fresh intercept
    cy.intercept("GET", `${DB_URL}/api/default-queries/`, {
      statusCode: 200,
      body: [
        {
          id: 1,
          name: "Default Query 1",
          cypher_query: "MATCH (n) RETURN n LIMIT 10",
          natural_language_query: "Return 10 nodes from the database",
        },
        {
          id: 2,
          name: "Default Query 2",
          cypher_query: "MATCH (n:Person) RETURN n.name LIMIT 5",
          natural_language_query: "Return names of 5 persons",
        },
      ],
    }).as("fetchDefaultQueries");
  });

  it("fetches and transforms default queries correctly", async () => {
    const result = await fetchDefaultQueries();

    // Verify the result
    expect(result).to.deep.equal([
      {
        queryId: 1,
        queryName: "Default Query 1",
        cypherQuery: "MATCH (n) RETURN n LIMIT 10",
        natLang: "Return 10 nodes from the database",
      },
      {
        queryId: 2,
        queryName: "Default Query 2",
        cypherQuery: "MATCH (n:Person) RETURN n.name LIMIT 5",
        natLang: "Return names of 5 persons",
      },
    ]);
  });

  it("handles fetch error correctly", async () => {
    // Mock an error response
    cy.intercept("GET", `${DB_URL}/api/default-queries/`, {
      statusCode: 500,
      body: "Internal Server Error",
    }).as("fetchDefaultQueriesError");

    try {
      await fetchDefaultQueries();
    } catch (error) {
      // Verify the error is thrown
      expect(error.message).to.include("Failed to fetch folders");
    }
  });
});
