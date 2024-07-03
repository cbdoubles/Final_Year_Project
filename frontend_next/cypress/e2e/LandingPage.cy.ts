import { existsSync } from "fs";

describe("Home Page Components Are Rendered", () => {
  beforeEach(() => {
    cy.visit("/"); // Visit the home page
  });

  it("should render the header", () => {
    // Check if Header component is rendered
    cy.get('[data-testid="header"]').should("exist").and("be.visible");
  });

  it("should render the Capgemini logo", () => {
    // Check if the logo image is rendered
    cy.get('[data-testid="capgemini-logo"]')
      .should("exist")
      .should("be.visible")
      .and("have.attr", "src", "/images/blackminiNG.png")
      .and("have.attr", "alt", "Capgemini Logo");
  });

  it("should render the main card", () => {
    // Check if the main card is rendered
    cy.get('[data-testid="main-card"]').should("exist").and("be.visible");
  });

  it("should render the card with buttons", () => {
    // Check if the buttons inside the main card are rendered
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
    cy.get('[data-testid="select-exising-project-modal"]')
      .should("exist")
      .and("be.visible");
    cy.contains("Close").scrollIntoView().should("exist").and("be.visible");
    cy.contains("Select").should("exist").and("be.visible");
    cy.contains("Close").click();
    cy.get('[data-testid="select-exising-project-modal"]').should(
      "not.be.visible"
    );
  });
});

describe("Start New Project", () => {
  beforeEach(() => {
    cy.visit("/"); // Visit the home page
  });

  it('should open and close the "Select Existing Project" modal', () => {
    // Click the "Select existing project" button - Modal should Open
    const fileName = "test-file.json";
    const fileContent = '{"name": "test"}';
    const fileType = "application/json";
    const testFile = new Blob([fileContent], { type: fileType });

    cy.contains("Start new project").click();
    cy.get('[data-testid="start-new-project-modal"]')
      .should("exist")
      .and("be.visible");
    cy.contains("Select File").should("exist").and("be.visible");
    cy.get('[data-testid = "select-file"]').should("exist").and("be.visible");
    cy.get('[data-testid="project-name-text-field"]')
      .should("exist")
      .and("be.visible");
    cy.get('[data-testid="file-name-text-field"]')
      .should("exist")
      .and("be.visible");
    cy.get('[data-testid="project-name-text-field"]')
      .type("TestProject")
      .should("have.value", "TestProject");
    cy.get('[data-testid="file-name-text-field"]')
      .type("TestFile")
      .should("have.value", "TestFile");
    cy.get('[data-testid="select-file-upload"]').click();
  });
});
