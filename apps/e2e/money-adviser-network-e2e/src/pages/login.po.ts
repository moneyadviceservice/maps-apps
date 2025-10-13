import { ACDLPage } from '@maps-react/utils/e2e/support/acdl-page.po';

export class Login extends ACDLPage {
  elements = {
    heading: () => cy.get('#main h1'),
    subHeading1: () => cy.get('#main h2'),
    subHeading2: () => cy.get('#main h3'),

    info: () => cy.get('#main h3 ~ *'),

    usernameLabel: () => cy.get('label[for="username"]'),
    usernameInfo: () => cy.get('label[for="username"] ~ span'),
    usernameInput: () => cy.get('#username'),

    passwordLabel: () => cy.get('label[for="password"]'),
    passwordInput: () => cy.get('#password'),

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
    messages.forEach((message, index) => {
      this.elements.errorRecords().eq(index).should('have.text', message);
    });
  }

  checkErrorOnInput(elementId: 'username' | 'password', message: string) {
    this.elements[`${elementId}Label`]()
      .parent()
      .within(() => {
        cy.get(`[aria-describedby=${elementId}]`).should('have.text', message);
      });
  }
}
