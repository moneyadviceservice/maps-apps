// Accept cookies
Cypress.Commands.add('acceptCookies', () => {
  cy.get('div#ccc-notify').within(() => {
    cy.get('button#ccc-notify-accept').click();
  });
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

    cy.confirmElementCount('li > form', questionCount);
  },
);
