/* global cy */
/* global Cypress */
describe("Project Page - Visibility of Components", () => {
  beforeEach(() => {
    cy.visit("/"); // Visit the home page
  });

  it("should render the header after navigating to project page", () => {
    cy.contains("Select existing project").click();
    cy.contains("Cypress-Testing DO NOT DELETE").click();
    cy.get('[data-testid="select-project-home-button"]').click();
    cy.url().should("eq", `${Cypress.config().baseUrl}/projectpage`);
    cy.wait(500);
    cy.get('[data-testid="header"]').should("exist").and("be.visible");
  });

  it("should display the Capgemini logo", () => {
    cy.get('[data-testid="capgemini-logo"]').should("exist").and("be.visible");
  });

  it("should display the sidebar with all buttons", () => {
    cy.contains("Select existing project").click();
    cy.contains("Cypress-Testing DO NOT DELETE").click();
    cy.get('[data-testid="select-project-home-button"]').click();
    cy.url().should("eq", `${Cypress.config().baseUrl}/projectpage`);
    cy.wait(500);

    cy.get('[data-testid="side-bar"]').should("exist").and("be.visible");
    cy.get('[data-testid="default-button"]').should("exist").and("be.visible");
    cy.get('[data-testid="import-button"]').should("exist").and("be.visible");
    cy.get('[data-testid="reupload-button"]').should("exist").and("be.visible");
    cy.get('[data-testid="custom-button"]').should("exist").and("be.visible");
    cy.get('[data-testid="favorite-button"]').should("exist").and("be.visible");
    cy.get('[data-testid="switch-mode-button"]')
      .should("exist")
      .and("be.visible");
  });

  it("should display the main buttons in basic mode", () => {
    cy.contains("Select existing project").click();
    cy.contains("Cypress-Testing DO NOT DELETE").click();
    cy.get('[data-testid="select-project-home-button"]').click();
    cy.url().should("eq", `${Cypress.config().baseUrl}/projectpage`);
    cy.wait(500);

    cy.contains("Run").should("exist").and("be.visible");
    cy.contains("Show Cypher").should("exist").and("be.visible");
    cy.contains("Add to Favorites").should("exist").and("be.visible");
  });

  it("should display the query text box in basic mode", () => {
    cy.contains("Select existing project").click();
    cy.contains("Cypress-Testing DO NOT DELETE").click();
    cy.get('[data-testid="select-project-home-button"]').click();
    cy.url().should("eq", `${Cypress.config().baseUrl}/projectpage`);
    cy.wait(500);

    cy.get('[data-testid="basic-query-text-box"]')
      .should("exist")
      .and("be.visible");
  });

  it("should display the main buttons in advanced mode", () => {
    cy.contains("Select existing project").click();
    cy.contains("Cypress-Testing DO NOT DELETE").click();
    cy.get('[data-testid="select-project-home-button"]').click();
    cy.url().should("eq", `${Cypress.config().baseUrl}/projectpage`);
    cy.wait(500);

    cy.get('[data-testid="switch-mode-button"]').click();
    cy.get('[data-testid="add-favorite-button"]')
      .should("exist")
      .and("be.visible");
    cy.get('[data-testid="add-custom-button"]')
      .should("exist")
      .and("be.visible");
    cy.get('[data-testid="run-button"]').should("exist").and("be.visible");
    cy.get('[data-testid="hide-show-naural-lang-button"]')
      .should("exist")
      .and("be.visible");
  });

  it("should display the query text box in advanced mode", () => {
    cy.contains("Select existing project").click();
    cy.contains("Cypress-Testing DO NOT DELETE").click();
    cy.get('[data-testid="select-project-home-button"]').click();
    cy.url().should("eq", `${Cypress.config().baseUrl}/projectpage`);
    cy.wait(500);

    cy.get('[data-testid="switch-mode-button"]').click();
    cy.get('[data-testid="advanced-query-text-box"]')
      .should("exist")
      .and("be.visible");
  });
});

