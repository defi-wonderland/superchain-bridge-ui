/// <reference types="cypress" />

Cypress.Commands.add('getDataTest', (dataTestSelector) => {
  return cy.get(`[data-test="${dataTestSelector}"]`);
});
