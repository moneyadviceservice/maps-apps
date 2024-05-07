// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Chainable<Subject> {
    acceptCookies(): void;
    rejectCookies(): void;
    verifyTaskCompletion(taskNumber: number): Chainable<Element>;
    checkLinkHref(selector: string): Chainable<Element>;
  }
}

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

// Verify task completion
Cypress.Commands.add('verifyTaskCompletion', (taskNumber: number) => {
  cy.get(`button[data-testid='task-${taskNumber}']`).scrollIntoView();
  cy.get(`button[data-testid='task-${taskNumber}']`)
    .contains('Completed')
    .should('be.visible');
});

// Check status code of href
Cypress.Commands.add('checkLinkHref', (selector) => {
  cy.get(selector).each(($el) => {
    cy.wrap($el)
      .invoke('attr', 'href')
      .then((href: any) => {
        cy.request(href).its('status').should('eq', 200);
      });
  });
});
