/// <reference types="cypress"/>
declare namespace Cypress {
  interface Chainable {
    setCookieControl(): Chainable;
    setBreakPoint(
      viewport: 'desktop' | 'tablet' | 'mobile',
    ): Chainable<Subject>;
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

    elementShouldBeVisible(selector: string): Chainable<JQuery<HTMLElement>>;
    elementShouldBeVisible(selector: string): Chainable<any>;
    checkCSS(
      selector: string,
      property: string,
      value: string,
    ): Chainable<JQuery<HTMLElement>>;
    checkCSS(selector: string, property: string, value: string): Chainable<any>;
    elementShouldNotExist(selector: string): Chainable<JQuery<HTMLElement>>;
    elementShouldNotExist(selector: string): Chainable<any>;
    acceptCookies(): Chainable<Subject>;
    verifyURLIncludes(url: string): Chainable<Subject>;
    elementShouldNotBeVisible(selector: string): Chainable<any>;
    elementValue(selector: string, expectedValue: string): Chainable<any>;
    verifyDatalayer(
      eventName: string,
      locale: string,
      expectedValues: any,
    ): Chainable<Subject>;
    //Midlife MOT
    login(email: string, password: string): void;
    verifyEventDoesNotExist(eventName: string): Chainable<void>;
    elementIndexContainsText(
      selector: string,
      index: number,
      text: string,
    ): Chainable<void>;
  }
}
