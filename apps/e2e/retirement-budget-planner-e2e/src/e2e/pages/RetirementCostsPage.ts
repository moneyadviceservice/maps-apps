import type { Locator, Page } from '@playwright/test';

import { basePage } from './basePage';

interface RetirementCostsPage {
  fillValuesAndContinue(
    page: Page,
    value: string,
    fieldTestId: string,
  ): Promise<void>;
  getAccordionByTitle(page: Page, title: string): Promise<Locator>;
  clickAccordionSummary(page: Page, title: string): Promise<void>;
  fillAnyAccordion(
    page: Page,
    testId: string,
    value: string,
    title: string,
  ): Promise<void>;
}

const heading = 'Retirement costs';

const retirementCostsPage: RetirementCostsPage = {
  async fillValuesAndContinue(page, value, fieldTestId) {
    await basePage.waitForPageHeading(page, heading);
    await basePage.fillInputByTestId(page, fieldTestId, value);
    await basePage.clickButton(page, 'Continue');
  },
  async getAccordionByTitle(page: Page, title: string) {
    return page.getByTestId('expandable-section').filter({
      has: page.getByTestId('summary-block-title'),
      hasText: title,
    });
  },
  async clickAccordionSummary(page, title) {
    const accordion = await retirementCostsPage.getAccordionByTitle(
      page,
      title,
    );
    const isOpen = await accordion.evaluate(
      (el: HTMLDetailsElement) => el.open,
    );
    if (!isOpen) {
      await accordion.locator('summary').filter({ hasText: title }).click();
    }
  },
  async fillAnyAccordion(page, testId, value, title) {
    await basePage.waitForPageHeading(page, heading);
    await retirementCostsPage.clickAccordionSummary(page, title);
    await basePage.fillInputByTestId(page, testId, value);
  },
};

export default retirementCostsPage;
