import { Page } from '@maps/playwright';

class PendingPensionsPage {
  readonly pendingPensionsPageTitleText =
    'Pending pensions - MoneyHelper Pensions Dashboard';
  readonly heading = `h1:has-text("Your pensions")`;
  readonly subHeading = `h2:has-text("Understanding your pending pensions")`;
  readonly pendingPensionsBreadcrumb = `a[href*="pending-pensions"]`;
  readonly pensionsFoundBreadcrumb = `a[href*="overview"]`;
  readonly summaryText01 = `What does 'pending' mean? Your provider has confirmed the pension is yours. They haven’t sent us all the details yet, so some figures might be missing.`;
  readonly summaryText02 = `Do I need to do anything? No. Pending pensions will automatically move to ‘Your pensions’ once their information is complete.`;

  constructor(private readonly page: Page) {}

  async pageLoads(): Promise<void> {
    await this.page.locator(this.heading).waitFor();
    await this.page.locator(this.subHeading).waitFor();
    await this.page
      .locator(`div > p.mb-4:has-text("${this.summaryText01}")`)
      .waitFor();
    await this.page
      .locator(`div p.mb-4:has-text("${this.summaryText02}")`)
      .waitFor();
  }

  getPensionCard(schemeName: any) {
    return this.page
      .getByTestId('information-callout')
      .filter({
        has: this.page
          .getByTestId('pension-card-scheme-name')
          .getByText(schemeName, { exact: true }),
      })
      .first();
  }

  getPensionCardType(schemeName: any) {
    return this.getPensionCard(schemeName).getByTestId('pension-card-type');
  }

  async viewDetailsOfPendingPension(schemeName: any): Promise<void> {
    await this.page.locator(this.heading).waitFor();
    const pensionCards = this.page.getByTestId('information-callout');
    await pensionCards
      .filter({ hasText: schemeName })
      .getByTestId('details-link')
      .click();
  }

  async assertPendingPensions(pensions: any): Promise<void> {
    await this.page.locator(this.heading).waitFor();
    const pensionCards = this.page.getByTestId('information-callout');
    const pendingPensions = pensions.filter(
      (pension: any) =>
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
  }

  async viewTextOnPensionCard(schemeName: string): Promise<void> {
    const pensionCard = this.page
      .getByTestId('information-callout')
      .filter({ hasText: schemeName });
    await pensionCard.getByTestId('pension-card-employer-name').waitFor();
  }

  async clickNeedActionLink(): Promise<void> {
    await this.page.getByTestId('need-action-link').click();
    await this.page
      .locator('h1:has-text("Pensions that need action")')
      .waitFor();
  }
}

export default PendingPensionsPage;
