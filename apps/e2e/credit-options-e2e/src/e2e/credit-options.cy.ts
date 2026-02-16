import '@maps-react/utils/e2e/support/commands';

describe('Credit Options Tool', () => {
  const completeJourney = (
    creditAmount = '5000',
    answerSequence = ['0', '1', '3', '1', '1'],
  ) => {
    // Set credit amount
    cy.get('input[name="answer"]').clear();
    cy.get('input[name="answer"]').type(creditAmount);
    cy.get('button[type="submit"]').first().click();

    // Tool process
    //cy.answerAndProceed(answerSequence);
    cy.answerAndProceed(answerSequence.map(Number));
  };

  const testResultsPage = () => {
    // Results page
    cy.get('[data-testid="toolpage-h1-title"]').should(
      'have.text',
      'Your options for borrowing money',
    );
  };

  const resetTool = () => {
    // Reset Tool
    cy.clickButtonByIndex('a.t-button', 1);
    cy.get('[data-testid="results-page-heading"]')
      .should('be.visible')
      .and('contain.text', 'Borrowing options to consider');
    cy.get('[data-testid="start-again-link"]')
      .should('not.be.disabled')
      .click();

    cy.get('input[name="answer"]').should('have.value', '');
  };

  beforeEach(() => {
    cy.skipExceptions();
    cy.setBreakPoint('desktop');
    cy.setCookieControl();
    cy.visitWithRetry('/');
  });

  // End 2 End test & Change 1st,6th answers and verify on 'Check your answers' page
  it('Credit options end to end & Change answers', () => {
    completeJourney();

    // Results page
    testResultsPage();

    // Change 1st,6th answers and verify on 'Check your answers' page
    cy.get('[data-testid="change-question-1"]').should('be.visible').click();
    cy.get('[data-testid="input-1"]').clear();
    cy.get('[data-testid="input-1"]').type('6000');
    cy.get('[data-testid="step-container-submit-button"]').click();

    cy.get('[data-testid="change-question-6"]').click();
    cy.get('[data-testid="radio-input-1"]').check({ force: true });
    cy.get('[data-testid="radio-input-1"]').should('be.checked');
    cy.get('[data-testid="step-container-submit-button"]').focus();
    cy.get('[data-testid="step-container-submit-button"]').click();

    //Verify above changed 1st & 6th answers
    cy.get('[data-testid="paragraph"]').should('contain.text', '£6000');
    cy.get('[data-testid="paragraph"]').should('contain.text', 'Fair or ok');
  });

  // Test scenarios based on User Story 22953: Credit Options: Testing scenarios & check Back link on 'Check your answers' page
  it('Credit options scenario 1', () => {
    completeJourney('12500', ['0', '1', '3', '1', '0']);
    testResultsPage();
    cy.get('[data-testid="toolpage-h1-title"]').should(
      'have.text',
      'Your options for borrowing money',
    );

    // Check Back link, afterwards check that page title
    cy.get('a.tool-nav-prev').as('backLink');
    cy.get('@backLink').click();
    cy.get('h1').should('have.text', 'How good is your credit score?');
  });

  //End 2 End test & Verify 'Your options for borrowing money' page
  it('Credit options scenario 2', () => {
    completeJourney('27000', ['2', '2', '4', '0', '1']);
    testResultsPage();

    //Verify 'Your options for borrowing money' page
    cy.get('[data-testid="next-page-button"]').click();
    cy.get('[data-testid="toolpage-h1-title"]').should(
      'contain.text',
      'Your options for borrowing money',
    );
  });

  //End 2 End test & Verify suitable types of borrowings on 'Borrowing options to consider' page
  it('Credit options scenario 3', () => {
    completeJourney('400', ['3', '1', '1', '1', '2']);
    testResultsPage();

    //Verify suitable types of borrowings on 'Borrowing options to consider' page
    cy.get('[data-testid="next-page-button"]').click();
    cy.contains('h2', 'Widely available options').should('be.visible');
    cy.contains('h2', 'Good options, but may not be open to all').should(
      'be.visible',
    );
  });

  //End 2 End test & Verify 'Start again' button
  it('Credit options scenario 4', () => {
    completeJourney('1234.56', ['4', '0', '4', '0', '3']);
    testResultsPage();

    // Reset Tool
    resetTool();
  });

  //End 2 End test & Check options on 'Your options for borrowing money' page
  it('Credit options scenario 5', () => {
    completeJourney('4800', ['4', '2', '0', '1', '2']);
    testResultsPage();

    // Check options on 'Your options for borrowing money' page
    cy.get('[data-testid="next-page-button"]').click();
    cy.get('h2')
      .should('be.visible')
      .should(
        'have.text',
        'Good options, but may not be open to allExpensive options - use as a last resortHelp applying for creditShare this tool',
      );
    cy.get('h3')
      .should('be.visible')
      .should(
        'have.text',
        'Loan from a credit union, if you become a memberGuarantor loan',
      );
  });

  //End 2 End test & Verify suitable types of borrowings on 'Borrowing options to consider' page
  it('Credit options scenario 6', () => {
    completeJourney('46000', ['1', '2', '4', '1', '1']);
    testResultsPage();

    // Check options on 'Your options for borrowing money' page
    cy.get('[data-testid="next-page-button"]').click();
    cy.contains('h2', 'Widely available options').should('be.visible');
    cy.contains('h3', 'Loan from a bank or building society').should(
      'be.visible',
    );
    cy.contains('h3', 'Car finance – Personal Contract Purchase (PCP)').should(
      'be.visible',
    );
    cy.contains('h3', 'Car finance – hire purchase (HP)').should('be.visible');
  });

  // End 2 End testing & verify options on 'Your options for borrowing money' page
  it('Credit options scenario 7', () => {
    completeJourney('900', ['0', '0', '2', '0', '0']);
    testResultsPage();

    // Check options on 'Your options for borrowing money' page
    cy.get('[data-testid="next-page-button"]').click();
    cy.get('[data-testid="results-page-heading"]')
      .should('be.visible')
      .and('contain.text', 'Borrowing options to consider');
    cy.get('[data-testid="results-intro"]')
      .should('be.visible')
      .and(
        'contain.text',
        'Based on what you’ve told us, these types of borrowing might be suitable for your needs. We’ve listed the pros and cons of each so you can compare and decide which could suit your needs.',
      );
    cy.contains('h2', 'Good options, but may not be open to all').should(
      'be.visible',
    );
  });

  // End 2 End testing & verify options on 'Your options for borrowing money' page
  it('Credit options scenario 8', () => {
    completeJourney('9000', ['4', '1', '2', '1', '3']);
    testResultsPage();

    // Check options on 'Your options for borrowing money' page
    cy.get('[data-testid="next-page-button"]').click();
    cy.get('[data-testid="results-page-heading"]')
      .should('be.visible')
      .and('contain.text', 'Borrowing options to consider');
    cy.contains(
      'h3',
      'You might need a good credit score for some of these options',
    ).should('be.visible');
  });

  it('Credit options scenario 9', () => {
    completeJourney('1600', ['1', '2', '1', '0', '1']);
    testResultsPage();

    // Check options on 'Your options for borrowing money' page
    cy.get('[data-testid="next-page-button"]').click();
    cy.get('[data-testid="results-page-heading"]')
      .should('be.visible')
      .and('contain.text', 'Borrowing options to consider');
  });

  it('Credit options scenario 10', () => {
    completeJourney('15000', ['2', '1', '4', '1', '0']);
    testResultsPage();
  });

  it('Credit options scenario 11', () => {
    completeJourney('300', ['0', '2', '0', '1', '0']);
    testResultsPage();

    // Reset Tool
    resetTool();
  });

  it('Credit options scenario 12', () => {
    completeJourney('1200', ['3', '2', '1', '1', '1']);
    testResultsPage();
  });

  // This test case verifies for Step Tools Lose Data on Error(Ticket - 24832) E2E testing of Credit Options
  // -------------------------------------------------------------------------------------------------------

  const completeJourneyForStepTools = (
    //creditAmount = '5678',
    answerSequence = ['', '1', '3', '1', '1'],
  ) => {
    cy.get('button[type="submit"]').first().click();

    // Tool process
    //cy.answerAndProceed(answerSequence);
    cy.answerAndProceed(answerSequence.map(Number));
  };

  it('Step Tools Lose Data on Error E2E-Credit Options', () => {
    cy.visit('/en/question-1?');

    // Tapped on Continue button without entering value for the question-1
    cy.get('[data-testid="step-container-submit-button"]')
      .should('be.visible')
      .click();

    //Check the displayed error message for not selecting / entering the value for the question-1
    cy.get('[data-testid="errorMessage-1"]').should(
      'contain.text',
      'Please select an answer',
    );
    cy.get('[data-testid="input-1"]').type('5678');
    cy.get('[data-testid="step-container-submit-button"]')
      .should('be.visible')
      .click();

    // Tapped on Continue button without selecting the radio button for the question-2
    cy.get('[data-testid="step-container-submit-button"]')
      .should('be.visible')
      .click();
    cy.get('[data-testid="errorMessage-2"]').should(
      'contain.text',
      'Please select an answer',
    );

    //This method completes the flow and reaches 'Check your answers' page, completes 'Credit Options' journey
    completeJourneyForStepTools();

    //Verify the value of question-1 displayed on 'Check your answers' page, where Continue button was tapped initially without entering/selecting value
    cy.get('[data-testid="paragraph"]').should('contain.text', '£5678');

    //Verify the selected option of question-2 displayed on 'Check your answers' page, where Continue button was tapped initially without selecting value
    cy.get('.mb-4.col-span-3[data-testid="paragraph"]')
      .should('be.visible')
      .and(
        'contain.text',
        'Planned purchase – like a holiday, wedding, home improvements or buying a new TV',
      );

    // Tap on Change link for question-1 on 'Check your answers' page to go back to question-1 page
    cy.get('[data-testid="change-question-1"]').click();

    // It displays the previously entered value for question-1
    cy.get('[data-testid="input-1"]').should('contain.value', '5,678');

    // Clear the previously submitted for question-1
    cy.get('[data-testid="input-1"]').clear();

    //Tap on the Continue button of question-1 with empty value
    cy.get('[data-testid="step-container-submit-button"]')
      .should('be.visible')
      .click();

    //Verifying that previously entered value is displayed again for the question-1 after tapping on 'Save Changes' button without entering the values,
    //then it returns with the previously entered value without erasing it with Continue button
    cy.get('[data-testid="input-1"]').should('contain.value', '5,678');
  });
});
