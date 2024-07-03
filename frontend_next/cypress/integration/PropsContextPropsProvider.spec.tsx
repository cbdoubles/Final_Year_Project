/* global cy */
/// <reference types="cypress" />
import React from "react";

import { PropsProvider, useProps } from "../../src/contexts/PropsContext";

// Test component to interact with PropsContext
const TestComponent = () => {
  const {
    advancedMode,
    setAdvancedMode,
    queryRunClicked,
    setQueryRunTrue,
    setQueryRunFalse,
    resetProps,
  } = useProps();

  return (
    <div>
      <div>
        <span id="advanced-mode">Advanced Mode: {advancedMode.toString()}</span>
        <button
          id="toggle-advanced-mode"
          onClick={() => setAdvancedMode(!advancedMode)}
        >
          Toggle Advanced Mode
        </button>
      </div>
      <div>
        <span id="query-run-clicked">
          Query Run Clicked: {queryRunClicked.toString()}
        </span>
        <button id="set-query-run-true" onClick={setQueryRunTrue}>
          Set Query Run True
        </button>
        <button id="set-query-run-false" onClick={setQueryRunFalse}>
          Set Query Run False
        </button>
      </div>
      <button id="reset-props" onClick={resetProps}>
        Reset Props
      </button>
    </div>
  );
};

describe("<PropsProvider />", () => {
  beforeEach(() => {
    cy.mount(
      <PropsProvider>
        <TestComponent />
      </PropsProvider>
    );
  });

  it("initially renders with default values", () => {
    // Initial values
    cy.get("#advanced-mode").should("contain", "Advanced Mode: false");
    cy.get("#query-run-clicked").should("contain", "Query Run Clicked: false");
  });

  it("toggles advanced mode", () => {
    // Toggle advanced mode
    cy.get("#toggle-advanced-mode").click();
    cy.get("#advanced-mode").should("contain", "Advanced Mode: true");
    cy.get("#toggle-advanced-mode").click();
    cy.get("#advanced-mode").should("contain", "Advanced Mode: false");
  });

  it("sets query run clicked to true", () => {
    // Set query run clicked to true
    cy.get("#set-query-run-true").click();
    cy.get("#query-run-clicked").should("contain", "Query Run Clicked: true");
  });

  it("sets query run clicked to false", () => {
    // Set query run clicked to true
    cy.get("#set-query-run-true").click();
    cy.get("#query-run-clicked").should("contain", "Query Run Clicked: true");
    // Set query run clicked to false
    cy.get("#set-query-run-false").click();
    cy.get("#query-run-clicked").should("contain", "Query Run Clicked: false");
  });

  it("resets props", () => {
    // Change values before reset
    cy.get("#toggle-advanced-mode").click();
    cy.get("#set-query-run-true").click();
    // Reset props
    cy.get("#reset-props").click();
    cy.get("#advanced-mode").should("contain", "Advanced Mode: false");
    cy.get("#query-run-clicked").should("contain", "Query Run Clicked: false");
  });
});
