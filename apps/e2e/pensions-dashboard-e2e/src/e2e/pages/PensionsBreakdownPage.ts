import { Locator, Page } from '@maps/playwright';

import { Locale } from '../types/common.types';
import type CommonHelpers from '../utils/commonHelpers';
import PensionDetailsPage from './PensionDetailsPage';

class PensionBreakdownPage {
  private readonly pensionDetailsPage: PensionDetailsPage;

  constructor(private readonly page: Page) {
    this.pensionDetailsPage = new PensionDetailsPage(page);
  }

  readonly heading = `h1:text-is("Your pensions")`;
  readonly summary = 'callout-white';
  readonly paragraph = 'p';
  readonly scamsCallout = 'urgent-callout';
  readonly statePensionCard =
    '[data-testid="information-callout"]:has-text("State Pension")';
  readonly yourPensionsBreadcrumb = `a[href*="your-pensions"]`;
  readonly pensionsFoundBreadcrumb = `a[href*="overview"]`;
  readonly pensionBreakdownPageTitleText = `Your Pension Breakdown - MoneyHelper Pensions Dashboard`;
  readonly notIncludedText = `See the pension’s details for why we cannot show an estimated income. If any other pensions are missing, see Pensions not showing.`;

  async pageLoads(): Promise<void> {
    await this.page
      .locator(this.heading)
      .waitFor({ state: 'visible', timeout: 3000 });
  }

  async viewDetailsOfPension(schemeName: any): Promise<void> {
    await this.page.getByTestId('page-title').waitFor({ state: 'visible' });
    // Find the pension card that exactly matches the schemeName in its heading or main label
    const pensionCards = this.page.getByTestId('information-callout');
    const matchingScheme = pensionCards
      .getByTestId('pension-card-scheme-name')
      .filter({ has: this.page.getByText(schemeName, { exact: true }) });

    await matchingScheme.first().waitFor({ state: 'visible' });
    // Optionally, ensure only one card matches
    const count = await matchingScheme.count();
    if (count !== 1) {
      throw new Error(
        `Expected exactly one pension card with schemeName '${schemeName}', but found ${count}`,
      );
    }
    const matchingCard = matchingScheme.locator('..');
    await matchingCard.getByTestId('details-link').click();
  }

  async pensionCards() {
    return this.page.locator('[data-testid="information-callout"]').all();
  }

  async getschemeNameOnCard(pensionCard: any) {
    return pensionCard
      .locator('[data-testid="pension-card-scheme-name"]')
      .textContent();
  }

  async estimatedIncome(pensionCard: any): Promise<string> {
    return (
      (
        await pensionCard
          .locator('[data-testid="pension-card-monthly-amount"]')
          .textContent()
      )?.trim() ?? ''
    );
  }

  async clickSeeDetailsButton(pensionCard: any): Promise<void> {
    const seeDetailsbutton = pensionCard.locator(
      '[data-testid="details-link"]',
    );
    await seeDetailsbutton.click({ force: true });
    await this.page.waitForURL(/\/pension-details(\/|$)/);
  }

  async clickPensionsTimelineButton(locale: Locale = 'en'): Promise<void> {
    const timelineLinks = {
      en: 'View full pensions timeline',
      cy: 'Gweld amserlen pensiynau lawn',
    };

    await this.page.getByRole('link', { name: timelineLinks[locale] }).click();
    await this.page.waitForURL('**/your-pensions-timeline*');
  }

  async administratorName(pensionCard: any): Promise<string> {
    return (
      (
        await pensionCard
          .locator('[data-testid="pension-card-administrator-name"]')
          .textContent()
      )?.trim() ?? ''
    );
  }

  async employerName(pensionCard: any): Promise<string | null> {
    const locator = pensionCard.locator(
      '[data-testid="pension-card-employer-name"]',
    );
    return (await locator.count()) > 0
      ? (await locator.textContent())?.trim() ?? ''
      : null;
  }

  async pensionStatus(pensionCard: any): Promise<string | null> {
    const locator = pensionCard.locator('[data-testid="pension-card-status"]');
    return (await locator.count()) > 0
      ? (await locator.textContent())?.trim() ?? ''
      : null;
  }

  async viewPensionCardWithEstimatedIncome(schemeName: any): Promise<void> {
    const pensionCard = this.page
      .getByTestId('information-callout')
      .filter({ hasText: schemeName });
    await pensionCard.getByText('Employer').waitFor();
    await pensionCard.getByText('Estimated income').waitFor();
    await pensionCard.getByTestId('details-link').waitFor();
  }

  async pensionCardType(pensionCard: any): Promise<string> {
    return (
      (
        await pensionCard
          .locator('[data-testid="pension-card-type"]')
          .textContent()
      )?.trim() ?? ''
    );
  }

  async retirementDate(pensionCard: any): Promise<string | null> {
    const locator = pensionCard.locator(
      '[data-testid="pension-card-retirement-date"]',
    );
    if ((await locator.count()) === 0) {
      return null;
    }
    const text = (await locator.textContent())?.trim();
    if (!text || text === '--') {
      return null;
    }
    return text;
  }

