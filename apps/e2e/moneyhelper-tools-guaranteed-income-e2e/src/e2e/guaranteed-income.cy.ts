import { IncomeEstimator } from '../pages/guaranteedIncome';
import incomeData from '../fixtures/guaranteedIncome.json';

type TestData = {
  label: string;
  pot: string;
  age: string;
  takeHome: string;
  tax: string;
};

describe('Guaranteed Income', () => {
  beforeEach(() => {
    //cy.mockGoogleAnalytics();
    cy.skipExceptions();
    cy.setBreakPoint('desktop');
    cy.setCookieControl();
    cy.visit('/en/guaranteed-income-estimator');
  });

  const page = new IncomeEstimator();

  incomeData.tests.forEach(({ label, pot, age, takeHome, tax }: TestData) => {
    it(`Calculation for ${label}`, () => {
      page.elements.heading().should('have.text', incomeData.core.heading);
      page.elements.potLabel().should('have.text', incomeData.core.potLabel);
      page.enterPotIncome(pot);
      page.elements.ageLabel().should('have.text', incomeData.core.ageLabel);
      page.enterAgeValue(age);
      page.elements.calculate().click();
      page.elements.callOut().should('have.text', incomeData.core.callOutText);
      page.elements
        .resultsTitle()
        .should('have.text', incomeData.core.resultsTitle);
      page.validateResults(pot, takeHome, tax);
    });
  });

  it('Checking error messages', () => {
    page.elements.calculate().click();

    cy.url().should('include', '?pot=&age=#results');
    page.validateErrorMessages();
    page.enterPotIncome('45000');
    page.elements.calculate().click();

    cy.url().should(
      'include',
      `?pot=${encodeURIComponent('45,000')}&age=#results`,
    );
    page.validateErrorMessage('age', 'age');

    page.elements.potIncome().clear();
    page.enterAgeValue('56');
    page.elements.calculate().click();

    //cy.url().should('include', `?pot=&age=${encodeURIComponent('56')}#results`);
    page.validateErrorMessage('pot', 'pot');

    page.enterPotIncome('45000');
    page.enterAgeValue('54');
    page.elements.calculate().click();
    page.validateErrorMessage('age', 'age2');
  });

  it('Recalculate', () => {
    page.enterPotIncome('90000');
    page.enterAgeValue('59');
    page.elements.calculate().click();

    page.validateResults('90,000', '£22,500 tax free', '4,100');

    page.enterPotIncome('80,000');
    page.elements.calculate().click();
    page.validateResults('80,000', '£20,000 tax free', '3,600');
  });
});
