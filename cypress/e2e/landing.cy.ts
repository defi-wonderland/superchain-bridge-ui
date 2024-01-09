describe('basic test', () => {
  it('test', () => {
    cy.visit('/');
    cy.contains(/Logo/i).should('exist');
  });
});
