/// <reference types="cypress" />
import React from "react";

import { QueryPropsProvider } from "../../src/contexts/QueryContext";
import TestComponent from "../../test/QueryContextTest"; // Assuming the TestComponent is saved in the components directory

describe("<QueryPropsProvider />", () => {
  beforeEach(() => {
    cy.mount(
      <QueryPropsProvider>
        <TestComponent />
      </QueryPropsProvider>
    );
  });

  it("initially renders with default values", () => {
    // Initial values
    cy.get("#cypher-query").should("contain", "Cypher Query: ");
    cy.get("#query-id").should("contain", "Query ID: 0");
    cy.get("#query-name").should("contain", "Query Name: ");
    cy.get("#nat-lang").should("contain", "Natural Language: ");
  });

  it("sets cypher query", () => {
    // Set cypher query
    cy.get("#set-cypher-query").click();
    cy.get("#cypher-query").should(
      "contain",
      "Cypher Query: MATCH (n) RETURN n"
    );
  });

  it("sets query id", () => {
    // Set query ID
    cy.get("#set-query-id").click();
    cy.get("#query-id").should("contain", "Query ID: 42");
  });

  it("sets query name", () => {
    // Set query name
    cy.get("#set-query-name").click();
    cy.get("#query-name").should("contain", "Query Name: Test Query");
  });

  it("sets natural language query", () => {
    // Set natural language query
    cy.get("#set-nat-lang").click();
    cy.get("#nat-lang").should("contain", "Natural Language: Find all nodes");
  });

  it("resets query context", () => {
    // Change values before reset
    cy.get("#set-cypher-query").click();
    cy.get("#set-query-id").click();
    cy.get("#set-query-name").click();
    cy.get("#set-nat-lang").click();
    // Reset query context
    cy.get("#reset-query-context").click();
    cy.get("#cypher-query").should("contain", "Cypher Query: ");
    cy.get("#query-id").should("contain", "Query ID: 0");
    cy.get("#query-name").should("contain", "Query Name: ");
    cy.get("#nat-lang").should("contain", "Natural Language: ");
  });

  it("sets query from query object", () => {
    // Set query from query object
    cy.get("#set-query-from-query").click();
    cy.get("#cypher-query").should(
      "contain",
      "Cypher Query: MATCH (n) RETURN n"
    );
    cy.get("#query-id").should("contain", "Query ID: 1");
    cy.get("#query-name").should(
      "contain",
      "Query Name: Test Query From Object"
    );
    cy.get("#nat-lang").should("contain", "Natural Language: Find all nodes");
  });
});
