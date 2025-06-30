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

type ResultField = {
  default: string;
  updatedValue: string;
  prevResult: string;
  prevResultType?: 'negative' | 'warning' | 'positive';
  updatedResult: string;
  updatedResultType?: 'negative' | 'warning' | 'positive';
};

export class MortgageAffordabilityCalculator {
  elements = {
    title: () => cy.get('.container-auto .text-2xl'),
    heading: () => cy.get('[data-testid="tab-container-div"] h1'),
    primaryInfo: () => cy.get('[data-testid="tab-container-div"] h1 ~p'),
    subHeading: () => cy.get('[data-testid="tab-container-div"] h2'),
    moreInfo: (id: string) =>
      cy
        .get(`[data-testid="field-group-${id}"]`)
        .siblings('details.tool-expand')
        .children('summary')
        .children('[data-testid="summary-block-title"]'),
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
    householdTitle: () => cy.get('.text-2xl'),
    householdHeading: () => cy.get('[data-testid="tab-container-div"] h1'),
    householdInfo: () => cy.get('[data-testid="tab-container-div"] h1 ~p'),
    householdSubHeading: () =>
      cy.get('#mortgage-affordability-calculator h2').first(),
    fixedCostsSubHeading: () =>
      cy.get('#mortgage-affordability-calculator h2').eq(1),
    livingCostsSubHeading: () =>
      cy.get('#mortgage-affordability-calculator h2').eq(2),
    livingCostsInfo: () =>
      cy.get('#mortgage-affordability-calculator h2').eq(2).siblings('p'),

    getLabelForField: (id: string) => cy.get(`label[for="q-${id}"]`),
    getInputField: (id: string) => cy.get(`#q-${id}`),

    getNextStepsButton: () =>
      cy.get('[data-testid="landing-page-button"]').eq(1),
  };

  shouldCheckDescriptionFor(
    id: MONTHLY_COSTS | string,
    title: string,
    description: string,
  ) {
    this.elements.moreInfo(id).should('have.text', title);
    this.elements.moreInfo(id).click();

    this.elements
      .moreInfo(id)
      .parent()
      .parent()
      .children('.mb-4')
      .should('have.text', description)
      .should('be.visible');

    this.elements.moreInfo(id).click();
  }

  enterValueFor(
    element: Cypress.Chainable<JQuery<HTMLElement>>,
    value: string,
  ) {
    element.clear().type(value);
  }

  enterIncome(key: IncomeFieldsKey, value?: string) {
    if (INCOME_FIELDS[key] && value) {
      this.elements
        .getLabelForField(INCOME_FIELDS[key])
        .should('have.text', incomeData.core.annualIncome[`${key}Label`]);

      if (key === 'otherIncome') {
        this.shouldCheckDescriptionFor(
          INCOME_FIELDS[key],
          incomeData.core.annualIncome[`${key}IncludeLabel`],
          incomeData.core.annualIncome[`${key}Description`],
        );
      }
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

      this.shouldCheckDescriptionFor(
        MONTHLY_COSTS[key],
        incomeData.core.householdCosts[`${key}IncludeLabel`],
        incomeData.core.householdCosts[`${key}Description`],
      );
      this.enterValueFor(
        this.elements.getInputField(MONTHLY_COSTS[key]),
        value,
      );
    }
  }

  checkOverstretchedLabels() {
    cy.get('h1')
      .should('be.visible')
      .should('have.text', incomeData.core.overstretched.title);
    cy.get('h1')
      .siblings('p')
      .eq(0)
      .should('have.text', incomeData.core.overstretched.primaryInfo);
    cy.get('h1')
      .siblings('p')
      .eq(1)
      .should('have.text', incomeData.core.overstretched.subHeading);
    cy.get('h1')
      .siblings('p')
      .eq(2)
      .should('have.text', incomeData.core.overstretched.secondaryInfo);
  }

  clickNextSteps() {
    this.elements.getNextStepsButton().click();
  }

  validateResultCallout(
    resultType: 'negative' | 'warning' | 'positive',
    repayment: string,
    currentMortgage: string,
  ) {
    cy.get(`[data-testid="callout-${resultType}"]`)
      .first()
      .should('have.text', incomeData.core.calloutMessages[resultType]);

    cy.get('[data-testid="ResultsCallout"]').children('p').as('resultsCallout');
    cy.get('@resultsCallout')
      .eq(0)
      .should(
        'have.text',
        'Your estimated mortgage repayments per month will be approximately:',
      );
    cy.get('@resultsCallout').eq(1).should('have.text', repayment);
    cy.get('@resultsCallout')
      .eq(2)
      .should(
        'have.text',
        'Compared with your current rent or mortgage payment of:',
      );
    cy.get('@resultsCallout').eq(3).should('have.text', currentMortgage);
  }

  updateBorrowingAmount(amount: string) {
    cy.get('#r-borrow-amount').type(`{selectAll}${amount}`);
  }

