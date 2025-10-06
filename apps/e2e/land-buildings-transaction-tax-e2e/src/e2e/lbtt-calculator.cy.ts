import { taxValues as taxValueLBTT } from '../fixtures/taxValueLBTT';

import '@maps-react/utils/e2e/support/commands';

const localeLBTT = ['en', 'cy'];

const fillInStampDutyCalculator = (buyerType: any, price: string) => {
  cy.get('#buyerType').select(buyerType);
  cy.get('#price').type(price);
  cy.get('button.tool-nav-submit').click();
};

localeLBTT.forEach((locale) => {
  describe(`Land Transaction Tax - ${locale.toUpperCase()}`, () => {
    beforeEach(() => {
      cy.skipExceptions();
      cy.setCookieControl();
      cy.setBreakPoint('desktop');
      cy.visit(`/${locale}/lbtt`);
    });

    it('Verifies LBTT for a First Time Buyer', () => {
      fillInStampDutyCalculator(1, '350000');
      cy.elementContainsText(
        'p.t-result-tax',
        taxValueLBTT[locale].firstTimeBuyer.tax,
      );
      cy.elementContainsText(
        'p.t-result-rate',
        taxValueLBTT[locale].firstTimeBuyer.rate,
      );
    });

    it('Verifies LBTT for a Next Home Buyer', () => {
      fillInStampDutyCalculator(2, '650999');
      cy.elementContainsText(
        'p.t-result-tax',
        taxValueLBTT[locale].nextHomeBuyer.tax,
      );
      cy.elementContainsText(
        'p.t-result-rate',
        taxValueLBTT[locale].nextHomeBuyer.rate,
      );
    });

    it('Verifies LBTT for Additional Property/Second Home Buyer - Property Price : 39K', () => {
      fillInStampDutyCalculator(3, '39000');
      cy.elementContainsText(
        'p.t-result-tax',
        taxValueLBTT[locale].secondHomeBuyer39K.tax,
      );
      cy.elementContainsText(
        'p.t-result-rate',
        taxValueLBTT[locale].secondHomeBuyer39K.rate,
      );
    });

    it('Verifies LBTT for Additional Property/Second Home Buyer - Property Price : 125K', () => {
      fillInStampDutyCalculator(3, '125000');
      cy.elementContainsText(
        'p.t-result-tax',
        taxValueLBTT[locale].secondHomeBuyer125K.tax,
      );
      cy.elementContainsText(
        'p.t-result-rate',
        taxValueLBTT[locale].secondHomeBuyer125K.rate,
      );
    });

    it('Verifies LBTT for Additional Property/Second Home Buyer - Property Price : 275K', () => {
      fillInStampDutyCalculator(3, '275000');
      cy.elementContainsText(
        'p.t-result-tax',
        taxValueLBTT[locale].secondHomeBuyer275K.tax,
      );
      cy.elementContainsText(
        'p.t-result-rate',
        taxValueLBTT[locale].secondHomeBuyer275K.rate,
      );
    });

    it('Verifies LBTT for Additional Property/Second Home Buyer - Property Price : 310K', () => {
      fillInStampDutyCalculator(3, '310000');
      cy.elementContainsText(
        'p.t-result-tax',
        taxValueLBTT[locale].secondHomeBuyer310K.tax,
      );
      cy.elementContainsText(
        'p.t-result-rate',
        taxValueLBTT[locale].secondHomeBuyer310K.rate,
      );
    });

    it('Verifies LBTT for Additional Property/Second Home Buyer - Property Price : 490K', () => {
      fillInStampDutyCalculator(3, '490000');
      cy.elementContainsText(
        'p.t-result-tax',
        taxValueLBTT[locale].secondHomeBuyer490K.tax,
      );
      cy.elementContainsText(
        'p.t-result-rate',
        taxValueLBTT[locale].secondHomeBuyer490K.rate,
      );
    });

    it('Verifies LBTT for Additional Property/Second Home Buyer - Property Price : 937K', () => {
      fillInStampDutyCalculator(3, '937000');
      cy.elementContainsText(
        'p.t-result-tax',
        taxValueLBTT[locale].secondHomeBuyer937K.tax,
      );
      cy.elementContainsText(
        'p.t-result-rate',
        taxValueLBTT[locale].secondHomeBuyer937K.rate,
      );
    });

    it('Verifies LBTT for Additional Property/Second Home Buyer - Property Price : 62000K', () => {
      fillInStampDutyCalculator(3, '62000000');
      cy.elementContainsText(
        'p.t-result-tax',
        taxValueLBTT[locale].secondHomeBuyer62M.tax,
      );
      cy.elementContainsText(
        'p.t-result-rate',
        taxValueLBTT[locale].secondHomeBuyer62M.rate,
      );
    });

    it('Verifies LBTT for Additional Property/Second Home Buyer - Property Price : 1000000K', () => {
      fillInStampDutyCalculator(3, '1000000000');
      cy.elementContainsText(
        'p.t-result-tax',
        taxValueLBTT[locale].secondHomeBuyer1B.tax,
      );
      cy.elementContainsText(
        'p.t-result-rate',
        taxValueLBTT[locale].secondHomeBuyer1B.rate,
      );
    });
    it('Verify the error message when user not enters the property price', () => {
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
