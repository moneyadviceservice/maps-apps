import incomeData from '../fixtures/mortgageAffordabilityCalculator.json';

export enum MONTHLY_COSTS {
  creditCard = 'card-and-loan',
  childAndSpouse = 'child-spousal',
  childCare = 'care-school',
  travelCosts = 'travel',
  bills = 'bills-insurance',
  mortgage = 'rent-mortgage',
  entertainment = 'leisure',
  holidays = 'holidays',
  groceries = 'groceries',
}

export enum INCOME_FIELDS {
  annualIncome = 'annual-income',
  takeHome = 'take-home',
  otherIncome = 'other-income',
}

export type MonthlyCostsKey = keyof typeof MONTHLY_COSTS;

export type IncomeFieldsKey = keyof typeof INCOME_FIELDS;

type CalloutResultType = 'warning' | 'positive';

type ResultField = {
  default?: string;
  updatedValue?: string;
  mortgageResult?: string;
  interestResult?: string;
  prevResult?: string;
  prevResultType?: CalloutResultType;
  updatedResult?: string;
  updatedResultType?: CalloutResultType;
};

type CalloutResults = {
  percentUsage: ResultField | undefined;
  leftOver: ResultField | undefined;
  leftOverIncreased: ResultField | undefined;
  resultType: CalloutResultType;
};

export class MortgageAffordabilityCalculator {
  private readonly borrowAmountInputSelector =
    '#r-borrow-amount, #q-r-borrow-amount, [data-testid="borrow-amount"]';

  elements = {
    title: () => cy.get('[data-testid="toolpage-span-title"]'),
    heading: () => cy.get('[data-testid="tab-container-div"] h1').first(),
    primaryInfo: () => cy.get('[data-testid="tab-container-div"] h1 ~p'),
    subHeading: () => cy.get('[data-testid="tab-container-div"] h2'),
    annualIncomeLabel: () =>
      cy.get(
        '[data-testid="field-group-annual-income"] > :nth-child(1) > .block',
      ),
    annualIncome: () => cy.get('#annual-income'),
    takeHomeLabel: () =>
      cy.get(
        '[data-testid="field-group-take-home"] > :nth-child(1) > .text-xl',
      ),
    takeHomeHintText: () => cy.get('.text-gray-400'),
    takeHomeIncome: () => cy.get('#take-home'),
    otherIncomeLabel: () =>
      cy.get(
        '[data-testid="field-group-other-income"] > :nth-child(1) > .block',
      ),
    otherIncome: () => cy.get('#other-income'),
    incomeCountLabel: () => cy.get('[data-testid="summary-block-title"]'),

    secondApplicantYes: () => cy.get('#Yes'),
    secondApplicantNo: () => cy.get('#No'),
    householdTitle: () => cy.get('[data-testid="toolpage-span-title"]'),
    householdHeading: () =>
      cy.get('[data-testid="tab-container-div"] h1').first(),
    householdInfo: () => cy.get('[data-testid="tab-container-div"] h1 ~p'),
    householdApplyingNote: () =>
      cy.get('[data-testid="applying-with-someone-note"]'),
    householdSubHeading: () =>
      cy.get('#mortgage-affordability-calculator h2').first(),
    travelLivingSubHeading: () =>
      cy.get('#mortgage-affordability-calculator h2').eq(1),
    livingCostsInfo: () =>
      cy.get('#mortgage-affordability-calculator h2').eq(1).siblings('p'),

    getLabelForField: (id: string) => cy.get(`label[for="q-${id}"]`),
    getHintForField: (id: string) =>
      cy.get(`span[id="q-${id}-description"].block`),
    getInputField: (id: string) => cy.get(`#q-${id}`),

    resultsBorrowAmount: () => cy.get('#r-borrow-amount'),
    resultsMortgageTerm: () => cy.get('#r-term'),
    resultsIntrestRate: () => cy.get('#r-interest'),
  };

