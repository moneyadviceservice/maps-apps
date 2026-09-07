import incomeData from '../fixtures/mortgageAffordabilityCalculator.json';
import { MortgageAffordabilityCalculator } from '../pages/mortgageAffordabilityCalculator';

describe('Mortgage Affordability Calculator', () => {
  beforeEach(() => {
    cy.skipExceptions();
    cy.setBreakPoint('desktop');
    cy.setCookieControl();
    cy.visit('/en/annual-income');
  });

  const page = new MortgageAffordabilityCalculator();

  it('checking overstretched budget', () => {
    page.elements
      .title()
      .should('have.text', incomeData.core.annualIncome.title);
    page.elements
      .heading()
      .should('have.text', incomeData.core.annualIncome.heading);
    page.elements
      .primaryInfo()
      .should('have.text', incomeData.core.annualIncome.primaryInfo);

    page.enterIncome('annualIncome', '35000');
    page.enterIncome('takeHome', '2000');
    page.enterIncome('otherIncome', '344');

    cy.get('#continue').click();
    page.elements
      .householdTitle()
      .should('be.visible')
      .should('have.text', incomeData.core.householdCosts.title);
    page.elements
      .householdHeading()
      .should('have.text', incomeData.core.householdCosts.heading);
    page.elements
      .householdInfo()
      .should('have.text', incomeData.core.householdCosts.monthlyHouseholdInfo);
    page.elements
      .householdApplyingNote()
      .should(
        'have.text',
        incomeData.core.householdCosts.applyingWithSomeoneNote,
      );
    page.elements
      .householdSubHeading()
      .should('have.text', incomeData.core.householdCosts.householdSubHeading);

    page.enterMonthlyCostFor('mortgage', '1500');
    page.enterMonthlyCostFor('creditCard', '600');
    page.enterMonthlyCostFor('childAndSpouse', '500');
    page.enterMonthlyCostFor('childCare', '500');

    page.elements
      .travelLivingSubHeading()
      .should('have.text', incomeData.core.householdCosts.subHeading2);
    page.elements
      .livingCostsInfo()
      .should(
        'have.text',
        incomeData.core.householdCosts.monthlyLivingCostsInfo,
      );

    page.enterMonthlyCostFor('travelCosts', '200');
    page.enterMonthlyCostFor('bills', '500');
    page.enterMonthlyCostFor('groceries', '500');

    page.elements
      .getHintForField('leisure')
      .should('have.text', incomeData.core.householdCosts.entertainmentHint);
    page.enterMonthlyCostFor('entertainment', '100');

    page.elements
      .getHintForField('holidays')
      .should('have.text', incomeData.core.householdCosts.holidaysHint);
    page.enterMonthlyCostFor('holidays', '300');

    cy.get('#continue').click();

    page.checkOverstretchedLabels();
  });

  it('checking risky budget', () => {
    page.enterIncome('annualIncome', '35000');
    page.enterIncome('takeHome', '2100');
    page.enterIncome('otherIncome', '3440');

    cy.get('#continue').click();

    page.enterMonthlyCostFor('creditCard', '300');
    page.enterMonthlyCostFor('travelCosts', '200');
    page.enterMonthlyCostFor('bills', '250');
    page.enterMonthlyCostFor('mortgage', '100');
    page.enterMonthlyCostFor('entertainment', '50');
    page.enterMonthlyCostFor('holidays', '100');
    page.enterMonthlyCostFor('groceries', '500');

    cy.get('#continue').click();

    page.checkResults(
      '£52,260',
      '£174,200',
      {
        default: '113,230',
        updatedValue: '100,000',
        prevResult: '£597.67',
        updatedResult: '£527.84',
      },
      {
        default: '25',
        updatedValue: '30',
        prevResult: '£527.84',
        updatedResult: '£477.42',
      },
      {
        default: '4',
        updatedValue: '4.43',
        prevResult: '£477.42',
        updatedResult: '£502.53',
      },
      {
        percentUsage: {
          prevResult: '95',
          updatedResult: '92',
          mortgageResult: '89',
          interestResult: '91',
        },
        leftOver: {
          prevResult: '£102.33',
          updatedResult: '£172.16',
          mortgageResult: '£222.58',
          interestResult: '£197.47',
        },
        leftOverIncreased: {
          prevResult: '£549.71',
          updatedResult: '-£6.78',
          mortgageResult: '£34.70',
          interestResult: '£5.57',
        },
        resultType: 'warning',
      },
    );

    page.checkAffordability(
      'warning',
      '£750.00',
      '£2,100.00',
      'between 80% - 100%',
      '91%',
      '£1,902.53',
      '9%',
      '£197.47',
      '650',
      '300',
      '£547.47',
      '£694.43',
      '£355.57',
    );
  });

  it('checking for safe budget', () => {
    page.enterIncome('annualIncome', '65000');
    page.enterIncome('takeHome', '3500');
    page.enterIncome('otherIncome', '10440');

    cy.get('#continue').click();

    page.enterMonthlyCostFor('travelCosts', '200');
    page.enterMonthlyCostFor('bills', '250');
    page.enterMonthlyCostFor('mortgage', '800');
    page.enterMonthlyCostFor('entertainment', '50');
    page.enterMonthlyCostFor('holidays', '100');
    page.enterMonthlyCostFor('groceries', '400');

    cy.get('#continue').click();

    page.checkResults(
      '£113,160',
      '£377,200',
      {
        default: '245,180',
        updatedValue: '250,000',
        prevResult: '£1,294.15',
        updatedResult: '£1,319.59',
        prevResultType: 'positive',
        updatedResultType: 'positive',
      },
      {
        default: '25',
        updatedValue: '20',
        prevResult: '£1,319.59',
        prevResultType: 'positive',
        updatedResult: '£1,514.95',
        updatedResultType: 'positive',
      },
      {
        default: '4',
        updatedValue: '4.25',
        prevResult: '£1,514.95',
        prevResultType: 'positive',
        updatedResult: '£1,548.09',
        updatedResultType: 'positive',
      },
      {
        percentUsage: {
          prevResult: '66',
          updatedResult: '66',
          mortgageResult: '72',
          interestResult: '73',
        },
        leftOver: {
          prevResult: '£1,205.85',
          updatedResult: '£1,180.41',
          mortgageResult: '£985.05',
          interestResult: '£951.91',
        },
        leftOverIncreased: {
          prevResult: '£1,317.12',
          updatedResult: '£733.05',
          mortgageResult: '£561.75',
          interestResult: '£524.06',
        },
        resultType: 'positive',
      },
    );

    page.checkAffordability(
      'positive',
      '£450.00',
      '£3,500.00',
      'less than 80%',
      '73%',
      '£2,548.09',
      '27%',
      '£951.91',
      '550',
      '300',
      '£1,201.91',
      '£1,975.94',
      '£774.06',
    );

    page.updateBorrowingAmount('100000');

    page.clickUpdateResults();

    page.checkForBorrowError('Enter a number between £113,160 and £377,200');

    page.updateBorrowingAmount('220000');
    page.updateMortgageTerm('25');
    page.updateInterestRate('2');

    page.clickUpdateResults();

    page.expectResultCalloutWith('positive', '55', '£1,567.52', '£1,463.90');
  });

  it('verify error messages on Page -1', () => {
    cy.get('[data-testid="second-applicant-no"]').click({ force: true });
    cy.get('[data-testid="second-applicant-no"]').should('be.checked');

    cy.get('[data-testid="second-applicant-yes"]').click({ force: true });
    cy.get('[data-testid="second-applicant-yes"]').should('be.checked');

    cy.get('label[for="q-second-applicant-yes"]').click();
    cy.get('[data-testid="second-applicant-yes"]').should('be.checked');

    cy.get('#continue').click();
    cy.get('#error-summary-heading').should('contain', 'There is a problem');
    cy.get('[data-testid="error-link-0"]').should(
      'contain',
      'Please enter your annual income or salary before tax',
    );
    cy.get('[data-testid="error-link-1"]').should(
      'contain',
      'Please enter your monthly take-home pay',
    );
    cy.get('[data-testid="error-link-2"]').should(
      'contain',
      "Please enter the second applicant's annual income or salary before tax",
    );
    cy.get('[data-testid="error-link-3"]').should(
      'contain',
      "Please enter the secondary applicant's monthly take-home pay",
    );
  });

  // Testcase - 56080
  it('verify error message on results page when user enters the mortgage amount above offered range', () => {
    page.enterIncome('annualIncome', '50000');
    page.enterIncome('takeHome', '3000');
    cy.get('#continue').click();
    page.enterMonthlyCostFor('mortgage', '500');
    page.enterMonthlyCostFor('creditCard', '200');
    page.enterMonthlyCostFor('childAndSpouse', '300');
    page.enterMonthlyCostFor('childCare', '400');
    page.enterMonthlyCostFor('travelCosts', '55');
    page.enterMonthlyCostFor('bills', '400');
    page.enterMonthlyCostFor('groceries', '250');
    page.enterMonthlyCostFor('entertainment', '100');
    page.enterMonthlyCostFor('holidays', '67');
    cy.get('#continue').click();
    page.enterResultsBorrowAmount('2210000');
    page.submitResultsForm();
    cy.get('[data-testid="error-link-0"]')
      .should('be.visible')
      .and('contain.text', 'Enter a number between £66,000 and £220,000');
  });

  // Testcase - 56081
  it('verify error message on results page when user enters interest rate above 16%', () => {
    page.enterIncome('annualIncome', '40000');
    page.enterIncome('takeHome', '3100');
    cy.get('#continue').click();
    page.enterMonthlyCostFor('mortgage', '500');
    page.enterMonthlyCostFor('creditCard', '100');
    page.enterMonthlyCostFor('childAndSpouse', '200');
    page.enterMonthlyCostFor('childCare', '300');
    page.enterMonthlyCostFor('travelCosts', '200');
    page.enterMonthlyCostFor('bills', '100');
    page.enterMonthlyCostFor('groceries', '200');
    page.enterMonthlyCostFor('entertainment', '300');
    page.enterMonthlyCostFor('holidays', '312');
    cy.get('#continue').click();
    page.enterResultsBorrowAmount('90000');
    page.enterResultsIntrestRate('16');
    page.submitResultsForm();

    cy.get('[data-testid="error-link-0"]')
      .should('be.visible')
      .and('contain.text', 'Enter a number between 1 and 15');
  });

  // TESTCASE-55460
  it('shows the compare housing costs card with a new mortgage costing £475.05 per month', () => {
    page.enterIncome('annualIncome', '30000');
    page.enterIncome('takeHome', '1000');
    cy.get('#continue').click();

    page.enterMonthlyCostFor('creditCard', '300');
    page.enterMonthlyCostFor('mortgage', '500');
    cy.get('#continue').click();

    page.enterResultsBorrowAmount('90000');
    page.enterResultsMortgageTerm('25');
    page.enterResultsIntrestRate('4');
    page.submitResultsForm();

    page.expectCompareHousingCostsCardWith(
      '£500.00',
      '£475.05',
      '£24.95',
      'less',
    );
  });

  // TESTCASE-55620
  it('shows the compare housing costs card with a new mortgage costing £633.40 per month', () => {
    page.enterIncome('annualIncome', '30000');
    page.enterIncome('takeHome', '1000');
    cy.get('#continue').click();

    page.enterMonthlyCostFor('creditCard', '300');
    page.enterMonthlyCostFor('mortgage', '500');
    cy.get('#continue').click();

    page.enterResultsBorrowAmount('120000');
    page.enterResultsMortgageTerm('25');
    page.enterResultsIntrestRate('4');
    page.submitResultsForm();

    page.expectCompareHousingCostsCardWith(
      '£500.00',
      '£633.40',
      '£133.40',
      'more',
    );
  });

  // TESTCASE-55621
  it('shows the compare housing costs card with a new mortgage costing £209.02 per month', () => {
    page.enterIncome('annualIncome', '30000');
    page.enterIncome('takeHome', '1000');
    cy.get('#continue').click();

    page.enterMonthlyCostFor('creditCard', '300');
    page.enterMonthlyCostFor('mortgage', '500');
    cy.get('#continue').click();

    page.enterResultsBorrowAmount('39600');
    page.enterResultsMortgageTerm('25');
    page.enterResultsIntrestRate('4');
    page.submitResultsForm();

    page.expectCompareHousingCostsCardWith(
      '£500.00',
      '£209.02',
      '£290.98',
      'less',
    );
  });

  // TESTCASE-55622
  it('shows the compare housing costs card with a new mortgage costing £696.74 per month', () => {
    page.enterIncome('annualIncome', '30000');
    page.enterIncome('takeHome', '1000');
    cy.get('#continue').click();

    page.enterMonthlyCostFor('creditCard', '300');
    page.enterMonthlyCostFor('mortgage', '500');
    cy.get('#continue').click();

    page.enterResultsBorrowAmount('132000');
    page.enterResultsMortgageTerm('25');
    page.enterResultsIntrestRate('4');
    page.submitResultsForm();

    page.expectCompareHousingCostsCardWith(
      '£500.00',
      '£696.74',
      '£196.74',
      'more',
    );
  });

  // TESTCASE-55627
  it('shows the compare housing costs card with a new mortgage costing the same as the current one (£500.00 per month)', () => {
    page.enterIncome('annualIncome', '30000');
    page.enterIncome('takeHome', '1000');
    cy.get('#continue').click();

    page.enterMonthlyCostFor('creditCard', '300');
    page.enterMonthlyCostFor('mortgage', '500');
    cy.get('#continue').click();

    page.enterResultsBorrowAmount('94726');
    page.enterResultsMortgageTerm('25');
    page.enterResultsIntrestRate('4');
    page.submitResultsForm();

    page.expectCompareHousingCostsCardWith(
      '£500.00',
      '£500.00',
      '£0.00',
      'same',
    );
  });

  // TESTCASE-55803
  it('shows the can you afford this card with a new mortgage costing £475.05 per month and £752.95 left over', () => {
    page.enterIncome('annualIncome', '50000');
    page.enterIncome('takeHome', '3000');
    cy.get('#continue').click();

    page.enterMonthlyCostFor('mortgage', '500');
    page.enterMonthlyCostFor('creditCard', '200');
    page.enterMonthlyCostFor('childAndSpouse', '300');
    page.enterMonthlyCostFor('childCare', '400');
    page.enterMonthlyCostFor('travelCosts', '55');
    page.enterMonthlyCostFor('bills', '400');
    page.enterMonthlyCostFor('groceries', '250');
    page.enterMonthlyCostFor('entertainment', '100');
    page.enterMonthlyCostFor('holidays', '67');
    cy.get('#continue').click();

    page.enterResultsBorrowAmount('90000');
    page.enterResultsMortgageTerm('25');
    page.enterResultsIntrestRate('4');
    page.submitResultsForm();

    page.expectCanYouAffordThisCardWith(
      '£3,000.00',
      '£475.05',
      '£1,355.00',
      '£752.95',
    );
  });

  // TESTCASE-55802
  it('shows the can you afford this card with overstretched budget costing £1465.47 per month and -£77.47 left over', () => {
    page.enterIncome('annualIncome', '40000');
    page.enterIncome('takeHome', '3100');
    cy.get('#continue').click();

    page.enterMonthlyCostFor('mortgage', '500');
    page.enterMonthlyCostFor('creditCard', '100');
    page.enterMonthlyCostFor('childAndSpouse', '200');
    page.enterMonthlyCostFor('childCare', '300');
    page.enterMonthlyCostFor('travelCosts', '200');
    page.enterMonthlyCostFor('bills', '100');
    page.enterMonthlyCostFor('groceries', '200');
    page.enterMonthlyCostFor('entertainment', '300');
    page.enterMonthlyCostFor('holidays', '312');
    cy.get('#continue').click();

    page.enterResultsBorrowAmount('132000');
    page.enterResultsMortgageTerm('10');
    page.enterResultsIntrestRate('6');
    page.submitResultsForm();

    page.expectCanYouAffordThisCardWith(
      '£3,100.00',
      '£1,465.47',
      '£900.00',
      '-£77.47',
    );
  });

  it('shows the what if interest rates rise card for values; loan amount = 122200, term = 25, interest rate = 4%', () => {
    page.enterIncome('annualIncome', '30000');
    page.enterIncome('takeHome', '2000');
    page.enterIncome('otherIncome', '10000');
    cy.get('#continue').click();

    page.enterMonthlyCostFor('creditCard', '200');
    page.enterMonthlyCostFor('childAndSpouse', '0');
    page.enterMonthlyCostFor('childCare', '75');
    page.enterMonthlyCostFor('travelCosts', '75');
    page.enterMonthlyCostFor('bills', '100');
    page.enterMonthlyCostFor('mortgage', '500');
    page.enterMonthlyCostFor('entertainment', '100');
    page.enterMonthlyCostFor('holidays', '150');
    page.enterMonthlyCostFor('groceries', '300');
    cy.get('#continue').click();

    page.enterResultsBorrowAmount('122200');
    page.enterResultsMortgageTerm('25');
    page.enterResultsIntrestRate('4');
    page.submitResultsForm();

    page.expectWhatIfInterestRatesWiseWith([
      { rate: '7%', payment: '£863.68', left: '£136.32' },
      { rate: '8%', payment: '£943.16', left: '£56.84' },
      { rate: '9%', payment: '£1,025.50', left: '-£25.50' },
    ]);
  });

  it('shows the what if interest rates rise card for values; loan amount = 97993, term = 20, interest rate = 3.25%', () => {
    page.enterIncome('annualIncome', '30000');
    page.enterIncome('takeHome', '2000');
    page.enterIncome('otherIncome', '0');
    cy.get('#continue').click();

    page.enterMonthlyCostFor('creditCard', '200');
    page.enterMonthlyCostFor('childAndSpouse', '0');
    page.enterMonthlyCostFor('childCare', '100');
    page.enterMonthlyCostFor('travelCosts', '100');
    page.enterMonthlyCostFor('bills', '100');
    page.enterMonthlyCostFor('mortgage', '500');
    page.enterMonthlyCostFor('entertainment', '100');
    page.enterMonthlyCostFor('holidays', '150');
    page.enterMonthlyCostFor('groceries', '300');
    cy.get('#continue').click();

    page.enterResultsBorrowAmount('97993');
    page.enterResultsMortgageTerm('20');
    page.enterResultsIntrestRate('3.25');
    page.submitResultsForm();

    page.expectWhatIfInterestRatesWiseWith([
      { rate: '6.25%', payment: '£716.26', left: '£233.74' },
      { rate: '7.25%', payment: '£774.51', left: '£175.49' },
      { rate: '8.25%', payment: '£834.96', left: '£115.04' },
    ]);
  });

  it('shows the what if interest rates rise card for values; loan amount = 509560, term = 30, interest rate = 5%', () => {
    page.enterIncome('annualIncome', '130000');
    page.enterIncome('takeHome', '6000');
    page.enterIncome('otherIncome', '0');
    cy.get('#continue').click();

    page.enterMonthlyCostFor('creditCard', '700');
    page.enterMonthlyCostFor('childAndSpouse', '700');
    page.enterMonthlyCostFor('childCare', '123');
    page.enterMonthlyCostFor('travelCosts', '234');
    page.enterMonthlyCostFor('bills', '300');
    page.enterMonthlyCostFor('mortgage', '1500');
    page.enterMonthlyCostFor('entertainment', '300');
    page.enterMonthlyCostFor('holidays', '300');
    page.enterMonthlyCostFor('groceries', '600');
    cy.get('#continue').click();

    page.enterResultsBorrowAmount('509560');
    page.enterResultsMortgageTerm('30');
    page.enterResultsIntrestRate('5');
    page.submitResultsForm();

    page.expectWhatIfInterestRatesWiseWith([
      { rate: '8%', payment: '£3,738.97', left: '-£995.97' },
      { rate: '9%', payment: '£4,100.04', left: '-£1,357.04' },
      { rate: '10%', payment: '£4,471.75', left: '-£1,728.75' },
    ]);
  });

  it('shows the what if interest rates rise card for values; loan amount = 169800, term = 15, interest rate = 1%', () => {
    page.enterIncome('annualIncome', '130000');
    page.enterIncome('takeHome', '6000');
    page.enterIncome('otherIncome', '0');
    cy.get('#continue').click();

    page.enterMonthlyCostFor('creditCard', '700');
    page.enterMonthlyCostFor('childAndSpouse', '700');
    page.enterMonthlyCostFor('childCare', '123');
    page.enterMonthlyCostFor('travelCosts', '234');
    page.enterMonthlyCostFor('bills', '300');
    page.enterMonthlyCostFor('mortgage', '1500');
    page.enterMonthlyCostFor('entertainment', '300');
    page.enterMonthlyCostFor('holidays', '300');
    page.enterMonthlyCostFor('groceries', '600');
    cy.get('#continue').click();

    page.enterResultsBorrowAmount('169800');
    page.enterResultsMortgageTerm('15');
    page.enterResultsIntrestRate('1');
    page.submitResultsForm();

    page.expectWhatIfInterestRatesWiseWith([
      { rate: '4%', payment: '£1,255.99', left: '£1,487.01' },
      { rate: '5%', payment: '£1,342.77', left: '£1,400.23' },
      { rate: '6%', payment: '£1,432.87', left: '£1,310.13' },
    ]);
  });

  it('shows the overstretched page for scenario 5', () => {
    page.enterIncome('annualIncome', '25000');
    page.enterIncome('takeHome', '1750');
    page.enterIncome('otherIncome', '450');
    cy.get('#continue').click();

    page.enterMonthlyCostFor('creditCard', '700');
    page.enterMonthlyCostFor('childAndSpouse', '700');
    page.enterMonthlyCostFor('childCare', '123');
    page.enterMonthlyCostFor('travelCosts', '234');
    page.enterMonthlyCostFor('bills', '300');
    page.enterMonthlyCostFor('mortgage', '1500');
    page.enterMonthlyCostFor('entertainment', '300');
    page.enterMonthlyCostFor('holidays', '300');
    page.enterMonthlyCostFor('groceries', '600');
    cy.get('#continue').click();

    page.checkOverstretchedLabels();
  });

  it('shows the what if interest rates rise card for values; loan amount = 70696, term = 25, interest rate = 4%', () => {
    page.enterIncome('annualIncome', '25000');
    page.enterIncome('takeHome', '1750');
    page.enterIncome('otherIncome', '450');
    cy.get('#continue').click();

    page.enterMonthlyCostFor('creditCard', '0');
    page.enterMonthlyCostFor('childAndSpouse', '0');
    page.enterMonthlyCostFor('childCare', '0');
    page.enterMonthlyCostFor('travelCosts', '120');
    page.enterMonthlyCostFor('bills', '200');
    page.enterMonthlyCostFor('mortgage', '0');
    page.enterMonthlyCostFor('entertainment', '100');
    page.enterMonthlyCostFor('holidays', '0');
    page.enterMonthlyCostFor('groceries', '500');
    cy.get('#continue').click();

    page.enterResultsBorrowAmount('70696');
    page.enterResultsMortgageTerm('25');
    page.enterResultsIntrestRate('4');
    page.submitResultsForm();

    page.expectWhatIfInterestRatesWiseWith([
      { rate: '7%', payment: '£499.66', left: '£330.34' },
      { rate: '8%', payment: '£545.64', left: '£284.36' },
      { rate: '9%', payment: '£593.28', left: '£236.72' },
    ]);
  });

  it('shows the results summary callout with positive result for income of £50000, with outgoings of 75%', () => {
    page.enterIncome('annualIncome', '50000');
    page.enterIncome('takeHome', '3000');
    cy.get('#continue').click();

    page.enterMonthlyCostFor('mortgage', '500');
    page.enterMonthlyCostFor('creditCard', '200');
    page.enterMonthlyCostFor('childAndSpouse', '300');
    page.enterMonthlyCostFor('childCare', '400');
    page.enterMonthlyCostFor('travelCosts', '55');
    page.enterMonthlyCostFor('bills', '400');
    page.enterMonthlyCostFor('groceries', '250');
    page.enterMonthlyCostFor('entertainment', '100');
    page.enterMonthlyCostFor('holidays', '67');
    cy.get('#continue').click();

    page.enterResultsBorrowAmount('90000');
    page.enterResultsMortgageTerm('25');
    page.enterResultsIntrestRate('4');
    page.submitResultsForm();

    page.expectResultCalloutWith('positive', '75', '£752.95', '£591.90');
  });

  it('shows the results summary callout with positive result for income of £50000, with outgoings of 79%', () => {
    page.enterIncome('annualIncome', '50000');
    page.enterIncome('takeHome', '3000');
    cy.get('#continue').click();

    page.enterMonthlyCostFor('mortgage', '500');
    page.enterMonthlyCostFor('creditCard', '100');
    page.enterMonthlyCostFor('childAndSpouse', '200');
    page.enterMonthlyCostFor('childCare', '50');
    page.enterMonthlyCostFor('travelCosts', '0');
    page.enterMonthlyCostFor('bills', '0');
    page.enterMonthlyCostFor('groceries', '0');
    page.enterMonthlyCostFor('entertainment', '150');
    page.enterMonthlyCostFor('holidays', '220');
    cy.get('#continue').click();

    page.enterResultsBorrowAmount('190000');
    page.enterResultsMortgageTerm('12');
    page.enterResultsIntrestRate('4');
    page.submitResultsForm();

    page.expectResultCalloutWith('positive', '79', '£616.50', '£326.08');
  });

  it('shows the results summary callout with positive result for income of £30000, with outgoings of 88%', () => {
    page.enterIncome('annualIncome', '30000');
    page.enterIncome('takeHome', '2000');
    cy.get('#continue').click();

    page.enterMonthlyCostFor('mortgage', '500');
    page.enterMonthlyCostFor('creditCard', '450');
    page.enterMonthlyCostFor('childAndSpouse', '230');
    page.enterMonthlyCostFor('childCare', '0');
    page.enterMonthlyCostFor('travelCosts', '0');
    page.enterMonthlyCostFor('bills', '0');
    page.enterMonthlyCostFor('groceries', '44');
    page.enterMonthlyCostFor('entertainment', '111');
    page.enterMonthlyCostFor('holidays', '0');
    cy.get('#continue').click();

    page.enterResultsBorrowAmount('105000');
    page.enterResultsMortgageTerm('13');
    page.enterResultsIntrestRate('5');
    page.submitResultsForm();

    page.expectResultCalloutWith('warning', '88', '£248.29', '£80.27');
  });

  it('shows the results summary callout with warning result for income of £30000, with outgoings of 80%', () => {
    page.enterIncome('annualIncome', '30000');
    page.enterIncome('takeHome', '2000');
    cy.get('#continue').click();

    page.enterMonthlyCostFor('mortgage', '500');
    page.enterMonthlyCostFor('creditCard', '76');
    page.enterMonthlyCostFor('childAndSpouse', '54');
    page.enterMonthlyCostFor('childCare', '43');
    page.enterMonthlyCostFor('travelCosts', '32');
    page.enterMonthlyCostFor('bills', '56');
    page.enterMonthlyCostFor('groceries', '45');
    page.enterMonthlyCostFor('entertainment', '56');
    page.enterMonthlyCostFor('holidays', '67');
    cy.get('#continue').click();

    page.enterResultsBorrowAmount('118800');
    page.enterResultsMortgageTerm('11');
    page.enterResultsIntrestRate('5');
    page.submitResultsForm();

    page.expectResultCalloutWith('warning', '80', '£399.10', '£214.84');
  });

  it('shows the results summary callout with warning result for income of £40000, with outgoings of 99%', () => {
    page.enterIncome('annualIncome', '40000');
    page.enterIncome('takeHome', '3100');
    cy.get('#continue').click();

    page.enterMonthlyCostFor('mortgage', '500');
    page.enterMonthlyCostFor('creditCard', '100');
    page.enterMonthlyCostFor('childAndSpouse', '200');
    page.enterMonthlyCostFor('childCare', '300');
    page.enterMonthlyCostFor('travelCosts', '200');
    page.enterMonthlyCostFor('bills', '100');
    page.enterMonthlyCostFor('groceries', '200');
    page.enterMonthlyCostFor('entertainment', '300');
    page.enterMonthlyCostFor('holidays', '212');
    cy.get('#continue').click();

    page.enterResultsBorrowAmount('132000');
    page.enterResultsMortgageTerm('10');
    page.enterResultsIntrestRate('6');
    page.submitResultsForm();

    page.expectResultCalloutWith('warning', '99', '£22.53', '-£184.12');
  });

  it('shows the overstretched page for scenario 6', () => {
    page.enterIncome('annualIncome', '40000');
    page.enterIncome('takeHome', '3100');
    cy.get('#continue').click();

    page.enterMonthlyCostFor('mortgage', '500');
    page.enterMonthlyCostFor('creditCard', '500');
    page.enterMonthlyCostFor('childAndSpouse', '500');
    page.enterMonthlyCostFor('childCare', '500');
    page.enterMonthlyCostFor('travelCosts', '300');
    page.enterMonthlyCostFor('bills', '300');
    page.enterMonthlyCostFor('groceries', '300');
    page.enterMonthlyCostFor('entertainment', '300');
    page.enterMonthlyCostFor('holidays', '100');
    cy.get('#continue').click();

    page.checkOverstretchedLabels();
  });
});
