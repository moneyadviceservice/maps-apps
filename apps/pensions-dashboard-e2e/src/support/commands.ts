// Accept cookies
Cypress.Commands.add('acceptCookies', () => {
  cy.get('div#ccc-notify').within(() => {
    cy.get('button#ccc-notify-accept').click();
  });
});

// Reject cookies
Cypress.Commands.add('rejectCookies', () => {
  cy.get('div#ccc-notify').within(() => {
    cy.get('button#ccc-notify-reject').eq(0).click();
  });
});