  enterValueFor(
    element: Cypress.Chainable<JQuery<HTMLElement>>,
    value: string,
  ) {
    element.clear().type(value);
  }

  enterResultsBorrowAmount(value: string) {
    this.enterValueFor(
      this.elements.resultsBorrowAmount(),
      `{selectAll}${value}`,
    );
  }

  enterResultsMortgageTerm(value: string) {
    this.elements.resultsMortgageTerm().select(value);
  }

  enterResultsIntrestRate(value: string) {
    this.enterValueFor(
      this.elements.resultsIntrestRate(),
      `{selectAll}${value}`,
    );
  }

  enterIncome(key: IncomeFieldsKey, value?: string) {
    if (INCOME_FIELDS[key] && value) {
      this.elements
        .getLabelForField(INCOME_FIELDS[key])
        .should('have.text', incomeData.core.annualIncome[`${key}Label`]);
      this.enterValueFor(
        this.elements.getInputField(INCOME_FIELDS[key]),
        value,
      );
    }
  }

  enterMonthlyCostFor(key: MonthlyCostsKey, value?: string) {
    if (MONTHLY_COSTS[key] && value) {
      this.elements
        .getLabelForField(MONTHLY_COSTS[key])
        .should('have.text', incomeData.core.householdCosts[`${key}Label`]);
      this.enterValueFor(
        this.elements.getInputField(MONTHLY_COSTS[key]),
        value,
      );
    }
  }

  checkOverstretchedLabels() {
    cy.get('[data-testid="callout-negative"] h1')
      .should('be.visible')
      .should('have.text', incomeData.core.overstretched.title);
    cy.get('[data-testid="callout-negative"]')
      .siblings('p')
      .eq(0)
      .should('have.text', incomeData.core.overstretched.primaryInfo);
    cy.get('[data-testid="callout-negative"]')
      .siblings('p')
      .eq(1)
      .should('have.text', incomeData.core.overstretched.subHeading);
    cy.get('[data-testid="callout-negative"]')
      .siblings('p')
      .eq(2)
      .should('have.text', incomeData.core.overstretched.secondaryInfo);
  }

  expectResultCalloutWith(
    resultType: CalloutResultType,
    percentUsage: string,
    leftOver: string,
    leftOverIncreased: string,
  ) {
    cy.get(`[data-testid="callout-${resultType}-ResultsCallout"]`)
      .children()
      .as('resultsCallout');

    cy.get('@resultsCallout')
      .eq(0)
      .should(
        'have.text',
        `You’re using ${percentUsage}% of your take-home pay each month`,
      );
    cy.get('@resultsCallout')
      .eq(1)
      .should(
        'have.text',
        `This means you have ${leftOver} left over. If interest rates rose by 3%, this goes down to ${leftOverIncreased} a month - could you afford this? `,
      );
  }

  updateBorrowingAmount(amount: string) {
    cy.get(this.borrowAmountInputSelector).first().type(`{selectAll}${amount}`);
  }

  clickUpdateResults() {
    cy.get('[data-testid="mac-update-results"]').click();
  }

  submitResultsForm() {
    this.clickUpdateResults();
    // Results only update after the server round-trip; the redirect adds the
    // submitted r- values to the query string
    cy.location('search').should('contain', 'r-borrow-amount=');
  }

  updateMortgageTerm(term: string) {
    cy.get('#r-term').select(term);
  }

  updateInterestRate(rate: string) {
    cy.get('#r-interest').type(`{selectAll}${rate}`);
  }

