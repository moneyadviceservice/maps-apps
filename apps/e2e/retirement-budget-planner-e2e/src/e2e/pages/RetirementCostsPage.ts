import { Page } from '@playwright/test';

import { basePage } from './basePage';

interface RetirementCostsPage {
  fillValuesAndContinue(page: Page, mortgageRepayment: string): Promise<void>;
}

const heading = 'Retirement costs';

const retirementCostsPage: RetirementCostsPage = {
  async fillValuesAndContinue(page, mortgageRepayment): Promise<void> {
    await basePage.assertHeading(page, heading);
    await basePage.fillInput(page, 'formmortgageRepayment', mortgageRepayment);
    await basePage.clickButton(page, 'Continue');
  },
};

export default retirementCostsPage;
