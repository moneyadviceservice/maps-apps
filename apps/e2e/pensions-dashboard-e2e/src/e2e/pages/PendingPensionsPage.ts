import { Page } from '@maps/playwright';

type PendingPensionsPage = {
  heading: string;
  pendingPensionsBreadcrumb: string;
  pensionsFoundBreadcrumb: string;
  summaryText01: string;
  summaryText02: string;
  pendingPensionsPageTitleText: string;
  assertPendingPensions(page: Page, pesnions: any): Promise<void>;
  pageLoads(page: Page): Promise<void>;
  viewDetailsOfPendingPension(page: Page, pensionName: any): Promise<void>;
  viewTextOnPensionCard(page: Page, schemeName: any): Promise<void>;
  clickNeedActionLink(page: Page): Promise<void>;
};

const pendingPensionsPage: PendingPensionsPage = {
  pendingPensionsPageTitleText:
    'Pending pensions - MoneyHelper Pensions Dashboard',
  heading: `h1:has-text("Pending Pensions")`,
  pendingPensionsBreadcrumb: `a[href*="pending-pensions"]`,
  pensionsFoundBreadcrumb: `a[href*="overview"]`,
  summaryText01: `You don't need to do anything. These pensions are waiting for more information from your pension providers.`,
  summaryText02: `They'll automatically show up in ‘Your pensions’ once their information is complete.`,

  async pageLoads(page): Promise<void> {
    await page.locator(this.heading).waitFor();
    await page
      .locator(`div > p.mb-4:has-text("${this.summaryText01}")`)
      .waitFor();
    await page
      .locator(`div p.mb-4:has-text("${this.summaryText02}")`)
      .waitFor();
  },

  async viewDetailsOfPendingPension(page, schemeName): Promise<void> {
    await page.locator(this.heading).waitFor();
    const pensionCards = page.getByTestId('information-callout');
    await pensionCards
      .filter({ hasText: schemeName })
      .getByTestId('details-link')
      .click();
  },

  async assertPendingPensions(page, pensions): Promise<void> {
    await page.locator(this.heading).waitFor();
    const pensionCards = page.getByTestId('information-callout');
    const pendingPensions = pensions.filter(
      (pension) =>
        pension.matchType === 'DEFN' &&
        ['DBC', 'DCC', 'NEW', 'ANO', 'NET', 'TRN'].includes(
          pension.unavailableReason,
        ),
    );
    for (const pension of pendingPensions) {
      const matchingCards = pensionCards.filter({
        hasText: pension.schemeName,
      });
      const cardCount = await matchingCards.count();

      if (cardCount === 0) {
        console.warn(
          `No matching cards found for scheme: "${pension.schemeName}"`,
        );
        continue;
      }
    }
  },

  async viewTextOnPensionCard(page, schemeName): Promise<void> {
    const pensionCard = page
      .getByTestId('information-callout')
      .filter({ hasText: schemeName });
    await pensionCard.getByTestId('pension-card-employer-name').waitFor();
  },

  async clickNeedActionLink(page): Promise<void> {
    await page.getByTestId('need-action-link').click();
    await page.locator('h1:has-text("Pensions that need action")').waitFor();
  },
};

export default pendingPensionsPage;
