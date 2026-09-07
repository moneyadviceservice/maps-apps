import type { Locator, Page } from '@playwright/test';

import { retirementCostsHeading } from '../data/retirement-costs';
import { basePage } from './basePage';

interface RetirementCostsPage {
  waitForPageToBeReady(page: Page): Promise<void>;
  fillValuesAndContinue(
    page: Page,
    value?: string,
    fieldTestId?: string,
    options?: {
      continueWithKeyboard?: boolean;
    },
  ): Promise<void>;
  getAccordionByTitle(page: Page, title: string): Locator;
  getAccordionSummaryByTitle(page: Page, title: string): Locator;
  clickAccordionSummary(page: Page, title: string): Promise<void>;
  fillAnyAccordion(
    page: Page,
    testId: string,
    value: string,
    title: string,
  ): Promise<void>;
  RetirementCostsIntroTextLocator(page: Page): Locator;
  verifyRetirementCostsIntroText(page: Page): Promise<string | undefined>;
  waitForRetirementCostsIntroText(page: Page): Promise<void>;
  verifyRentAndCareHomeFeesLabel(page: Page): Promise<string | undefined>;
  getFirstBorrowingFieldHeading(page: Page): Locator;
  openHouseholdBillsSection(page: Page): Promise<void>;
  getHouseholdBillsLabels(page: Page): Promise<string[]>;
  openOtherEssentialOutgoingsSection(page: Page): Promise<void>;
  getNameOfCostPlaceholders(page: Page): Promise<string[]>;
  closeHousingSection(page: Page): Promise<void>;
  getSectionHeadings(page: Page): Promise<string[]>;
  clickContinue(page: Page): Promise<void>;
  getErrorSummaryHeading(page: Page): Promise<string>;
  getErrorSummaryBody(page: Page): Promise<string>;
  verifyOtherEssentialOutgoingsIntroText(
    page: Page,
  ): Promise<string | undefined>;
  OtherEssentialOutgoingsIntroTextLocator(page: Page): Locator;
  getInputSectionByLegend(page: Page, legendText: string): Locator;
  openMoreInformationByLegend(page: Page, legendText: string): Promise<Locator>;
  mortgageRepaymentInput(page: Page): Locator;
}

