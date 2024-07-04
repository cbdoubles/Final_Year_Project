// cypress/integration/handleSaveProject.spec.ts
/* global cy */
import { DB_URL } from "@/src/libs/constants";
import handleSaveProject from "@/src/utils/apiCalls/project/handleSaveProject";

describe("handleSaveProject API utility", () => {
  const mockSelectedFile = new File(["file contents"], "testFile.txt", {
    type: "text/plain",
  });
  const mockFileName = "testFile.txt";
  const mockNewProjectName = "New Project Name";

  beforeEach(() => {
    // Mock successful fetch response for project creation
    cy.intercept("POST", `${DB_URL}/api/projects/`, {
      statusCode: 200,
      body: {
        id: 1,
        name: mockNewProjectName,
        file_name: mockFileName,
      },
    }).as("saveProject");

    // Mock an error response for project creation (e.g., project name already in use)
    cy.intercept("POST", `${DB_URL}/api/projects/`, {
      statusCode: 400,
      body: { error: "Project name already in use" },
    }).as("saveProjectError");
  });

  it("creates project successfully", () => {
    // Stubbing the fetch call
    cy.stub(window, "fetch").resolves({
      ok: true,
      json: () =>
        Promise.resolve({
          id: 1,
          name: mockNewProjectName,
          file_name: mockFileName,
        }),
    });

    handleSaveProject(mockSelectedFile, mockFileName, mockNewProjectName)
      .then((result) => {
        // Verify the result
        expect(result).to.deep.equal({
          projectId: 1,
          projectName: mockNewProjectName,
          graphName: mockFileName,
        });

        // Ensure saveProject interceptor was called
        cy.wait("@saveProject").its("response.statusCode").should("eq", 200);
      })
      .catch((error) => {
        // Log any errors
        console.error("Failed to create project:", error);
        throw error; // Rethrow the error to fail the test
      });
  });

  it("handles project creation error", () => {
    // Stubbing the fetch call to simulate an error
    cy.stub(window, "fetch").rejects({
      ok: false,
      status: 400,
      json: () => Promise.resolve({ error: "Project name already in use" }),
    });

    // Call handleSaveProject and expect it to throw an error
    handleSaveProject(mockSelectedFile, mockFileName, mockNewProjectName)
      .then(() => {
        // If no error is thrown, fail the test
        throw new Error("Expected handleSaveProject to throw an error.");
      })
      .catch((error) => {
        // Ensure saveProjectError interceptor was called
        cy.wait("@saveProjectError")
          .its("response.statusCode")
          .should("eq", 400);

        // Verify the error message
        expect(error.message).to.equal("undefined");
      });
  });
});
