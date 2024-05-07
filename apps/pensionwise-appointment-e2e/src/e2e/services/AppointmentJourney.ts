/* eslint-disable cypress/no-unnecessary-waiting */
import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';

export const initiateUserJourney = () => {
  /**
     Initiating user pension journey.
     This is the initial step and takes the user
     to the pension appointment page for each selected option to start journey
     */

  const interceptResponse = (url: string) => {
    cy.intercept(`/en/pension-wise-appointment${url}*`).as(url);
  };

  Given('I am on the home page', () => {
    cy.visit('/', { failOnStatusCode: false });
    cy.rejectCookies();
  });

  Given('I am on the home page with completed Helping You Plan', () => {
    cy.visit(
      '/?version=1&t1=4&t1q1=1&t1q2=2&t2=4&t2q1=1&t2q2=1&t2q3=2&t3=4&t3q1=2&t4=4&t4q1=2&t5=4&t5q1=1&t5q2=1',
      { failOnStatusCode: false },
    );
    cy.rejectCookies();
  });

  Given('I am on the home page with no options selected', () => {
    cy.visit(
      '/?version=1&t1=4&t1q1=1&t1q2=2&t2=4&t2q1=1&t2q2=1&t2q3=2&t3=4&t3q1=2&t4=4&t4q1=2&t5=4&t5q1=1&t5q2=1&t6=4&t6q1=2&t7=4&t7q1=2&t8=4&t8q1=2&t9=4&t9q1=2&t10=4&t10q1=2&t11=4&t11q1=2',
      { failOnStatusCode: false },
    );
    cy.rejectCookies();
  });

  Given(
    'I am on the home page with all pension options and helping you plan selected - Benefits received',
    () => {
      cy.visit(
        '/?version=1&t1=4&t1q1=3&t1q2=3&t2=4&t2q1=2&t2q2=2&t2q3=1&t3=4&t3q1=3&t4=4&t4q1=1&t5=4&t5q1=2&t5q2=2&t6=4&t6q1=1&t7=4&t7q1=1&t8=4&t8q1=1&t9=4&t9q1=1&t10=4&t10q1=1&t11=4&t11q1=1',
        { failOnStatusCode: false },
      );
      cy.rejectCookies();
    },
  );

  Given(
    'I am on the home page with all pension options and helping you plan selected - Benefits unknown',
    () => {
      cy.visit(
        '/?version=1&t1=4&t1q1=3&t1q2=3&t2=4&t2q1=2&t2q2=2&t2q3=3&t3=4&t3q1=3&t4=4&t4q1=1&t5=4&t5q1=2&t5q2=2&t6=4&t6q1=1&t7=4&t7q1=1&t8=4&t8q1=1&t9=4&t9q1=1&t10=4&t10q1=1&t11=4&t11q1=1',
        { failOnStatusCode: false },
      );
      cy.rejectCookies();
    },
  );

  Given(
    'I am on the home page with no pension options and 8 retirement planning cards',
    () => {
      cy.visit(
        '/?version=1&t1=4&t1q1=2&t1q2=1&t2=4&t2q1=1&t2q2=1&t2q3=2&t3=4&t3q1=2&t4=4&t4q1=1&t5=4&t5q1=2&t5q2=2&t6=4&t6q1=2&t7=4&t7q1=2&t8=4&t8q1=2&t9=4&t9q1=2&t10=4&t10q1=2&t11=4&t11q1=2',
        { failOnStatusCode: false },
      );
      cy.rejectCookies();
    },
  );

  Given(
    'I am on the home page with no pension options and 9 retirement planning cards',
    () => {
      cy.visit(
        '/?version=1&t1=4&t1q1=2&t1q2=1&t2=4&t2q1=1&t2q2=1&t2q3=2&t3=4&t3q1=1&t4=4&t4q1=1&t5=4&t5q1=2&t5q2=2&t6=4&t6q1=2&t7=4&t7q1=2&t8=4&t8q1=2&t9=4&t9q1=2&t10=4&t10q1=2&t11=4&t11q1=2',
        { failOnStatusCode: false },
      );
      cy.rejectCookies();
    },
  );

  When(
    'I select {string} with data testId {string} from the list',
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
      interceptResponse(pageUrl);
      cy.get('body')
        .find(`button[data-testid='${selectedDataTestId}']`)
        .scrollIntoView();
      cy.get(`button[data-testid='${selectedDataTestId}']`).click({
        force: true,
      });
      cy.wait(`@${pageUrl}`).its('response.statusCode').should('eq', 200);
    },
  );

  Then(
    'I should be taken to the page to get pension guidance for {string}',
    () => {
      cy.get(`h2[data-testid='section-title']`).should('be.visible');
    },
  );

  When(
    'I click on the continue button on the start journey page for {string}',
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

  When(
    "I select {string} for 'Does this option interest you?' question and click on the continue button on the start journey page for {string}",
    (selectedYesNoOption: string) => {
      const pageUrl = '?version';
      interceptResponse(pageUrl);
      cy.get(`h3[data-testid='section-title-footer']`).scrollIntoView();
      cy.get('body').then(($elem) => {
        if ($elem.find(`input[name="answer"]`).length) {
          cy.get('input[name="answer"]').check(
            `${selectedYesNoOption === 'Yes' ? '0' : '1'}`,
            { force: true },
          );
          cy.get(`button[data-testid='continue']`).click({ force: true });
          cy.wait(`@${pageUrl}`).its('response.statusCode').should('eq', 200);
        } else {
          cy.get(`a[data-testid='back']`).scrollIntoView();
          cy.get(`a[data-testid='back']`).click({ force: true });
        }
      });
    },
  );

  Given('I am on the home page with pension options completed', () => {
    cy.visit(
      '?version=1&t1=4&t1q1=1&t1q2=2&t2=4&t2q1=1&t2q2=1&t2q3=2&t3=4&t3q1=2&t4=4&t4q1=2&t5=4&t5q1=1&t5q2=1&t11=4&t11q1=1&t6=4&t6q1=1&t7=4&t7q1=1&t8=4&t8q1=2&t9=4&t9q1=1&t10=4&t10q1=1#options',
      { failOnStatusCode: false },
    );
    cy.rejectCookies();
  });
};
