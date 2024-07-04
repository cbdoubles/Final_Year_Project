import { DB_URL } from "@/src/libs/constants";
import { fetchProjects } from "@/src/utils/apiCalls/project/fetchProjects";

describe("fetchProjects API utility", () => {
  beforeEach(() => {
    // Ensure each test starts with a fresh intercept
    cy.intercept("GET", `${DB_URL}/api/projects/`, {
      statusCode: 200,
      body: [
        {
          id: 1,
          name: "Project 1",
          file_name: "project1.graph",
        },
        {
          id: 2,
          name: "Project 2",
          file_name: "project2.graph",
        },
      ],
    }).as("fetchProjects");
  });

  it("fetches projects successfully", async () => {
    const result = await fetchProjects();

    // Verify the result
    expect(result).to.deep.equal([
      {
        projectId: 1,
        projectName: "Project 1",
        graphName: "project1.graph",
      },
      {
        projectId: 2,
        projectName: "Project 2",
        graphName: "project2.graph",
      },
    ]);
  });

  it("handles fetch error", async () => {
    const errorMessage = "Internal Server Error";

    // Mock an error response
    cy.intercept("GET", `${DB_URL}/api/projects/`, {
      statusCode: 500,
      body: errorMessage,
    }).as("fetchProjectsError");

    const result = await fetchProjects();

    // Verify the result
    expect(result).to.be.undefined; // or to.be.null, depending on how you handle errors

    // Verify the error message
    cy.get(".error-message").should("contain", errorMessage); // Adjust selector as per your application
  });
});
