/// <reference types="cypress"/>
/// <reference types="@cypress-audit/lighthouse" />

declare namespace Cypress {
  interface Chainable {
    setCookieControl(): void;
    checkLinkHref(selector: string): Chainable<Element>;
    interceptQuestion(question: string): void;
    verifyExpandableSectionExists(): void;
    provideAnswer(question: string, answer: string): void;
  }
}
