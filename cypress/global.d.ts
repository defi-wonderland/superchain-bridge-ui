/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    getDataTest(usedataTestSelectorr: string): Chainable<Subject>;
  }
}
