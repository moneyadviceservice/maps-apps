import incomeData from '../fixtures/adjustableIncome.json';
import { IncomeEstimator } from '../pages/adjustableIncome';

type TestData = {
  label: string;
  pot: string;
  age: string;
  takeHome: string;
  tax: string;
  ageUntil: string;
};

describe('Adjustable Income', () => {
  beforeEach(() => {
    //cy.mockGoogleAnalytics();
    cy.skipExceptions();
    cy.setBreakPoint('desktop');
    cy.setCookieControl();
    cy.visit('/en/adjustable-income-calculator');
  });

  const page = new IncomeEstimator();

  incomeData.tests.forEach(
    ({ label, pot, age, takeHome, tax, ageUntil }: TestData) => {
      it(`Calculation for ${label}`, () => {
        page.elements.heading().should('have.text', incomeData.core.heading);
        page.elements.potLabel().should('have.text', incomeData.core.potLabel);
        page.enterPotIncome(pot);
        page.elements.ageLabel().should('have.text', incomeData.core.ageLabel);
        page.enterAgeValue(age);
        page.elements.calculate().click();
        page.elements
          .callOut()
          .should('have.text', incomeData.core.callOutText);
        page.elements
          .resultsTitle()
          .should('have.text', incomeData.core.resultsTitle);
        page.validateResults(pot, takeHome, tax, ageUntil);
      });
    },
  );

  it('Checking error messages', () => {
    page.elements.calculate().click();

    cy.url().should('include', '?pot=&age=#results');
    page.validateErrorMessages();
    page.enterPotIncome('99999999');
    page.elements.calculate().click();

    cy.url().should(
      'include',
      `?pot=${encodeURIComponent('99,999,999')}&age=#results`,
    );
    page.validateErrorMessage('pot', 'pot');

    page.elements.potIncome().clear();
    page.enterAgeValue('56');
    page.elements.calculate().click();

    cy.url().should('include', `?pot=&age=${encodeURIComponent('56')}#results`);
    page.validateErrorMessages();

    page.enterPotIncome('45000');
    page.enterAgeValue('54');
    page.elements.calculate().click();
    page.validateErrorMessage('age', 'age');

    page.elements.potIncome().clear();
    page.enterPotIncome('0');
    page.enterAgeValue('56');
    page.elements.calculate().click();
    page.validateErrorMessageForZeroValue();
  });

  it('Recalculate', () => {
    page.enterPotIncome('90000');
    page.enterAgeValue('59');
    page.elements.calculate().click();

    page.validateResults('90,000', '£22,500 tax free', '308', '85');

    page.enterPotIncome('80,000');
    page.elements.calculate().click();
    page.validateResults('80,000', '£20,000 tax free', '275', '85');

    page.updateMonthlyIncome('500');
    page.validateResults('80,000', '£20,000 tax free', '500', '71');
  });
});

describe('Embed Adjustable Income calculator', () => {
  beforeEach(() => {
    cy.skipExceptions();
    cy.setBreakPoint('desktop');
    cy.setCookieControl();
    cy.visit('/en/adjustable-income-calculator?isEmbedded=true');
  });

  const page = new IncomeEstimator();

  it('should have isEmbedded query param and no header and footer', () => {
    const data = incomeData.tests[0];
    page.enterPotIncome(data.pot);
    page.enterAgeValue(data.age);

    page.elements.calculate().click();
    cy.url().should('include', '?isEmbedded=true');
    page.elements.footer().should('not.exist');
    page.elements.header().should('not.exist');
  });
});