  async pensionsNotShowingLinkAccordion(): Promise<void> {
    await this.page
      .locator(`[data-testid="paragraph"] > a:text-is("Pensions not showing")`)
      .click();
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

  getEmployerName(schemeName: any) {
    return this.getPensionCard(schemeName).getByTestId(
      'pension-card-employer-name',
    );
  }

  getPensionCardType(schemeName: any) {
    return this.getPensionCard(schemeName).getByTestId('pension-card-type');
  }

  getActiveStatus(schemeName: any) {
    return this.getPensionCard(schemeName).getByTestId('pension-status');
  }

  getAdministratorName(schemeName: any) {
    return this.getPensionCard(schemeName).getByTestId(
      'pension-card-administrator-name',
    );
  }

  getRetirementDate(schemeName: any) {
    return this.getPensionCard(schemeName).getByTestId(
      'pension-card-retirement-date',
    );
  }

  getEstimatedIncome(schemeName: any) {
    return this.getPensionCard(schemeName).getByTestId(
      'pension-card-monthly-amount',
    );
  }

  getSeeDetailsButton(schemeName: any) {
    return this.getPensionCard(schemeName).getByTestId('details-link');
  }

  getPendingMessage(schemeName: any) {
    return this.getPensionCard(schemeName).getByTestId(
      'pension-card-expected-income',
    );
  }

  getLinkedPensions(schemeName: any) {
    return this.getPensionCard(schemeName).getByTestId(
      'pension-card-linked-pensions',
    );
  }

  async getLinkedPensionsList() {
    const linkedPensions = await this.page
      .getByTestId('pension-detail-linked')
      .innerText();
    return linkedPensions.split('\n').map((pension) => pension.trim());
  }

  async getLinkedPensionsToolTipText() {
    const tooltipText = await this.page.getByTestId('').innerText();
    await this.page.getByTestId('').click();
    return tooltipText.replaceAll(/\s+/g, ' ').trim();
  }

  async getBewareOfScamsText(): Promise<string> {
    const bewareOfScamsText = await this.page
      .getByTestId(this.scamsCallout)
      .innerText();
    return bewareOfScamsText.replaceAll(/\s+/g, ' ').trim();
  }

  async getEstimateTitleText(): Promise<string> {
    const estimateTitleText = await this.page
      .getByRole('heading', { name: /Pensions in your estimate/i })
      .innerText();
    return estimateTitleText.replaceAll(/\s+/g, ' ').trim();
  }

  async getNotInYourEstimateTitleText(): Promise<string> {
    const notIncludedInYourEstimateTitleText = await this.page
      .getByRole('heading', { name: /Pensions without estimated incomes/i })
      .innerText();
    return notIncludedInYourEstimateTitleText.replaceAll(/\s+/g, ' ').trim();
  }

  async getNotIncludedParagraphText(): Promise<string> {
    const notIncludedLinkLocator = this.page.getByRole('link', {
      name: 'not included',
    });

    const paragraphLocator = this.page
      .locator(this.paragraph)
      .filter({ has: notIncludedLinkLocator });

    const textContent = await paragraphLocator.textContent();

    return textContent.replaceAll(/\s+/g, ' ').trim();
  }

  async getImportantBanner(): Promise<string> {
    const importantHeadingLocator = this.page.getByTestId(
      'notification-box-negative',
    );
    const importantHeading = await importantHeadingLocator.innerText();
    return importantHeading.replaceAll(/\s+/g, ' ').trim();
  }

  async getStatePensionCardType(): Promise<string> {
    // Locates the smaller 'State Pension' text inside the card type area (h3)
    const cardLocator = this.page.locator(this.statePensionCard);
    const headingText = await cardLocator
      .locator('h3:has-text("State Pension")')
      .innerText();
    return headingText.replaceAll(/\s+/g, ' ').trim();
  }

  async getStatePensionDateText(): Promise<string> {
    // Locates the date using its unique data-testid within the card
    const cardLocator = this.page.locator(this.statePensionCard);
    const dateText = await cardLocator
      .locator('dt')
      .getByText('State Pension date')
      .innerText();
    return dateText.replaceAll(/\s+/g, ' ').trim();
  }

  async navigateToSchemeIncomeAndValuesTab(
    schemeName: string,
    pensionBreakdownPage: PensionBreakdownPage,
  ) {
    await pensionBreakdownPage.viewDetailsOfPension(schemeName);
    await this.pensionDetailsPage.assertHeading(schemeName);
    await this.pensionDetailsPage.checkPensionDetailsTabs(
      'tab-pension-income-and-values',
      'Income and values',
    );
  }

  async clickCBLumpSumTooltip() {
    await this.page
      .getByTestId('donut-heading')
      .getByTestId('tooltip-icon')
      .click();
  }

  async getCBLumpSumTooltipText() {
    return (
      await this.page
        .getByTestId('donut-heading')
        .getByTestId('tooltip-content')
        .innerText()
    )
      .replaceAll(/\s+/g, ' ')
      .trim();
  }

  get cbLumpSumTooltipIcon() {
    return this.page.getByTestId('donut-heading').getByTestId('tooltip-icon');
  }

  async clickTimelineLink() {
    await this.page.getByTestId('timeline-link').click();
    await this.page.waitForURL('**/your-pensions-timeline');
  }

  get understandYourNextStepsHeading(): Locator {
    return this.page.getByTestId('onward-journey-banner-heading');
  }

  get understandYourNextStepsContent(): Locator {
    return this.page.getByTestId('onward-journey-banner-body');
  }

  async clickRetirementGuidanceLink(
    commonHelpers: CommonHelpers,
  ): Promise<Page> {
    const link = this.page.getByRole('link', {
      name: 'Get retirement guidance',
    });
    return await commonHelpers.clickLinkAndReturnNewPage(link);
  }
}
export default PensionBreakdownPage;
