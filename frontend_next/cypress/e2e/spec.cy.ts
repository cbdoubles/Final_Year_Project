describe("template spec", () => {
  beforeEach(() => {
    // Visit the home page before each test
    cy.visit("/")
  })

  //Test if buttons are visable
  it("should display the buttons", () => {
    // Check if the buttons are displayed and have the correct text
    cy.contains("button", "Existing Project").should("be.visible")
    cy.contains("button", "New Project").should("be.visible")
  })
})
