// Accept cookies
Cypress.Commands.add('acceptCookies', () => {
  cy.get('div#ccc-notify').within(() => {
    cy.get('button#ccc-notify-accept').click();
  });
});

// Reject cookies
Cypress.Commands.add('rejectCookies', () => {
  cy.get('div#ccc-notify').within(() => {
    cy.get('button#ccc-notify-reject').eq(0).click();
  });
});

// Verify task completion
Cypress.Commands.add('verifyTaskCompletion', (taskNumber: number) => {
  cy.get(`button[data-testid='task-${taskNumber}']`).scrollIntoView();
  cy.get(`button[data-testid='task-${taskNumber}']`)
    .contains('Completed')
    .should('be.visible');
});

// Check status code of href
Cypress.Commands.add('checkLinkHref', (selector) => {
  cy.get(selector).each(($el) => {
    cy.wrap($el)
      .invoke('attr', 'href')
      .then((href: any) => {
        cy.request(href).its('status').should('eq', 200);
      });
  });
});

// Intercept response
Cypress.Commands.add('interceptResponse', (response: string) => {
  cy.intercept(`/en/pension-wise-appointment/${response}*`).as(response);
});

Cypress.Commands.add(
  'viewSummaryDocument',
  (selectedHomePageOption: string, selectedDataTestId: string) => {
    let pageUrl = '';
    switch (selectedHomePageOption.toLowerCase()) {
      case 'pension basics':
        pageUrl = '/pension-basics';
        break;
      case 'income and savings':
        pageUrl = '/income-savings';
        break;
      case 'debts and repayment':
        pageUrl = '/debt-repayment';
        break;
      case 'your home':
        pageUrl = '/your-home';
        break;
      case 'health and family':
        pageUrl = '/health-family';
        break;
      case 'retire later or delay taking your pension':
        pageUrl = '/retire-later-or-delay';
        break;
      case 'get a guaranteed income':
        pageUrl = '/guaranteed-income';
        break;
      case 'get a flexible income':
        pageUrl = '/flexible-income';
        break;
      case 'take your pension as a number of lump sums':
        pageUrl = '/lump-sums';
        break;
      case 'take your pot in one go':
        pageUrl = '/take-pot-in-one';
        break;
      case 'mix your options':
        pageUrl = '/mix-options';
        break;
      case 'view your summary document and to-do list':
        cy.scrollTo('bottom');
        pageUrl = '/summary?';
        break;

      default:
        pageUrl = '/summary?version';
    }
    cy.interceptResponse(pageUrl);
    cy.get(`button[data-testid='${selectedDataTestId}']`).scrollIntoView();
    cy.get(`button[data-testid='${selectedDataTestId}']`).click({
      force: true,
    });
    cy.wait(`@${pageUrl}`).its('response.statusCode').should('eq', 200);
  },
);

Cypress.Commands.add(
  'viewPensionGuidance',
  (selectedHomePageOption: string) => {
    let pageUrl = '';
    switch (selectedHomePageOption.toLowerCase()) {
      case 'pension basics':
        pageUrl = 'pension-basics/protecting-your-pension';
        break;
      case 'income and savings':
        pageUrl = 'income-savings/retirement-budget';
        break;
      case 'debts and repayment':
        pageUrl = 'debt-repayment/using-pension-to-pay-debt';
        break;
      case 'your home':
        pageUrl = 'your-home/live-overseas';
        break;
      case 'health and family':
        pageUrl = 'health-family/will';
        break;
    }

    cy.intercept(`/**/en/pension-wise-appointment/${pageUrl}.json?*`).as(
      pageUrl,
    );
    cy.get('body').then(($elem) => {
      if ($elem.find(`a[data-testid='continue']`).length) {
        cy.get(`[data-testid='continue']`).click({ force: true });
        cy.wait(`@${pageUrl}`).its('response.statusCode').should('eq', 200);
      } else {
        cy.get(`a[data-testid='back']`).click({ force: true });
      }
    });
  },
);