const retirementCostsPage: RetirementCostsPage = {
  /**
   * Wait for the page to be ready by waiting for the main heading to be visible
   *
   * @param page - Playwright page object
   * @returns Promise that resolves when the page is ready
   */
  async waitForPageToBeReady(page) {
    return await basePage.waitForPageHeading(page, retirementCostsHeading);
  },

  async fillValuesAndContinue(
    page,
    value = '500',
    fieldTestId = 'formmortgageRepaymentId',
    options = undefined,
  ) {
    const { continueWithKeyboard = false } = { ...options };

    await basePage.waitForPageHeading(page, retirementCostsHeading);
    await basePage.fillInputByTestId(page, fieldTestId, value);

    if (continueWithKeyboard) {
      await retirementCostsPage.mortgageRepaymentInput(page).press('Enter');
    } else {
      await basePage.continueButton(page).click();
    }
  },
  getAccordionByTitle(page, title) {
    return page
      .getByTestId('expandable-section')
      .filter({
        has: page.getByTestId('summary-block-title'),
        hasText: title,
      })
      .first();
  },
  getAccordionSummaryByTitle(page, title) {
    return retirementCostsPage
      .getAccordionByTitle(page, title)
      .locator('summary', { hasText: title });
  },
  async clickAccordionSummary(page, title) {
    const accordion = retirementCostsPage.getAccordionByTitle(page, title);
    const isOpen = await accordion.evaluate(
      (el: HTMLDetailsElement) => el.open,
    );
    if (!isOpen) {
      await accordion.locator('summary').filter({ hasText: title }).click();
    }
  },
  async fillAnyAccordion(page, testId, value, title) {
    await basePage.waitForPageHeading(page, retirementCostsHeading);
    await retirementCostsPage.clickAccordionSummary(page, title);
    await basePage.fillInputByTestId(page, testId, value);
  },

  RetirementCostsIntroTextLocator(page: Page) {
    return page.getByTestId('paragraph');
  },
  async verifyRetirementCostsIntroText(page: Page) {
    const paragraph = this.RetirementCostsIntroTextLocator(page).nth(0);
    return (await paragraph.textContent())?.trim();
  },

  async waitForRetirementCostsIntroText(page: Page) {
    await page
      .getByText(
        /Enter all the essential expenses you expect to pay after you retire/i,
      )
      .waitFor();
  },

  getFirstBorrowingFieldHeading(page: Page) {
    return retirementCostsPage
      .getAccordionByTitle(page, 'Borrowing')
      .locator('legend')
      .first();
  },

  async verifyRentAndCareHomeFeesLabel(page: Page) {
    const label = page.locator('legend', {
      hasText: 'Rent or care home fees',
    });
    const text = await label.textContent();
    return text?.trim();
  },

  async openHouseholdBillsSection(page: Page) {
    await page
      .getByTestId('summary-block-title')
      .filter({ hasText: 'Household bills' })
      .click();
  },

  async getHouseholdBillsLabels(page: Page): Promise<string[]> {
    const accordion = retirementCostsPage.getAccordionByTitle(
      page,
      'Household bills',
    );
    const labels = accordion.locator('legend');
    const count = await labels.count();

    const results: string[] = [];

    for (let i = 0; i < count; i++) {
      const text = await labels.nth(i).textContent();
      results.push(text?.trim() || '');
    }

    return results;
  },

  async openOtherEssentialOutgoingsSection(page: Page) {
    await page
      .locator('summary', { hasText: 'Other essential outgoings' })
      .click();
  },

  OtherEssentialOutgoingsIntroTextLocator(page: Page) {
    return page.getByTestId('paragraph');
  },

  async verifyOtherEssentialOutgoingsIntroText(page: Page) {
    const paragraph = this.OtherEssentialOutgoingsIntroTextLocator(page).nth(1);
    return (await paragraph.textContent())?.trim();
  },
  async getNameOfCostPlaceholders(page: Page): Promise<string[]> {
    await page.getByPlaceholder('Name of cost').first().waitFor();

    const fields = page.getByPlaceholder('Name of cost');
    const count = await fields.count();

    const results: string[] = [];

    for (let i = 0; i < count; i++) {
      const placeholder = await fields.nth(i).getAttribute('placeholder');
      results.push(placeholder || '');
    }

    return results;
  },

  async getSectionHeadings(page: Page): Promise<string[]> {
    // Scope to only top-level expandable sections, excluding nested
    // "More information" accordions that appear when sections are expanded.
    const topLevelSections = page.locator(
      '[data-testid="expandable-section"] > summary > div[data-testid="summary-block-title"]',
    );
    const count = await topLevelSections.count();
    const results: string[] = [];

    for (let i = 0; i < count; i++) {
      const text = (await topLevelSections.nth(i).innerText()).trim();
      if (text) {
        results.push(text);
      }
    }

    return results;
  },

  async closeHousingSection(page: Page) {
    await page.locator('summary', { hasText: 'Housing' }).click();
  },

  async clickContinue(page: Page): Promise<void> {
    await basePage.continueButton(page).click();
  },

  async getErrorSummaryHeading(page: Page): Promise<string> {
    return page.locator('#error-summary-heading').innerText();
  },

  async getErrorSummaryBody(page: Page): Promise<string> {
    return page.locator('[data-testid="error-link-0"]').innerText();
  },

  /**
   * Get the input section wrapper for a field by its legend text.
   * This gives tests a stable way to interact with nested "More information" accordions.
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
    const section = retirementCostsPage.getInputSectionByLegend(
      page,
      legendText,
    );
    await section.getByText('More information', { exact: true }).click();
    return section;
  },

  /**
   * Get the mortgage repayment input field (first/primary input field)
   *
   * @param page - Playwright page object
   * @returns Locator for mortgage repayment input field
   */
  mortgageRepaymentInput(page) {
    return page.getByTestId('formmortgageRepaymentId');
  },
};

export default retirementCostsPage;
