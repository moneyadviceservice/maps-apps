import type { Locator, Page } from '@playwright/test';

import { landingPage as landingPageData } from '../data/landing';
import { basePage } from './basePage';

interface LandingPage {
  // Components
  headingComponent(page: Page): Locator;
  howRbpWorksComponent(page: Page): Locator;
  calloutComponent(page: Page): Locator;
  // Heading component
  heading(page: Page): Locator;
  subHeadingIntro(page: Page): Locator;
  timeEstimate(page: Page): Locator;
  startButtons(page: Page): Locator;
  // How RBP works component
  howRbpWorksHeadings(page: Page): Locator;
  howRbpWorksTextItems(page: Page): Locator;
  howRbpWorksListItems(page: Page): Locator;
  checkStatePensionLink(page: Page): Locator;
  // Callout component
  calloutHeading(page: Page): Locator;
  calloutIntroText(page: Page): Locator;
  calloutListItems(page: Page): Locator;
  calloutOutroText(page: Page): Locator;
  webchatLink(page: Page): Locator;
  insideUkPhoneLink(page: Page): Locator;
  outsideUkPhoneLink(page: Page): Locator;
  contactFormLink(page: Page): Locator;
  // Actions
  waitForPageToBeReady(page: Page): Promise<void>;
  clickStartButton(page: Page): Promise<void>;
}

const landingPage: LandingPage = {
  /**
   * Get the heading component of the page
   *
   * @param page - Playwright page object
   * @returns Heading component locator
   */
  headingComponent(page) {
    return page.getByTestId(landingPageData.headingTestId);
  },

  /**
   * Get the how RBP works component of the page
   *
   * @param page - Playwright page object
   * @returns How RBP works component locator
   */
  howRbpWorksComponent(page) {
    return page.getByTestId(landingPageData.howRbpWorksTestId);
  },

  /**
   * Get the callout component of the page
   *
   * @param page - Playwright page object
   * @returns Callout component locator
   */
  calloutComponent(page) {
    return page.getByTestId(landingPageData.calloutTestId);
  },

  /**
   * Get the main page heading
   *
   * @param page - Playwright page object
   * @returns Main page heading locator
   */
  heading(page) {
    return page.locator('h1', {
      hasText: landingPageData.heading,
    });
  },

  /**
   * Get the subheading intro text
   *
   * @param page - Playwright page object
   * @returns Subheading intro text locator
   */
  subHeadingIntro(page) {
    return page.getByText(landingPageData.subHeadingIntro);
  },

  /**
   * Get the time estimate text
   *
   * @param page - Playwright page object
   * @returns Time estimate text locator
   */
  timeEstimate(page) {
    return page.getByText(landingPageData.timeEstimate);
  },

  /**
   * Get the start button(s)
   *
   * @param page - Playwright page object
   * @returns Start button locator
   */
  startButtons(page) {
    return page.getByRole('link', { name: landingPageData.startButton });
  },

  /**
   * Get the how RBP works headings
   *
   * @param page - Playwright page object
   * @returns How RBP works headings locator
   */
  howRbpWorksHeadings(page) {
    return landingPage.howRbpWorksComponent(page).getByRole('heading');
  },

  /**
   * Get the text items of the how RBP works component
   *
   * @param page - Playwright page object
   * @returns How RBP works text items locator
   */
  howRbpWorksTextItems(page) {
    return landingPage.howRbpWorksComponent(page).getByRole('paragraph');
  },

  /**
   * Get the list items of the how RBP works component
   *
   * @param page - Playwright page object
   * @returns How RBP works list items locator
   */
  howRbpWorksListItems(page) {
    return landingPage.howRbpWorksComponent(page).getByRole('listitem');
  },

  /**
   * Get the check state pension link of the how RBP works component
   *
   * @param page - Playwright page object
   * @returns Check state pension link locator
   */
  checkStatePensionLink(page) {
    return landingPage.howRbpWorksComponent(page).getByRole('link', {
      name: landingPageData.checkStatePensionLink.text,
    });
  },

  /**
   * Get the heading of the callout component
   *
   * @param page - Playwright page object
   * @returns Callout heading locator
   */
  calloutHeading(page) {
    return page.getByRole('heading', { name: landingPageData.calloutHeading });
  },

  /**
   * Get the intro text of the callout component
   *
   * @param page - Playwright page object
   * @returns Callout intro text locator
   */
  calloutIntroText(page) {
    return page.getByText(landingPageData.calloutIntroText);
  },

  /**
   * Get the list items of the callout component
   *
   * @param page - Playwright page object
   * @returns Callout list items locator
   */
  calloutListItems(page) {
    return landingPage.calloutComponent(page).getByRole('listitem');
  },

  /**
   * Get the outro text of the callout component
   *
   * @param page - Playwright page object
   * @returns Callout outro text locator
   */
  calloutOutroText(page) {
    return page.getByText(landingPageData.calloutOutroText);
  },

  /**
   * Get the webchat link of the callout component
   *
   * @param page - Playwright page object
   * @returns Webchat link locator
   */
  webchatLink(page) {
    return page.getByRole('link', { name: landingPageData.webchatLink.text });
  },

  /**
   * Get the inside UK phone number link of the callout component
   *
   * @param page - Playwright page object
   * @returns Inside UK phone number link locator
   */
  insideUkPhoneLink(page) {
    return page.getByRole('link', {
      name: landingPageData.insideUkPhoneLink.text,
    });
  },

  /**
   * Get the outside UK phone number link of the callout component
   *
   * @param page - Playwright page object
   * @returns Outside UK phone number link locator
   */
  outsideUkPhoneLink(page) {
    return page.getByRole('link', {
      name: landingPageData.outsideUkPhoneLink.text,
    });
  },

  /**
   * Get the contact form link of the callout component
   *
   * @param page - Playwright page object
   * @returns Contact form link locator
   */
  contactFormLink(page) {
    return page.getByRole('link', {
      name: landingPageData.contactFormLink.text,
    });
  },

  /**
   * Wait for the page to be ready by waiting for the main heading to be visible
   *
   * @param page - Playwright page object
   * @returns Promise that resolves when the page is ready
   */
  async waitForPageToBeReady(page) {
    return await basePage.waitForPageHeading(page, landingPageData.heading);
  },

  /**
   * Click the first start button on the landing page
   *
   * @param page - Playwright page object
   */
  async clickStartButton(page) {
    await landingPage.startButtons(page).first().click();
  },
};

export default landingPage;