  checkResults(
    min: string,
    max: string,
    borrowingAmount: ResultField | undefined,
    mortgageTerm: ResultField | undefined,
    interestRate: ResultField | undefined,
    callout: CalloutResults | undefined,
  ) {
    cy.get('h1').should('have.text', 'Your results');
    cy.get('h1')
      .siblings('p')
      .eq(0)
      .should('have.text', 'You might be offered between');
    cy.get('h2').first().should('have.text', `${min} and ${max}`);
    cy.get('h2').eq(1).should('have.text', 'Change your results');

    cy.get('input[type="range"]').should('not.exist');

    // Borrowing Amount
    if (borrowingAmount) {
      cy.get(this.borrowAmountInputSelector)
        .first()
        .as('borrow')
        .should('be.visible')
        .should('have.value', borrowingAmount.default);
      cy.get('@borrow')
        .invoke('attr', 'id')
        .then((borrowId) => {
          if (borrowId) {
            cy.get(`label[for="${borrowId}"]`).should(
              'contain.text',
              'Mortgage amount',
            );
          }
        });
      cy.get('#r-borrow-amount-description').should(
        'have.text',
        `Enter how much you want to borrow. It must be between ${min} and ${max}.`,
      );
      this.expectResultCalloutWith(
        borrowingAmount.prevResultType || callout.resultType,
        callout.percentUsage.prevResult,
        callout.leftOver.prevResult,
        callout.leftOverIncreased.prevResult,
      );

      cy.get('@borrow').type(`{selectAll}${borrowingAmount.updatedValue}`);
      // Results only change once the form is submitted
      this.clickUpdateResults();

      if (
        parseFloat(borrowingAmount.updatedValue.replaceAll(',', '')) >=
        parseFloat(min.replace('£', '').replaceAll(',', ''))
      ) {
        cy.location('search').should(
          'contain',
          `r-borrow-amount=${encodeURIComponent(borrowingAmount.updatedValue)}`,
        );
        cy.window().its('scrollY').should('eq', 0);
        cy.get(this.borrowAmountInputSelector)
          .first()
          .should('have.value', borrowingAmount.updatedValue);
        this.expectResultCalloutWith(
          borrowingAmount.updatedResultType || callout.resultType,
          callout.percentUsage.updatedResult,
          callout.leftOver.updatedResult,
          callout.leftOverIncreased.updatedResult,
        );
      } else {
        cy.get('[data-testid="borrow-error"]').should(
          'have.text',
          `Enter a number between ${min} and ${max}`,
        );
      }
    }

    // Repayment Term
    if (mortgageTerm) {
      cy.get('label[for="r-term"]').should('have.text', 'Length of mortgage');
      cy.get('#r-term-description').should(
        'have.text',
        "A longer term lowers your monthly costs, but you'll pay more interest overall.",
      );
      cy.get('#r-term').as('term').should('have.value', mortgageTerm.default);
      this.expectResultCalloutWith(
        mortgageTerm.updatedResultType || callout.resultType,
        callout.percentUsage.updatedResult,
        callout.leftOver.updatedResult,
        callout.leftOverIncreased.updatedResult,
      );
      cy.get('@term').select(mortgageTerm.updatedValue);
      this.clickUpdateResults();
      cy.location('search').should(
        'contain',
        `r-term=${encodeURIComponent(mortgageTerm.updatedValue)}`,
      );
      cy.window().its('scrollY').should('eq', 0);
      cy.get('#r-term').should('have.value', mortgageTerm.updatedValue);
      this.expectResultCalloutWith(
        mortgageTerm.updatedResultType || callout.resultType,
        callout.percentUsage.mortgageResult,
        callout.leftOver.mortgageResult,
        callout.leftOverIncreased.mortgageResult,
      );
    }

    // Interest Rate
    if (interestRate) {
      cy.get('label[for="r-interest"]').should('have.text', 'Interest rate');
      cy.get('#r-interest-description').should(
        'have.text',
        "A higher interest rate means you'll pay more each month.",
      );
      cy.get('#r-interest')
        .as('interest')
        .should('have.value', interestRate.default);
      this.expectResultCalloutWith(
        interestRate.prevResultType || callout.resultType,
        callout.percentUsage.mortgageResult,
        callout.leftOver.mortgageResult,
        callout.leftOverIncreased.mortgageResult,
      );
      cy.get('@interest').type(`{selectAll}${interestRate.updatedValue}`);
      this.clickUpdateResults();
      cy.location('search').should(
        'contain',
        `r-interest=${encodeURIComponent(interestRate.updatedValue)}`,
      );
      cy.window().its('scrollY').should('eq', 0);
      cy.get('#r-interest').should('have.value', interestRate.updatedValue);
      this.expectResultCalloutWith(
        interestRate.updatedResultType || callout.resultType,
        callout.percentUsage.interestResult,
        callout.leftOver.interestResult,
        callout.leftOverIncreased.interestResult,
      );
    }
  }

