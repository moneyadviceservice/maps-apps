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

    page.elements
      .subHeading()
      .should('have.text', incomeData.core.annualIncome.subHeading);

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
      .householdSubHeading()
      .should('have.text', incomeData.core.householdCosts.householdSubHeading);

    page.enterMonthlyCostFor('creditCard', '600');
    page.enterMonthlyCostFor('childAndSpouse', '500');

    page.elements
      .fixedCostsSubHeading()
      .should('have.text', incomeData.core.householdCosts.subHeading2);

    page.enterMonthlyCostFor('childCare', '500');
    page.enterMonthlyCostFor('travelCosts', '200');
    page.enterMonthlyCostFor('bills', '500');
    page.enterMonthlyCostFor('mortgage', '1500');

    page.elements
      .livingCostsSubHeading()
      .should('have.text', incomeData.core.householdCosts.subHeading3);
    page.elements
      .livingCostsInfo()
      .should(
        'have.text',
        incomeData.core.householdCosts.monthlyLivingCostsInfo,
      );

    page.enterMonthlyCostFor('entertainment', '100');
    page.enterMonthlyCostFor('holidays', '300');
    page.enterMonthlyCostFor('groceries', '500');

    cy.get('#continue').click();

    page.checkOverstretchedLabels();
    page.clickNextSteps();

    page.validateNextSteps('negative');
  });

  it('checking risky budget', () => {
    page.enterIncome('annualIncome', '35000');
    page.enterIncome('takeHome', '2700');
    page.enterIncome('otherIncome', '3440');

    cy.get('#continue').click();

    page.enterMonthlyCostFor('creditCard', '300');
    page.enterMonthlyCostFor('travelCosts', '200');
    page.enterMonthlyCostFor('bills', '250');
    page.enterMonthlyCostFor('mortgage', '1200');
    page.enterMonthlyCostFor('entertainment', '50');
    page.enterMonthlyCostFor('holidays', '100');
    page.enterMonthlyCostFor('groceries', '500');

    cy.get('#continue').click();

    page.checkResults(
      '£97,552',
      '£146,328',
      {
        default: '121,940',
        updatedValue: '100,000',
        prevResult: '£785.66',
        updatedResult: '£644.30',
      },
      {
        default: '25',
        updatedValue: '30',
        prevResult: '£644.30',
        updatedResult: '£599.55',
      },
      {
        default: '6',
        updatedValue: '4.43',
        prevResult: '£599.55',
        updatedResult: '£502.53',
      },
      'warning',
      '£1,200',
    );

    page.checkAffordability(
      'warning',
      '£750.00',
      '£2,700.00',
      'between 40% - 60%',
      '46%',
      '£1,252.53',
      '54%',
      '£1,447.47',
      '650',
      '300',
      '£1,147.47',
      '£694.43',
      '£955.57',
    );

    cy.get('#continue').click();
    page.validateNextSteps('warning');
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
      '£211,232',
      '£316,848',
      {
        default: '264,040',
        updatedValue: '250,000',
        prevResult: '£1,701.21',
        updatedResult: '£1,610.75',
        prevResultType: 'negative',
        updatedResultType: 'warning',
      },
      {
        default: '25',
        updatedValue: '20',
        prevResult: '£1,610.75',
        prevResultType: 'warning',
        updatedResult: '£1,791.08',
        updatedResultType: 'negative',
      },
      {
        default: '6',
        updatedValue: '4.25',
        prevResult: '£1,791.08',
        prevResultType: 'negative',
        updatedResult: '£1,548.09',
        updatedResultType: 'warning',
      },
      'warning',
      '£800',
    );

    page.checkAffordability(
      'warning',
      '£450.00',
      '£3,500.00',
      'between 40% - 60%',
      '57%',
      '£1,998.09',
      '43%',
      '£1,501.91',
      '550',
      '300',
      '£1,201.91',
      '£1,975.94',
      '£774.06',
    );

    page.checkResults(
      '£211,232',
      '£316,848',
      {
        default: '250,000',
        updatedValue: '150,000',
        prevResult: '£1,548.09',
        updatedResult: '£928.85',
        prevResultType: 'warning',
        updatedResultType: 'positive',
      },
      undefined,
      undefined,
      'warning',
      '£800',
    );

    page.checkAffordability(
      'positive',
      '£450.00',
      '£3,500.00',
      'less than 40%',
      '39%',
      '£1,378.85',
      '61%',
      '£2,121.15',
      '300',
      '300',
      '£1,821.15',
      '£1,185.56',
      '£1,564.44',
    );

    cy.get('#continue').click();

    page.checkForBorrowError('Enter a number between £211,232 and £316,848');

    page.updateBorrowingAmount('220000');
    page.updateMortgageTerm('25');
    page.updateInterestRate('2');

    page.validateResultCallout('positive', '£932.48', '£800');

    cy.get('#continue').click();
    page.validateNextSteps('positive');
  });
});
