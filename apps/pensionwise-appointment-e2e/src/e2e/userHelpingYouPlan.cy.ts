describe('Pension Appointment Helping You Plan Section', () => {
  beforeEach(() => {
    cy.setCookieControl();
    cy.visit('/', { failOnStatusCode: false });
  });

  const answerAndProceed = (answer: string, questionUrl = '?version') => {
    cy.intercept(`/en/pension-wise-appointment${questionUrl}*`).as(questionUrl);
    cy.get(`h2[data-testid='section-title']`).should('be.visible');
    cy.get('form input[name="answer"]').check(answer, { force: true });
    cy.get(`button[data-testid='continue']`).click();
    cy.wait(`@${questionUrl}`).its('response.statusCode').should('eq', 200);

    cy.get(`h2[data-testid='section-title']`).should('be.visible');
  };

  it(`completes 'Pension Basics' journey under helping your plan section`, () => {
    cy.viewSummaryDocument('Pension basics', 'task-1');
    cy.get(`h2[data-testid='section-title']`).should('be.visible');
    cy.viewPensionGuidance('Pension basics');
    cy.get(`h2[data-testid='section-title']`).should('be.visible');

    cy.intercept(
      `/**/en/pension-wise-appointment/pension-basics/keeping-track-of-pensions.json?version*`,
    ).as('continue');
    cy.get(`h2[data-testid='section-title']`).should('be.visible');
    cy.get(`[data-testid='callout-warning']`).scrollIntoView();
    cy.scrollTo('bottom');
    cy.get(`[data-testid='continue']`).click({ force: true });
    cy.wait('@continue').its('response.statusCode').should('eq', 200);

    cy.get(`h2[data-testid='section-title']`).should('be.visible');

    answerAndProceed('0', '/pension-basics/transferring-pension?version');
    answerAndProceed('0');
    cy.verifyTaskCompletion(1);
  });

  it(`completes 'Income and savings' journey under helping your plan section`, () => {
    cy.viewSummaryDocument('Income and savings', 'task-2');
    cy.get(`h2[data-testid='section-title']`).should('be.visible');
    cy.viewPensionGuidance('Income and savings');
    cy.get(`h2[data-testid='section-title']`).should('be.visible');

    answerAndProceed('0', '/income-savings/state-pension');
    answerAndProceed('0', '/income-savings/state-benefits');
    answerAndProceed('0');
    cy.verifyTaskCompletion(2);
  });

  it(`completes 'Debts and repayment' journey under helping your plan section`, () => {
    cy.viewSummaryDocument('Debts and repayment', 'task-3');
    cy.get(`h2[data-testid='section-title']`).should('be.visible');
    cy.viewPensionGuidance('Debts and repayment');
    cy.get(`h2[data-testid='section-title']`).should('be.visible');

    answerAndProceed('0');
    cy.verifyTaskCompletion(3);
  });

  it(`completes 'Your home' journey under helping your plan section`, () => {
    cy.viewSummaryDocument('Your home', 'task-4');
    cy.get(`h2[data-testid='section-title']`).should('be.visible');
    cy.viewPensionGuidance('your home');
    cy.get(`h2[data-testid='section-title']`).should('be.visible');

    answerAndProceed('0');
    cy.verifyTaskCompletion(4);
  });

  it(`completes 'Your home' journey under helping your plan section`, () => {
    cy.viewSummaryDocument('Health and family', 'task-5');
    cy.get(`h2[data-testid='section-title']`).should('be.visible');
    cy.viewPensionGuidance('health and family');
    cy.get(`h2[data-testid='section-title']`).should('be.visible');
    answerAndProceed('0', '/health-family/power-of-attorney?version');
    cy.get(`h2[data-testid='section-title']`).scrollIntoView();
    cy.get(`h2[data-testid='section-title']`).should('be.visible');

    answerAndProceed('0');
    cy.verifyTaskCompletion(5);
  });
});