describe("Advance Mode Button Functionalites", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("Add to Favorites - Create New Folder", () => {
    cy.contains("Select existing project").click();
    cy.contains("Cypress-Testing DO NOT DELETE").click();
    cy.get('[data-testid= "select-project-home-button"]').click();
    cy.url().should("eq", `${Cypress.config().baseUrl}/projectpage`);

    cy.wait(500);

    cy.get('[data-testid="switch-mode-button"]').click();
    cy.get('[data-testid = "add-favorite-button"]').click();
    cy.get('[ data-testid="save-pop-up-modal"]')
      .should("exist")
      .and("be.visible");
    cy.get('[data-testid= "query-text-field"]')
      .eq(0)
      .should("have.attr", "placeholder", "Type here");

    cy.get('[data-testid= "query-text-field"]')
      .eq(0)
      .type("TestQueryCustom")
      .should("have.value", "TestQueryCustom");

    cy.get('[data-testid= "query-text-field"]')
      .eq(1)
      .should("have.attr", "placeholder", "Type here");

    cy.get('[data-testid= "query-text-field"]')
      .eq(1)
      .type("MATCH (n) RETURN n LIMIT 3")
      .should("have.value", "MATCH (n) RETURN n LIMIT 3");

    cy.get('[data-testid= "query-text-field"]')
      .eq(2)
      .should("have.attr", "placeholder", "Type here");

    cy.get('[data-testid= "query-text-field"]')
      .eq(2)
      .type("Returns up to 3 nodes in the graph")
      .should("have.value", "Returns up to 3 nodes in the graph");

    cy.wait(400);

    cy.get('[data-testid="select-folder-button"]').should("be.visible");

    cy.get('[data-testid="select-folder-button"]').click();

    cy.get('[data-teestid="select-folder-modal"]').should("be.visible");

    cy.get('[data-testid = "create-new-folder-button"]')
      .should("exist")
      .and("be.visible");

    cy.get('[data-testid = "create-new-folder-button"]').click();

    cy.get('[data-testid = "new-folder-modal"]')
      .should("exist")
      .and("be.visible");

    cy.get('[data-testid="folder-name-project-page-text-field"]')
      .should("exist")
      .and("be.visible");

    cy.get('[data-testid="folder-name-project-page-text-field"]').type(
      "TestFolderFavorite"
    );

    cy.get('[data-testid="save-folder-modal-button"]')
      .should("exist")
      .and("be.visible");

    cy.get('[data-testid="save-folder-modal-button"]')
      .should("exist")
      .and("be.visible");
  });

  it("Add to Favorites - Select Existing folder ", () => {
    cy.contains("Select existing project").click();
    cy.contains("Cypress-Testing DO NOT DELETE").click();
    cy.get('[data-testid= "select-project-home-button"]').click();
    cy.url().should("eq", `${Cypress.config().baseUrl}/projectpage`);

    cy.wait(500);

    cy.get('[data-testid="switch-mode-button"]').click();
    cy.get('[data-testid = "add-favorite-button"]').click();
    cy.get('[ data-testid="save-pop-up-modal"]')
      .should("exist")
      .and("be.visible");
    cy.get('[data-testid= "query-text-field"]')
      .eq(0)
      .should("have.attr", "placeholder", "Type here");

    cy.get('[data-testid= "query-text-field"]')
      .eq(0)
      .type("TestQueryCustom")
      .should("have.value", "TestQueryCustom");

    cy.get('[data-testid= "query-text-field"]')
      .eq(1)
      .should("have.attr", "placeholder", "Type here");

    cy.get('[data-testid= "query-text-field"]')
      .eq(1)
      .type("MATCH (n) RETURN n LIMIT 3")
      .should("have.value", "MATCH (n) RETURN n LIMIT 3");

    cy.get('[data-testid= "query-text-field"]')
      .eq(2)
      .should("have.attr", "placeholder", "Type here");

    cy.get('[data-testid= "query-text-field"]')
      .eq(2)
      .type("Returns up to 3 nodes in the graph")
      .should("have.value", "Returns up to 3 nodes in the graph");

    cy.wait(400);

    cy.get('[data-testid="select-folder-button"]').should("be.visible");

    cy.get('[data-test-id="add-to-favorite-save-button"]')
      .should("exist")
      .and("be.visible");

    cy.get('[data-test-id="add-to-favorite-cancel-button"]')
      .should("exist")
      .and("be.visible");

    cy.contains("Cancel").should("exist").and("be.visible");

    cy.get('[data-testid="select-folder-button"]').click();

    cy.get('[data-teestid="select-folder-modal"]').should("be.visible");

    cy.contains("Project Favorite Queries").should("be.visible");

    cy.contains("Project Favorite Queries").click();

    cy.get('[ data-testid = "select-folder-button"]')
      .should("exist")
      .and("be.visible");

    cy.get('[ data-testid = "select-folder-button"]').eq(1).click();

    cy.wait(500);

    cy.get('[data-test-id="add-to-favorite-save-button"]').click();
  });

  it("Add to Favorites - Close Modal", () => {
    cy.contains("Select existing project").click();
    cy.contains("Cypress-Testing DO NOT DELETE").click();
    cy.get('[data-testid= "select-project-home-button"]').click();
    cy.url().should("eq", `${Cypress.config().baseUrl}/projectpage`);

    cy.wait(500);

    cy.get('[data-testid="switch-mode-button"]').click();
    cy.get('[data-testid = "add-custom-button"]').click();
    cy.get('[ data-testid="save-pop-up-modal"]')
      .should("exist")
      .and("be.visible");

    cy.get('[data-test-id="add-to-custom-cancel-button"]').click();
  });

  it("Add to Customs - Create New Folder", () => {
    cy.contains("Select existing project").click();
    cy.contains("Cypress-Testing DO NOT DELETE").click();
    cy.get('[data-testid= "select-project-home-button"]').click();
    cy.url().should("eq", `${Cypress.config().baseUrl}/projectpage`);

    cy.wait(500);

    cy.get('[data-testid="switch-mode-button"]').click();
    cy.get('[data-testid = "add-custom-button"]').click();
    cy.get('[ data-testid="save-pop-up-modal"]')
      .should("exist")
      .and("be.visible");
    cy.get('[data-testid= "query-text-field"]')
      .eq(0)
      .should("have.attr", "placeholder", "Type here");

    cy.get('[data-testid= "query-text-field"]')
      .eq(0)
      .type("TestQueryCustom")
      .should("have.value", "TestQueryCustom");

    cy.get('[data-testid= "query-text-field"]')
      .eq(1)
      .should("have.attr", "placeholder", "Type here");

    cy.get('[data-testid= "query-text-field"]')
      .eq(1)
      .type("MATCH (n) RETURN n LIMIT 3")
      .should("have.value", "MATCH (n) RETURN n LIMIT 3");

    cy.get('[data-testid= "query-text-field"]')
      .eq(2)
      .should("have.attr", "placeholder", "Type here");

    cy.get('[data-testid= "query-text-field"]')
      .eq(2)
      .type("Returns up to 3 nodes in the graph")
      .should("have.value", "Returns up to 3 nodes in the graph");

    cy.wait(400);

    cy.get('[data-testid="select-folder-button"]').should("be.visible");

    cy.get('[data-testid="select-folder-button"]').click();

    cy.get('[data-teestid="select-folder-modal"]').should("be.visible");

    cy.get('[data-testid = "create-new-folder-button"]')
      .should("exist")
      .and("be.visible");

    cy.get('[data-testid = "create-new-folder-button"]').click();

    cy.get('[data-testid = "new-folder-modal"]')
      .should("exist")
      .and("be.visible");

    cy.get('[data-testid="folder-name-project-page-text-field"]')
      .should("exist")
      .and("be.visible");

    cy.get('[data-testid="folder-name-project-page-text-field"]').type(
      "TestFolderCustoms"
    );

    cy.get('[data-testid="save-folder-modal-button"]')
      .should("exist")
      .and("be.visible");

    cy.get('[data-testid="save-folder-modal-button"]')
      .should("exist")
      .and("be.visible");
  });

  it(" Add to Customs - Select Existing Folder", () => {
    cy.contains("Select existing project").click();
    cy.contains("Cypress-Testing DO NOT DELETE").click();
    cy.get('[data-testid= "select-project-home-button"]').click();
    cy.url().should("eq", `${Cypress.config().baseUrl}/projectpage`);

    cy.wait(500);

    cy.get('[data-testid="switch-mode-button"]').click();
    cy.get('[data-testid = "add-custom-button"]').click();
    cy.get('[ data-testid="save-pop-up-modal"]')
      .should("exist")
      .and("be.visible");
    cy.get('[data-testid= "query-text-field"]')
      .eq(0)
      .should("have.attr", "placeholder", "Type here");

    cy.get('[data-testid= "query-text-field"]')
      .eq(0)
      .type("TestQueryCustom")
      .should("have.value", "TestQueryCustom");

    cy.get('[data-testid= "query-text-field"]')
      .eq(1)
      .should("have.attr", "placeholder", "Type here");

    cy.get('[data-testid= "query-text-field"]')
      .eq(1)
      .type("MATCH (n) RETURN n LIMIT 3")
      .should("have.value", "MATCH (n) RETURN n LIMIT 3");

    cy.get('[data-testid= "query-text-field"]')
      .eq(2)
      .should("have.attr", "placeholder", "Type here");

    cy.get('[data-testid= "query-text-field"]')
      .eq(2)
      .type("Returns up to 3 nodes in the graph")
      .should("have.value", "Returns up to 3 nodes in the graph");

    cy.wait(400);

    cy.get('[data-testid="select-folder-button"]').should("be.visible");

    cy.get('[data-test-id="add-to-custom-save-button"]')
      .should("exist")
      .and("be.visible");

    cy.get('[data-test-id="add-to-custom-cancel-button"]')
      .should("exist")
      .and("be.visible");

    cy.contains("Cancel").should("exist").and("be.visible");

    cy.get('[data-testid="select-folder-button"]').click();

    cy.get('[data-teestid="select-folder-modal"]').should("be.visible");

    cy.contains("Project Custom Queries").should("be.visible");

    cy.contains("Project Custom Queries").click();

    cy.get('[ data-testid = "select-folder-button"]')
      .should("exist")
      .and("be.visible");

    cy.get('[ data-testid = "select-folder-button"]').eq(1).click();

    cy.wait(500);

    cy.get('[data-test-id="add-to-custom-save-button"]').click();
  });

  it("Add to Customs - Close Modal ", () => {
    cy.contains("Select existing project").click();
    cy.contains("Cypress-Testing DO NOT DELETE").click();
    cy.get('[data-testid= "select-project-home-button"]').click();
    cy.url().should("eq", `${Cypress.config().baseUrl}/projectpage`);

    cy.wait(500);

    cy.get('[data-testid="switch-mode-button"]').click();
    cy.get('[data-testid = "add-custom-button"]').click();
    cy.get('[ data-testid="save-pop-up-modal"]')
      .should("exist")
      .and("be.visible");

    cy.get('[data-test-id="add-to-custom-cancel-button"]').click();
  });
});

