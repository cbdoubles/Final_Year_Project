describe("Project Page - Everthing Is Visable", () => {
  beforeEach(() => {
    cy.visit("/projectpage");
  });

  it("should render the header", () => {
    // Check if Header component is rendered
    cy.get('[data-testid="header"]').should("exist").and("be.visible");
  });

  it("should display the project logo", () => {
    // Check if the logo image is rendered
    cy.get('[data-testid="project-logo"]')
      .should("exist")
      .should("be.visible")
      .and("have.attr", "src", "/images/blackminiNG.png")
      .and("have.attr", "alt", "Project Logo");
  });

  it("should display the buttons", () => {
    // Check if the logo image is rendered
    cy.contains("Run").should("exist").and("be.visible");
    cy.contains("Show Cypher").should("exist").and("be.visible");
    cy.contains("Add to Favorites").should("exist").and("be.visible");
  });
});