  checkAffordability(
    resultType: CalloutResultType,
    estimatedCommitment: string,
    takeHomePay: string,
    basicCostPercentage: string,
    essentialCostPercentage: string,
    totalCost: string,
    leftOverPercentage: string,
    leftOverValue: string,
    livingCosts: string,
    updatedLivingCost: string,
    updatedLeftOver: string,
    monthlyRepayment: string,
    remainingBudget: string,
  ) {
    cy.contains('h2', 'Can you afford these monthly payments?').should('exist');
    cy.contains('h2', 'Can you afford these monthly payments?')
      .nextAll()
      .then((elements) => {
        cy.wrap(elements[0]).should(
          'have.text',
          'Your estimated fixed and committed spend per month is:',
        );
        cy.wrap(elements[1]).should('have.text', estimatedCommitment);
        cy.wrap(elements[2]).should(
          'have.text',
          'Your total take-home pay per month is:',
        );
        cy.wrap(elements[3]).should('have.text', takeHomePay);

        cy.wrap(elements[4]).should('have.text', "What's left over?");
        cy.wrap(elements[5]).within(() => {
          cy.get('label[for="r-living-costs"]').should(
            'have.text',
            'You estimated your monthly living costs to be:',
          );
          cy.get('#r-living-costs')
            .as('livingCosts')
            .should('have.value', livingCosts);
          cy.get('input[type="range"]').should('not.exist');

          cy.get('@livingCosts').type(`{selectAll}${updatedLivingCost}`);
          cy.get('@livingCosts').should('have.value', updatedLivingCost);
        });

        cy.wrap(elements[6]).should(
          'have.text',
          'The amount you have left over after living costs per month is:',
        );
        cy.wrap(elements[7]).should('have.text', updatedLeftOver);

        const leftOver = parseFloat(
          updatedLeftOver.replace('£', '').replaceAll(',', ''),
        );
        cy.wrap(elements[8]).should(
          'have.text',
          leftOver < 0
            ? "You are spending more than your take-home pay, which means that you are overstretching your budget and are at risk of getting into debt. You won't be able to afford your mortgage payments, particularly if circumstances change. Here's what you can do now."
            : "You have money left over each month right now, but if interest rates rise how would that affect your budget? Would you be overstretching yourself? Here's what you can do now.",
        );

        cy.wrap(elements[9]).should(
          'have.text',
          'What if interest rates rise?',
        );
        cy.wrap(elements[10]).should(
          'have.text',
          'If interest rates rise by 3 percentage points, your monthly repayment will rise to:',
        );
        cy.wrap(elements[11]).should('have.text', monthlyRepayment);
        cy.wrap(elements[12]).should(
          'have.text',
          'Your remaining budget per month will be:',
        );
        cy.wrap(elements[13]).should('have.text', remainingBudget);
        cy.wrap(elements[14]).should(
          'have.text',
          'This is an estimate, designed to help you understand what a lender might offer you. Actual loan amounts and affordability criteria will differ across lenders.',
        );
      });
  }

  checkForBorrowError(message: string) {
    cy.get('[data-testid="error-records"], .t-error-summary')
      .first()
      .within(() => {
        cy.get('[data-testid="error-summary-heading"], #error-summary-heading')
          .first()
          .should('contain', 'There is a problem');
        cy.get('[data-testid^="error-link-"]')
          .first()
          .should('contain', message);
      });
  }

