describe('Moneyhelper Pension Dashboard Support Pages', () => {
  beforeEach(() => {
    cy.visit('/en/support/explore-the-pensions-dashboard', {
      failOnStatusCode: false,
    });
  });

  const URL: { [key in string]: string } = {
    SUPPORT_EXPLORE: '/explore-the-pensions-dashboard',
    SUPPORT_UNDERSTAND: '/understand-your-pensions',
    SUPPORT_REPORT: '/report-a-technical-problem',
    SUPPORT_SUGGEST: '/suggest-another-question',
  };

  const findLinkAndSelect = (testId: string) => {
    cy.get(`[data-testid=${testId}]`).scrollIntoView();
    cy.get(`[data-testid=${testId}]`).click();
  };

  const findBackButtonAndSelect = () => {
    cy.get('[data-testid="back"]').click();
  };

  it(`Support pages`, () => {
    // understand > explore > report > explore > suggest > explore
    findLinkAndSelect('support-callout-link-understand');
    cy.confirmPage(URL.SUPPORT_UNDERSTAND);
    findLinkAndSelect('support-callout-link-explore');
    cy.confirmPage(URL.SUPPORT_EXPLORE);
    findLinkAndSelect('support-callout-link-report');
    cy.confirmPage(URL.SUPPORT_REPORT);
    findLinkAndSelect('support-callout-link-explore');
    cy.confirmPage(URL.SUPPORT_EXPLORE);
    findLinkAndSelect('suggest-another-question');
    cy.confirmPage(URL.SUPPORT_SUGGEST);
    findBackButtonAndSelect();
    cy.confirmPage(URL.SUPPORT_EXPLORE);

    // understand > report > understand > suggest > understand
    findLinkAndSelect('support-callout-link-understand');
    cy.confirmPage(URL.SUPPORT_UNDERSTAND);
    findLinkAndSelect('support-callout-link-report');
    cy.confirmPage(URL.SUPPORT_REPORT);
    findLinkAndSelect('support-callout-link-understand');
    cy.confirmPage(URL.SUPPORT_UNDERSTAND);
    findLinkAndSelect('suggest-another-question');
    cy.confirmPage(URL.SUPPORT_SUGGEST);
    findBackButtonAndSelect();
    cy.confirmPage(URL.SUPPORT_UNDERSTAND);
    findLinkAndSelect('suggest-another-question');
    cy.confirmPage(URL.SUPPORT_SUGGEST);
    cy.reload();
    findBackButtonAndSelect();
    cy.confirmPage(URL.SUPPORT_EXPLORE);
  });
});
