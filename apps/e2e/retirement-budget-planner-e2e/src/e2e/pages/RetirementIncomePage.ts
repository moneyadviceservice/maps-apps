import { type Locator, Page } from '@playwright/test';

import {
  continueButtonText,
  personalPensionsDescription,
  personalPensionsTitle,
  retirementIncomeHeading,
} from '../data/retirement-income';
import { basePage } from './basePage';

interface RetirementIncomePage {
  waitForPageToBeReady(page: Page): Promise<void>;
  getAllAccordions(page: Page): Locator;
  getAllAccordionTitles(page: Page): Locator;
  getAccordionByTitle(page: Page, title: string): Locator;
  getAccordionContentByTitle(page: Page, title: string): Locator;
  openAccordionByTitle(
    page: Page,
    title: string,
    description?: string,
  ): Promise<Locator>;
  fillValuesAndContinue(page: Page, pensionValue: string): Promise<void>;
  fillPersonalPensionValueAndContinue(
    page: Page,
    testId: string,
    pensionValue: string,
  ): Promise<void>;
  fillAnyAccordion(
    page: Page,
    testId: string,
    value: string,
    title: string,
    description?: string,
  ): Promise<void>;
  clickAddPensionButton(
    page: Page,
    options: {
      type: 'definedContribution' | 'definedBenefit' | 'privatePension';
    },
  ): Promise<void>;
}

const retirementIncomePage: RetirementIncomePage = {
  /**
   * Wait for the page to be ready by waiting for the main heading to be visible
   *
   * @param page - Playwright page object
   * @returns Promise that resolves when the page is ready
   */
  async waitForPageToBeReady(page) {
    return await basePage.waitForPageHeading(page, retirementIncomeHeading);
  },

  /**
   * Get all accordion sections on the page
   *
   * @param page - Playwright page object
   * @returns Locator for all accordion sections
   */
  getAllAccordions(page) {
    return page.getByTestId('retirement-income-section');
  },

  /**
   * Get only the titles of all accordion sections on the page
   *
   * @param page - Playwright page object
   * @returns Locator for all accordion titles
   */
  getAllAccordionTitles(page) {
    return retirementIncomePage
      .getAllAccordions(page)
      .locator(page.getByTestId('summary-block-title').first());
  },

  /**
   * Get a specific accordion section by its title
   *
   * @param page - Playwright page object
   * @param title - Title of the accordion section to find
   * @returns Locator for the accordion section with the specified title
   */
  getAccordionByTitle(page, title) {
    return retirementIncomePage.getAllAccordions(page).filter({
      has: page.getByTestId('summary-block-title'),
      hasText: title,
    });
  },

  /**
   * Get the content of a specific accordion section by its title
   *
   * @param page – Playwright page object
   * @param title - Title of the accordion section to find
   * @returns Locator for the content of the accordion section with the specified title
   */
  getAccordionContentByTitle(page, title) {
    return retirementIncomePage
      .getAccordionByTitle(page, title)
      .getByTestId('retirement-income-section-content');
  },

  /**
   * Open a specific accordion section by clicking its summary title
   *
   * @param page - Playwright page object
   * @param title - Title of the accordion section to open
   * @param description - Description text to wait for after opening the accordion (optional)
   * @returns Promise that resolves to the locator for the opened accordion section
   */
  async openAccordionByTitle(page, title, description) {
    const accordion = retirementIncomePage.getAccordionByTitle(page, title);
    const isAccordionOpen = await accordion.evaluate(
      (el: HTMLDetailsElement) => el.open,
    );

    if (!isAccordionOpen) {
      await accordion.locator('summary').first().click();
    }

    await accordion.getByTestId('retirement-income-section-content').waitFor();

    if (description) {
      await accordion.getByText(description, { exact: false }).waitFor();
    }

    return accordion;
  },

  /**
   * Fill in the minimum required values and click the "Continue" button to
   * proceed to the next page.
   * Fills the state pension section, as it is first and is opened by default.
   *
   * @param page - Playwright page object
   * @param pensionValue - The pension value to fill in for the state pension input field
   * @returns Promise that resolves when the pension value has been filled in and the "Continue" button has been clicked
   */
  async fillValuesAndContinue(page, pensionValue): Promise<void> {
    await basePage.waitForPageHeading(page, retirementIncomeHeading);
    await basePage.fillInput(page, 'formstatePension', pensionValue);
    await basePage.clickButton(page, continueButtonText);
  },

  /**
   * Fill in the personal pension value and click the "Continue" button.
   *
   * @param page - Playwright page object
   * @param testId - The test ID of the personal pension input field to fill in
   * @param pensionValue - The pension value to fill in for the personal pension input field
   * @returns Promise that resolves when the pension value has been filled in and the "Continue" button has been clicked
   */
  async fillPersonalPensionValueAndContinue(
    page,
    testId,
    pensionValue,
  ): Promise<void> {
    await basePage.waitForPageHeading(page, retirementIncomeHeading);
    await retirementIncomePage.openAccordionByTitle(
      page,
      personalPensionsTitle,
      personalPensionsDescription,
    );
    await basePage.fillInputByTestId(page, testId, pensionValue);
    await basePage.clickButton(page, continueButtonText);
  },

  /**
   * Fill in a specified value in an input field within a specific accordion section, and click the "Continue" button.
   *
   * @param page - Playwright page object
   * @param testId - The test ID of the personal pension input field to fill in
   * @param pensionValue - The value to fill in for the input field
   * @param title - Title of the accordion section to open
   * @param description - Description text to wait for after opening the accordion (optional)
   */
  async fillAnyAccordion(
    page,
    testId,
    value,
    title,
    description,
  ): Promise<void> {
    await retirementIncomePage.waitForPageToBeReady(page);
    await retirementIncomePage.openAccordionByTitle(page, title, description);
    await basePage.fillInputByTestId(page, testId, value);
  },

  /**
   * Click on the "add pension" button for the specified pension type.
   * Note that the relevant accordion section must already be open.
   *
   * @param page - Playwright page object
   * @param options - Object containing the type of pension to add
   * @returns Promise that resolves when the "add pension" button has been clicked
   */
  async clickAddPensionButton(page, options) {
    const { type } = options;
    const addPensionButtonTestID = `add-${type}-button`;

    await page.getByTestId(addPensionButtonTestID).click();
  },
};

export default retirementIncomePage;