describe("Cypher Query/Natural Lag Visibility Toggle", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("Toggle Cypher Query Visibility", () => {
    cy.contains("Select existing project").click();
    cy.contains("Cypress-Testing DO NOT DELETE").click();
    cy.get('[data-testid= "select-project-home-button"]').click();
    cy.url().should("eq", `${Cypress.config().baseUrl}/projectpage`);
    cy.wait(500);

    cy.contains("Show Cypher query").should("exist").and("be.visible").click();
    cy.contains("Ensure that the Project ID is incorported in the query")
      .should("exist")
      .and("be.visible");
    cy.contains("Hide Cypher Query").should("exist").and("be.visible").click();
    cy.contains("Show Cypher query").should("exist").and("be.visible");
  });

  it("Toggle Natural Language Visibility", () => {
    cy.contains("Select existing project").click();
    cy.contains("Cypress-Testing DO NOT DELETE").click();
    cy.get('[data-testid= "select-project-home-button"]').click();
    cy.url().should("eq", `${Cypress.config().baseUrl}/projectpage`);
    cy.wait(500);

    cy.get("[data-testid = switch-mode-button]").click();
    cy.wait(500);
    cy.contains("Show Natural Lang").should("exist").and("be.visible").click();
    cy.contains("Hide Natural Lang").should("exist").and("be.visible").click();
    cy.contains("Show Natural Lang").should("exist").and("be.visible");
  });
});

