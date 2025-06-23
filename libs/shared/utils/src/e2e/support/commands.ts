/// <reference types="cypress" />
// set cookie control cookie
Cypress.Commands.add('setCookieControl', () => {
  cy.setCookie(
    'CookieControl',
    JSON.stringify({
      necessaryCookies: [],
      optionalCookies: { analytics: 'revoked', marketing: 'revoked' },
      statement: {},
      consentDate: 0,
      consentExpiry: 0,
      interactedWith: true,
      user: 'anonymous',
    }),
  );
});

// Breakpoints
Cypress.Commands.add('setBreakPoint', (viewport) => {
  if (viewport == 'desktop') {
    cy.viewport(1534, 900);
  } else if (viewport == 'tablet') {
    cy.viewport(1180, 820);
  } else if (viewport == 'mobile') {
    cy.viewport(639, 1080);
  }
});

// Element should contain text
Cypress.Commands.add('elementContainsText', (element, text) => {
  cy.get(element).should('contain.text', text);
});

// Check if an element has an attribute
Cypress.Commands.add('elementHasAttribute', (selector, attribute) => {
  cy.get(selector).should('have.attr', attribute);
});

// Check if an element has an attribute and expected value
Cypress.Commands.add(
  'elementHasAttributeValue',
  (selector, attribute, value) => {
    cy.get(selector).invoke('attr', attribute).should('equal', value);
  },
);

Cypress.Commands.add('clickPrimaryButton', () => {
  cy.get('button.t-primary-button').click();
});

// Click button by index
Cypress.Commands.add('clickButtonByIndex', (element, index) => {
  cy.get(element).eq(index).click();
});

// Confirm correct number of elements found
Cypress.Commands.add('confirmElementCount', (element, count) => {
  cy.get(element).its('length').should('equal', count);
});

// Skip exceptions
Cypress.Commands.add('skipExceptions', () => {
  Cypress.on('uncaught:exception', () => {
    return false;
  });
});

// Answer questions and proceed for step based tools
Cypress.Commands.add('answerAndProceed', (answers: number[]) => {
  answers.forEach((answer: number) => {
    cy.get('form')
      .eq(1)
      .within(() => {
        cy.clickButtonByIndex('label', answer);
      });
    cy.clickPrimaryButton();
  });
});

// Verify the change options page on step based tools
Cypress.Commands.add(
  'verifyChangeAnswerPage',
  (questions: string[], skippedQuestionNumbers: number[]) => {
    cy.elementContainsText('h2', 'Check your answers');
    let questionCount = 0;
    questions.forEach((question, index) => {
      const questionNumber = index + 1;
      const questionTestId = `[data-testid="q-${questionNumber}"]`;
      const changeLinkId = `[data-testid="change-question-${questionNumber}"]`;

      if (skippedQuestionNumbers?.includes(questionNumber)) {
        // Assert that the element does not exist on the page
        cy.get(questionTestId).should('not.exist');
      } else {
        // Assert for the question existence and attributes if not skipped
        cy.get(questionTestId).should('contain.text', question);
        cy.get(changeLinkId).should(
          'have.attr',
          'formaction',
          '/api/form-actions/change-answer',
        );

        questionCount++;
      }
    });

    cy.confirmElementCount('form > ul > li', questionCount);
  },
);

// Extract today's date, current month plus 9 and year for Baby Money Timeline tool

export const getFutureDate = (monthsToAdd = 9) => {
  const today = new Date();
  const futureDate = new Date(today.setMonth(today.getMonth() + monthsToAdd));
  const day = futureDate.getDate();
  const month = futureDate.getMonth() + 1; // Months are zero-based
  const year = futureDate.getFullYear();
  return { day, month, year };
};

// Below for ACDL E2E tests
interface ErrorDetails {
  reactCompType: string;
  reactCompName: string;
  errorMessage: string;
}

interface EventInfo {
  toolName: string;
  toolStep: string;
  stepName?: string;
  errorDetails?: ErrorDetails[];
}

interface PageDetails {
  lang: string;
  categoryL1: string;
  categoryL2: string;
  pageName: string;
  pageTitle: string;
  pageType: string;
  site: string;
}

interface ToolDetails {
  stepName: string;
  toolCategory: string;
  toolName: string;
  toolStep: string;
}

interface DataLayerValues {
  eventInfo?: EventInfo;
  page?: PageDetails;
  tool?: ToolDetails;
}

interface DataLayerEvent {
  event: string;
  eventInfo?: EventInfo;
  page?: PageDetails;
  tool?: ToolDetails;
}

Cypress.Commands.add(
  'verifyErrorMessage',
  (expectedEvent: DataLayerEvent, values: DataLayerValues) => {
    expect(expectedEvent).to.have.property('eventInfo');
    expect(expectedEvent.eventInfo!.toolName).to.eql(
      values.eventInfo!.toolName,
    );
    expect(expectedEvent.eventInfo!.toolStep).to.eql(
      values.eventInfo!.toolStep,
    );
    if (
      expectedEvent.eventInfo!.errorDetails &&
      values.eventInfo!.errorDetails
    ) {
      expect(expectedEvent.eventInfo!.errorDetails).to.deep.equal(
        values.eventInfo!.errorDetails,
      );
    }
  },
);

Cypress.Commands.add(
  'verifyToolSaved',
  (expectedEvent: DataLayerEvent, values: DataLayerValues) => {
    expect(expectedEvent).to.have.property('eventInfo');
    expect(expectedEvent.eventInfo!.toolName).to.eql(
      values.eventInfo!.toolName,
    );
    expect(expectedEvent.eventInfo!.toolStep).to.eql(
      values.eventInfo!.toolStep,
    );
    expect(expectedEvent.eventInfo!.stepName).to.eql(
      values.eventInfo!.stepName,
    );
  },
);

