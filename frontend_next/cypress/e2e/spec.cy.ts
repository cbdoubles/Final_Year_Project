describe("template spec", () => {
  beforeEach(() => {
    // Visit the home page before each test
    cy.visit("/")
  })

  it("passes", () => {
    cy.get('[data-frame="header-1"]').should("contain.text", "Querify")
  })

  it("should display the buttons", () => {
    // Check if the buttons are displayed and have the correct text
    cy.contains("button", "Existing Project").should("be.visible")

    cy.contains("button", "New Project").should("be.visible")
  })
})