describe("Run Default Query", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("Run - Basic Mode", () => {
    cy.contains("Select existing project").click();
    cy.contains("Cypress-Testing DO NOT DELETE").click();
    cy.get('[data-testid= "select-project-home-button"]').click();
    cy.url().should("eq", `${Cypress.config().baseUrl}/projectpage`);

    cy.wait(500);

    cy.get('[data-testid ="default-button"]').click();
    cy.contains("Retrieve Nodes").should("exist").and("be.visible").click();
    cy.get('[ data-testid="default-pop-up-select-button"]')
      .should("exist")
      .and("be.visible");

    cy.get('[ data-testid="default-pop-up-select-button"]')
      .should("exist")
      .click();
    cy.contains("Run").click();
    cy.get('[data-testid="graph-table-display"]')
      .should("exist")
      .and("be.visible");
  });
});

describe("Run Favorite Query", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("Run - Basic Mode", () => {
    cy.contains("Select existing project").click();
    cy.contains("Cypress-Testing DO NOT DELETE").click();
    cy.get('[data-testid= "select-project-home-button"]').click();
    cy.url().should("eq", `${Cypress.config().baseUrl}/projectpage`);

    cy.wait(500);

    cy.get('[data-testid = "favorite-button"]')
      .should("exist")
      .and("be.visible")
      .click();

    cy.contains("Project Favorite Queries").should("exist").click();
    cy.contains("Project Favorite Queries").should("exist").click();
    cy.get('[data-testid="query-select"]').should("exist").click();
    cy.get('[data-testid = "select-query-side-bar-button"]')
      .should("exist")
      .click();
    cy.contains("Run").should("exist").click();
    cy.get('[data-testid="graph-table-display"]')
      .should("exist")
      .and("be.visible");
  });
});

