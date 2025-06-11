import { adobeDatalayer } from '../fixtures/pacs-adobeDatalayer';
describe('PACS-Analytics', () => {
  beforeEach(() => {
    cy.skipExceptions();
    cy.setCookieControl();
    cy.setBreakPoint('desktop');
  });

  const visitPage = (url: string) => {
    cy.visit(url);
  };

  it('DataLayer - pageLoadReact', () => {
    const locales = ['en', 'cy'];
    const urls = [
      '?accountsPerPage=20&p=1',
      '?q=&standardcurrent=on&feefreebasicbank=on&student=on&premier=on&accountsPerPage=5&order=random',
      '?q=&chequebookavailable=on&nomonthlyfee=on&opentonewcustomers=on&overdraftfacilities=on&sevendayswitching=on&accountsPerPage=10&order=random',
      '?q=&branchbanking=on&internetbanking=on&mobileappbanking=on&postofficebanking=on&accountsPerPage=15&order=random',
      '?accountsPerPage=20&order=providerNameAZ&p=1',
      '?accountsPerPage=20&order=providerNameZA&p=1',
      '?accountsPerPage=20&order=monthlyAccountFeeLowestFirst&p=1',
      '?accountsPerPage=20&order=minimumMonthlyDepositLowestFirst&p=1',
      '?accountsPerPage=10&order=arrangedOverdraftRateLowestFirst&p=1',
      '?accountsPerPage=5&order=unarrangedMaximumMonthlyChargeLowestFirst&p=1',
    ];

    locales.forEach((locale) => {
      urls.forEach((urlTemplate) => {
        const expectedUrl = `/${locale}/${urlTemplate}`;
        const values = adobeDatalayer(locale)[urlTemplate];
        visitPage(expectedUrl);
        cy.verifyDatalayer('pageLoadReact', locale, values);
      });
    });
  });
});
