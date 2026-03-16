import { Page } from '@playwright/test';

import { basePage } from './basePage';

interface RetirementIncomePage {
  fillValuesAndContinue(page: Page, pensionValue: string): Promise<void>;
}

const heading = 'Retirement income';

const retirementIncomePage: RetirementIncomePage = {
  async fillValuesAndContinue(page, pensionValue): Promise<void> {
    await basePage.assertHeading(page, heading);
    await basePage.fillInput(page, 'formprivatePension', pensionValue);
    await basePage.clickButton(page, 'Continue');
  },
};

export default retirementIncomePage;
