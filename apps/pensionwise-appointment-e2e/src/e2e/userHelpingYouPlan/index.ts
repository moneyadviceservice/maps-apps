/* eslint-disable cypress/no-unnecessary-waiting */
import { initiateUserJourney } from '../services/AppointmentJourney';
import { Then, When } from '@badeball/cypress-cucumber-preprocessor';

const answerAndProceed = (answer: string, questionUrl = '?version') => {
  cy.intercept(`/en/pension-wise-appointment${questionUrl}*`).as(questionUrl);
  cy.get(`h2[data-testid='section-title']`).should('be.visible');
  cy.get('form input[name="answer"]').check(answer, { force: true });
  cy.get(`button[data-testid='continue']`).click();
  cy.wait(`@${questionUrl}`).its('response.statusCode').should('eq', 200);
};

//Helper function to process Scenario: Complete 'Pension Basics' Journey Under helping your Plan section
const completePensionBasicsJourney = () => {
  Then("I should be taken to the 'Protecting your pensions' page", () => {
    cy.get(`h2[data-testid='section-title']`).should('be.visible');
  });

  When(
    "I click on the continue button on the 'Protecting your pensions' page",
    () => {
      cy.intercept(
        `/**/en/pension-wise-appointment/pension-basics/keeping-track-of-pensions.json?version*`,
      ).as('continue');
      cy.get(`h2[data-testid='section-title']`).should('be.visible');
      cy.get(`[data-testid='callout-warning']`).scrollIntoView();
      cy.scrollTo('bottom');
      cy.get(`[data-testid='continue']`).click({ force: true });
      cy.wait('@continue').its('response.statusCode').should('eq', 200);
    },
  );
  Then(
    "I should be taken to the 'Have you kept track of all your pensions?' initial page",
    () => {
      cy.get(`h2[data-testid='section-title']`).should('be.visible');
    },
  );

  When(
    "I select Yes for 'Have you kept track of all your pensions?' question and click continue button",
    () => {
      answerAndProceed('0', '/pension-basics/transferring-pension?version');
    },
  );

  Then(
    "I should be taken to the 'Are you interested in transferring your pension?' page",
    () => {
      cy.get(`h2[data-testid='section-title']`).should('be.visible');
    },
  );

  When(
    "I select Yes for 'Are you interested in transferring your pension?' question and click the continue button",
    () => {
      answerAndProceed('0');
    },
  );
  Then(
    "I should be taken back to the homepage with a 'Completed' status for the 'Pension basics'",
    () => {
      cy.verifyTaskCompletion(1);
    },
  );
};

//Helper function to process Scenario: Complete 'Income and savings' Journey Under helping your Plan section
const completeIncomeAndSavingsJourney = () => {
  Then(
    "I should be taken to the 'Have you created a retirement budget?' initial page",
    () => {
      cy.get(`h2[data-testid='section-title']`).should('be.visible');
    },
  );

  When(
    "I select Yes for 'Have you created a retirement budget?' question and click continue button",
    () => {
      answerAndProceed('0', '/income-savings/state-pension');
    },
  );
  Then(
    "I should be taken to the 'Do you know how much State Pension you'll get and when?' page",
    () => {
      cy.get(`h2[data-testid='section-title']`).should('be.visible');
    },
  );

  When(
    "I select Yes for 'Do you know how much State Pension you'll get and when?' question and click the continue button",
    () => {
      answerAndProceed('0', '/income-savings/state-benefits');
    },
  );
  Then(
    "I should be taken to the 'Have you or anyone in your household received state benefits in last 12 months?' page",
    () => {
      cy.get(`h2[data-testid='section-title']`).should('be.visible');
    },
  );

  When(
    "I select Yes for 'Have you or anyone in your household received state benefits in last 12 months?' question and click the continue button",
    () => {
      answerAndProceed('0');
    },
  );
  Then(
    "I should be taken back to the homepage with a 'Completed' status for the 'Income and savings'",
    () => {
      cy.verifyTaskCompletion(2);
    },
  );
};

//Helper function to process Scenario: Complete 'Debts and repayment' Journey Under helping your Plan section
const completeDebtsAndRepaymentJourney = () => {
  Then(
    "I should be taken to the 'Are you thinking of using your pension to pay off any debts?' page",
    () => {
      cy.get(`h2[data-testid='section-title']`).should('be.visible');
    },
  );
  When(
    "I select Yes for 'Are you thinking of using your pension to pay off any debts?' question and click the continue button",
    () => {
      answerAndProceed('0');
    },
  );
  Then(
    "I should be taken back to the homepage with a 'Completed' status for the 'Debts and repayment'",
    () => {
      cy.verifyTaskCompletion(3);
    },
  );
};

//Helper function to process Scenario: Complete 'Your Home' Journey Under helping your Plan section
const completeYourHomeJourney = () => {
  Then(
    "I should be taken to the 'Do you or are you planning to live overseas?' page",
    () => {
      cy.get(`h2[data-testid='section-title']`).should('be.visible');
    },
  );

  When(
    "I select Yes for 'Do you or are you planning to live overseas?' question and click the continue button",
    () => {
      answerAndProceed('0');
    },
  );
  Then(
    "I should be taken back to the homepage with a 'Completed' status for the 'Your home'",
    () => {
      cy.verifyTaskCompletion(4);
    },
  );
};

//Helper function to process Scenario: Complete 'Health and Family' Journey Under helping your Plan section
const completeHealthAndFamilyJourney = () => {
  Then("I should be taken to the 'Have you made a will?' page", () => {
    cy.get(`h2[data-testid='section-title']`).should('be.visible');
  });

  When(
    "I select Yes for 'Have you made a will?' question and click the continue button",
    () => {
      answerAndProceed('0', '/health-family/power-of-attorney?version');
    },
  );
  Then(
    "I should be taken to the 'Have you set up a power of attorney for your money and property?' page",
    () => {
      cy.get(`h2[data-testid='section-title']`).scrollIntoView();
      cy.get(`h2[data-testid='section-title']`).should('be.visible');
    },
  );

  When(
    "I select Yes for 'Have you set up a power of attorney for your money and property?' question and click the continue button",
    () => {
      answerAndProceed('0');
    },
  );
  Then(
    "I should be taken back to the homepage with a 'Completed' status for the 'Health and family'",
    () => {
      cy.verifyTaskCompletion(5);
    },
  );
};

//Background: User Taken to the homepage and an appointment journey option is chosen
initiateUserJourney();

//Scenario: Complete 'Pension Basics' Journey Under helping your Plan section
completePensionBasicsJourney();

//Scenario: Complete 'Income and savings' Journey Under helping your Plan section
completeIncomeAndSavingsJourney();

//Scenario: Complete 'Debts and repayment' Journey Under helping your Plan section
completeDebtsAndRepaymentJourney();

//Scenario: Complete 'Your Home' Journey Under helping your Plan section
completeYourHomeJourney();

//Scenario: Complete 'Health and Family' Journey Under helping your Plan section
completeHealthAndFamilyJourney();
