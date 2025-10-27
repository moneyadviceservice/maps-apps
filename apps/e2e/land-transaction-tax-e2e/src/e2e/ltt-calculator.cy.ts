import taxValueLTT from '../fixtures/taxValueLTT';

import '@maps-react/utils/e2e/support/commands';

const localeLTT = ['en', 'cy'];

const fillInStampDutyCalculator = (buyerType: number, price: string) => {
  cy.get('#buyerType').select(buyerType);
  cy.get('#price').type(price);
  cy.get('button.tool-nav-submit').click();
};

localeLTT.forEach((locale) => {
  describe(`Land Transaction Tax - ${locale.toUpperCase()}`, () => {
    beforeEach(() => {
      cy.skipExceptions();
      cy.setCookieControl();
      cy.setBreakPoint('desktop');
      cy.visit(`/${locale}/ltt`);
    });

    it.skip('Verifies LTT for a first time or next home buyer for the Property Price-£467887', () => {
      fillInStampDutyCalculator(1, '467887');
      cy.elementContainsText(
        'p.t-result-tax',
        taxValueLTT[locale].firstTimeBuyer467887.tax,
      );
      cy.elementContainsText(
        'p.t-result-rate',
        taxValueLTT[locale].firstTimeBuyer467887.rate,
      );
    });

    it.skip('Verifies LTT for a first time or next home buyer for the Property Price-£550K', () => {
      fillInStampDutyCalculator(1, '550000');
      cy.elementContainsText(
        'p.t-result-tax',
        taxValueLTT[locale].firstTimeBuyer550000.tax,
      );
      cy.elementContainsText(
        'p.t-result-rate',
        taxValueLTT[locale].firstTimeBuyer550000.rate,
      );
    });

    it.skip('Verifies LTT for a first time or next home buyer for the Property Price-£750K', () => {
      fillInStampDutyCalculator(1, '750000');
      cy.elementContainsText(
        'p.t-result-tax',
        taxValueLTT[locale].firstTimeBuyer750000.tax,
      );
      cy.elementContainsText(
        'p.t-result-rate',
        taxValueLTT[locale].firstTimeBuyer750000.rate,
      );
    });

    it.skip('Verifies LTT for a first time or next home buyer for the Property Price-£1500K', () => {
      fillInStampDutyCalculator(1, '1500000');
      cy.elementContainsText(
        'p.t-result-tax',
        taxValueLTT[locale].firstTimeBuyer1500000.tax,
      );
      cy.elementContainsText(
        'p.t-result-rate',
        taxValueLTT[locale].firstTimeBuyer1500000.rate,
      );
    });

    it.skip('Verifies LTT for a first time or next home buyer for the Property Price-£3333333', () => {
      fillInStampDutyCalculator(1, '3333333');
      cy.elementContainsText(
        'p.t-result-tax',
        taxValueLTT[locale].firstTimeBuyer3333333.tax,
      );
      cy.elementContainsText(
        'p.t-result-rate',
        taxValueLTT[locale].firstTimeBuyer3333333.rate,
      );
    });

    it.skip('Verifies LTT for a first time or next home buyer for the Property Price-£987654321', () => {
      fillInStampDutyCalculator(1, '987654321');
      cy.elementContainsText(
        'p.t-result-tax',
        taxValueLTT[locale].firstTimeBuyer987654321.tax,
      );
      cy.elementContainsText(
        'p.t-result-rate',
        taxValueLTT[locale].firstTimeBuyer987654321.rate,
      );
    });

    // Ticket #31632
    it.skip('Verifies LTT for an addl. property or sec. home buyer for the Property Price-£39K', () => {
      fillInStampDutyCalculator(2, '39000');
      cy.elementContainsText(
        'p.t-result-tax',
        taxValueLTT[locale].secondHomeBuyer39K.tax,
      );
      cy.elementContainsText(
        'p.t-result-rate',
        taxValueLTT[locale].secondHomeBuyer39K.rate,
      );
    });

    it.skip('Verifies LTT for an addl. property or sec. home buyer for the Property Price-£125K', () => {
      fillInStampDutyCalculator(2, '125000');
      cy.elementContainsText(
        'p.t-result-tax',
        taxValueLTT[locale].secondHomeBuyer125K.tax,
      );
      cy.elementContainsText(
        'p.t-result-rate',
        taxValueLTT[locale].secondHomeBuyer125K.rate,
      );
    });

    it.skip('Verifies LTT for an addl. property or sec. home buyer for the Property Price-£300019', () => {
      fillInStampDutyCalculator(2, '300019');
      cy.elementContainsText(
        'p.t-result-tax',
        taxValueLTT[locale].secondHomeBuyer300019.tax,
      );
      cy.elementContainsText(
        'p.t-result-rate',
        taxValueLTT[locale].secondHomeBuyer300019.rate,
      );
    });

    it.skip('Verifies LTT for an addl. property or sec. home buyer for the Property Price-£400012', () => {
      fillInStampDutyCalculator(2, '400012');
      cy.elementContainsText(
        'p.t-result-tax',
        taxValueLTT[locale].secondHomeBuyer400012.tax,
      );
      cy.elementContainsText(
        'p.t-result-rate',
        taxValueLTT[locale].secondHomeBuyer400012.rate,
      );
    });

    it.skip('Verifies LTT for an addl. property or sec. home buyer for the Property Price-£937K', () => {
      fillInStampDutyCalculator(2, '937000');
      cy.elementContainsText(
        'p.t-result-tax',
        taxValueLTT[locale].secondHomeBuyer937000.tax,
      );
      cy.elementContainsText(
        'p.t-result-rate',
        taxValueLTT[locale].secondHomeBuyer937000.rate,
      );
    });

    it.skip('Verifies LTT for an addl. property or sec. home buyer for the Property Price-£988882', () => {
      fillInStampDutyCalculator(2, '988882');
      cy.elementContainsText(
        'p.t-result-tax',
        taxValueLTT[locale].secondHomeBuyer988882.tax,
      );
      cy.elementContainsText(
        'p.t-result-rate',
        taxValueLTT[locale].secondHomeBuyer988882.rate,
      );
    });

    it.skip('Verifies LTT for an addl. property or sec. home buyer for the Property Price-£2100K', () => {
      fillInStampDutyCalculator(2, '2100000');
      cy.elementContainsText(
        'p.t-result-tax',
        taxValueLTT[locale].secondHomeBuyer2100000.tax,
      );
      cy.elementContainsText(
        'p.t-result-rate',
        taxValueLTT[locale].secondHomeBuyer2100000.rate,
      );
    });

    it.skip('Verifies LTT for an addl. property or sec. home buyer for the Property Price-£9999999', () => {
      fillInStampDutyCalculator(2, '9999999');
      cy.elementContainsText(
        'p.t-result-tax',
        taxValueLTT[locale].secondHomeBuyer9999999.tax,
      );
      cy.elementContainsText(
        'p.t-result-rate',
        taxValueLTT[locale].secondHomeBuyer9999999.rate,
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
});
