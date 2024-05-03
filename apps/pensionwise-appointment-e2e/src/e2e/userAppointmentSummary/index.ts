/* eslint-disable cypress/no-unnecessary-waiting */
import { initiateUserJourney } from '../services/AppointmentJourney';
import { Then, When } from '@badeball/cypress-cucumber-preprocessor';

//Helper function to process Scenario: Complete 'Your appointment summary' section
const completeYourAppointmentSummarySectionJourney = () => {
  Then(
    'I should be taken to the page to view the completed appointment journeys summary',
    () => {
      cy.get(`h2[data-testid='section-title']`).should('be.visible');
    },
  );

  When(
    'I scroll to the Start your retirement planning section on the summary page',
    () => {
      cy.get(`h3[data-testid='basic-planning-title']`).should('be.visible');
    },
  );

  Then('I should see the three default retirement planning cards', () => {
    cy.get(`li[data-testid^='summary-card-']`)
      .should('have.length', 3)
      .each(($elem) => {
        cy.wrap($elem).should('be.visible');
      });
  });

  Then(
    'I should see all 6 pension option cards and 12 retirement planning cards: Generate a summary, Update your beneficiary, Get regulated advice, Find your pension pots, Ask about transferring, Check your retirement savings, Get your State Pension forecast, Use our benefits calculator, Get free debt advice, Get your pension abroad, Make a will and Set up a power of attorney',
    () => {
      //6 pension options cards
      cy.get(`[data-testid='information-callout'] > .p-4`)
        .should('have.length', 6)
        .each(($elem) => {
          cy.wrap($elem).should('be.visible');
        });

      //12 retirement planning cards
      cy.get(`ul[data-testid='summary-card-list'] li`)
        .should('have.length', 12)
        .each(($elem) => {
          cy.wrap($elem).should('be.visible');
        });
    },
  );

  Then(
    'I should see all 6 pension option cards and 12 retirement planning cards: Generate a summary, Update your beneficiary, Get regulated advice, Find your pension pots, Ask about transferring, Check your retirement savings, Get your State Pension forecast, Talk to your benefits provider, Get free debt advice, Get your pension abroad, Make a will and Set up a power of attorney',
    () => {
      //6 pension options cards
      cy.get(`[data-testid='retire-later-list']`).should('be.visible');
      cy.get(`[data-testid='guaranteed-income-list']`).should('be.visible');
      cy.get(`[data-testid='flexible-income-list']`).should('be.visible');
      cy.get(`[data-testid='lump-sum-list']`).should('be.visible');
      cy.get(`[data-testid='pot-in-one-go-list']`).should('be.visible');
      cy.get(`[data-testid='mix-options-list']`).should('be.visible');

      //12 retirement planning cards
      cy.get(`ul[data-testid='summary-card-list'] li`)
        .should('have.length', 12)
        .each(($elem) => {
          cy.wrap($elem).should('be.visible');
        });
    },
  );

  Then(
    'I should only see these 8 retirement planning cards: Generate a summary, Update your beneficiary, Get regulated advice, Find your pension pots, Ask about transferring, Check your retirement savings, Get your State Pension forecast and Talk to your benefits provider',
    () => {
      //8 retirement planning cards
      cy.get(`ul[data-testid='summary-card-list'] li`)
        .should('have.length', 8)
        .each(($elem) => {
          cy.wrap($elem).should('be.visible');
        });
    },
  );

  Then(
    'I should see these 9 retirement planning cards: Generate a summary, Update your beneficiary, Get regulated advice, Find your pension pots, Ask about transferring, Check your retirement savings, Get your State Pension forecast, Talk to your benefits provider and Make a will',
    () => {
      //9 retirement planning cards
      cy.get(`ul[data-testid='summary-card-list'] li`)
        .should('have.length', 9)
        .each(($elem) => {
          cy.wrap($elem).should('be.visible');
        });
    },
  );
};

//Background: User Taken to the homepage and an appointment journey option is chosen
initiateUserJourney();

//Scenarios: Complete All Journeys Under Your Pension options section
completeYourAppointmentSummarySectionJourney();
