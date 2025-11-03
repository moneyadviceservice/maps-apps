import budget from '../fixtures/budgetPlanner.json';

describe('Budget Planner End to End', () => {
  let cacheStore: Record<string, any> = {};
  const expandOrCloseSectionByIndex = (index: number) => {
    cy.get('section.t-forms-section details.group')
      .eq(index)
      .within(() => {
        cy.get('summary.t-forms-section__heading').click();
      });
  };
  const enterInputValue = (input_name: string, value: string) => {
    cy.get(`input[name=${input_name}]`).type(value);
  };

  const goToNextStep = () => {
    cy.get('button.tool-nav-submit').click();
  };
  const confirmSelectedNavItem = (step: string) => {
    const selected_step_class = '.text-blue-700';
    cy.get(`button[formaction="/api/${step}"]${selected_step_class}`);
  };
  const selectFrequency = (name: string, index: number) => {
    cy.get(`select[name=${name}]`).select(index);
  };
  const realTimeSummary = () => {
    cy.get('div[data-testid="real-time-summary"]').should('exist');
    checkBalanceColour(`div[data-testid="real-time-summary"]`);
  };
  const checkBalanceColour = (summaryType: string) => {
    cy.get(`${summaryType}`)
      .should('exist')
      .then(($elem: JQuery<HTMLElement>) => {
        cy.wrap($elem)
          .find('[data-testid="item-value"]')
          .eq(0)
          .find('b')
          .then(($income: JQuery<HTMLElement>) => {
            const income = parseFloat(
              $income.text().replace(/[£,]/g, '').trim(),
            );

            cy.wrap($elem)
              .find('[data-testid="summary-total-item-value"]')
              .eq(1)
              .find('b')
              .then(($spending: JQuery<HTMLElement>) => {
                const Spending = parseFloat(
                  $spending.text().replace(/[£,]/g, '').trim(),
                );

                if (income > Spending) {
                  cy.checkCSS(
                    '.bg-green-700',
                    'background-color',
                    'rgb(0, 128, 33)',
                  );
                  cy.checkCSS(
                    '.bg-green-700',
                    'textDecoration',
                    'none solid rgb(255, 255, 255)',
                  );
                } else if (income < Spending) {
                  cy.checkCSS(
                    '.bg-red-600',
                    'background-color',
                    'rgb(204, 0, 0)',
                  );
                  cy.checkCSS(
                    '.bg-red-600',
                    'textDecoration',
                    'none solid rgb(255, 255, 255)',
                  );
                } else {
                  cy.checkCSS(
                    '.bg-slate-600',
                    'background-color',
                    'rgb(71, 85, 105)',
                  );
                  cy.checkCSS(
                    '.bg-slate-600',
                    'textDecoration',
                    'none solid rgb(255, 255, 255)',
                  );
                }
              });
          });
      });
  };

  beforeEach(() => {
    cy.skipExceptions();
    cy.setCookieControl();
    cy.setBreakPoint('desktop');

    // Mock fetchDataFromBlob
    cy.intercept('GET', '**/.netlify/functions/fetchDataFromBlob*', (req) => {
      const url = new URL(req.url);
      const key = url.searchParams.get('key');
      const data = cacheStore[key || ''] || {};
      req.reply({
        statusCode: 200,
        body: data,
      });
    }).as('fetchDataFromBlob');

    // Mock saveDataToBlob
    cy.intercept('POST', '**/.netlify/functions/saveDataToBlob', (req) => {
      const { queryData, cacheName } = req.body;
      if (
        (queryData && Object.keys(queryData).length === 0) ||
        queryData?.reset === 'true'
      ) {
        delete cacheStore[cacheName];
      } else {
        cacheStore[cacheName] = {
          ...(cacheStore[cacheName] || {}),
          ...queryData,
        };
      }
      req.reply({
        statusCode: 200,
        body: { message: `Data saved for "${cacheName}"` },
      });
    }).as('saveDataToBlob');

    cy.visit('/en/income');
  });

  afterEach(() => {
    // Clear cache after each test
    cacheStore = {};
  });
  it('Creates a budget and presents a summary', () => {
    confirmSelectedNavItem('income');
    enterInputValue('pay', budget.Income.Pay.PayAfterTax);
    expandOrCloseSectionByIndex(1);
    enterInputValue(
      'universal-credit',
      budget.Income.BenefitsTaxCredit['income-universal-credit'],
    );
    expandOrCloseSectionByIndex(3);
    enterInputValue(
      'rent-or-board',
      budget.Income.OtherIncome['income-rent-or-board'],
    );
    realTimeSummary();
    goToNextStep();

    confirmSelectedNavItem('household-bills');
    enterInputValue(
      'mortgage',
      budget['Household bills']['Mortgage & rent']['household-bills-mortgage'],
    );
    expandOrCloseSectionByIndex(0);
    expandOrCloseSectionByIndex(2);
    enterInputValue(
      'buildings-insurance',
      budget['Household bills']['Buildings insurance'][
        'household-bills-buildings-insurance'
      ],
    );
    enterInputValue(
      'contents-insurance',
      budget['Household bills']['Buildings insurance'][
        'household-bills-contents-insurance'
      ],
    );
    expandOrCloseSectionByIndex(3);
    enterInputValue(
      'council-tax',
      budget['Household bills'].Utilities['household-bills-council-tax'],
    );
    enterInputValue(
      'gas',
      budget['Household bills'].Utilities['household-bills-gas'],
    );
    enterInputValue(
      'electricity',
      budget['Household bills'].Utilities['household-bills-electricity'],
    );
    realTimeSummary();
    goToNextStep();

    confirmSelectedNavItem('living-costs');
    enterInputValue('grocery-shopping', '300');
    selectFrequency('grocery-shopping-factor', 5);
    expandOrCloseSectionByIndex(0);
    expandOrCloseSectionByIndex(1);
    enterInputValue('lunches-snacks', '170');
    selectFrequency('lunches-snacks-factor', 5);
    realTimeSummary();
    goToNextStep();

    confirmSelectedNavItem('finance-insurance');
    enterInputValue('life-insurance', '26');
    enterInputValue('protection-insurance', '25');
    selectFrequency('protection-insurance-factor', 5);
    expandOrCloseSectionByIndex(0);
    expandOrCloseSectionByIndex(3);
    enterInputValue('payments-isas', '100');
    selectFrequency('payments-isas-factor', 5);
    realTimeSummary();
    goToNextStep();

    confirmSelectedNavItem('family-friends');
    enterInputValue('pocket-money', '50');
    selectFrequency('pocket-money-factor', 5);
    expandOrCloseSectionByIndex(0);
    expandOrCloseSectionByIndex(4);
    enterInputValue(
      'pet-insurance',
      budget['Family & friends'].Pets['family-friends-pet-insurance'],
    );
    realTimeSummary();
    goToNextStep();

    confirmSelectedNavItem('travel');
    enterInputValue(
      'car-insurance',
      budget.Travel['Car insurance']['travel-car-insurance'],
    );
    selectFrequency('breakdown-cover-factor', 7);
    expandOrCloseSectionByIndex(0);
    expandOrCloseSectionByIndex(2);
    realTimeSummary();
    goToNextStep();

    confirmSelectedNavItem('leisure');
    enterInputValue(
      'cinema-theatre-trips',
      budget.Leisure.Entertainment['leisure-cinema-theatre-trips'],
    );
    selectFrequency('cinema-theatre-trips-factor', 5);
    expandOrCloseSectionByIndex(0);
    expandOrCloseSectionByIndex(1);
    expandOrCloseSectionByIndex(2);
    enterInputValue('holidays', budget.Leisure.Holidays['leisure-holidays']);
    selectFrequency('holidays-factor', 7);
    realTimeSummary();
    goToNextStep();

    // Results page
    confirmSelectedNavItem('summary');
    cy.elementContainsText('h1.font-bold', 'Summary');
    cy.elementContainsText(
      'p.text-gray-800',
      'Work out how long it’ll take to save up for something, and how much you’d need to regularly saveUse our Bill prioritiser to work out which bills and payments you need to deal with first - plus how to avoid missing payments.',
    );

    // Summary Total
    cy.get('div.t-summary-total').within(() => {
      // Income
      cy.get('[data-testid="item-value"] b').should('contain.text', '£2,179');
      // Spending
      cy.get('[data-testid="item-value"]')
        .eq(1)
        .find('b')
        .should('contain.text', '£982.42');
      // Spare cash
      cy.get('[data-testid="item-value"]')
        .eq(2)
        .find('b')
        .should('contain.text', '£1,196.58');
    });

    // Spending breakdown
    cy.get('div.t-summary-breakdown').within(() => {
      const amounts = ['£661.67', '£156.67', '£67.67', '£42.67'];

      amounts.forEach((amount) => {
        cy.get(
          'table.w-full.border-separate.lg\\:text-lg.border-spacing-2.lg\\:border-spacing-5.lg\\:ml-10',
        )
          .find(
            'td.flex.justify-end.font-bold.text-right.align-top.items-top.lg\\:table-cell',
          )
          .find('span.lg\\:hidden')
          .should('contain.text', amount);
      });
    });
  });

  it('Creates a budget with different frequencies and presents a summary', () => {
    confirmSelectedNavItem('income');
    enterInputValue('pay', '3000');
    expandOrCloseSectionByIndex(1);
    enterInputValue('universal-credit', '200');
    expandOrCloseSectionByIndex(3);
    enterInputValue('rent-or-board', '400');
    realTimeSummary();
    goToNextStep();

    confirmSelectedNavItem('household-bills');
    enterInputValue('mortgage', '568');
    expandOrCloseSectionByIndex(0);
    expandOrCloseSectionByIndex(2);
    enterInputValue('buildings-insurance', '30');
    enterInputValue('contents-insurance', '26');
    expandOrCloseSectionByIndex(3);
    enterInputValue('council-tax', '103');
    enterInputValue('gas', '60');
    enterInputValue('electricity', '35');
    realTimeSummary();
    goToNextStep();

    confirmSelectedNavItem('living-costs');
    enterInputValue('grocery-shopping', '130');
    selectFrequency('grocery-shopping-factor', 2);
    expandOrCloseSectionByIndex(0);
    expandOrCloseSectionByIndex(1);
    enterInputValue('lunches-snacks', '40');
    selectFrequency('lunches-snacks-factor', 3);
    realTimeSummary();
    goToNextStep();

    confirmSelectedNavItem('finance-insurance');
    enterInputValue('life-insurance', '5');
    selectFrequency('life-insurance-factor', 0);
    enterInputValue('protection-insurance', '25');
    selectFrequency('protection-insurance-factor', 4);

    expandOrCloseSectionByIndex(0);
    expandOrCloseSectionByIndex(3);
    enterInputValue('payments-isas', '100');
    selectFrequency('payments-isas-factor', 4);
    realTimeSummary();
    goToNextStep();

    confirmSelectedNavItem('family-friends');
    enterInputValue('pocket-money', '20');
    selectFrequency('pocket-money-factor', 0);
    expandOrCloseSectionByIndex(0);
    expandOrCloseSectionByIndex(4);
    enterInputValue('pet-insurance', '26');
    realTimeSummary();
    goToNextStep();

    confirmSelectedNavItem('travel');
    enterInputValue('car-insurance', '5');
    selectFrequency('breakdown-cover-factor', 3);
    expandOrCloseSectionByIndex(0);
    expandOrCloseSectionByIndex(2);
    realTimeSummary();
    goToNextStep();

    confirmSelectedNavItem('leisure');
    enterInputValue('cinema-theatre-trips', '25');
    selectFrequency('cinema-theatre-trips-factor', 5);
    expandOrCloseSectionByIndex(0);
    expandOrCloseSectionByIndex(1);
    expandOrCloseSectionByIndex(2);
    realTimeSummary();
    goToNextStep();

    // Results page
    confirmSelectedNavItem('summary');
    cy.elementContainsText('h1.font-bold', 'Summary');
    cy.elementContainsText(
      'p.text-gray-800',
      'Work out how long it’ll take to save up for something, and how much you’d need to regularly saveUse our Bill prioritiser to work out which bills and payments you need to deal with first - plus how to avoid missing payments.',
    );

    // Summary Total
    cy.get('div.t-summary-total').within(() => {
      // Income
      cy.get('[data-testid="item-value"] b').should('contain.text', '£3,600');

      //Spending;
      cy.get('[data-testid="item-value"]')
        .eq(1)
        .find('b')
        .should('contain.text', '£2,016.73');

      // Spare cash
      cy.get('[data-testid="item-value"]')
        .eq(2)
        .find('b')
        .should('contain.text', '£1,583.27');
    });

    // Spending breakdown
    cy.get('div.t-summary-breakdown').within(() => {
      const amounts = ['£770.67', '£325.89', '£277.08', '£634.33'];
      amounts.forEach((amount) => {
        cy.get(
          'table.w-full.border-separate.lg\\:text-lg.border-spacing-2.lg\\:border-spacing-5.lg\\:ml-10',
        )
          .find(
            'td.flex.justify-end.font-bold.text-right.align-top.items-top.lg\\:table-cell',
          )
          .find('span.lg\\:hidden')
          .should('contain.text', amount);
      });
    });
  });

  /*
  it('CTA on category pages should display continue', () => {
    const locales = {
      en: ['Continue'],
      cy: ['Parhau'],
    };
    const tabs = [
      'income',
      'household-bills',
      'living-costs',
      'finance-insurance',
      'family-friends',
      'travel',
      'leisure',
    ];
  });
*/
  it('Balance should change colours', () => {
    const pages = ['/en', '/cy'];
    pages.forEach((page) => {
      cy.visit(`${page}/income`);

      confirmSelectedNavItem('income');
      enterInputValue('pay', '57');
      goToNextStep();
      realTimeSummary(); //Balance should be green

      confirmSelectedNavItem('household-bills');
      enterInputValue('mortgage', '57');
      goToNextStep();
      realTimeSummary(); //Balance should be grey

      confirmSelectedNavItem('living-costs');
      enterInputValue('grocery-shopping', '20');
      goToNextStep();
      realTimeSummary(); //Balance should be red

      confirmSelectedNavItem('finance-insurance');
      enterInputValue('dental-insurance', '5');
      goToNextStep();
      realTimeSummary();

      confirmSelectedNavItem('family-friends');
      enterInputValue('childcare', '10');
      goToNextStep();
      realTimeSummary();

      confirmSelectedNavItem('travel');
      enterInputValue('petrol-diesel', '15');
      goToNextStep();
      realTimeSummary();

      confirmSelectedNavItem('leisure');
      enterInputValue('cinema-theatre-trips', '25');
      goToNextStep();

      cy.elementShouldNotExist('div[data-testid="real-time-summary"]');

      // Real-time total summary card colour
      checkBalanceColour(`div.t-summary-total`); //Balance should be red
    });
  });

  //Save and return journey ticket#25602 for valid and invalid mails
  it('Save and Return Journey - Valid email', () => {
    confirmSelectedNavItem('income');
    enterInputValue('pay', '2000');

    cy.intercept('POST', '/api/save-and-return*', (req) => {
      req.reply({
        statusCode: 200,
        body: {
          message: 'Email sent successfully',
          sessionID: 'test-session-123',
        },
      });
    }).as('saveAndReturn');

    // Click save and return button
    cy.get('button.t-save-and-return').scrollIntoView();
    cy.get('button.t-save-and-return').click({ force: true });

    // Wait for the form to submit and any redirects to complete
    cy.url().should('include', '/save');

    // Fill in email and submit
    cy.get('form input[name="email"]').should('be.visible');
    cy.get('form input[name="email"]').clear();
    cy.get('form input[name="email"]').type('mock-mail@maps.org.uk');
    cy.get(`button[type='submit'][data-testid='save-and-return']`).click();

    // Wait for the save and return request
    cy.wait('@saveAndReturn', { timeout: 10000 });
  });

  //Going to raise new PR after fixing the bug # 34399 for this test case, till then error message part will be commented
  it('Save and Return Journey - Invalid email', () => {
    cy.intercept('POST', '/api/save-and-return', (req) => {
      req.reply((res) => {
        res.send({
          fixture: 'saveAndReturnError.json',
        });
      });
    });

    confirmSelectedNavItem('income');
    enterInputValue('pay', budget.Income.Pay.PayAfterTax);
    expandOrCloseSectionByIndex(1);
    enterInputValue(
      'universal-credit',
      budget.Income.BenefitsTaxCredit['income-universal-credit'],
    );
    expandOrCloseSectionByIndex(3);
    enterInputValue(
      'rent-or-board',
      budget.Income.OtherIncome['income-rent-or-board'],
    );

    cy.get("button[type='submit']")
      .contains('Save and come back later')
      .click();

    cy.get('input[name="email"]').clear();
    cy.get('input[name="email"]').type('notanemail');

    cy.get("button[data-testid='save-and-return']").should('exist').click();

    /*
    cy.get('#email-error').should(
      'contain.text',
      'Error: Enter an email address in the correct format, like name@example.com',
    );
    */
  });
});
