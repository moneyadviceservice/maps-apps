import '@maps-react/utils/e2e/support/commands';
describe('Mid Life MOT', () => {
  beforeEach(() => {
    cy.skipExceptions();
    cy.setCookieControl();
    cy.setBreakPoint('desktop');
    cy.visit('/');
  });

  const verifyNumberOfCards = (
    answersHeading: string,
    summaryHeading: string,
    numberOfCards: string,
  ) => {
    cy.answerAndProceed([1, 2, 0, 3, 2, 3, 4, 2, 4, 0, 2, 5]);
    // Check answers page
    cy.elementContainsText('h1', answersHeading);
    cy.confirmElementCount('li > form', 13);
    cy.clickButtonByIndex('a.t-button', 1);

    // Check number of teaser cards on the summary page
    cy.elementContainsText('h2', summaryHeading);
    cy.get('.t-teaser').should('have.length', numberOfCards);
  };

  it('Mid Life MOT End to End', () => {
    // Tool process
    cy.answerAndProceed([1, 2, 4, 2, 1, 2, 4, 1, 3, 2, 1, 0, 4, 2, 3, 0, 1, 3]);

    // Check answers page
    cy.elementContainsText('h1', 'Check your answers');
    cy.clickButtonByIndex('a.t-button', 1);

    // Summary page
    cy.elementContainsText('h2', 'Summary of your results');
    cy.elementIndexContainsText('h5', 0, 'What to focus on');
    cy.elementIndexContainsText('h5', 1, 'What to build on');
    cy.elementIndexContainsText('h5', 2, 'What to keep doing');

    // Check number of teaser cards on the summary page
    cy.get('.t-teaser').should('have.length', 3);
    cy.clickButtonByIndex('a.t-button', 1);

    // Results page
    cy.clickButtonByIndex('a.t-button', 1);
    cy.elementContainsText('h1', 'Your personalised report');
    cy.confirmElementCount('div.t-information-callout', 9);
    cy.elementIndexContainsText(
      'h4',
      0,
      "Finished your Money Midlife MOT?See how you're doing with your work and health",
    );

    cy.contains('button', 'Download your report (PDF)').click();
    cy.confirmElementCount('button.t-primary-button', 2);
    // Reset Tool
    cy.contains('a', 'Start again').click();
    cy.elementContainsText('h1', 'How old are you?');
  });

  // This test case verifies for Step Tools Lose Data on Error(Ticket - 24832) E2E testing of Midlife MOT
  it('Step Tools Lose Data on Error E2E-Midlife MOT', () => {
    cy.visit('/');

    // Tapped on Continue button without selecting the option/answer for the question-1
    cy.get('[data-testid="step-container-submit-button"]').click();

    //Check the displayed error message for not selecting / entering the value for the question-1
    cy.get('[data-testid="errorMessage-1"]').should(
      'contain.text',
      'Please select an answer',
    );

    //Select option for the question-1 and Continue for the the question-2
    cy.answerAndProceed([1]);
    cy.get('[data-testid="step-container-submit-button"]').click();

    // Tapped on Continue button without selecting the option/answer for the question-2
    cy.get('[data-testid="step-container-submit-button"]').click();

    //Check the displayed error message for not selecting / entering the value for the question-2
    cy.get('[data-testid="errorMessage-2"]').should(
      'contain.text',
      'Please select an answer',
    );

    //Select option for the question-2 and Continue for the the question-3
    cy.answerAndProceed([2]);
    cy.get('[data-testid="step-container-submit-button"]').click();

    // Tool process
    cy.answerAndProceed([4, 2, 1, 2, 4, 1, 3, 2, 1, 0, 4, 2, 3, 0, 1, 3]);

    // Check answers page
    cy.elementContainsText('h1', 'Check your answers');

    //Tap on change link to go back to question-1
    cy.get('[data-testid="change-question-1"]').click();

    // Check the shown selected option is same as earlier for the question-1
    cy.get(':nth-child(2) > .flex > ').should('contain.text', '45 to 49');

    //Tap on 'Save changes' button for question-1 to go back to the 'Check your answers'
    cy.get('[data-testid="step-container-submit-button"]').click();

    //Tap on change link to go back to question-2
    cy.get('[data-testid="change-question-2"]').click();

    // Check the shown selected option is same as earlier for the question-2
    cy.get('[data-testid="radio-button-label"]')
      .eq(2)
      .should('contain.text', 'Scotland');
  });
});
