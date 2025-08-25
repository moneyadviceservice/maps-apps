import potData from '../fixtures/potEstimator.json';
import { PotEstimator } from '../pages/potEstimator';

type TestData = {
  label: string;
  income: string;
  pot: string;
  takeHome: string;
  tax: string;
};

describe('Take Whole Pot Estimator Form', () => {
  beforeEach(() => {
    //cy.mockGoogleAnalytics();
    cy.skipExceptions();
    cy.setBreakPoint('desktop');
    cy.setCookieControl();
    cy.visit('/en/take-whole-pot');
  });

  const page = new PotEstimator();

  potData.tests.forEach(({ label, income, pot, takeHome, tax }: TestData) => {
    it(`Calculation for ${label}`, () => {
      page.elements.heading().should('have.text', potData.core.heading);
      page.elements.incomeLabel().should('have.text', potData.core.incomeLabel);
      page.elements.incomeText().should('have.text', potData.core.incomeText);
      page.enterYearlyIncome(income);
      page.elements.potLabel().should('have.text', potData.core.potText);
      page.enterPotValue(pot);
      page.elements.calculate().click();

      page.elements.callOut().should('have.text', potData.core.callOutText);
      page.elements
        .resultsTitle()
        .should('have.text', potData.core.resultsTitle);
      page.validateResults(pot, takeHome, tax);
    });
  });

  it('Checking error messages', () => {
    page.elements.calculate().click();

    cy.url().should('include', '?income=&pot=#results');
    page.validateErrorMessages();
    page.enterYearlyIncome('45000');
    page.elements.calculate().click();

    cy.url().should(
      'include',
      `?income=${encodeURIComponent('45,000')}&pot=#results`,
    );
    page.validateErrorMessage('pot');

    page.elements.yearlyIncome().clear();
    page.enterPotValue('70000');
    page.elements.calculate().click();

    cy.url().should(
      'include',
      `?income=&pot=${encodeURIComponent('70,000')}#results`,
    );
    page.validateErrorMessage('income');
  });

  it('Recalculate', () => {
    page.enterYearlyIncome('25000');
    page.enterPotValue('100000');
    page.elements.calculate().click();

    page.validateResults('100,000', '£75,054', '24,946');

    page.enterYearlyIncome('45000');
    page.elements.calculate().click();
    page.validateResults('100,000', '£70,000', '30,000');
  });
});
