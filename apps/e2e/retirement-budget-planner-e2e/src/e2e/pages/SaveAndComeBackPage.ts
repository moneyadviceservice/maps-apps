import { Locator, Page } from '@playwright/test';

const pageHeading = 'Save and come back later';

interface SaveAndComeBackPage {
  waitForPageToBeReady(page: Page): Promise<void>;
  heading(page: Page): Locator;
  retirementIncomeValidationError(page: Page): Locator;
}

const saveAndComeBackPage: SaveAndComeBackPage = {
  async waitForPageToBeReady(page) {
    await page.waitForURL(/\/save(?:\?|$)/);
    await saveAndComeBackPage.heading(page).waitFor();
  },

  heading(page) {
    return page.getByRole('heading', { level: 1, name: pageHeading });
  },

  retirementIncomeValidationError(page) {
    return page.getByText(
      'We need more information to calculate your retirement budget.',
    );
  },
};

export default saveAndComeBackPage;
