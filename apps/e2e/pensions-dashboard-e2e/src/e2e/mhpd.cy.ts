describe('Moneyhelper Pension Dashboard', () => {
  beforeEach(() => {
    cy.visit('/', { failOnStatusCode: false });
  });

  const TIMEOUT = 20000;

  const URL: { [key in string]: string } = {
    YOUR_PENSION_SEARCH_RESULTS: '/your-pension-search-results',
    YOUR_PENSION_BREAKDOWN: '/your-pension-breakdown',
    PENDING_PENSIONS: '/pending-pensions',
    PENSIONS_THAT_NEED_ACTION: '/pensions-that-need-action',
    PENSION_DETAILS: '/pension-details',
    EXITED: '/you-have-exited-the-dashboard',
  };

  const navigateToOverviewPage = () => {
    cy.get(`[data-testid='start']`).scrollIntoView();
    cy.get(`[data-testid='start']`).should('be.visible').click();

    cy.get('#options').should('be.visible').select('zTestAll');
    cy.get('form').submit();

    cy.get(`[data-testid='welcome-button']`).scrollIntoView();
    cy.get(`[data-testid='welcome-button']`).should('be.visible').click();

    cy.confirmPage(URL.YOUR_PENSION_SEARCH_RESULTS, 90000);
    cy.get(`[data-testid='pensions-found']`).should(
      'contain.text',
      'We found 15 pensions',
    );
  };

  const findContainerAndSelect = (testId: string) => {
    cy.get(`[data-testid=${testId}]`).should('be.visible');
    cy.get(`[data-testid=${testId}]`).find('a').scrollIntoView();
    cy.get(`[data-testid=${testId}]`).find('a').should('be.visible').click();
  };

  const findPensionAndSelect = (testId: string) => {
    cy.get(`[data-testid='page-title']`).should('be.visible');
    cy.get(`[data-testid=${testId}]`).scrollIntoView();
    cy.get(`[data-testid=${testId}]`)
      .find('li')
      .first()
      .find(`[data-testid='details-link']`)
      .click();
  };

  const findBackButtonAndSelect = () => {
    cy.reload();
    cy.get('[data-testid="back"]').click();
  };

  const findNeedActionLinkAndSelect = () => {
    cy.get("[data-testid='need-action-link']").click();
  };

  it(`Pensions confirmed (green)`, () => {
    navigateToOverviewPage();
    findContainerAndSelect('callout-positive');
    cy.confirmPage(URL.YOUR_PENSION_BREAKDOWN);
    findBackButtonAndSelect();
    cy.confirmPage(URL.YOUR_PENSION_SEARCH_RESULTS);

    findContainerAndSelect('callout-positive');
    findPensionAndSelect('confirmed-pensions');
    cy.confirmPage(URL.PENSION_DETAILS, TIMEOUT);
    cy.get('h1').should('contain.text', 'State Pension summary');
    findBackButtonAndSelect();
    cy.confirmPage(URL.YOUR_PENSION_BREAKDOWN);
    findBackButtonAndSelect();
    cy.confirmPage(URL.YOUR_PENSION_SEARCH_RESULTS);

    findContainerAndSelect('callout-positive');
    findPensionAndSelect('confirmed-pensions');
    findNeedActionLinkAndSelect();
    cy.confirmPage(URL.PENSIONS_THAT_NEED_ACTION);
    findBackButtonAndSelect();
    cy.confirmPage(URL.YOUR_PENSION_BREAKDOWN);
    findBackButtonAndSelect();
    cy.confirmPage(URL.YOUR_PENSION_SEARCH_RESULTS);
    cy.logout();
    cy.confirmPage(URL.EXITED);
  });

  it(`Pensions pending (yellow)`, () => {
    navigateToOverviewPage();
    findContainerAndSelect('callout-warning');
    cy.confirmPage(URL.PENDING_PENSIONS);
    findBackButtonAndSelect();
    cy.confirmPage(URL.YOUR_PENSION_SEARCH_RESULTS);

    findContainerAndSelect('callout-warning');
    findPensionAndSelect('pending-pensions');
    cy.confirmPage(URL.PENSION_DETAILS, TIMEOUT);
    cy.get('h1').should('contain.text', 'Master Trust Workplace 0887 summary');
    findBackButtonAndSelect();
    cy.confirmPage(URL.PENDING_PENSIONS);
    findBackButtonAndSelect();
    cy.confirmPage(URL.YOUR_PENSION_SEARCH_RESULTS);

    findContainerAndSelect('callout-warning');
    findPensionAndSelect('pending-pensions');
    findNeedActionLinkAndSelect();
    cy.confirmPage(URL.PENSIONS_THAT_NEED_ACTION);
    findBackButtonAndSelect();
    cy.confirmPage(URL.PENDING_PENSIONS);
    findBackButtonAndSelect();
    cy.confirmPage(URL.YOUR_PENSION_SEARCH_RESULTS);
    cy.logout();
    cy.confirmPage(URL.EXITED);
  });

  it(`Pensions that need action (red)`, () => {
    navigateToOverviewPage();
    findContainerAndSelect('callout-negative');
    cy.confirmPage(URL.PENSIONS_THAT_NEED_ACTION);
    cy.get('h1').should('contain.text', 'Pensions that need action');
    findBackButtonAndSelect();
    cy.confirmPage(URL.YOUR_PENSION_SEARCH_RESULTS);
    cy.logout();
    cy.confirmPage(URL.EXITED);
  });
});