  updateMortgageTerm(term: string) {
    cy.get('#r-term').type(`{selectAll}${term}`);
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
    resultType: 'negative' | 'warning' | 'positive',
    currentMortgage: string,
  ) {
    cy.get('h1').should('have.text', 'Your results');
    cy.get('h1')
      .siblings('p')
      .eq(0)
      .should('have.text', 'You might be offered between');
    cy.get('h1').siblings('p').eq(1).should('have.text', `${min} and ${max}`);

    // Borrowing Amount
    if (borrowingAmount) {
      cy.get('label[for="r-borrow-amount"]').should(
        'have.text',
        'Amount to borrow:',
      );
      cy.get('#r-borrow-amount')
        .as('borrow')
        .should('have.value', borrowingAmount.default);
      this.validateResultCallout(
        borrowingAmount.prevResultType || resultType,
        borrowingAmount.prevResult,
        currentMortgage,
      );

      cy.get('input[type=range][name="s-borrow-amount"]')
        .as('borrowRange')
        .should('have.value', borrowingAmount.default.replaceAll(',', ''));

      cy.get('@borrow').type(`{selectAll}${borrowingAmount.updatedValue}`);
      if (
        parseFloat(borrowingAmount.updatedValue.replaceAll(',', '')) >=
        parseFloat(min.replace('£', '').replaceAll(',', ''))
      ) {
        cy.get('@borrowRange').should(
          'have.value',
          parseFloat(borrowingAmount.updatedValue.replaceAll(',', '')),
        );
      } else {
        cy.get('[data-testid="borrow-error"]').should(
          'have.text',
          `Enter a number between ${min} and ${max}`,
        );
      }
      this.validateResultCallout(
        borrowingAmount.updatedResultType || resultType,
        borrowingAmount.updatedResult,
        currentMortgage,
      );
    }

    // Repayment Term
    if (mortgageTerm) {
      cy.get('label[for="r-term"]').should(
        'have.text',
        'Based on a repayment mortgage term of:',
      );
      cy.get('#r-term').as('term').should('have.value', mortgageTerm.default);
      cy.get('input[type="range"][name="s-term"]')
        .as('termRange')
        .should('have.value', parseInt(mortgageTerm.default));
      this.validateResultCallout(
        mortgageTerm.prevResultType || resultType,
        mortgageTerm.prevResult,
        currentMortgage,
      );
      cy.get('@term').type(`{selectAll}${mortgageTerm.updatedValue}`);
      cy.get('@termRange').should(
        'have.value',
        parseInt(mortgageTerm.updatedValue),
      );
      this.validateResultCallout(
        mortgageTerm.updatedResultType || resultType,
        mortgageTerm.updatedResult,
        currentMortgage,
      );
    }

    // Interest Rate
    if (interestRate) {
      cy.get('label[for="r-interest"]').should(
        'have.text',
        'With an interest rate at:',
      );
      cy.get('#r-interest')
        .as('interest')
        .should('have.value', interestRate.default);
      this.validateResultCallout(
        interestRate.prevResultType || resultType,
        interestRate.prevResult,
        currentMortgage,
      );
      cy.get('input[type=range][name="s-interest"]')
        .as('interestRange')
        .should('have.value', parseFloat(interestRate.default));
      cy.get('@interest').type(`{selectAll}${interestRate.updatedValue}`);
      this.validateResultCallout(
        interestRate.updatedResultType || resultType,
        interestRate.updatedResult,
        currentMortgage,
      );
    }

    cy.get('h2')
      .first()
      .prev()
      .should(
        'have.text',
        'Changing the term of the mortgage can affect the total amount of money you are able to borrow as well as the cost of your monthly repayments. For example, a shorter term will probably result in higher monthly payments, whereas a longer term means lower payments, spread out over a longer period of time.',
      );
  }

