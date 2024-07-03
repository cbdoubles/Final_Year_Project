/* global cy */
/// <reference types="cypress" />
import React from "react";

import { TestComponent } from "../../test/ProjectContextTest"; // Assuming the TestComponent is saved in the components directory

import { ProjectPropsProvider } from "@/src/contexts/ProjectContext";

describe("<ProjectPropsProvider />", () => {
  beforeEach(() => {
    cy.mount(
      <ProjectPropsProvider>
        <TestComponent />
      </ProjectPropsProvider>
    );
  });

  it("initially renders with default values", () => {
    // Initial values
    cy.get("#project-id").should("contain", "Project ID: 0");
    cy.get("#project-name").should("contain", "Project Name: ");
    cy.get("#graph-name").should("contain", "Graph Name: ");
  });

  it("sets project id", () => {
    // Set project ID
    cy.get("#set-project-id").click();
    cy.get("#project-id").should("contain", "Project ID: 42");
  });

  it("sets project name", () => {
    // Set project name
    cy.get("#set-project-name").click();
    cy.get("#project-name").should("contain", "Project Name: Test Project");
  });

  it("sets graph name", () => {
    // Set graph name
    cy.get("#set-graph-name").click();
    cy.get("#graph-name").should("contain", "Graph Name: Test Graph");
  });

  it("resets project", () => {
    // Change values before reset
    cy.get("#set-project-id").click();
    cy.get("#set-project-name").click();
    cy.get("#set-graph-name").click();
    // Reset project
    cy.get("#reset-project").click();
    cy.get("#project-id").should("contain", "Project ID: 0");
    cy.get("#project-name").should("contain", "Project Name: ");
    cy.get("#graph-name").should("contain", "Graph Name: ");
  });
});
