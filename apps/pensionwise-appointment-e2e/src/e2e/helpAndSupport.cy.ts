/* eslint-disable cypress/no-unnecessary-waiting */
describe('Help And Support', () => {
  const verifyElementIsDisplayed = (element: string) => {
    cy.get(element).scrollIntoView();
    cy.get(element).should('be.visible');
  };
  const waitForWebChat = 3000;

  it('displays webchat link within help and support section ', () => {
    const locales = {
      '/cy': ['Dechrau gwesgwrs', 'Cau gwesgwrs'],
    };

    for (const [url, linkText] of Object.entries(locales)) {
      // Intercept third party script
      cy.intercept('/genesys-bootstrap/*.js').as('script');
      cy.visit(`${url}/pension-wise-appointment`);

      cy.rejectCookies();
      cy.get('[data-testid="page-title"]').should('be.visible');
      cy.wait('@script').its('response.statusCode').should('eq', 200);

      // Book phone appointment
      const helpAndSupportTitle = '[id="help"] h5';
      const appointmentLink = '[id="help"] a';
      verifyElementIsDisplayed(helpAndSupportTitle);
      verifyElementIsDisplayed(appointmentLink);
      cy.checkLinkHref(appointmentLink);

      // Wait for thrid party webchat link to become active
      cy.wait(waitForWebChat);
      const webChatLink = '[data-testid="custom-web-chat-link"]';

      verifyElementIsDisplayed(webChatLink);

      // Start Webchat
      cy.get(webChatLink).should('contain.text', linkText[0]).click();
      cy.get(webChatLink).should('contain.text', linkText[1]);

      // Close Webchat
      cy.get(webChatLink).should('contain.text', linkText[1]).click();
      cy.get(webChatLink).should('contain.text', linkText[0]);
    }
  });
});