describe("Run Custom Query", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("Run Custom Query - Basic Mode", () => {
    cy.contains("Select existing project").click();
    cy.contains("Cypress-Testing DO NOT DELETE").click();
    cy.get('[data-testid= "select-project-home-button"]').click();
    cy.url().should("eq", `${Cypress.config().baseUrl}/projectpage`);

    cy.wait(500);

    cy.get('[data-testid = "custom-button"]')
      .should("exist")
      .and("be.visible")
      .click();

    cy.contains("Project Custom Queries").should("exist").click();
    cy.contains("Project Custom Queries").should("exist").click();
    cy.get('[data-testid="query-select"]').should("exist").click();
    cy.get('[data-testid = "select-query-side-bar-button"]')
      .should("exist")
      .click();

    cy.contains("Run").should("exist").click();
    cy.contains("Fill in the query text before proceeding.");
  });
});

describe("Side Bar Button Functionality - Excluding Favorites and Customs", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("Run  ", () => {
    cy.contains("Select existing project").click();
    cy.contains("Cypress-Testing DO NOT DELETE").click();
    cy.get('[data-testid= "select-project-home-button"]').click();
    cy.url().should("eq", `${Cypress.config().baseUrl}/projectpage`);

    cy.wait(500);

    cy.get('[data-testid = "reupload-button"]')
      .should("exist")
      .and("be.visible")
      .click();

    cy.get('[ data-testid="reupload-data-modal"]')
      .should("exist")
      .and("be.visible");

    cy.get('[data-testid="reupload-file-name-text-field"]')
      .should("exist")
      .and("be.visible");

    cy.get('[data-testid="reupload-file-name-text-field"]')
      .type("TestQueryCustom")
      .should("have.value", "TestQueryCustom");

    cy.get('[data-testid="select-file-reupload-button"]')
      .should("exist")
      .and("be.visible");

    cy.get('[data-testid="select-file-reupload-button"]').click();
  });
});
