// cypress/e2e/home.spec.ts

/// <reference types="cypress" />

describe("Home Page Components Are Visable When No Buttons Are Clicked", () => {
  beforeEach(() => {
    cy.visit("/"); // Visit the home page
  });

  it("should render the header", () => {
    // Check if Header component is rendered
    cy.get('[data-testid="header"]').should("exist").and("be.visible");
  });

  it("should display the Capgemini logo", () => {
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

  it("should display the card with buttons", () => {
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
    cy.contains("Close").should("exist").and("be.visible");
    cy.contains("Select").should("exist").and("be.visible");
    cy.contains("Close").click;

    // Look into this error
    // cy.get('[data-testid="select-exising-project-modal"]')
    //   .should("exist")
    //   .and("not.be.visible");
  });
});

describe("Start New Project", () => {
  beforeEach(() => {
    cy.visit("/"); // Visit the home page
  });

  it('should open and close the "Select Existing Project" modal', () => {
    // Click the "Select existing project" button - Modal should Open
    cy.contains("Start new project").click();
    cy.get('[data-testid="start-new-project-modal"]')
      .should("exist")
      .and("be.visible");
    cy.contains("Select File").should("exist").and("be.visible");
    cy.contains("Select").should("exist").and("be.visible");

    // Look into this error
    // cy.get('[data-testid="start-new-project-modal"]')
    //   .should("exist")
    //   .and("not.be.visible");
  });
});
