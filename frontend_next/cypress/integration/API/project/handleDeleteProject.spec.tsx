// cypress/integration/handleDeleteProject.spec.ts
/* global cy */
import { DB_URL } from "@/src/libs/constants";
import { handleDeleteConfirm } from "@/src/utils/apiCalls/project/handleDeleteProject";

describe("handleDeleteConfirm API utility", () => {
  const mockProject = {
    projectId: 1,
    projectName: "Project 1",
    graphName: "project1.graph",
  };

  beforeEach(() => {
    // Mock successful fetch response for project deletion
    cy.intercept("DELETE", `${DB_URL}/api/projects/${mockProject.projectId}/`, {
      statusCode: 200,
    }).as("deleteProject");

    // Mock an error response for project deletion
    cy.intercept("DELETE", `${DB_URL}/api/projects/${mockProject.projectId}/`, {
      statusCode: 500,
      body: { error: "Internal Server Error" },
    }).as("deleteProjectError");
  });

  it("deletes project successfully", async () => {
    const setDeletingElement = cy.stub().as("setDeletingElement");
    const setElements = cy.stub().as("setElements");
    const elements = [mockProject];

    await handleDeleteConfirm(
      mockProject,
      setDeletingElement,
      setElements,
      elements
    );

    // Verify setDeletingElement and setElements were called with expected arguments
    cy.wrap(setDeletingElement).should("be.calledOnceWithExactly", null);
    cy.wrap(setElements).should("be.calledOnceWithExactly", []);

    // Ensure deleteProject interceptor was called
    cy.wait("@deleteProject").its("response.statusCode").should("eq", 200);
  });

  it("handles project deletion error", async () => {
    const setDeletingElement = cy.stub().as("setDeletingElement");
    const setElements = cy.stub().as("setElements");
    const elements = [mockProject];

    // Trigger deletion with error response
    await handleDeleteConfirm(
      mockProject,
      setDeletingElement,
      setElements,
      elements
    );

    // Verify setDeletingElement and setElements were not called
    cy.wrap(setDeletingElement).should("not.be.called");
    cy.wrap(setElements).should("not.be.called");

    // Ensure deleteProjectError interceptor was called
    cy.wait("@deleteProjectError").its("response.statusCode").should("eq", 500);

    // Verify console error message
    cy.window()
      .its("console")
      .invoke("error")
      .should("contain", "Error deleting project");
  });

  it("handles null deletingElement", async () => {
    const setDeletingElement = cy.stub().as("setDeletingElement");
    const setElements = cy.stub().as("setElements");
    const elements = [mockProject];

    // Call with null deletingElement
    await handleDeleteConfirm(null, setDeletingElement, setElements, elements);

    // Verify setDeletingElement and setElements were not called
    cy.wrap(setDeletingElement).should("not.be.called");
    cy.wrap(setElements).should("not.be.called");

    // Ensure no interceptors were hit
    cy.wait("@deleteProject", { timeout: 0 })
      .its("response.statusCode")
      .should("not.exist");
    cy.wait("@deleteProjectError", { timeout: 0 })
      .its("response.statusCode")
      .should("not.exist");
  });
});
