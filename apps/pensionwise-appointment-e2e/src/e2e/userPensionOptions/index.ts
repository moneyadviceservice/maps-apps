/* eslint-disable cypress/no-unnecessary-waiting */
import { initiateUserJourney } from '../services/AppointmentJourney';
import { Then, When } from '@badeball/cypress-cucumber-preprocessor';

// Helper function to process Scenario: Complete Save and Come Back Later Feature
const completeSaveAndComeBackLaterFeature = () => {
  When(
    "I click on the 'Save and come back later' button on the homepage",
    () => {
      const interceptUrl = 'save';
      cy.intercept(`/**/en/pension-wise-appointment/${interceptUrl}.json?*`).as(
        interceptUrl,
      );
      cy.get('body').find(`a[data-testid='save-and-return']`).scrollIntoView();
      cy.get(`a[data-testid='save-and-return']`).click({ force: true });
      cy.wait(`@${interceptUrl}`).its('response.statusCode').should('eq', 200);
    },
  );

  Then("I should be taken to the 'Save and come back later' page", () => {
    cy.get(`h2[data-testid='section-title']`).scrollIntoView();
    cy.get(`h2[data-testid='section-title']`).should('be.visible');
  });

  When(
    'I enter a valid email address in the email address field on the save and come back later form',
    () => {
      const interceptUrl = 'progress-saved?version';
      cy.intercept(`?*`).as('save');
      cy.intercept(`/en/pension-wise-appointment/${interceptUrl}?*`).as(
        interceptUrl,
      );
      cy.get(`h2[data-testid='section-title']`).scrollIntoView();
      cy.get('form input[name="email"]').clear();
      cy.get('form input[name="email"]').type('real-email@gmail.com');
      cy.get(`button[type='submit'][data-testid='save-and-return']`).click();
      cy.wait(`@${interceptUrl}`).its('response.statusCode').should('eq', 200);
    },
  );

  Then(
    'I should be sent an email to come back later to complete journey',
    () => {
      cy.get(`h2[data-testid='section-title']`).should('be.visible');
      cy.get('[data-testid="moneyhelper"]').should('be.visible');
      cy.get('[data-testid="resend-email"]').should('be.visible');
    },
  );
};

//Helper function to process Scenarios: Complete All Journeys Under Your Pension options section
const completeYourPensionOptionsSectionJourneys = () => {
  Then(
    'I should be taken back to the homepage with a Completed status for the section with {string} on the Your pension options section',
    (selectedHomePageOption: string) => {
      const taskNumber = parseInt(
        selectedHomePageOption.replace('task-', '').trim(),
      );
      cy.verifyTaskCompletion(taskNumber);
    },
  );
};

//Helper function to process Scenario: Complete 'Your appointment summary' section
const completeYourAppointmentSummarySectionJourney = () => {
  Then(
    'I should be taken to the page to view the completed appointment journeys summary',
    () => {
      cy.get(`h2[data-testid='section-title']`).scrollIntoView();
      cy.get(`h2[data-testid='section-title']`).should('be.visible');
    },
  );
  When(
    'I click on the back button to return to the homepage to view completed appointment summary section',
    () => {
      cy.get(`a[data-testid='back']`).scrollIntoView();
      cy.get(`a[data-testid='back']`).should('be.visible');
      cy.get(`a[data-testid='back']`).click();
    },
  );
  Then(
    'I should be taken back to the homepage with a Completed status for the section with {string} on the Your appointment summary',
    (selectedHomePageOption: string) => {
      cy.get(`button[data-testid=${selectedHomePageOption}]`).scrollIntoView();
      cy.get(`button[data-testid=${selectedHomePageOption}]`)
        .contains('Completed')
        .should('be.visible');
    },
  );
  Then('I should be able to generate appointment summary', () => {
    cy.url().then(($url) => {
      cy.get(`[data-testid='hero-banner'] [data-testid='paragraph'] a`)
        .should('be.visible')
        .invoke('removeAttr', 'target')
        .click();
      if ($url.includes('localhost'))
        cy.origin('https://www.moneyhelper.org.uk/', () => {
          cy.url().should('contain', 'view-your-appointment-summary');
        });
      else {
        cy.url().should('contain', 'view-your-appointment-summary');
      }
    });
  });
};

//Background: User Taken to the homepage and an appointment journey option is chosen
initiateUserJourney();

//Scenarios: Complete All Journeys Under Your Pension options section
completeYourPensionOptionsSectionJourneys();

//Scenarios: Complete All Journeys Under Your Pension options section
completeYourAppointmentSummarySectionJourney();

// Helper function to process Scenario: Complete Save and Come Back Later Feature
completeSaveAndComeBackLaterFeature();
