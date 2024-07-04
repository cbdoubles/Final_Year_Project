// cypress/integration/handleEditProject.spec.ts
/* global cy */
import { DB_URL } from "@/src/libs/constants";
import { handleEditSubmit } from "@/src/utils/apiCalls/project/handleEditProject";

describe("handleEditSubmit API utility", () => {
  const mockProjectId = 1;
  const mockProjectName = "Updated Project Name";

  beforeEach(() => {
    // Mock successful fetch response for project update
    cy.intercept("PATCH", `${DB_URL}/api/projects/${mockProjectId}/`, {
      statusCode: 200,
      body: {
        id: mockProjectId,
        name: mockProjectName,
        file_name: "project1.graph",
      },
    }).as("editProject");

    // Mock an error response for project update
    cy.intercept("PATCH", `${DB_URL}/api/projects/${mockProjectId}/`, {
      statusCode: 500,
      body: { error: "Internal Server Error" },
    }).as("editProjectError");
  });

  it("updates project successfully", () => {
    // Stubbing the fetch call
    cy.stub(window, "fetch").resolves({
      ok: true,
      json: () =>
        Promise.resolve({
          id: mockProjectId,
          name: mockProjectName,
          file_name: "project1.graph",
        }),
    });

    handleEditSubmit(mockProjectId, mockProjectName)
      .then((result) => {
        // Verify the result
        expect(result).to.deep.equal({
          projectId: mockProjectId,
          projectName: mockProjectName,
          graphName: "project1.graph",
        });

        // Ensure editProject interceptor was called
        cy.wait("@editProject").its("response.statusCode").should("eq", 200);
      })
      .catch((error) => {
        // Log any errors
        console.error("Failed to update project:", error);
        throw error; // Rethrow the error to fail the test
      });
  });

  it("handles project update error", () => {
    // Stubbing the fetch call to simulate an error
    cy.stub(window, "fetch").rejects({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ error: "Internal Server Error" }),
    });

    // Call handleEditSubmit and expect it to throw an error
    handleEditSubmit(mockProjectId, mockProjectName)
      .then(() => {
        // If no error is thrown, fail the test
        throw new Error("Expected handleEditSubmit to throw an error.");
      })
      .catch((error) => {
        // Ensure editProjectError interceptor was called
        cy.wait("@editProjectError")
          .its("response.statusCode")
          .should("eq", 500);

        // Verify the error message
        expect(error.message).to.equal("Internal Server Error");
      });
  });
});
