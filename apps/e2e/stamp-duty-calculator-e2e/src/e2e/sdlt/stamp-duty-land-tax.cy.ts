import taxValueSDLT from '../../fixtures/sdltTaxValues';

import '@maps-react/utils/e2e/support/commands';

const localeSDLT = ['en', 'cy'];

const fillInStampDutyCalculator = (buyerType: number, price: string) => {
  cy.get('#buyerType').select(buyerType);
  cy.get('#price').type(price);
  cy.get('button.tool-nav-submit').click();
};

for (const locale of localeSDLT) {
  describe(`Stamp Duty Calculator - ${locale.toUpperCase()}`, () => {
    beforeEach(() => {
      cy.skipExceptions();
      cy.setCookieControl();
      cy.setBreakPoint('desktop');
      cy.visit(`/${locale}/sdlt`);
    });

    it.skip('Verifies SDLT for first-time home buyer for Property Price-£39,000', () => {
      fillInStampDutyCalculator(1, '39000');

      cy.elementContainsText(
        'p.t-result-tax',
        taxValueSDLT[locale].firstTimeBuyer39000.tax,
      );
      cy.elementContainsText(
        'p.t-result-rate',
        taxValueSDLT[locale].firstTimeBuyer39000.rate,
      );
    });

    it.skip('Verifies SDLT for first time home buyer for the Property Price-£125000', () => {
      fillInStampDutyCalculator(1, '125000');
      cy.elementContainsText(
        'p.t-result-tax',
        taxValueSDLT[locale].firstTimeBuyer125000.tax,
      );
      cy.elementContainsText(
        'p.t-result-rate',
        taxValueSDLT[locale].firstTimeBuyer125000.rate,
      );
    });
    it.skip('Verifies SDLT for first time home buyer for the Property Price-£300019', () => {
      fillInStampDutyCalculator(1, '300019');
      cy.elementContainsText(
        'p.t-result-tax',
        taxValueSDLT[locale].firstTimeBuyer300019.tax,
      );
      cy.elementContainsText(
        'p.t-result-rate',
        taxValueSDLT[locale].firstTimeBuyer300019.rate,
      );
    });
    it.skip('Verifies SDLT for first time home buyer for the Property Price-£310000', () => {
      fillInStampDutyCalculator(1, '310000');
      cy.elementContainsText(
        'p.t-result-tax',
        taxValueSDLT[locale].firstTimeBuyer310000.tax,
      );
      cy.elementContainsText(
        'p.t-result-rate',
        taxValueSDLT[locale].firstTimeBuyer310000.rate,
      );
    });
    it.skip('Verifies SDLT for first time home buyer for the Property Price-£400012', () => {
      fillInStampDutyCalculator(1, '400012');
      cy.elementContainsText(
        'p.t-result-tax',
        taxValueSDLT[locale].firstTimeBuyer400012.tax,
      );
      cy.elementContainsText(
        'p.t-result-rate',
        taxValueSDLT[locale].firstTimeBuyer400012.rate,
      );
    });
    it.skip('Verifies SDLT for first time home buyer for the Property Price-£510000', () => {
      fillInStampDutyCalculator(1, '510000');
      cy.elementContainsText(
        'p.t-result-tax',
        taxValueSDLT[locale].firstTimeBuyer510000.tax,
      );
      cy.elementContainsText(
        'p.t-result-rate',
        taxValueSDLT[locale].firstTimeBuyer510000.rate,
      );
    });
    it.skip('Verifies SDLT for first time home buyer for the Property Price-£988882', () => {
      fillInStampDutyCalculator(1, '988882');
      cy.elementContainsText(
        'p.t-result-tax',
        taxValueSDLT[locale].firstTimeBuyer988882.tax,
      );
      cy.elementContainsText(
        'p.t-result-rate',
        taxValueSDLT[locale].firstTimeBuyer988882.rate,
      );
    });
    it.skip('Verifies SDLT for first time home buyer for the Property Price-£2100000', () => {
      fillInStampDutyCalculator(1, '2100000');
      cy.elementContainsText(
        'p.t-result-tax',
        taxValueSDLT[locale].firstTimeBuyer2100000.tax,
      );
      cy.elementContainsText(
        'p.t-result-rate',
        taxValueSDLT[locale].firstTimeBuyer2100000.rate,
      );
    });
    it.skip('Verifies SDLT for next home buyer for the Property Price-£39000', () => {
      fillInStampDutyCalculator(2, '39000');
      cy.elementContainsText(
        'p.t-result-tax',
        taxValueSDLT[locale].nextHomeBuyer39000.tax,
      );
      cy.elementContainsText(
        'p.t-result-rate',
        taxValueSDLT[locale].nextHomeBuyer39000.rate,
      );
    });
    it.skip('Verifies SDLT for next home buyer for the Property Price-£125000', () => {
      fillInStampDutyCalculator(2, '125000');
      cy.elementContainsText(
        'p.t-result-tax',
        taxValueSDLT[locale].nextHomeBuyer125000.tax,
      );
      cy.elementContainsText(
        'p.t-result-rate',
        taxValueSDLT[locale].nextHomeBuyer125000.rate,
      );
    });
    it.skip('Verifies SDLT for next home buyer for the Property Price-£185000', () => {
      fillInStampDutyCalculator(2, '185000');
      cy.elementContainsText(
        'p.t-result-tax',
        taxValueSDLT[locale].nextHomeBuyer185000.tax,
      );
      cy.elementContainsText(
        'p.t-result-rate',
        taxValueSDLT[locale].nextHomeBuyer185000.rate,
      );
    });
    it.skip('Verifies SDLT for next home buyer for the Property Price-£300019', () => {
      fillInStampDutyCalculator(2, '300019');
      cy.elementContainsText(
        'p.t-result-tax',
        taxValueSDLT[locale].nextHomeBuyer300019.tax,
      );
      cy.elementContainsText(
        'p.t-result-rate',
        taxValueSDLT[locale].nextHomeBuyer300019.rate,
      );
    });
    it.skip('Verifies SDLT for next home buyer for the Property Price-£400012', () => {
      fillInStampDutyCalculator(2, '400012');
      cy.elementContainsText(
        'p.t-result-tax',
        taxValueSDLT[locale].nextHomeBuyer400012.tax,
      );
      cy.elementContainsText(
        'p.t-result-rate',
        taxValueSDLT[locale].nextHomeBuyer400012.rate,
      );
    });
    it.skip('Verifies SDLT for next home buyer for the Property Price-£510000', () => {
      fillInStampDutyCalculator(2, '510000');
      cy.elementContainsText(
        'p.t-result-tax',
        taxValueSDLT[locale].nextHomeBuyer510000.tax,
      );
      cy.elementContainsText(
        'p.t-result-rate',
        taxValueSDLT[locale].nextHomeBuyer510000.rate,
      );
    });
    it.skip('Verifies SDLT for next home buyer for the Property Price-£988882', () => {
      fillInStampDutyCalculator(2, '988882');
      cy.elementContainsText(
        'p.t-result-tax',
        taxValueSDLT[locale].nextHomeBuyer988882.tax,
      );
      cy.elementContainsText(
        'p.t-result-rate',
        taxValueSDLT[locale].nextHomeBuyer988882.rate,
      );
    });
    it.skip('Verifies SDLT for next home buyer for the Property Price-£2100000', () => {
      fillInStampDutyCalculator(2, '2100000');
      cy.elementContainsText(
        'p.t-result-tax',
        taxValueSDLT[locale].nextHomeBuyer2100000.tax,
      );
      cy.elementContainsText(
        'p.t-result-rate',
        taxValueSDLT[locale].nextHomeBuyer2100000.rate,
      );
    });
    it.skip('Verifies SDLT for additional property or second home buyer for the Property Price-£39000', () => {
      fillInStampDutyCalculator(3, '39000');
      cy.elementContainsText(
        'p.t-result-tax',
        taxValueSDLT[locale].secondHomeBuyer39000.tax,
      );
      cy.elementContainsText(
        'p.t-result-rate',
        taxValueSDLT[locale].secondHomeBuyer39000.rate,
      );
    });
    it.skip('Verifies SDLT for additional property or second home buyer for the Property Price-£40000', () => {
      fillInStampDutyCalculator(3, '40000');
      cy.elementContainsText(
        'p.t-result-tax',
        taxValueSDLT[locale].secondHomeBuyer40000.tax,
      );
      cy.elementContainsText(
        'p.t-result-rate',
        taxValueSDLT[locale].secondHomeBuyer40000.rate,
      );
    });
    it.skip('Verifies SDLT for additional property or second home buyer for the Property Price-£125000', () => {
      fillInStampDutyCalculator(3, '125000');
      cy.elementContainsText(
        'p.t-result-tax',
        taxValueSDLT[locale].secondHomeBuyer125000.tax,
      );
      cy.elementContainsText(
        'p.t-result-rate',
        taxValueSDLT[locale].secondHomeBuyer125000.rate,
      );
    });
    it.skip('Verifies SDLT for additional property or second home buyer for the Property Price-£185000', () => {
      fillInStampDutyCalculator(3, '185000');
      cy.elementContainsText(
        'p.t-result-tax',
        taxValueSDLT[locale].secondHomeBuyer185000.tax,
      );
      cy.elementContainsText(
        'p.t-result-rate',
        taxValueSDLT[locale].secondHomeBuyer185000.rate,
      );
    });
    it.skip('Verifies SDLT for additional property or second home buyer for the Property Price-£300019', () => {
      fillInStampDutyCalculator(3, '300019');
      cy.elementContainsText(
        'p.t-result-tax',
        taxValueSDLT[locale].secondHomeBuyer300019.tax,
      );
      cy.elementContainsText(
        'p.t-result-rate',
        taxValueSDLT[locale].secondHomeBuyer300019.rate,
      );
    });
    it.skip('Verifies SDLT for additional property or second home buyer for the Property Price-£400012', () => {
      fillInStampDutyCalculator(3, '400012');
      cy.elementContainsText(
        'p.t-result-tax',
        taxValueSDLT[locale].secondHomeBuyer400012.tax,
      );
      cy.elementContainsText(
        'p.t-result-rate',
        taxValueSDLT[locale].secondHomeBuyer400012.rate,
      );
    });
    it.skip('Verifies SDLT for additional property or second home buyer for the Property Price-£510000', () => {
      fillInStampDutyCalculator(3, '510000');
      cy.elementContainsText(
        'p.t-result-tax',
        taxValueSDLT[locale].secondHomeBuyer510000.tax,
      );
      cy.elementContainsText(
        'p.t-result-rate',
        taxValueSDLT[locale].secondHomeBuyer510000.rate,
      );
    });
    it.skip('Verifies SDLT for additional property or second home buyer for the Property Price-£988882', () => {
      fillInStampDutyCalculator(3, '988882');
      cy.elementContainsText(
        'p.t-result-tax',
        taxValueSDLT[locale].secondHomeBuyer988882.tax,
      );
      cy.elementContainsText(
        'p.t-result-rate',
        taxValueSDLT[locale].secondHomeBuyer988882.rate,
      );
    });
    it.skip('Verifies SDLT for additional property or second home buyer for the Property Price-£2100000', () => {
      fillInStampDutyCalculator(3, '2100000');
      cy.elementContainsText(
        'p.t-result-tax',
        taxValueSDLT[locale].secondHomeBuyer2100000.tax,
      );
      cy.elementContainsText(
        'p.t-result-rate',
        taxValueSDLT[locale].secondHomeBuyer2100000.rate,
      );
    });

    it.skip('Verify the error message when user not enters the property price', () => {
      // Select property type
      cy.get('#buyerType').select('additionalHome');

      // Tap on Calculate (or) Recalculate button without entering the property price
      cy.contains('button', /Calculate|Cyfrifwch/).click();

      // Check the error message
      const errorMessage =
        locale === 'en'
          ? 'Enter a property price, for example £200,000'
          : 'Rhowch bris eiddo, er enghraifft £200,000';

      cy.get('a[data-testid="error-link-0"]', { timeout: 60000 }).should(
        'contain.text',
        errorMessage,
      );
    });
  });
}
