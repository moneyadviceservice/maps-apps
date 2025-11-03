describe('Redundancy Pay Calculator - End to End test', () => {
  beforeEach(() => {
    cy.setCookieControl();
    cy.skipExceptions();
    cy.setBreakPoint('desktop');
    cy.visit('/en/question-1');
  });

  //Lives in England, age is around 25 years, less than 2 years with current employer, salary £11999 per year & No contractual redundancy pay
  it('RPC E2E Test - 1 : Lives in England, age is around 25 years, less than 2 years with current employer, salary £11999 per year & No contractual redundancy pay ', () => {
    //Q-1 : Where in the UK do you live
    cy.get('input[data-testid="radio-input-0"]').check({ force: true });
    cy.get('[data-testid="step-container-submit-button"]')
      .should('be.visible')
      .should('not.be.disabled')
      .click();

    //Q-2 : What is your date of birth
    cy.get('[data-testid="number-input"]').each(($el) => cy.wrap($el).clear());
    cy.get('[data-testid="number-input"][name="day"]').type('02');
    cy.get('[data-testid="number-input"][name="month"]').type('02');
    cy.get('[data-testid="number-input"][name="year"]').type('2000');
    cy.get('[data-testid="step-container-submit-button"]').click();

    //Q-3 : When will you be made redundant
    cy.get('[data-testid="number-input"]').each(($el) => cy.wrap($el).clear());
    cy.get('[data-testid="number-input"][name="month"]').type('11');
    cy.get('[data-testid="number-input"][name="year"]').type('2025');
    cy.get('[data-testid="step-container-submit-button"]').click();

    //Q-4 : When did you start working with your current employer
    cy.get('[data-testid="number-input"]').each(($el) => cy.wrap($el).clear());
    cy.get('[data-testid="number-input"][name="month"]').type('03');
    cy.get('[data-testid="number-input"][name="year"]').type('2022');
    cy.get('[data-testid="step-container-submit-button"]').click();

    //Q-5 : What is your income before tax
    cy.get('[data-testid="input-5"][name="answer"]').clear();
    cy.get('[data-testid="input-5"][name="answer"]').type('11999');
    cy.get('[data-testid="select-5"]').select('0');
    cy.get('[data-testid="step-container-submit-button"]').click();

    //Q-6 : Will you be getting contractual redundancy pay
    cy.get('label[for="id-1"]').click();
    cy.get('[data-testid="step-container-submit-button"]').click();

    // Check your answers page
    cy.get('[data-testid="paragraph"]')
      .should('contain.text', 'England')
      .and('contain.text', '2 February 2000')
      .and('contain.text', 'November 2025')
      .and('contain.text', 'March 2022')
      .and('contain.text', '£11,999 Yearly')
      .and('contain.text', 'No');

    //Change your answers
    cy.get('[data-testid="change-question-1"]').click();
    cy.get('input[data-testid="radio-input-1"]').check({ force: true });
    cy.get('[data-testid="step-container-submit-button"]')
      .should('be.visible')
      .should('not.be.disabled')
      .click();
    cy.get('[data-testid="next-page-button"]').click();

    //Your results page
    cy.get('h2').should('contain.text', '£692');
    cy.get('[data-testid="summary-block-title"]').click({ multiple: true });
    cy.get('[data-testid="callout-information"]')
      .should('contain.text', '£11,999 yearly')
      .and('contain.text', '£692')
      .and('contain.text', '0.7');
  });

  //Lives in Scotland, age between 25-50 years, just 2 years with current employer, salary £765 per week & No contractual redundancy pay
  it('RPC E2E Test - 2 : Lives in Scotland, age between 25-50 years, just 2 years with current employer, salary £765 per week & No contractual redundancy pay', () => {
    //Q-1
    cy.get('input[data-testid="radio-input-1"]').check({ force: true });
    cy.get('[data-testid="step-container-submit-button"]')
      .should('be.visible')
      .should('not.be.disabled')
      .click();

    //Q-2
    cy.get('[data-testid="number-input"]').each(($el) => cy.wrap($el).clear());
    cy.get('[data-testid="number-input"][name="day"]').type('04');
    cy.get('[data-testid="number-input"][name="month"]').type('05');
    cy.get('[data-testid="number-input"][name="year"]').type('1978');
    cy.get('[data-testid="step-container-submit-button"]').click();

    //Q-3
    cy.get('[data-testid="number-input"]').each(($el) => cy.wrap($el).clear());
    cy.get('[data-testid="number-input"][name="month"]').type('12');
    cy.get('[data-testid="number-input"][name="year"]').type('2026');
    cy.get('[data-testid="step-container-submit-button"]').click();

    //Q-4
    cy.get('[data-testid="number-input"]').each(($el) => cy.wrap($el).clear());
    cy.get('[data-testid="number-input"][name="month"]').type('11');
    cy.get('[data-testid="number-input"][name="year"]').type('2022');
    cy.get('[data-testid="step-container-submit-button"]').click();

    //Q-5
    cy.get('[data-testid="input-5"][name="answer"]').clear();
    cy.get('[data-testid="input-5"][name="answer"]').type('765');
    cy.get('[data-testid="select-5"]').select('2');
    cy.get('[data-testid="step-container-submit-button"]').click();

    //Q-6
    cy.get('label[for="id-1"]').click();
    cy.get('[data-testid="step-container-submit-button"]').click();

    // Check your answers page
    cy.get('[data-testid="paragraph"]')
      .should('contain.text', 'Scotland')
      .and('contain.text', '4 May 1978')
      .and('contain.text', 'December 2026')
      .and('contain.text', 'November 2022')
      .and('contain.text', '£765 Weekly')
      .and('contain.text', 'No');

    //Change answers
    cy.get('[data-testid="change-question-1"]').click();
    cy.get('input[data-testid="radio-input-2"]').check({ force: true });
    cy.get('[data-testid="step-container-submit-button"]')
      .should('be.visible')
      .should('not.be.disabled')
      .click();
    cy.get('[data-testid="next-page-button"]').click();

    // Your results page
    cy.get('h2').should('contain.text', '£4,314');
    cy.get('[data-testid="summary-block-title"]').click({ multiple: true });
    cy.get('[data-testid="callout-information"]')
      .should('include.text', '£765')
      .and('contain.text', '£4,314')
      .and('contain.text', '1.5');
  });

  //Lives in Wales, age between 50-65 years, more than 5 years with current employer, salary £1890.89 per month & contractual redundancy pay- I don't know
  it('RPC E2E Test - 3: Lives in Wales, age 50-65, employed for 5+ Years, salary £1890.89/Month, contractual redundancy pay- I do not know', () => {
    //Q-1
    cy.get('input[data-testid="radio-input-2"]').check({ force: true });
    cy.get('[data-testid="step-container-submit-button"]')
      .should('be.visible')
      .should('not.be.disabled')
      .click();

    //Q-2
    cy.get('[data-testid="number-input"]').each(($el) => cy.wrap($el).clear());
    cy.get('[data-testid="number-input"][name="day"]').type('02');
    cy.get('[data-testid="number-input"][name="month"]').type('03');
    cy.get('[data-testid="number-input"][name="year"]').type('1965');
    cy.get('[data-testid="step-container-submit-button"]').click();

    //Q-3
    cy.get('[data-testid="number-input"]').each(($el) => cy.wrap($el).clear());
    cy.get('[data-testid="number-input"][name="month"]').type('12');
    cy.get('[data-testid="number-input"][name="year"]').type('2025');
    cy.get('[data-testid="step-container-submit-button"]').click();

    //Q-4
    cy.get('[data-testid="number-input"]').each(($el) => cy.wrap($el).clear());
    cy.get('[data-testid="number-input"][name="month"]').type('11');
    cy.get('[data-testid="number-input"][name="year"]').type('2000');
    cy.get('[data-testid="step-container-submit-button"]').click();

    //Q-5
    cy.get('[data-testid="input-5"][name="answer"]').clear();
    cy.get('[data-testid="input-5"][name="answer"]').type('1890.89');
    cy.get('[data-testid="select-5"]').select('1');
    cy.get('[data-testid="step-container-submit-button"]').click();

    //Q-6
    cy.get('label[for="id-2"]').click();
    cy.get('[data-testid="step-container-submit-button"]').click();

    // Check your answers page
    cy.get('h1').should('have.text', 'Check your answers');
    cy.get('[data-testid="paragraph"]')
      .should('contain.text', 'Wales')
      .and('contain.text', '2 March 1965')
      .and('contain.text', 'December 2025')
      .and('contain.text', 'November 2000')
      .and('contain.text', '£1,890.89 Monthly')
      .and('contain.text', "I don't know");
    cy.get('[data-testid="next-page-button"]').click();

    // Your results page
    cy.get('[data-testid="results-page-heading"]').should(
      'have.text',
      'Your results',
    );
    cy.get('[data-testid="callout-information"]')
      .should('include.text', 'How long will your money last?')
      .and('include.text', '£1,890.89 monthly')
      .and('include.text', '£12,873')
      .and('include.text', '7.5 months of salary.');
  });

  //Lives in Northern Ireland, age between 60-70 years, more than 10 years with current employer, Income before tax -56789.56 Yearly & contractual redundancy pay- £123,456,789
  it('RPC E2E Test - 4 : Lives in Northern Ireland, age between 60-70 years, more than 10 years with current employer, Income before tax -£56789.56 Yearly & contractual redundancy pay- £123,456,789', () => {
    //Q-1
    cy.get('input[data-testid="radio-input-3"]').check({ force: true });
    cy.get('[data-testid="step-container-submit-button"]')
      .should('be.visible')
      .should('not.be.disabled')
      .click();

    //Q-2
    cy.get('[data-testid="number-input"]').each(($el) => cy.wrap($el).clear());
    cy.get('[data-testid="number-input"][name="day"]').type('30');
    cy.get('[data-testid="number-input"][name="month"]').type('04');
    cy.get('[data-testid="number-input"][name="year"]').type('1958');
    cy.get('[data-testid="step-container-submit-button"]').click();

    //Q-3
    cy.get('[data-testid="number-input"]').each(($el) => cy.wrap($el).clear());
    cy.get('[data-testid="number-input"][name="month"]').type('12');
    cy.get('[data-testid="number-input"][name="year"]').type('2026');
    cy.get('[data-testid="step-container-submit-button"]').click();

    //Q-4
    cy.get('[data-testid="number-input"]').each(($el) => cy.wrap($el).clear());
    cy.get('[data-testid="number-input"][name="month"]').type('12');
    cy.get('[data-testid="number-input"][name="year"]').type('1999');
    cy.get('[data-testid="step-container-submit-button"]').click();

    //Q-5
    cy.get('[data-testid="input-5"][name="answer"]').clear();
    cy.get('[data-testid="input-5"][name="answer"]').type('56789.56');
    cy.get('[data-testid="select-5"]').select('0');
    cy.get('[data-testid="step-container-submit-button"]').click();

    //Q-6
    cy.get('label[for="id-0"]').click();
    cy.get('[data-testid="step-container-submit-button"]').click();

    //Q-7
    cy.get('[data-testid="input-7"]').clear();
    cy.get('[data-testid="input-7"]').type('123,456,789');
    cy.get('[data-testid="step-container-submit-button"]').click();

    // Check your answers page
    cy.get('h1').should('have.text', 'Check your answers');
    cy.get('[data-testid="paragraph"]')
      .should('contain.text', 'Northern Ireland')
      .and('contain.text', '30 April 1958')
      .and('contain.text', 'December 2026')
      .and('contain.text', 'December 1999')
      .and('contain.text', '£56,789.56 Yearly')
      .and('contain.text', 'Yes')
      .and('contain.text', '£123,456,789');
    cy.get('[data-testid="next-page-button"]').click();

    // Your results page
    cy.get('[data-testid="results-page-heading"]').should(
      'have.text',
      'Your results',
    );
    cy.get('h4').should(
      'have.text',
      "You've told us your contractual redundancy pay will be:",
    );
    cy.get('h2').contains('£123,456,789').should('exist');

    cy.get('[data-testid="callout-information"]')
      .should('include.text', 'How long will your money last?')
      .and('include.text', '£56,789.56 yearly')
      .and('include.text', '£123,456,789')
      .and('include.text', '31762.7 months of salary.');
  });

  //Lives in England, age is around 75 years, less than 2 years with current employer, Income before tax -88981 Yearly & contractual redundancy pay- I don't know
  it('RPC E2E Test - 5 : Lives in England, age is around 75 years, less than 2 years with current employer, Income before tax -£88981 Yearly & contractual redundancy pay- I do not know', () => {
    //Q-1
    cy.get('input[data-testid="radio-input-0"]').check({ force: true });
    cy.get('[data-testid="step-container-submit-button"]')
      .should('be.visible')
      .should('not.be.disabled')
      .click();

    //Q-2
    cy.get('[data-testid="number-input"]').each(($el) => cy.wrap($el).clear());
    cy.get('[data-testid="number-input"][name="day"]').type('21');
    cy.get('[data-testid="number-input"][name="month"]').type('12');
    cy.get('[data-testid="number-input"][name="year"]').type('1950');
    cy.get('[data-testid="step-container-submit-button"]').click();

    //Q-3
    cy.get('[data-testid="number-input"]').each(($el) => cy.wrap($el).clear());
    cy.get('[data-testid="number-input"][name="month"]').type('11');
    cy.get('[data-testid="number-input"][name="year"]').type('2025');
    cy.get('[data-testid="step-container-submit-button"]').click();

    //Q-4
    cy.get('[data-testid="number-input"]').each(($el) => cy.wrap($el).clear());
    cy.get('[data-testid="number-input"][name="month"]').type('12');
    cy.get('[data-testid="number-input"][name="year"]').type('2024');
    cy.get('[data-testid="step-container-submit-button"]').click();

    //Q-5
    cy.get('[data-testid="input-5"][name="answer"]').clear();
    cy.get('[data-testid="input-5"][name="answer"]').type('88981');
    cy.get('[data-testid="select-5"]').select('0');
    cy.get('[data-testid="step-container-submit-button"]').click();

    //Q-6
    cy.get('label[for="id-2"]').click();
    cy.get('[data-testid="step-container-submit-button"]').click();

    // Check your answers page
    cy.get('h1').should('have.text', 'Check your answers');
    cy.get('[data-testid="paragraph"]')
      .should('contain.text', 'England')
      .and('contain.text', '21 December 1950')
      .and('contain.text', 'November 2025')
      .and('contain.text', 'December 2024')
      .and('contain.text', '£88,981 Yearly')
      .and('contain.text', "I don't know");
    cy.get('[data-testid="next-page-button"]').click();

    // Your results page
    cy.get('[data-testid="results-page-heading"]').should(
      'have.text',
      'Your results',
    );

    cy.get('h2.text-3xl.md\\:text-5xl.text-gray-800.font-bold.mb-4').should(
      'contain.text',
      '£0,00',
    );
    cy.get('p').should(
      'contain.text',
      'Only employees who have worked at least two years are eligible for statutory redundancy pay.',
    );

    cy.get('[data-testid="callout-information"]')
      .should('contain.text', 'How long will your money last?')
      .and('contain.text', '£88,981 yearly')
      .and('contain.text', '£0')
      .and('contain.text', '0.0 months of salary');
  });

  it('RPC E2E Test - 6 : Verify error message and link - When where you live in the UK is not selected', () => {
    cy.get('[data-testid="step-container-submit-button"]')
      .should('be.visible')
      .should('not.be.disabled')
      .click();
    cy.get('#error-summary-heading').should('have.text', 'There is a problem');
    cy.get('[data-testid="error-link-0"]').should(
      'have.text',
      'Select where you live in the UK',
    );
    cy.get('[data-testid="error-link-0"]').click();
  });

  it('RPC E2E Test - 7 : Verify error message and link - When date of birth is not entered', () => {
    cy.get('input[data-testid="radio-input-1"]').check({ force: true });
    cy.get('[data-testid="step-container-submit-button"]')
      .should('be.visible')
      .should('not.be.disabled')
      .click();

    cy.get('[data-testid="step-container-submit-button"]').click();
    cy.get('#error-summary-heading').should('have.text', 'There is a problem');
    cy.get('[data-testid="error-link-0"]').should(
      'have.text',
      'Enter a valid day, month, and year',
    );
    cy.get('[data-testid="error-link-0"]').click();
  });

  it('RPC E2E Test - 8 : Verify error message - When date of birth is below 15 years', () => {
    cy.get('input[data-testid="radio-input-1"]').check({ force: true });
    cy.get('[data-testid="step-container-submit-button"]')
      .should('be.visible')
      .should('not.be.disabled')
      .click();
    cy.get('[data-testid="number-input"]').each(($el) => cy.wrap($el).clear());
    cy.get('[data-testid="number-input"][name="day"]').type('04');
    cy.get('[data-testid="number-input"][name="month"]').type('05');
    cy.get('[data-testid="number-input"][name="year"]').type('2016');
    cy.get('[data-testid="step-container-submit-button"]').click();
    cy.get('[data-testid="error-link-0"]').should(
      'have.text',
      'You must be at least 15 years old',
    );
    cy.get('[data-testid="error-link-0"]').click();
  });

  it('RPC E2E Test - 9 : Verify error message - When redundant date is not entered', () => {
    cy.get('input[data-testid="radio-input-1"]').check({ force: true });
    cy.get('[data-testid="step-container-submit-button"]')
      .should('be.visible')
      .should('not.be.disabled')
      .click();
    cy.get('[data-testid="number-input"]').each(($el) => cy.wrap($el).clear());
    cy.get('[data-testid="number-input"][name="day"]').type('04');
    cy.get('[data-testid="number-input"][name="month"]').type('05');
    cy.get('[data-testid="number-input"][name="year"]').type('1978');
    cy.get('[data-testid="step-container-submit-button"]').click();
    cy.get('[data-testid="step-container-submit-button"]').click();
    cy.get('[data-testid="error-link-0"]').should(
      'have.text',
      'Enter a valid month and year',
    );
    cy.get('[data-testid="error-link-0"]').click();
  });

  it('RPC E2E Test - 10 : Verify error message - When employment start date is not entered', () => {
    cy.get('input[data-testid="radio-input-1"]').check({ force: true });
    cy.get('[data-testid="step-container-submit-button"]')
      .should('be.visible')
      .should('not.be.disabled')
      .click();
    cy.get('[data-testid="number-input"]').each(($el) => cy.wrap($el).clear());
    cy.get('[data-testid="number-input"][name="day"]').type('04');
    cy.get('[data-testid="number-input"][name="month"]').type('05');
    cy.get('[data-testid="number-input"][name="year"]').type('1978');
    cy.get('[data-testid="step-container-submit-button"]').click();

    cy.get('[data-testid="number-input"]').each(($el) => cy.wrap($el).clear());
    cy.get('[data-testid="number-input"][name="month"]').type('12');
    cy.get('[data-testid="number-input"][name="year"]').type('2025');
    cy.get('[data-testid="step-container-submit-button"]').click();

    cy.get('[data-testid="step-container-submit-button"]').click();
    cy.get('[data-testid="error-link-0"]').should(
      'have.text',
      'Enter a valid month and year',
    );
    cy.get('[data-testid="error-link-0"]').click();
  });

  it('RPC E2E Test - 11 : Verify error message - When salary is not entered', () => {
    cy.get('input[data-testid="radio-input-1"]').check({ force: true });
    cy.get('[data-testid="step-container-submit-button"]')
      .should('be.visible')
      .should('not.be.disabled')
      .click();
    cy.get('[data-testid="number-input"]').each(($el) => cy.wrap($el).clear());
    cy.get('[data-testid="number-input"][name="day"]').type('04');
    cy.get('[data-testid="number-input"][name="month"]').type('05');
    cy.get('[data-testid="number-input"][name="year"]').type('1978');
    cy.get('[data-testid="step-container-submit-button"]').click();

    cy.get('[data-testid="number-input"]').each(($el) => cy.wrap($el).clear());
    cy.get('[data-testid="number-input"][name="month"]').type('12');
    cy.get('[data-testid="number-input"][name="year"]').type('2025');
    cy.get('[data-testid="step-container-submit-button"]').click();

    cy.get('[data-testid="number-input"]').each(($el) => cy.wrap($el).clear());
    cy.get('[data-testid="number-input"][name="month"]').type('11');
    cy.get('[data-testid="number-input"][name="year"]').type('2022');
    cy.get('[data-testid="step-container-submit-button"]').click();

    cy.get('[data-testid="step-container-submit-button"]').click();
    cy.get('[data-testid="error-link-0"]').should(
      'have.text',
      'Enter a salary before tax',
    );
    cy.get('[data-testid="error-link-0"]').click();
  });

  it('RPC E2E Test - 12 : Verify error message - When contractual redundancy pay option is not selected', () => {
    cy.get('input[data-testid="radio-input-1"]').check({ force: true });
    cy.get('[data-testid="step-container-submit-button"]')
      .should('be.visible')
      .should('not.be.disabled')
      .click();
    cy.get('[data-testid="number-input"]').each(($el) => cy.wrap($el).clear());
    cy.get('[data-testid="number-input"][name="day"]').type('04');
    cy.get('[data-testid="number-input"][name="month"]').type('05');
    cy.get('[data-testid="number-input"][name="year"]').type('1978');
    cy.get('[data-testid="step-container-submit-button"]').click();

    cy.get('[data-testid="number-input"]').each(($el) => cy.wrap($el).clear());
    cy.get('[data-testid="number-input"][name="month"]').type('12');
    cy.get('[data-testid="number-input"][name="year"]').type('2025');
    cy.get('[data-testid="step-container-submit-button"]').click();

    cy.get('[data-testid="number-input"]').each(($el) => cy.wrap($el).clear());
    cy.get('[data-testid="number-input"][name="month"]').type('01');
    cy.get('[data-testid="number-input"][name="year"]').type('2025');
    cy.get('[data-testid="step-container-submit-button"]').click();

    cy.get('[data-testid="input-5"][name="answer"]').clear();
    cy.get('[data-testid="input-5"][name="answer"]').type('2345.99');
    cy.get('[data-testid="select-5"]').select('1');
    cy.get('[data-testid="step-container-submit-button"]').click();

    cy.get('[data-testid="step-container-submit-button"]').click();
    cy.get('[data-testid="error-link-0"]').should(
      'have.text',
      'Choose an option',
    );
    cy.get('[data-testid="error-link-0"]').click();
  });

  it('RPC E2E Test - 13 : Verify error message - When contractual redundancy pay is not entered', () => {
    cy.get('input[data-testid="radio-input-1"]').check({ force: true });
    cy.get('[data-testid="step-container-submit-button"]')
      .should('be.visible')
      .should('not.be.disabled')
      .click();
    cy.get('[data-testid="number-input"]').each(($el) => cy.wrap($el).clear());
    cy.get('[data-testid="number-input"][name="day"]').type('04');
    cy.get('[data-testid="number-input"][name="month"]').type('05');
    cy.get('[data-testid="number-input"][name="year"]').type('1978');
    cy.get('[data-testid="step-container-submit-button"]').click();

    cy.get('[data-testid="number-input"]').each(($el) => cy.wrap($el).clear());
    cy.get('[data-testid="number-input"][name="month"]').type('12');
    cy.get('[data-testid="number-input"][name="year"]').type('2025');
    cy.get('[data-testid="step-container-submit-button"]').click();

    cy.get('[data-testid="number-input"]').each(($el) => cy.wrap($el).clear());
    cy.get('[data-testid="number-input"][name="month"]').type('01');
    cy.get('[data-testid="number-input"][name="year"]').type('2025');
    cy.get('[data-testid="step-container-submit-button"]').click();

    cy.get('[data-testid="input-5"][name="answer"]').clear();
    cy.get('[data-testid="input-5"][name="answer"]').type('2345.99');
    cy.get('[data-testid="select-5"]').select('1');
    cy.get('[data-testid="step-container-submit-button"]').click();

    cy.contains('label', 'Yes').click();
    cy.get('[data-testid="step-container-submit-button"]').click();

    cy.get('[data-testid="step-container-submit-button"]').click();

    cy.get('#error-summary-heading').should('contain', 'There is a problem');
    cy.get('[data-testid="error-link-0"]').should(
      'contain',
      'Enter an amount (or select "I don\'t know")',
    );
    cy.get('[data-testid="errorMessage-7"]').should(
      'contain',
      'Enter an amount (or select "I don\'t know")',
    );
  });
});
