describe('Complete Pension Appointment Journeys', () => {
  beforeEach(() => {
    cy.visit('/', { failOnStatusCode: false });
    cy.rejectCookies();
    navigateToAgeGroupPage();
  });

  const navigateToAgeGroupPage = () => {
    cy.get(`[data-testid='temp-landing']`).should('be.visible');
    cy.get(`a[data-testid='continue']`).click({ force: true });
    cy.url().should('contain', '/pension-wise-triage/start');
    cy.get(`[data-testid='start']`).should('be.visible');
    cy.get(`a[data-testid='continue']`).should('be.visible').click();
    cy.url().should('contain', '/pension-wise-triage/age');
    cy.get(`[data-testid='age-questions']`).should('be.visible');
    cy.get(`button[data-testid='continue']`).should('be.visible');
  };

  const navigateToPreviousPage = () => {
    cy.get(`a[data-testid='back']`).click();
  };

  it(`completes pension journey for 'under 50' age group`, () => {
    cy.provideAnswer('age/under-50', '0');
    cy.get(`[data-testid='under-50']`).should('be.visible');

    // should display contact info
    cy.get('[data-testid="under-50"] a').each(($elem, index) => {
      if (index == 1) {
        cy.wrap($elem).should('contain.text', '0800 011 3797');
      } else {
        cy.wrap($elem)
          .invoke('attr', 'href')
          .then((href: string) => {
            cy.request(href).its('status').should('eq', 200);
          });
      }
    });
  });

  it(`completes pension journey for '50 - 54' age group`, () => {
    cy.provideAnswer('age/50-54', '1');
    cy.get(`[data-testid='50-54']`).should('be.visible');
    cy.get('[data-testid="continue"]').click();

    // Terminal illness for '50 - 54' age group
    cy.get(`[data-testid='pension-type-questions']`).should('be.visible');
    cy.provideAnswer('terminal-illness', '0');
    cy.get(`[data-testid='terminal-illness-questions']`).should('be.visible');
    cy.provideAnswer('terminal-illness/coping-with-terminal-illness', '0');
    cy.get(`[data-testid='terminal-illness']`)
      .should('be.visible')
      .find('a')
      .should('contain.text', '0800 138 3944');
    navigateToPreviousPage();
    cy.get(`form[data-testid='terminal-illness-questions']`).should(
      'be.visible',
    );

    // Lifetime annuity in payment for '50 - 54' age group
    cy.provideAnswer('lifetime-annuity', '1');
    cy.get(`form[data-testid='lifetime-annuity-questions']`).should(
      'be.visible',
    );
    cy.provideAnswer('lifetime-annuity/lifetime-annuity-in-payment', '0');
    cy.get(`[data-testid='lifetime-annuity-in-payment']`).should('be.visible');
    cy.get(`[data-testid='continue']`).should('be.visible').click();
    cy.get(`form[data-testid='debt-questions']`).should('be.visible');

    navigateToPreviousPage();
    cy.get(`form[data-testid='lifetime-annuity-questions']`).should(
      'be.visible',
    );

    // Debts you're struggling to pay off for '50 - 54' age group
    cy.provideAnswer('debts', '1');
    cy.get(`form[data-testid='debt-questions']`).should('be.visible');
    cy.verifyExpandableSectionExists();
    cy.provideAnswer('debt-advice', '0');
    cy.get(`form[data-testid='debt-advice-questions']`).should('be.visible');
    cy.verifyExpandableSectionExists();
    cy.provideAnswer('debt-advice/have-not-received-debt-advice', '1');
    cy.get(`[data-testid='no-debt-advice']`).should('be.visible');
    cy.checkLinkHref(
      '[data-testid="no-debt-advice"] [data-testid="paragraph"] a',
    );
  });

  it(`completes pension journey for '55 - 74' age group`, () => {
    cy.provideAnswer('pension-type', '2');
    cy.get(`form[data-testid='pension-type-questions']`).should('be.visible');
    cy.checkLinkHref('[data-testid="paragraph"] a');
    cy.verifyExpandableSectionExists();

    // Terminal illness for '55 - 74' age group page
    cy.provideAnswer('terminal-illness', '0');
    cy.get(`form[data-testid='terminal-illness-questions']`).should(
      'be.visible',
    );
    cy.verifyExpandableSectionExists();
    cy.provideAnswer('terminal-illness/coping-with-terminal-illness', '0');

    // should display contact info
    cy.get(`[data-testid='terminal-illness']`)
      .should('be.visible')
      .find('a')
      .should('contain.text', '0800 138 3944');
    navigateToPreviousPage();
    cy.get(`form[data-testid='terminal-illness-questions']`).should(
      'be.visible',
    );

    // lifetime annuity in payment for '55 - 74' age group page
    cy.provideAnswer('lifetime-annuity', '1');
    cy.get(`form[data-testid='lifetime-annuity-questions']`).should(
      'be.visible',
    );
    cy.verifyExpandableSectionExists();
    cy.provideAnswer('lifetime-annuity/lifetime-annuity-in-payment', '0');
    cy.get(`[data-testid='lifetime-annuity-in-payment']`).should('be.visible');
    cy.get(`[data-testid='continue']`).should('be.visible').click();
    cy.get(`form[data-testid='debt-questions']`).should('be.visible');
    navigateToPreviousPage();
    cy.get(`form[data-testid='lifetime-annuity-questions']`)
      .should('be.visible')
      .find('[data-testid="paragraph"] a')
      .should('have.attr', 'href');

    cy.verifyExpandableSectionExists();

    // Debts you're struggling to pay off for '55 - 74' age group pagS
    cy.provideAnswer('debt', '1');
    cy.get(`form[data-testid='debt-questions']`).should('be.visible');
    cy.verifyExpandableSectionExists();
    cy.provideAnswer('debt-advice', '0');
    cy.get(`form[data-testid='debt-advice-questions']`).should('be.visible');
    cy.verifyExpandableSectionExists();
    cy.provideAnswer('debt-advice/have-not-received-debt-advice', '1');
    cy.get(`[data-testid='no-debt-advice']`).should('be.visible');
    cy.checkLinkHref(
      '[data-testid="no-debt-advice"] [data-testid="paragraph"] a',
    );
  });

  it(`completes pension journey for '75 and over' age group`, () => {
    cy.provideAnswer('age/75-and-over', '3');

    // should display contact info
    cy.get(`[data-testid='75-and-over']`)
      .should('be.visible')
      .find('a')
      .should('contain.text', '0800 138 3944');
  });
});
