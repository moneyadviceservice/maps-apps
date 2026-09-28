/// <reference types="cypress"/>
declare namespace Cypress {
  interface Chainable {
    setCookieControl(): Chainable;
    setBreakPoint(viewPoint: string): Chainable<Element>;
    elementContainsText(element: string, text: string): Chainable<Element>;
    elementHasAttribute(
      selector: string,
      attribute: string,
    ): Chainable<Element>;
    elementHasAttributeValue(
      selector: string,
      attribute: string,
      value: string,
    ): Chainable<Element>;
    clickPrimaryButton(): Chainable;
    clickButtonByIndex(element: string, index: number): Chainable<Element>;
    confirmElementCount(element: string, count: number): Chainable<Element>;
    skipExceptions(): Chainable;
    answerAndProceed(answers: number[]): Chainable<Element>;
    verifyChangeAnswerPage(
      questions: string[],
      skippedQuestionNumbers?: number[],
    ): Chainable<Element>;
  }
}
