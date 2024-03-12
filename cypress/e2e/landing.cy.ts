describe('basic test', () => {
  it('test', () => {
    cy.visit('/');
    cy.contains(/superchain/i).should('exist');
  });
});
