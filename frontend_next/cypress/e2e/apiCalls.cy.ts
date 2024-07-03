// describe('API Tests for fetchFolders', () => {
//   beforeEach(() => {
//     // Intercept the API call and mock the response
//     cy.intercept('GET', 'http://localhost:8000/api/folders/by-project/?project=1&type=testType', {
//       statusCode: 200,
//       body: [
//         { id: 1, name: 'Folder 1', type: 'testType' },
//         { id: 2, name: 'Folder 2', type: 'testType' },
//       ],
//     }).as('getFolders');

//     // Visit the index page where the API is called
//     cy.visit('/projectpgage');
//   });

//   it('should fetch and display folders', () => {
//     // Wait for the API call to complete
//     cy.wait('@getFolders');

//     // Verify that the folders are displayed correctly
//     cy.get('.folder-item').should('have.length', 2);
//     cy.get('.folder-item').first().should('contain.text', 'Folder 1');
//     cy.get('.folder-item').last().should('contain.text', 'Folder 2');
//   });

//   it('should handle API error gracefully', () => {
//     // Mock an error response
//     cy.intercept('GET', 'http://localhost:8000/api/folders/by-project/?project=1&type=testType', {
//       statusCode: 500,
//     }).as('getFoldersError');

//     // Visit the index page where the API is called
//     cy.visit('/');

//     // Wait for the API call to complete
//     cy.wait('@getFoldersError');

//     // Verify that the error message is displayed
//     cy.get('.error-message').should('contain.text', 'Error fetching folders');
//   });
// });

import { ProjectType, ProjectTypeFetch } from "@/src/libs/types";

const projectsFixture: ProjectTypeFetch[] = [
  {
    id: 1,
    name: "Project 1",
    file_name: "project1.graph",
  },
  {
    id: 2,
    name: "Project 2",
    file_name: "project2.graph",
  },
  {
    id: 3,
    name: "Project 3",
    file_name: "project3.graph",
  },
];

describe("fetchProjects API", () => {
  beforeEach(() => {
    // Intercept the API call and mock the response
    cy.intercept("GET", "http://localhost:8000/api/projects/", {
      statusCode: 200,
      body: projectsFixture,
    }).as("getProjects");

    // Visit the index page where the API is called
  });
  it("successfully fetches projects from the API", () => {
    cy.visit("/"); // Replace with the URL of your application

    // Retry the interception with a longer timeout
    cy.wait("@getProjects", { timeout: 10000 }).then((interception) => {
      const { response } = interception;

      // Check if response exists and status code is 200
      if (response && response.statusCode === 200) {
        // Assert on the number of projects fetched
        expect(response.body).to.have.length.greaterThan(0);

        // Add more assertions based on your API response structure
        response.body.forEach((project: ProjectType) => {
          expect(project.projectId).to.be.a("number");
          expect(project.projectName).to.be.a("string");
          expect(project.graphName).to.be.a("string");
        });

        // Optionally, you can also test UI interactions or state changes
        // For example, click on a project item and assert UI changes
        cy.get('[data-testid="select-existing-project-modal"]').first().click();
        cy.get('[data-testid="selected-project-name"]').should(
          "contain.text",
          response.body[0].name
        );
      } else {
        // Handle the case where response is undefined or status code is not 200
        const errorMessage = response
          ? `API call failed with status ${response.statusCode}`
          : "API call failed";
        throw new Error(errorMessage);
      }
    });
  });
});
