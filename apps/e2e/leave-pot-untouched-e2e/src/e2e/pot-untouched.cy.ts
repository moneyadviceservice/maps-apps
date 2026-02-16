import potData from '../fixtures/potUntouched.json';
import { PotUntouched } from '../pages/potUntouched';

type TestData = {
  label: string;
  monthlyContribution: string;
  pot: string;
  yearly: string[];
};

describe('Pot Untouched Estimator Form', () => {
  beforeEach(() => {
    //cy.mockGoogleAnalytics();
    cy.skipExceptions();
    cy.setBreakPoint('desktop');
    cy.setCookieControl();
    cy.visit('/en/leave-pot-untouched');
  });

  const page = new PotUntouched();

  potData.tests.forEach(
    ({ label, pot, monthlyContribution, yearly }: TestData) => {
      it(`Calculation for ${label}`, () => {
        page.elements.heading().should('have.text', potData.core.heading);
        page.elements.potText().should('have.text', potData.core.potText);
        page.enterPotValue(pot);
        page.elements.monthText().should('have.text', potData.core.monthText);
        page.enterMonthlyContribution(monthlyContribution);
        page.elements.calculate().click();

        page.elements.callOut().should('have.text', potData.core.callOutText);
        page.elements
          .resultsTitle()
          .should('have.text', potData.core.resultsTitle);
        page.validateResults(yearly, monthlyContribution);
      });
    },
  );

  it('Checking error messages', () => {
    page.elements.calculate().click();

    cy.url().should('include', '?pot=&month=0#results');
    page.validateErrorMessage('pot');
    page.enterMonthlyContribution('4000');
    page.elements.calculate().click();

    cy.url().should(
      'include',
      `?pot=&month=${encodeURIComponent('4,000')}#results`,
    );
    page.validateErrorMessage('pot');

    page.elements.month().clear();
    page.enterPotValue('70000');
    page.elements.calculate().click();

    cy.url().should(
      'include',
      `?pot=${encodeURIComponent('70,000')}&month=0#results`,
    );
    page.validateResults(
      ['£72,100', '£74,263', '£76,491', '£78,786', '£81,149'],
      '0',
    );

    page.elements.pot().clear();
    page.enterPotValue('0');
    page.elements.calculate().click();
    page.validateErrorMessageForZeroValue();
  });

  it('Recalculate', () => {
    page.enterPotValue('100000');
    page.enterMonthlyContribution('100000');
    page.elements.calculate().click();

    page.validateResults(
      ['£1,303,000', '£2,542,090', '£3,818,353', '£5,132,903', '£6,486,890'],
      '100,000',
    );

    page.updateMonthlyContribution('8000');

    // this is a flaky test which is why we are adding a wait to test if it reduces the flakiness
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000);

    page.validateResults(
      ['£199,000', '£300,970', '£405,999', '£514,179', '£625,604'],
      '8,000',
    );
  });
});

describe('Embed Leave Pot Untouched calculator', () => {
  beforeEach(() => {
    cy.skipExceptions();
    cy.setBreakPoint('desktop');
    cy.setCookieControl();
    cy.visit('/en/leave-pot-untouched?isEmbedded=true');
  });

  const page = new PotUntouched();

  it('should have isEmbedded query param and no header and footer', () => {
    const data = potData.tests[0];
    page.enterMonthlyContribution(data.monthlyContribution);
    page.enterPotValue(data.pot);

    page.elements.calculate().click();
    cy.url().should('include', '?isEmbedded=true');
    page.elements.footer().should('not.exist');
    page.elements.header().should('not.exist');
  });
});
