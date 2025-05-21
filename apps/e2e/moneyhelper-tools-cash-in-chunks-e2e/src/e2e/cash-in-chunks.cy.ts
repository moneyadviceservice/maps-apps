import { cashChunks } from '../pages/cashInChunks';
import cash from '../fixtures/cashInChunks.json';

type TestData = {
  label: string;
  cashInChunk: string;
  pot: string;
  income: string;
  results: string[];
};

describe('Cash in chunks calculator', () => {
  beforeEach(() => {
    cy.skipExceptions();
    cy.setBreakPoint('desktop');
    cy.setCookieControl();
    cy.visit('/en/cic-calculator/');
  });

  const page = new cashChunks();

  cash.tests.forEach(
    ({ label, income, pot, cashInChunk, results }: TestData) => {
      it(`Calculation for ${label}`, () => {
        page.elements.heading().should('have.text', cash.core.heading);
        page.elements.incomeText().should('have.text', cash.core.incomeText);
        page.elements.incomeLabel().should('have.text', cash.core.incomeLabel);
        page.enterIncomeValue(income);
        page.elements.potText().should('have.text', cash.core.potText);
        page.enterPotValue(pot);
        page.elements
          .cashChunkText()
          .should('have.text', cash.core.cashChunkText);
        page.enterCashInChunks(cashInChunk);
        page.elements.calculate().click();

        page.elements.callOut().should('have.text', cash.core.callOutText);
        page.elements
          .resultsTitle()
          .should('have.text', cash.core.resultsTitle);
        page.validateResults(results, cashInChunk, pot);
      });
    },
  );

  it('Checking error messages', () => {
    page.elements.calculate().click();

    cy.url().should('include', 'income=&pot=&chunk=#results');
    page.validateErrorMessages();
    page.enterIncomeValue('45000');
    page.elements.calculate().click();

    cy.url().should(
      'include',
      `?income=${encodeURIComponent('45,000')}&pot=&chunk=#results`,
    );
    page.validateErrorMessage(['pot', 'chunk'], ['pot', 'cashChunk']);

    page.elements.income().clear();
    page.enterPotValue('56');
    page.elements.calculate().click();

    cy.url().should(
      'include',
      `?income=&pot=${encodeURIComponent('56')}&chunk=#results`,
    );
    page.validateErrorMessage(['income', 'chunk'], ['income', 'cashChunk']);

    page.elements.pot().clear();
    page.enterCashInChunks('34343');
    page.elements.calculate().click();

    cy.url().should(
      'include',
      `?income=&pot=&chunk=${encodeURIComponent('34,343')}#results`,
    );

    page.validateErrorMessage(['income', 'pot'], ['income', 'pot']);

    page.enterIncomeValue('90000');
    page.enterPotValue('0');
    page.enterCashInChunks('34344');
    page.elements.calculate().click();
    page.validateErrorMessage(['pot'], ['potZero']);
    cy.url().should(
      'include',
      `?income=${encodeURIComponent('90,000')}&pot=0&chunk=${encodeURIComponent(
        '34,344',
      )}#results`,
    );

    page.enterPotValue('10000');
    page.elements.calculate().click();
    page.validateErrorMessage(['chunk'], ['chunkLessThanPot']);
    cy.url().should(
      'include',
      `?income=${encodeURIComponent('90,000')}&pot=${encodeURIComponent(
        '10,000',
      )}&chunk=${encodeURIComponent('34,344')}#results`,
    );
  });

  it('Recalculate', () => {
    page.enterIncomeValue('50000');
    page.enterPotValue('100000');
    page.enterCashInChunks('10000');
    page.elements.calculate().click();

    page.validateResults(
      ['£7,054', '£2,946 in tax', '£90,000 in your pot'],
      '10,000',
      '100,000',
    );

    page.updateChunk('80000');

    // this is a flaky test which is why we are adding a wait to test if it reduces the flakiness
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);

    page.validateResults(
      ['£56,000', '£24,000 in tax', '£20,000 in your pot'],
      '80,000',
      '100,000',
    );

    page.enterPotValue('25000');
    page.enterCashInChunks('20000');
    page.elements.calculate().click();

    page.validateResults(
      ['£14,054', '£5,946 in tax', '£5,000 in your pot'],
      '20,000',
      '25,000',
    );
  });
});
