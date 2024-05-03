/// <reference types="cypress"/>

declare namespace Cypress {
  interface Chainable {
    acceptCookies(): void;
    rejectCookies(): void;
    checkLinkHref(selector: string): Chainable<Element>;
    interceptQuestion(question: string): void;
    verifyExpandableSectionExists(): void;
    provideAnswer(question: string, answer: string): void;
  }
}