  expectCompareHousingCostsCardWith(
    currentMortgageOrRent: string,
    newMortgage: string,
    difference: string,
    comparison: 'less' | 'more' | 'same',
  ) {
    cy.get('[data-testid="compare-housing-costs"]').within(() => {
      cy.get('[data-testid="dtc-table"]').within(() => {
        cy.get('tr')
          .eq(0)
          .within(() => {
            cy.get('th').should('contain.text', 'Rent or current mortgage');
            cy.get('td').should('contain.text', currentMortgageOrRent);
          });

        cy.get('tr')
          .eq(1)
          .within(() => {
            cy.get('th').should('contain.text', 'New mortgage payment');
            cy.get('td').should('contain.text', newMortgage);
          });
      });

      if (comparison === 'less') {
        cy.get('[data-testid="dtc-description"]').should(
          'have.text',
          `Your new mortgage would cost ${newMortgage} a month - that’s ${difference} less than you spend now.`,
        );
        cy.get('[data-testid="dtc-footnote"]').should(
          'have.text',
          `You will pay ${difference} less`,
        );
      } else if (comparison === 'more') {
        cy.get('[data-testid="dtc-description"]').should(
          'have.text',
          `Your new mortgage would cost ${newMortgage} a month - that’s ${difference} more than you spend now.`,
        );
        cy.get('[data-testid="dtc-footnote"]').should(
          'have.text',
          `You will pay ${difference} more`,
        );
      } else if (comparison === 'same') {
        cy.get('[data-testid="dtc-description"]').should(
          'have.text',
          `Your new mortgage costs ${newMortgage} a month - that’s the same as you pay now.`,
        );
        cy.get('[data-testid="dtc-footnote"]').should(
          'have.text',
          `You will pay the same each month, ${newMortgage}`,
        );
      }
    });
  }

  expectCanYouAffordThisCardWith(
    takeHomePay: string,
    newMortgagePayment: string,
    otherHouseholdCosts: string,
    leftOver: string,
  ) {
    cy.get('[data-testid="can-you-afford-this"]').within(() => {
      cy.get('[data-testid="dtc-table"]').within(() => {
        cy.get('tr')
          .eq(0)
          .within(() => {
            cy.get('th').should('contain.text', 'Take-home pay');
            cy.get('td').should('contain.text', takeHomePay);
          });

        cy.get('tr')
          .eq(1)
          .within(() => {
            cy.get('th').should('contain.text', 'New mortgage payment');
            cy.get('td').should('contain.text', newMortgagePayment);
          });

        cy.get('tr')
          .eq(2)
          .within(() => {
            cy.get('th').should('contain.text', 'Other household costs');
            cy.get('td').should('contain.text', otherHouseholdCosts);
          });

        cy.get('tr')
          .eq(3)
          .within(() => {
            cy.get('th').should('contain.text', 'Left over');
            cy.get('td').should('contain.text', leftOver);
          });
      });

      cy.get('[data-testid="dtc-description"]').should(
        'contain.text',
        `After paying your household costs, you have around ${leftOver} left`,
      );
    });
  }

  expectWhatIfInterestRatesWiseWith(
    rows: {
      rate: string;
      payment: string;
      left: string;
    }[],
  ) {
    cy.get('[data-testid="what-if-interest-rates-rise"]').within(() => {
      cy.get('[data-testid="dtc-table"]').within(() => {
        rows.forEach((row, idx) => {
          cy.get('tr')
            .eq(1 + idx)
            .within(() => {
              cy.get('td').eq(0).should('contain.text', row.rate);
              cy.get('td').eq(1).should('contain.text', row.payment);
              cy.get('td').eq(2).should('contain.text', row.left);
            });
        });
      });

      cy.get('[data-testid="dtc-description"]').should(
        'have.text',
        `If your rate rises to ${rows[0].rate}, your monthly repayment would be ${rows[0].payment} - leaving you around ${rows[0].left} a month.`,
      );
    });
  }
}
