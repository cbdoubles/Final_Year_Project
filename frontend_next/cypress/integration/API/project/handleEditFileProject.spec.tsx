// cypress/integration/handleEditFileProject.spec.ts
/* global cy */
import { DB_URL } from "@/src/libs/constants";
import { uploadFile } from "@/src/utils/apiCalls/project/handleEditFileProject";

describe("uploadFile API utility", () => {
  const mockProjectId = 1;
  const mockSelectedFile = new File(["file contents"], "testFile.txt", {
    type: "text/plain",
  });
  const mockFileName = "testFile.txt";

  beforeEach(() => {
    // Mock successful fetch response for file upload
    cy.intercept("PATCH", `${DB_URL}/api/projects/${mockProjectId}/`, {
      statusCode: 200,
      body: {
        id: mockProjectId,
        name: "Project 1",
        file_name: mockFileName,
      },
    }).as("uploadFile");

    // Mock an error response for file upload
    cy.intercept("PATCH", `${DB_URL}/api/projects/${mockProjectId}/`, {
      statusCode: 500,
      body: { error: "Internal Server Error" },
    }).as("uploadFileError");
  });

  it("uploads file successfully", () => {
    // Stubbing the fetch call
    cy.stub(window, "fetch").resolves({
      ok: true,
      json: () =>
        Promise.resolve({
          id: mockProjectId,
          name: "Project 1",
          file_name: mockFileName,
        }),
    });

    uploadFile(mockProjectId, mockSelectedFile, mockFileName)
      .then((result) => {
        // Verify the result
        expect(result).to.deep.equal({
          projectId: mockProjectId,
          projectName: "Project 1",
          graphName: mockFileName,
        });

        // Ensure uploadFile interceptor was called
        cy.wait("@uploadFile").its("response.statusCode").should("eq", 200);
      })
      .catch((error) => {
        // Log any errors
        console.error("Failed to upload file:", error);
        throw error; // Rethrow the error to fail the test
      });
  });

  it("handles file upload error", () => {
    // Stubbing the fetch call
    cy.stub(window, "fetch").rejects({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ error: "Internal Server Error" }),
    });

    uploadFile(mockProjectId, mockSelectedFile, mockFileName)
      .then(() => {
        // If no error is thrown, fail the test
        throw new Error("Expected uploadFile to throw an error.");
      })
      .catch((error) => {
        // Ensure uploadFileError interceptor was called
        cy.wait("@uploadFileError")
          .its("response.statusCode")
          .should("eq", 500);

        // Verify the error message
        expect(error.message).to.equal("Failed to upload file");
      });
  });
});
