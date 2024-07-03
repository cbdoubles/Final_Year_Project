// describe("Project Page - Everthing Is Visable", () => {
//   beforeEach(() => {
//     cy.visit("/projectpage");
//   });

//   it("should render the header", () => {
//     // Check if Header component is rendered
//     cy.get('[data-testid="header"]').should("exist").and("be.visible");
//   });

//   it("should display the Capgemini logo", () => {
//     // Check if the logo image is rendered
//     cy.get('[data-testid="capgemini-logo"]')
//       .should("exist")
//       .should("be.visible")
//       .and("have.attr", "src", "/images/blackminiNG.png")
//       .and("have.attr", "alt", "Capgemini Logo");
//   });

//   it("should display sidebar", () => {
//     // Check if the logo image is rendered
//     cy.get('[data-testid = "side-bar"]').should("exist").and("be.visible");
//     cy.get('[data-testid="default-button"]').should("exist").and("be.visible");
//     cy.get('[data-testid="import-button"]').should("exist").and("be.visible");
//     cy.get('[data-testid="reupload-button"]').should("exist").and("be.visible");
//     cy.get('[data-testid="custom-button"]').should("exist").and("be.visible");
//     cy.get('[data-testid="favorite-button"]').should("exist").and("be.visible");
//     cy.get('[data-testid="switch-mode-button"]')
//       .should("exist")
//       .and("be.visible");
//   });

//   it("should display the buttons in basic mode", () => {
//     // Check if the logo image is rendered
//     cy.contains("Run").should("exist").and("be.visible");
//     cy.contains("Show Cypher").should("exist").and("be.visible");
//     cy.contains("Add to Favorites").should("exist").and("be.visible");
//   });

//   it("should display query text box in basic mode", () => {
//     // Check if the logo image is rendered
//     cy.get('[data-testid="basic-query-text-box"]')
//       .should("exist")
//       .and("be.visible");
//   });

//   it("should display buttons in advanced mode", () => {
//     // Check if the logo image is rendered
//     cy.get('[data-testid="switch-mode-button"]').click();
//     cy.get('[data-testid = "add-favorite-button"]')
//       .should("exist")
//       .and("be.visible");
//     cy.get('[data-testid = "add-custom-button"]')
//       .should("exist")
//       .and("be.visible");
//     cy.get('[data-testid = "run-button"]').should("exist").and("be.visible");
//     cy.get('[data-testid = "hide-show-naural-lang-button"]')
//       .should("exist")
//       .and("be.visible");
//   });

//   it("should display query text box in advanced mode", () => {
//     // Check if the logo image is rendered
//     cy.get('[data-testid="switch-mode-button"]').click();
//     cy.get('[data-testid="advanced-query-text-box"]')
//       .should("exist")
//       .and("be.visible");
//   });
// });

describe("Advance Mode Functionalites", () => {
  beforeEach(() => {
    cy.visit("/projectpage");
  });

  it("Add to Favorites ", () => {
    // Check if the logo image is rendered
    cy.get('[data-testid="switch-mode-button"]').click();
    cy.get('[data-testid = "add-favorite-button"]').click();
    cy.get('[ data-testid="save-pop-up-modal"]')
      .should("exist")
      .and("be.visible");
  });
});
