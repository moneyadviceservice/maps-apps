import { Page } from '@playwright/test';

import {
  continueButtonText,
  personalPensionDescription,
  personalPensionTitle,
} from '../data/retirement-income';
import { basePage } from './basePage';

interface RetirementIncomePage {
  getAccordionByTitle(page: Page, title: string): Promise<any>;
  clickAccordionSummary(page: Page, title: string): Promise<void>;
  fillValuesAndContinue(page: Page, pensionValue: string): Promise<void>;
  fillPersonalPensionValueAndContinue(
    page: Page,
    testId: string,
    pensionValue: string,
  ): Promise<void>;
}

const heading = 'Retirement income';

const retirementIncomePage: RetirementIncomePage = {
  async getAccordionByTitle(page: Page, title: string) {
    return page.getByTestId('expandable-section').filter({
      has: page.getByTestId('summary-block-title'),
      hasText: title,
    });
  },
  async clickAccordionSummary(page: Page, title: string) {
    const accordion = await retirementIncomePage.getAccordionByTitle(
      page,
      title,
    );

    if (!(await accordion.getAttribute('open'))) {
      await accordion.locator('summary').click();
    }

    accordion
      .getByTestId('paragraph')
      .filter({ hasText: personalPensionDescription })
      .waitFor();
  },

  async fillValuesAndContinue(page, pensionValue): Promise<void> {
    await basePage.waitForPageHeading(page, heading);
    await basePage.fillInput(page, 'formstatePension', pensionValue);
    await basePage.clickButton(page, continueButtonText);
  },
  async fillPersonalPensionValueAndContinue(
    page,
    testId,
    pensionValue,
  ): Promise<void> {
    await basePage.waitForPageHeading(page, heading);
    await retirementIncomePage.clickAccordionSummary(
      page,
      personalPensionTitle,
    );

    await basePage.fillInputByTestId(page, testId, pensionValue);

    await basePage.clickButton(page, continueButtonText);
  },
};

export default retirementIncomePage;
