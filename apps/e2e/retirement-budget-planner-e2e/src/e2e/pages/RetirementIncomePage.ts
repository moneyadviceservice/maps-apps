import { type Locator, Page } from '@playwright/test';

import {
  personalPensionsDescription,
  personalPensionsTitle,
  retirementIncomeHeading,
  retirementIncomeHeadingCy,
} from '../data/retirement-income';
import { basePage } from './basePage';

interface RetirementIncomePage {
  pageHeading(page: Page, options?: { language: 'en' | 'cy' }): Locator;
  waitForPageToBeReady(
    page: Page,
    options?: { language: 'en' | 'cy' },
  ): Promise<void>;
  getAllAccordions(page: Page): Locator;
  getAllAccordionTitles(page: Page): Locator;
  getAccordionByTitle(page: Page, title: string): Locator;
  getAccordionContentByTitle(page: Page, title: string): Locator;
  openAccordionByTitle(
    page: Page,
    title: string,
    description?: string,
  ): Promise<Locator>;
  fillValuesAndContinue(
    page: Page,
    pensionValue?: string,
    frequencyValue?:
      | 'day'
      | 'week'
      | 'twoweeks'
      | 'fourweeks'
      | 'month'
      | 'quarter'
      | 'sixmonths'
      | 'year',
    options?: {
      continueWithKeyboard?: boolean;
    },
  ): Promise<void>;
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
  getInputSectionByLegend(page: Page, legendText: string): Locator;
  openMoreInformationByLegend(page: Page, legendText: string): Promise<Locator>;
  statePensionInput(page: Page): Locator;
}

const retirementIncomePage: RetirementIncomePage = {
  pageHeading(page, options) {
    const { language = 'en' } = { ...options };
    const headingText =
      language === 'cy' ? retirementIncomeHeadingCy : retirementIncomeHeading;
    return page.getByRole('heading', { level: 1, name: headingText });
  },

  /**
   * Wait for the page to be ready by waiting for the main heading to be visible
   *
   * @param page - Playwright page object
   * @returns Promise that resolves when the page is ready
   */
  async waitForPageToBeReady(page, options) {
    return this.pageHeading(page, options).waitFor();
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
   * @param frequencyValue - The frequency value to fill in for the state pension input field
   * @param options Options object (optional)
   * @param options.continueWithKeyboard Use keyboard to submit form instead of button click (optional)
   * @returns Promise that resolves when the pension value has been filled in and the "Continue" button has been clicked
   */
  async fillValuesAndContinue(
    page,
    pensionValue = '965.20', // £241.30 per week * 4 weeks
    frequencyValue,
    options = undefined,
  ): Promise<void> {
    const { continueWithKeyboard = false } = { ...options };

    await basePage.waitForPageHeading(page, retirementIncomeHeading);
    await basePage.fillInput(page, 'formstatePension', pensionValue);

    if (frequencyValue) {
      await basePage.selectOption(
        page,
        'formstatePensionFrequency',
        frequencyValue,
      );
    }

    if (continueWithKeyboard) {
      await retirementIncomePage.statePensionInput(page).press('Enter');
    } else {
      await basePage.continueButton(page).click();
    }
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
    await basePage.continueButton(page).click();
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

  /**
   * Get the input section wrapper for a field by its legend text.
   * This scopes interactions to the specific field group and avoids brittle class-based selectors in tests.
   */
  getInputSectionByLegend(page, legendText) {
    const fieldset = page
      .locator('fieldset')
      .filter({
        has: page.locator('legend', { hasText: legendText }),
      })
      .first();

    return fieldset
      .locator(
        'xpath=ancestor::div[contains(@class,"max-w")][1]/following-sibling::details[@data-testid="expandable-section"][1]',
      )
      .first();
  },

  async openMoreInformationByLegend(page, legendText) {
    const section = retirementIncomePage.getInputSectionByLegend(
      page,
      legendText,
    );
    await section.getByText('More information', { exact: true }).click();
    return section;
  },

  /**
   * Get the state pension input field (first/primary input field)
   *
   * @param page - Playwright page object
   * @returns Locator for state pension input field
   */
  statePensionInput(page) {
    return page.getByTestId('formstatePensionId');
  },
};

export default retirementIncomePage;
