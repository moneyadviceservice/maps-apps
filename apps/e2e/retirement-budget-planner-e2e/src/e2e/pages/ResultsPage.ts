import { Locator, Page } from '@playwright/test';

interface ResultsPage {
  heading(page: Page): Locator;
  verifyNavigationLink(
    page: Page,
    navLink: string,
    pageHeading: string,
  ): Promise<boolean>;
  navigateBackToResults(page: Page): Promise<void>;
  getAccordionState(page: Page, index: number): Promise<boolean>;
  toggleAccordion(page: Page, index: number): Promise<void>;
  isAccordionContentVisible(
    page: Page,
    index: number,
    text: string,
  ): Promise<boolean>;
  getAccordionSummaryText(page: Page, index: number): Promise<string>;
  getAccordionContentText(page: Page, index: number): Promise<string>;
  getRetirementPlanningChecklistHeader(page: Page): Promise<Locator>;
  getOtherToolsHeader(page: Page): Promise<Locator>;
  getTeaserCards(page: Page): Promise<Locator>;
  getTeaserCardTitle(card: Locator): Promise<string>;
  getFeedbackHeading(page: Page): Promise<Locator>;
  getFeedbackButtons(page: Page, feedbackButton: string): Promise<Locator>;
  getReportProblemButton(page: Page): Promise<Locator>;
  getShareCalculatorText(page: Page): Promise<Locator>;
  getshareLink(page: Page, shareLink: string): Promise<Locator>;
}

const resultsPage: ResultsPage = {
  heading: (page) => {
    return page.locator('h1');
  },

  async verifyNavigationLink(page, navTab, pageHeading) {
    await page.getByTestId(navTab).waitFor({ state: 'visible' });
    await page.getByTestId(navTab).click();
    await page.waitForLoadState('load');
    const heading = page.locator('h1', { hasText: pageHeading });
    await heading.waitFor({ state: 'visible', timeout: 5000 });
    return true;
  },

  async navigateBackToResults(page) {
    await page.getByTestId('summary').waitFor({ state: 'visible' });
    await page.getByTestId('summary').click();
    await page.waitForLoadState('load');
    const heading = page.locator('h1', { hasText: 'Your results' });
    await heading.waitFor({ state: 'visible', timeout: 5000 });
  },

  async getRetirementPlanningChecklistHeader(page: Page) {
    return page.locator('h2', {
      hasText: 'Retirement planning checklist',
    });
  },

  async getAccordionState(page: Page, index: number) {
    const accordion = page.getByTestId('expandable-section').nth(index);
    const isOpen = (await accordion.getAttribute('open')) !== null;
    return isOpen;
  },

  async toggleAccordion(page: Page, index: number) {
    const accordion = page.getByTestId('expandable-section').nth(index);
    await accordion.locator('summary').click();
  },

  async isAccordionContentVisible(page: Page, index: number, text: string) {
    const accordion = page.getByTestId('expandable-section').nth(index);
    const content = accordion
      .getByTestId('paragraph')
      .filter({ hasText: text })
      .first();
    await content.waitFor({ state: 'visible', timeout: 3000 });
    return await content.isVisible();
  },

  async getAccordionSummaryText(page: Page, index: number): Promise<string> {
    const accordion = page.getByTestId('expandable-section').nth(index);
    return await accordion.getByTestId('summary-block-title').innerText();
  },

  async getAccordionContentText(page: Page, index: number): Promise<string> {
    const accordion = page.getByTestId('expandable-section').nth(index);
    const contentContainer = accordion.locator('div').nth(1);
    const text = await contentContainer.innerText();
    return text?.replaceAll(/\s+/g, ' ').trim() || '';
  },

  async getOtherToolsHeader(page: Page): Promise<Locator> {
    return page.locator('h2', { hasText: 'Other tools to try' });
  },

  async getTeaserCards(page: Page): Promise<Locator> {
    return page.getByTestId('teaserCard');
  },

  async getTeaserCardTitle(card: Locator): Promise<string> {
    return await card.locator('h3').innerText();
  },

  async getFeedbackHeading(page: Page): Promise<Locator> {
    return page.locator('.izHeader', {
      hasText: 'Was this tool useful? [DEV]',
    });
  },

  async getFeedbackButtons(page, feedbackButton): Promise<Locator> {
    return page.getByRole('button', { name: `${feedbackButton}` });
  },
  async getReportProblemButton(page: Page): Promise<Locator> {
    return page.locator('.izButtonText');
  },
  async getShareCalculatorText(page: Page): Promise<Locator> {
    return page.getByTestId('share-tool-title');
  },
  async getshareLink(page: Page, shareLink: string): Promise<Locator> {
    return page.locator(`a[title="${shareLink}"]`);
  },
};

export default resultsPage;
