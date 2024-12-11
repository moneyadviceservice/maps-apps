Cypress.Commands.add('confirmPage', (url: string, timeout?: number) => {
  cy.url({ timeout }).should('include', url);
  cy.request(url).then((response) => {
    expect(response.status).to.be.within(200, 399);
  });
});

Cypress.Commands.add('logout', () => {
  cy.get('.t-header-menu-open').click({ force: true });
  cy.get(`[data-testid='logout-link']`).click({ force: true });
  cy.get(`[data-testid='logout-yes']`).click({ force: true });
});