Cypress.Commands.add(
  'verifyOtherEvents',
  (expectedEvent: DataLayerEvent, locale: string, values: DataLayerValues) => {
    expect(expectedEvent).to.have.property('page');
    expect(expectedEvent.page!.lang).to.eql(locale);
    expect(expectedEvent.page!.categoryL1).to.eql(values.page!.categoryL1);
    expect(expectedEvent.page!.categoryL2).to.eql(values.page!.categoryL2);
    expect(expectedEvent.page!.pageName).to.eql(values.page!.pageName);
    expect(expectedEvent.page!.pageTitle).to.eql(values.page!.pageTitle);
    expect(expectedEvent.page!.pageType).to.eql(values.page!.pageType);
    expect(expectedEvent.page!.site).to.eql(values.page!.site);

    expect(expectedEvent).to.have.property('tool');
    expect(expectedEvent.tool!.stepName).to.eql(values.tool!.stepName);
    expect(expectedEvent.tool!.toolCategory).to.eql(values.tool!.toolCategory);
    expect(expectedEvent.tool!.toolName).to.eql(values.tool!.toolName);
    expect(expectedEvent.tool!.toolStep).to.eql(values.tool!.toolStep);
  },
);

Cypress.Commands.add(
  'verifyDatalayer',
  (eventName: string, locale: string, values: DataLayerValues) => {
    cy.window().then((win: any) => {
      const event = win.adobeDataLayer.filter(
        (x: any) => x.event === eventName,
      );
      if (event.length > 0) {
        const expectedEvent: DataLayerEvent = event[0];

        if (eventName === 'errorMessage') {
          cy.verifyErrorMessage(expectedEvent, values);
        } else if (eventName === 'toolSaved') {
          cy.verifyToolSaved(expectedEvent, values);
        } else {
          cy.verifyOtherEvents(expectedEvent, locale, values);
        }
      }
    });
  },
);

Cypress.Commands.add('verifyEventDoesNotExist', (eventName: string) => {
  cy.window().then((win: any) => {
    const event = win.adobeDataLayer.filter((x: any) => x.event);
    expect(event).not.to.contain(eventName);
  });
});

Cypress.Commands.add('skipExceptions', () => {
  Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from failing the test
    return false;
  });
});

Cypress.Commands.add(
  'verifyDatalayer',
  (eventName: string, locale: string, values: any) => {
    cy.window().then((win) => {
      if (win.adobeDataLayer) {
        const event = win.adobeDataLayer.filter(
          (x: any) => x.event === eventName,
        );
        if (event.length > 0) {
          const expectedEvent = event[0];
          // Check event properties based on eventName
          if (eventName === 'toolCompletion') {
            expect(expectedEvent).to.have.property('page');
            expect(expectedEvent.page).to.have.property('lang');
            expect(expectedEvent.page.lang).to.eql(locale);
          }
        }
      }
    });
  },
);

//PACS (or) Compare Accounts

// Accept cookies
Cypress.Commands.add('acceptCookies', () => {
  cy.get('div#ccc-notify').within(() => {
    cy.wait(2000); // added for handling of pageLoadReact event in BP tool
    cy.get('button#ccc-notify-accept').click();
  });
});

// Verify URL contains
Cypress.Commands.add('verifyURLIncludes', (expected_string) => {
  cy.url().should('include', expected_string);
});

Cypress.Commands.add('forceClick', { prevSubject: 'element' }, (subject) => {
  cy.wrap(subject).click({ force: true });
});
// Visit a URL with a specified number of retries and delay between retries in case of failure.
Cypress.Commands.add(
  'visitWithRetry',
  (url, options = {}, retries = 3, delay = 3000) => {
    const visit = (): any => {
      try {
        cy.visit(url, options).then(() => {
          return null;
        });
      } catch (error) {
        if (retries > 0) {
          setTimeout(() => {
            retries--;
            visit();
          }, delay);
          return false;
        } else {
          throw error;
        }
      }
    };
    visit();
  },
);

// Check CSS property
Cypress.Commands.add('checkCSS', (element, property, value) => {
  cy.get(element).should('have.css', property, value);
});
Cypress.Commands.add('checkCSS', (selector, property, value) => {
  cy.get(selector).should('have.css', property, value);
});

// Check element existence/non-existence/visibility
Cypress.Commands.add('elementShouldExist', (selector) => {
  cy.get(selector).should('exist');
});
Cypress.Commands.add('elementShouldNotExist', (selector) => {
  cy.get(selector).should('not.exist');
});
Cypress.Commands.add('elementShouldBeVisible', (selector) => {
  cy.get(selector).should('be.visible');
});
Cypress.Commands.add('elementShouldNotBeVisible', (selector) => {
  cy.get(selector).should('not.be.visible');
});

// Check value of element
Cypress.Commands.add('elementValue', (selector, expected_value) => {
  cy.get(selector).invoke('val').should('equal', expected_value);
});

//Mortgage calculator
Cypress.Commands.add('elementIndexContainsText', (selector, index, text) => {
  cy.get(selector).eq(index).should('contain.text', text);
});
Cypress.Commands.add(
  'confirmAttributeValue',
  (selector, attribute, expectedValue) => {
    cy.get(selector)
      .should('have.attr', attribute)
      .and('include', expectedValue);
  },
);
Cypress.Commands.add('checkTagName', (selector, tagName) => {
  cy.get(selector).then((element) => {
    expect(element.prop('tagName')).to.equal(tagName.toUpperCase());
  });
});
