/* global cy */
describe("Home Page Components Are Rendered", () => {
  beforeEach(() => {
    cy.visit("/"); // Visit the home page
  });

  it("should render the header", () => {
    // Check if Header component is rendered
    cy.get('[data-testid="header"]').should("exist").and("be.visible");
  });

  it("should render the Capgemini logo", () => {
    // Check if the Capgemini logo image is rendered and visible
    cy.get('[data-testid="capgemini-logo"]')
      .should("exist")
      .should("be.visible");
  });

  it("should render the main card", () => {
    // Check if the main card component is rendered and visible
    cy.get('[data-testid="main-card"]').should("exist").and("be.visible");
  });

  it("should render the card with buttons", () => {
    // Check if the buttons inside the main card are rendered and visible
    cy.contains("Select existing project").should("exist").and("be.visible");
    cy.contains("Start new project").should("exist").and("be.visible");
  });
});

describe("Select Existing Project", () => {
  beforeEach(() => {
    cy.visit("/"); // Visit the home page
  });

  it('should open and close the "Select Existing Project" modal', () => {
    // Click the "Select existing project" button - Modal should Open
    cy.contains("Select existing project").click();
    // Verify if the modal for selecting an existing project is visible
    cy.get('[data-testid="select-exising-project-modal"]')
      .should("exist")
      .and("be.visible");
    cy.wait(300);
    // Verify if the "Close" and "Select" buttons are visible in the modal
    cy.contains("Close").scrollIntoView().should("exist").and("be.visible");
    cy.contains("Select").should("exist").and("be.visible");
    // Close the modal by clicking the "Close" button
    cy.contains("Close").click();
  });
});

describe("Start New Project", () => {
  beforeEach(() => {
    cy.visit("/"); // Visit the home page
  });

  it('should open and close the "Start New Project" modal', () => {
    // Click the "Start new project" button - Modal should Open
    cy.contains("Start new project").click();
    // Verify if the modal for starting a new project is visible
    cy.get('[data-testid="start-new-project-modal"]')
      .should("exist")
      .and("be.visible");
    // Verify if the "Select File" button and text fields are visible
    cy.contains("Select File").should("exist").and("be.visible");
    cy.get('[data-testid="select-file-upload"]')
      .should("exist")
      .and("be.visible");
    cy.get('[data-testid="project-name-text-field"]')
      .should("exist")
      .and("be.visible");
    cy.get('[data-testid="file-name-text-field"]')
      .should("exist")
      .and("be.visible");
    // Enter a project name and file name in the text fields
    cy.get('[data-testid="project-name-text-field"]')
      .type("TestProject")
      .should("have.value", "TestProject");
    cy.get('[data-testid="file-name-text-field"]')
      .type("TestFile")
      .should("have.value", "TestFile");
    // Click the "Select File" button to proceed
    cy.get('[data-testid="select-file-upload"]').click();
  });
});
