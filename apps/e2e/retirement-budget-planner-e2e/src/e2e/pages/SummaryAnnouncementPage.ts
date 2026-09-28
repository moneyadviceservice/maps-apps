import { Locator, Page } from '@playwright/test';

interface SummaryAnnouncementPage {
  summaryAnnouncement(page: Page): Locator;
  summaryDescription(page: Page): Locator;
  incomeValue(page: Page): Locator;
  costsValue(page: Page): Locator;
  balanceValue(page: Page): Locator;
  incomeSummaryRow(page: Page): Locator;
  costsSummaryRow(page: Page): Locator;
  balanceSummaryRow(page: Page): Locator;
  getIncomeValueText(page: Page): Promise<string>;
  getCostsValueText(page: Page): Promise<string>;
  getBalanceValueText(page: Page): Promise<string>;
  getSummaryAnnouncementText(page: Page): Promise<string>;
}

const getText = async (locator: Locator): Promise<string> =>
  (await locator.textContent())?.trim() ?? '';

const summaryAnnouncementPage: SummaryAnnouncementPage = {
  summaryAnnouncement(page) {
    return page.getByTestId('summary-announcement');
  },

  summaryDescription(page) {
    return page.locator('#summary-total-description');
  },

  incomeValue(page) {
    return page.getByTestId('t-summary-value-retirement-income');
  },

  costsValue(page) {
    return page.getByTestId('t-summary-value-retirement-costs');
  },

  balanceValue(page) {
    return page.getByTestId('t-summary-value-balance');
  },

  incomeSummaryRow(page) {
    return page.locator('[aria-label^="Retirement income £"]').first();
  },

  costsSummaryRow(page) {
    return page.locator('[aria-label^="Retirement costs £"]').first();
  },

  balanceSummaryRow(page) {
    return page.locator('[aria-label^="Balance "]').first();
  },

  async getIncomeValueText(page) {
    return getText(summaryAnnouncementPage.incomeValue(page));
  },

  async getCostsValueText(page) {
    return getText(summaryAnnouncementPage.costsValue(page));
  },

  async getBalanceValueText(page) {
    return getText(summaryAnnouncementPage.balanceValue(page));
  },

  async getSummaryAnnouncementText(page) {
    return getText(summaryAnnouncementPage.summaryAnnouncement(page));
  },
};

export default summaryAnnouncementPage;
