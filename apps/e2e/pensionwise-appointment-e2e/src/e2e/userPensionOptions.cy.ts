describe('Pension Appointment Pension Options Section', () => {
  beforeEach(() => {
    cy.setCookieControl();
    cy.visit(
      '/?version=1&t1=4&t1q1=1&t1q2=2&t2=4&t2q1=1&t2q2=1&t2q3=2&t3=4&t3q1=2&t4=4&t4q1=2&t5=4&t5q1=1&t5q2=1',
      { failOnStatusCode: false },
    );
  });

  const navigateToPensionGuidance = (
    pensionOption: string,
    taskNumber: number,
  ) => {
    cy.viewSummaryDocument(pensionOption, `task-${taskNumber}`);
    cy.get(`h1[data-testid='section-title']`).should('be.visible');
  };

  const selectPensionInterest = (yesOrNoOption: string) => {
    const pageUrl = '?version';
    cy.intercept(`/en/pension-wise-appointment${pageUrl}*`).as(pageUrl);
    cy.get(`h3[data-testid='section-title-footer']`).scrollIntoView();
    cy.get('body').then(($elem) => {
      if ($elem.find(`input[name="answer"]`).length) {
        cy.get('input[name="answer"]').check(
          `${yesOrNoOption === 'Yes' ? '0' : '1'}`,
          { force: true },
        );
        cy.get(`button[data-testid='continue']`).click({ force: true });
        cy.wait(`@${pageUrl}`).its('response.statusCode').should('eq', 200);
      } else {
        cy.get(`a[data-testid='back']`).scrollIntoView();
        cy.get(`a[data-testid='back']`).click({ force: true });
      }
    });
  };

  it(`completes 'retire later or delay taking your pension' journey under your pension options section`, () => {
    const taskNumber = 6;
    navigateToPensionGuidance(
      'Retire later or delay taking your pension',
      taskNumber,
    );
    selectPensionInterest('No');
    cy.verifyTaskCompletion(taskNumber);
  });

  it(`completes 'get a guaranteed income' journey under your pension options section`, () => {
    const taskNumber = 7;
    navigateToPensionGuidance('get a guaranteed income', taskNumber);
    selectPensionInterest('Yes');
    cy.verifyTaskCompletion(taskNumber);
  });

  it(`completes 'get a flexible income' journey under your pension options section`, () => {
    const taskNumber = 8;
    navigateToPensionGuidance('get a flexible income', taskNumber);
    selectPensionInterest('Yes');
    cy.verifyTaskCompletion(taskNumber);
  });

  it(`completes 'take your pension as a number of lump sums' journey under your pension options section`, () => {
    const taskNumber = 9;
    navigateToPensionGuidance(
      'take your pension as a number of lump sums',
      taskNumber,
    );
    selectPensionInterest('Yes');
    cy.verifyTaskCompletion(taskNumber);
  });

  it(`completes 'take your pot in one go' journey under your pension options section`, () => {
    const taskNumber = 10;
    navigateToPensionGuidance('take your pot in one go', taskNumber);
    selectPensionInterest('Yes');
    cy.verifyTaskCompletion(taskNumber);
  });

  it(`completes 'mix your options' journey under your pension options section`, () => {
    const taskNumber = 11;
    navigateToPensionGuidance('mix your options', taskNumber);
    selectPensionInterest('Yes');
    cy.verifyTaskCompletion(taskNumber);
  });

  it(`completes 'your appointment summary' section`, () => {
    cy.visit(
      '?version=1&t1=4&t1q1=1&t1q2=2&t2=4&t2q1=1&t2q2=1&t2q3=2&t3=4&t3q1=2&t4=4&t4q1=2&t5=4&t5q1=1&t5q2=1&t11=4&t11q1=1&t6=4&t6q1=1&t7=4&t7q1=1&t8=4&t8q1=2&t9=4&t9q1=1&t10=4&t10q1=1#options',
      { failOnStatusCode: false },
    );
    const taskNumber = 12;
    navigateToPensionGuidance(
      'view your summary document and to-do list',
      taskNumber,
    );
    cy.get(`a[data-testid='back']`).scrollIntoView();
    cy.get(`a[data-testid='back']`).should('be.visible');
    cy.get(`a[data-testid='back']`).click();
    cy.verifyTaskCompletion(taskNumber);
  });

  it(`completes save and come back later feature`, () => {
    const save = 'save';
    cy.intercept(`/**/en/pension-wise-appointment/${save}*`).as(save);
    cy.get('body').find(`a[data-testid='save-and-return']`).scrollIntoView();
    cy.get(`a[data-testid='save-and-return']`).click({ force: true });
    cy.wait(`@${save}`).its('response.statusCode').should('eq', 200);

    // should display 'save and come back later' page
    cy.get(`h1[data-testid='section-title']`).scrollIntoView();
    cy.get(`h1[data-testid='section-title']`).should('be.visible');

    const progressSaved = 'progress-saved';
    cy.intercept(`/en/pension-wise-appointment/${progressSaved}*`).as(
      progressSaved,
    );

    // input email address
    cy.get('form input[name="email"]').clear();
    cy.get('form input[name="email"]').type('real-email@gmail.com');
    cy.get(`button[type='submit'][data-testid='save-and-return']`).click();
    cy.wait(`@${progressSaved}`).its('response.statusCode').should('eq', 200);

    // should display confirmation page - progress saved
    cy.get(`h1[data-testid='section-title']`).should('be.visible');
    cy.get('[data-testid="paragraph"]')
      .eq(0)
      .should(
        'contain.text',
        'pension.wise.digital@notifications.service.gov.uk',
      );
    cy.get('[data-testid="moneyhelper"]').should('be.visible');
    cy.get('[data-testid="resend-email"]').should('be.visible');
  });

  it('shows embedded journeys - calculators', () => {
    const locales = ['en', 'cy'];

    const calculators = [
      [
        'Take your whole pot',
        'take-pot-in-one',
        'take-whole-pot',
        'take-whole-pot-calculator',
      ],
      [
        'Leave Pot untouched',
        'retire-later-or-delay',
        'leave-pot-untouched',
        'leave-pot-untouched',
      ],
      ['Take Cash in chunks', 'lump-sums', 'cash-in-chunks', 'cic-calculator'],
      [
        'Adjustable income',
        'flexible-income',
        'adjustable-income-calculator',
        'adjustable-income-estimator',
      ],
      [
        'Guaranteed income',
        'guaranteed-income',
        'guaranteed-income-estimator',
        'guaranteed-income-estimator',
      ],
    ];

    locales.forEach((locale) => {
      calculators.forEach((item) => {
        const pensionWisePage = item[1],
          embeddedJourney = item[2],
          iframeDataTestId = item[3];

        cy.intercept(`/${locale}/${embeddedJourney}?isEmbedded=true`).as(
          `${embeddedJourney}`,
        );
        cy.visit(`/${locale}/pension-wise-appointment/${pensionWisePage}`);
        cy.wait(`@${embeddedJourney}`)
          .its('response.statusCode')
          .should('be.oneOf', [200, 401]);
        cy.get(
          `[data-testid='tool-iframe-${iframeDataTestId}']`,
        ).scrollIntoView();
        cy.get(`[data-testid='tool-iframe-${iframeDataTestId}']`).should(
          'be.visible',
        );
      });
    });
  });
});
