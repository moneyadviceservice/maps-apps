import { BrowserContext, Locator, Page } from '@playwright/test';

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
  getCalloutComponent(
    page: Page,
    calloutTestId: string,
    titleTestId: string,
  ): Promise<{
    root: Locator;
    title: Locator;
    paragraph1: Locator;
    paragraph2: Locator;
  }>;
  getRetirementPlanningChecklistHeader(page: Page): Locator;
  getOtherToolsHeader(page: Page): Promise<Locator>;
  getTeaserCards(page: Page): Promise<Locator>;
  getTeaserCardTitle(card: Locator): Promise<string>;
  getFeedbackHeading(page: Page): Promise<Locator>;
  getShareCalculatorText(page: Page): Locator;
  getShareLink(page: Page, shareLink: string): Locator;
  getEmailLinkHref(page: Page): Promise<string | null>;
  getByTestId(page: Page, testId: string): Promise<string>;
  clickSocialShare(
    page: Page,
    context: BrowserContext,
    socialMedia: string,
  ): Promise<Page>;
  closeSocialMediaTab(tab: Page): Promise<void>;
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

  getRetirementPlanningChecklistHeader(page: Page) {
    return page.getByRole('heading', {
      name: 'Retirement planning checklist',
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
    const locator = page
      .locator('.izHeader', {
        hasText: /Was this tool useful\?/,
      })
      .first();
    await locator.waitFor({ state: 'visible', timeout: 15000 });
    return locator;
  },

  getShareCalculatorText(page) {
    return page.getByTestId('share-tool-title');
  },
  getShareLink(page, shareLink) {
    return page.locator(`a[title="${shareLink}"]`);
  },
  async getEmailLinkHref(page) {
    const shareEmailLink = this.getShareLink(page, 'email');
    return await shareEmailLink.getAttribute('href');
  },

  async clickSocialShare(page, context, socialMedia) {
    const pagePromise = context.waitForEvent('page');
    const shareSocialLink = this.getShareLink(page, socialMedia);
    await shareSocialLink.click();
    const newTab = await pagePromise;
    await newTab.waitForLoadState();
    return newTab;
  },

  async closeSocialMediaTab(tab): Promise<void> {
    await tab.close();
  },
  async getByTestId(page: Page, testId: string): Promise<string> {
    return await page.getByTestId(testId).innerText();
  },
  async getCalloutComponent(
    page: Page,
    calloutTestId: string,
    titleTestId: string,
  ) {
    const root = page
      .getByTestId(calloutTestId)
      .filter({ has: page.getByTestId(titleTestId) })
      .first();
    await root.waitFor({ state: 'visible', timeout: 5000 });
    const title = root.getByTestId(titleTestId);
    const paragraph1 = root.getByTestId('paragraph').first();
    const paragraph2 = root.getByTestId('paragraph').nth(1);
    return { root, title, paragraph1, paragraph2 };
  },
};

export default resultsPage;
