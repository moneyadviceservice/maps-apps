import { ACDLPage } from '@maps-react/utils/e2e/support/acdl-page.po';

export class Login extends ACDLPage {
  elements = {
    heading: () => cy.get('#main h1'),
    subHeading1: () => cy.get('#main h2'),
    subHeading2: () => cy.get('#main h3'),

    info: () => cy.get('#main h3 ~ *'),

    referrerIdLabel: () => cy.get('label[for="referrerId"]'),
    referrerIdInfo: () => cy.get('label[for="referrerId"] ~ span'),
    referrerIdInput: () => cy.get('#referrerId'),

    signinButton: () => cy.get('[data-testid="sign-in"]'),

    problemInfo: () => cy.get('[data-testid="paragraph"]:last-child'),

    errorSummaryContainer: () =>
      cy.get('[data-testid="error-summary-container"]'),
    errorSummaryHeading: () => cy.get('[data-testid="error-summary-heading"]'),
    errorRecords: () => cy.get('[data-testid="error-records"] li'),
  };

  checkErrorMessages(messages: string[]) {
    this.elements.errorSummaryContainer().should('not.be.empty');
    this.elements
      .errorSummaryHeading()
      .should('have.text', 'There is a problem');
    for (const [index, message] of messages.entries()) {
      this.elements.errorRecords().eq(index).should('have.text', message);
    }
  }

  checkErrorOnInput(elementId: 'referrerId', message: string) {
    this.elements[`${elementId}Label`]()
      .parent()
      .within(() => {
        cy.get(`[aria-describedby=${elementId}]`).should('have.text', message);
      });
  }
}
