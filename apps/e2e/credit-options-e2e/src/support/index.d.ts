/// <reference types="cypress"/>

declare namespace Cypress {
  interface Chainable {
    setCookieControl(): Chainable<void>;
    setBreakPoint(
      viewport: 'desktop' | 'tablet' | 'mobile',
    ): Chainable<Subject>;
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
    visitWithRetry(
      url: string,
      options?: any,
      retries?: number,
      delay?: number,
    ): Chainable<any>;
    checkCSS(
      element: string,
      property: string,
      value: string,
    ): Chainable<Element>;
    confirmAttributeValue(
      element: string,
      attribute: string,
      value: string,
    ): Chainable<Element>;
    checkLinkHref(selector: string): Chainable<Element>;
    enterInputValue(element: string, value: string): Chainable<Element>;
    elementShouldExist(selector: string): Chainable<Element>;
    elementShouldNotExist(selector: string): Chainable<Element>;
    elementShouldBeVisible(selector: string): Chainable<Element>;
    elementShouldNotBeVisible(selector: string): Chainable<Element>;
    elementValue(selector: string, expectedValue: string): Chainable<Element>;
    checkAllInternalLinks(): Chainable;
    checkAllExternalLinks(): Chainable<Element>;
    clickPrimaryLinkButton(): Chainable;
    clickElementInEach(
      parent: string,
      childToClick: string,
    ): Chainable<Element>;
    checkTagName(element: string, value: string): Chainable<Element>;
    elementIndexContainsText(
      element: string,
      index: number,
      text: string,
    ): Chainable<void>;
    verifyDatalayer(): Chainable<void>;
    verifyDatalayer(
      eventName: string,
      locale: string,
      values: DataLayerValues,
    ): Chainable<Element>;
    verifyEventDoesNotExist(eventName: string): Chainable<Element>;
    getToolPageTitle(): Chainable<JQuery<HTMLHeadingElement>>;
    verifyURL(expected_url: string): Chainable<void>;
    verifyURLIncludes(expected_url: string): Chainable<void>;
    visitLink(element: string): Chainable<void>;
    disableJS(): Chainable<void>;
    selectOptionByValue(value: string, index: number): Chainable<void>;
    hiddenToScreenReader(element: string): Chainable<void>;
    login(email: string, password: string): Chainable<void>;
    forceClick(): Chainable<void>;
    acceptCookies(): Chainable<void>;
  }
  interface Window {
    adobeDataLayer?: Array<{ eventName: string; [key: string]: any }>;
  }
  interface VisitOptions {
    timeout?: number;
    failOnStatusCode?: boolean;
  }
}