  checkAffordability(
    resultType: 'negative' | 'warning' | 'positive',
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
    cy.get('h2')
      .first()
      .should('have.text', 'Can you afford these monthly payments?');
    cy.get('h2')
      .first()
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

        cy.wrap(elements[4]).within(() => {
          cy.get('#summary').should(
            'have.text',
            incomeData.core.budgetInfo[resultType].heading,
          );
          cy.get('#summary')
            .next()
            .should(
              'have.text',
              incomeData.core.budgetInfo.basicPercentageLabel.replace(
                '%BASIC_COST_PERCENTAGE%',
                basicCostPercentage,
              ),
            );
          cy.get('#summary')
            .next()
            .next()
            .should('have.text', incomeData.core.budgetInfo[resultType].info);

          cy.get('p')
            .eq(3)
            .should(
              'have.text',
              `Mortgage repayments and essential costs per month amount to roughly ${essentialCostPercentage} of your total take-home pay: ${totalCost}`,
            );
          cy.get('p')
            .last()
            .should(
              'have.text',
              `What you have left over is roughly ${leftOverPercentage} of your monthly take-home: ${leftOverValue}`,
            );
        });

        cy.wrap(elements[5]).should('have.text', "What's left over?");
        cy.wrap(elements[6]).within(() => {
          cy.get('label[for="r-living-costs"]').should(
            'have.text',
            'You estimated your monthly living costs to be:',
          );
          cy.get('#r-living-costs')
            .as('livingCosts')
            .should('have.value', livingCosts);
          cy.get('input[type="range"]')
            .as('livingCostRange')
            .should('have.value', parseFloat(livingCosts.replaceAll(',', '')));

          cy.get('@livingCosts').type(`{selectAll}${updatedLivingCost}`);
          cy.get('@livingCostRange').should(
            'have.value',
            parseFloat(updatedLivingCost.replaceAll(',', '')),
          );
        });
        cy.wrap(elements[7]).should(
          'have.text',
          'The amount you have left over after living costs per month is:',
        );
        cy.wrap(elements[8]).should('have.text', updatedLeftOver);

        const leftOver = parseFloat(
          updatedLeftOver.replace('£', '').replaceAll(',', ''),
        );
        cy.wrap(elements[9]).should(
          'have.text',
          leftOver < 0
            ? "You are spending more than your take-home pay, which means that you are overstretching your budget and are at risk of getting into debt. You won't be able to afford your mortgage payments, particularly if circumstances change. Here's what you can do now."
            : "You have money left over each month right now, but if interest rates rise how would that affect your budget? Would you be overstretching yourself? Here's what you can do now.",
        );

        cy.wrap(elements[10]).should(
          'have.text',
          'What if interest rates rise?',
        );
        cy.wrap(elements[11]).should(
          'have.text',
          'If interest rates rise by 3 percentage points, your monthly repayment will rise to:',
        );
        cy.wrap(elements[12]).should('have.text', monthlyRepayment);
        cy.wrap(elements[13]).should(
          'have.text',
          'Your remaining budget per month will be:',
        );
        cy.wrap(elements[14]).should('have.text', remainingBudget);
        cy.wrap(elements[15]).should(
          'have.text',
          'This is an estimate, designed to help you understand what a lender might offer you. Actual loan amounts and affordability criteria will differ across lenders.',
        );
      });
  }

  checkForBorrowError(message: string) {
    cy.get('.t-error-summary').within(() => {
      cy.get('h5').should('have.text', 'There is a problem');
      cy.get('.list-none').should(
        'have.text',
        `"Amount to borrow" - ${message}`,
      );
    });

    cy.get('[data-testid="borrow-error"]').should('have.text', message);
  }

  validateNextSteps(resultType: 'negative' | 'warning' | 'positive') {
    if (resultType === 'positive') {
      cy.get('h1').should(
        'have.text',
        'Three steps to finding an affordable mortgage',
      );

      cy.get('ol')
        .first()
        .within(() => {
          cy.get('li')
            .first()
            .should(
              'have.text',
              'Make sure you get the best mortgage for youUnderstanding mortgages (opens in a new window) ',
            );

          cy.get('li')
            .eq(1)
            .should(
              'have.text',
              "Don't make these mistakesBuying a home: how to avoid the most common mistakes (opens in a new window) ",
            );

          cy.get('li')
            .last()
            .should(
              'have.text',
              'Get started with your applicationHome-buying process - Steps to buying a new house or flat (opens in a new window) ',
            );
        });
    } else if (resultType === 'negative') {
      cy.get('h1').should('have.text', 'What you should do next');

      cy.get('ol')
        .first()
        .within(() => {
          cy.get('li')
            .first()
            .should(
              'have.text',
              'Explore different schemes to help you buy a homeGovernment schemes for first-time home buyers and existing homeowners (opens in a new window) ',
            );

          cy.get('li')
            .eq(1)
            .should(
              'have.text',
              'Take control of your moneyUse our Budget Planner (opens in a new window)  to get the full picture',
            );

          cy.get('li')
            .last()
            .should(
              'have.text',
              'Understand all the costsMake sure you understand all the up front costs of buying a home (opens in a new window) ',
            );
        });
    } else if (resultType === 'warning') {
      cy.get('h1').should('have.text', 'What you should do next');
      cy.get('ol')
        .first()
        .within(() => {
          cy.get('li')
            .first()
            .should(
              'have.text',
              'Explore different schemes to help you buy a homeGovernment schemes for first-time home buyers and existing homeowners (opens in a new window) ',
            );

          cy.get('li')
            .eq(1)
            .should(
              'have.text',
              'Take control of your moneyUse our Budget Planner (opens in a new window)  to get the full picture',
            );

          cy.get('li')
            .last()
            .should(
              'have.text',
              'Understand all the costsMake sure you understand all the up front costs of buying a home (opens in a new window) ',
            );
        });
    }

    cy.get('h2').first().should('have.text', 'Affording your mortgage');
    cy.get('h2 ~ p')
      .first()
      .should(
        'have.text',
        'Think about your household spend as well as your mortgage repayments.',
      );
    cy.get('h2 ~ p')
      .last()
      .should(
        'have.text',
        'Spending more than 50% of your take-home pay on committed costs and mortgage puts you at very high risk of overstretching your budget. Make sure you have enough money left over at the end of the month to help you cope, should interest rates rise or your circumstances change.',
      );
  }
}
