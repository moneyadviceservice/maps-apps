import { Page } from '@playwright/test';

import { basePage } from './basePage';

interface HomePage {
  startRetirementBudgetPlanner(page: Page): Promise<void>;
  handleCookies(page: Page): Promise<void>;
}

const pageHeading = 'Retirement budget planner';
const startButtonText = 'Start Retirement Budget Planner';

const homePage: HomePage = {
  async startRetirementBudgetPlanner(page: Page): Promise<void> {
    await page.goto('/');
    await basePage.assertHeading(page, pageHeading);
    await page.getByText(startButtonText).first().click();
  },
  async handleCookies(page) {
    await page
      .getByRole('button', { name: 'Accept all cookies' })
      .click({ timeout: 10000 })
      .catch(() => {
        console.log('Cookie banner not found');
      });
  },
};

export default homePage;
