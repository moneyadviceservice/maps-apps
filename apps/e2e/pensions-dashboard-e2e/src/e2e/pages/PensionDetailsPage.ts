import { Page } from '@maps/playwright';

import { Locale } from '../types/common.types';

type TabName =
  | 'Summary'
  | 'Income & values'
  | 'About this pension'
  | 'Contact provider'
  | 'Crynodeb'
  | 'Incwm a gwerthoedd'
  | 'Am y pensiwn hwn'
  | 'Cysylltu â darparwr';

class PensionDetailsPage {
  constructor(private readonly page: Page) {}

  readonly heading = 'h1';
  readonly summary = 'tool-intro';
  readonly subHeading = 'sub-heading';
  readonly statePensionTitlePageText =
    'State Pension - MoneyHelper Pensions Dashboard';
  readonly mcCloudWarningFlagText =
    'This pension has different payment options';
  readonly incomeValuesSubHeadingText =
    'These charts show the latest value of your pension sent by your provider, as well as their estimate of what it could be worth in the future.';
  readonly incomeValuesSubHeadingTextDC =
    'Your actual income will depend on how and when you take your pension. Learn about your options in our guide, What can I do with my pension pot?';

  async getAllTabs() {
    return this.page.locator('[data-testid="tabs"] > li');
  }

  async getSubHeadingText() {
    return await this.page.getByTestId(this.subHeading).textContent();
  }

  async getPotValueCallout() {
    return this.page.getByTestId('pot-value');
  }

  get summaryCard() {
    return this.page.getByTestId('pension-detail-intro');
  }

  async getSummaryBoxText(): Promise<string> {
    return this.summaryCard.innerText();
  }

  get summaryContent() {
    return this.page.getByTestId('summary-content');
  }

  async getSummaryBoxContent(): Promise<string> {
    return this.summaryContent.innerText();
  }

  get mcCloudWarningFlag() {
    return this.page.getByTestId('notification-box-default-warning-MCCLOUD');
  }

  async getMcCloudWarningFlagText(): Promise<string> {
    return this.mcCloudWarningFlag.innerText();
  }

  async assertHeading(schemeName: string): Promise<void> {
    await this.page
      .locator(`${this.heading}:has-text("${schemeName}")`)
      .waitFor({ state: 'visible', timeout: 4000 });
  }

  async assertHeadingStatePension(locale: Locale = 'en'): Promise<void> {
    const statePensionHeadings = {
      en: 'State Pension',
      cy: 'Pensiwn y Wladwriaeth',
    };

    await this.page
      .locator(`${this.heading}:has-text("${statePensionHeadings[locale]}")`)
      .waitFor();
  }

  async pageTitle(): Promise<string> {
    return (
      (
        await this.page.locator('[data-testid="page-title"]').textContent()
      )?.trim() ?? ''
    );
  }

  async getPensionDetailsSubtext(): Promise<string> {
    return this.getTextFromLocator('pension-detail-intro');
  }

  async getSummaryAmount(): Promise<string> {
    return this.getTextFromLocator('amount-text');
  }

  async getTextFromLocator(testId: string): Promise<string> {
    const locator = this.page.getByTestId(testId);
    await locator.first().waitFor({ state: 'visible' });
    const text = await locator.first().textContent();
    return text?.trim() ?? '--';
  }

  async getLumpSumSentenceOnDonut(): Promise<string> {
    const tooTipiconOnDonut = this.page.getByTestId('tooltip').nth(1);
    await tooTipiconOnDonut.click();
    return tooTipiconOnDonut.innerText();
  }

  async getDataFromAccordion(): Promise<string> {
    const accordionLocator = this.page.getByTestId('expandable-section').nth(1);
    if (!(await accordionLocator.isVisible())) {
      return '';
    }
    await accordionLocator.click();
    return accordionLocator.innerText();
  }

  tableSectionHeading(tableHeading: any) {
    return this.page
      .getByTestId('table-section-heading')
      .filter({ hasText: tableHeading });
  }

  async getLumpSumText(): Promise<string> {
    const lumpSumStatement = await this.page
      .locator('[data-testid="detail-summary-intro"]')
      .innerText();
    return lumpSumStatement;
  }

  async getStatePensionMonthlyERIAmount(): Promise<string> {
    return this.page.getByTestId('sp-progress-bar-eri').innerText();
  }

  async assertPendingPensionDetailsPage(pensions: any): Promise<void> {
    const pendingPensions = pensions.filter(
      (pension: any) =>
        pension.matchType == 'DEFN' &&
        (pension.unavailableReason == 'DBC' ||
          pension.unavailableReason == 'DCC' ||
          pension.unavailableReason == 'NEW' ||
          pension.unavailableReason == 'ANO' ||
          pension.unavailableReason == 'NET' ||
          pension.unavailableReason == 'TRN'),
    );

    for (const pension of pendingPensions) {
      // Pension Summary Heading
      await this.page
        .locator(`${this.heading}:has-text("${pension.schemeName}")`)
        .waitFor();
      break;
    }
  }

  get employerStatus() {
    return this.page.getByTestId('dt-employer-status');
  }

  get tableHeadings() {
    return this.page.locator(`[data-testid="table-section-content"] thead th`);
  }

  getDataCol1(label: string) {
    return this.page
      .locator('[data-testid="table-section-content"] tbody tr')
      .filter({
        has: this.page.locator('td').first().filter({ hasText: label }),
      })
      .locator('td')
      .nth(1);
  }

  getDataCol2(label: string) {
    return this.page
      .locator('[data-testid="table-section-content"] tbody tr')
      .filter({
        has: this.page.locator('td').first().filter({ hasText: label }),
      })
      .locator('td')
      .nth(2);
  }

  getDataCol3(label: string) {
    return this.page
      .locator('[data-testid="table-section-content"] tbody tr')
      .filter({
        has: this.page.locator('td').first().filter({ hasText: label }),
      })
      .locator('td')
      .nth(3);
  }

  aboutTheseValuesAccordion() {
    return this.page.getByTestId('expandable-section');
  }

  /**
   * Selects a tab on the page by clicking its visible tab header and verifies the tab's header is displayed.
   *
   * Summary page and contact does not have a header, so is not asserted upon execution.
   */
  async selectTab(tabName: TabName) {
    const possibleHeaders: Partial<Record<TabName, string>> = {
      'Income & values': 'Income and values',
      'About this pension': 'About this pension',
    };
    const expectedHeader = possibleHeaders[tabName] ?? null;

    const targetTab = this.page
      .locator('[data-testid^="tab-"]:visible')
      .filter({ hasText: tabName });
    await targetTab.first().click();

    // Some pages don't have headers, will only check if there's a record in possibleHeaders.
    if (!expectedHeader) return;
    await this.page
      .locator(`h2:has-text('${expectedHeader}')`)
      .waitFor({ state: 'visible' });
  }

  async checkPensionDetailsTabs(testId: string, heading: string) {
    await this.page.getByTestId(testId).first().click();
    await this.page
      .locator(`h2:has-text('${heading}')`)
      .waitFor({ state: 'visible' });
  }

  async verifyExpectedDataIsDisplayedInUi(
    SectionName: [string, string, string | undefined][],
    heading: string,
  ): Promise<boolean> {
    const Section = this.page
      .getByRole('heading', { name: heading })
      .locator('xpath=..');
    const allValuesDisplayedInUi = SectionName.filter(
      ([, , val]) => val,
    ).length;
    const allDataInPayload = await Section.locator(
      '[data-testid^="dd-"]',
    ).count();
    if (allValuesDisplayedInUi !== allDataInPayload) {
      console.log(
        `Mismatch in locator count. Expected: ${allValuesDisplayedInUi}, Actual: ${allDataInPayload}`,
      );
      return false;
    }
    return true;
  }

  async verifyCommonHeaderAndIllustrationDate(
    referenceNumber?: string,
    payableDateERI?: string,
    dataIllustrationDate?: string,
    status?: string,
    type?: string,
  ): Promise<boolean> {
    // Plan reference number
    let referenceNumberCheck = true;
    if (referenceNumber !== undefined) {
      const referenceText = await this.page
        .getByTestId('reference-number')
        .innerText();
      referenceNumberCheck =
        referenceNumber !== undefined &&
        referenceText.includes('Plan reference number') &&
        referenceText.includes(referenceNumber);
    }
    // Retirement date
    let retirementDateCheck = true;
    if (payableDateERI !== undefined) {
      const retirementDateTextRaw = await this.page
        .getByTestId('retirement-date')
        .innerText();
      const retirementDateText = retirementDateTextRaw
        .replace(/\s+/g, ' ')
        .trim();
      retirementDateCheck =
        retirementDateText.includes('Retirement date Show more information') &&
        retirementDateText.includes(payableDateERI);
    }
    // Status check (optional)
    let statusCheck = true;
    if (status) {
      const statusText = await this.page
        .getByTestId('pension-status')
        .innerText();
      statusCheck = statusText.includes(status);
    }
    // Type check (optional)
    let typeCheck = true;
    if (type) {
      const typeText = await this.page
        .getByTestId('pension-detail-type')
        .innerText();
      typeCheck = typeText.includes(type);
    }
    // Information last updated (optional)
    let informationLastUpdatedCheck = true;
    if (dataIllustrationDate !== undefined) {
      const informationText = await this.page
        .locator('p[data-testid="paragraph"]:has-text("Calculation date")')
        .innerText();
      const informationLastUpdatedText = informationText
        .replace(/\s+/g, ' ')
        .trim();
      informationLastUpdatedCheck = informationLastUpdatedText.includes(
        `Calculation date: ${dataIllustrationDate} Show more information`,
      );
    }
    // Retirement date tooltip text (optional)
    let retirementDateToolTipCheck = true;
    if (payableDateERI !== undefined) {
      const retirementTooltipText = await this.page
        .locator(
          'p:has-text("Retirement date") span[data-testid="tooltip-content"]',
        )
        .innerText();
      const retirementDateToolTipText = retirementTooltipText
        .replace(/\s+/g, ' ')
        .trim();
      retirementDateToolTipCheck = retirementDateToolTipText.includes(
        `The pension retirement date is the date your provider expects you to start taking money from this pension scheme. You don’t have to retire or take your pension on this date - you can usually change it by contacting them.`,
      );
    }
    // Information last updated tooltip text (optional)
    let informationLastUpdatedTooltipCheck = true;
    if (dataIllustrationDate !== undefined) {
      const informationTooltipText = await this.page
        .locator(
          'p:has-text("Calculation date") span[data-testid="tooltip-content"]',
        )
        .innerText();
      const informationLastUpdatedToolTipText = informationTooltipText
        .replace(/\s+/g, ' ')
        .trim();
      informationLastUpdatedTooltipCheck =
        informationLastUpdatedToolTipText.includes(
          `These values are based on the information your provider had on this specific date. Because information is updated at different times, they might be different from what you see on your annual benefit statements or online account.`,
        );
    }
    return (
      referenceNumberCheck &&
      retirementDateCheck &&
      informationLastUpdatedCheck &&
      retirementDateToolTipCheck &&
      informationLastUpdatedTooltipCheck &&
      statusCheck &&
      typeCheck
    );
  }

  async verifyReferenceNumber(): Promise<string> {
    await this.page
      .getByTestId('reference-number')
      .waitFor({ state: 'visible' });
    const referenceNumber = await this.page
      .getByTestId('reference-number')
      .innerText();
    return referenceNumber;
  }

  async verifyPayableDate(): Promise<string> {
    const payableDate = await this.page
      .getByTestId('retirement-date')
      .innerText();
    return payableDate;
  }

  async verifyIllustrationDate(): Promise<string> {
    const illustrationDate = await this.page
      .locator('p[data-testid="paragraph"]:has-text("Information last update")')
      .innerText();
    return illustrationDate;
  }

  async verifyStatus(): Promise<string> {
    const status = await this.page.getByTestId('status').innerText();
    return status;
  }

  async verifyType(): Promise<string> {
    const type = await this.page.getByTestId('type').innerText();
    return type;
  }

  get pensionDetailType() {
    return this.page.getByTestId('pension-detail-type');
  }

  async formatCurrencyStringWithCommas(value: string): Promise<string> {
    // Extract the currency symbol and numeric part
    const symbol = value[0]; // "£"
    const number = parseInt(value.slice(1), 10);

    // Format the number with commas
    const formatted = number.toLocaleString();

    // Combine and return
    const result = symbol + formatted;

    return result;
  }

  nextStepSection() {
    return this.page.getByTestId('next-steps-section');
  }

  nextStepsHeading() {
    return this.page.getByTestId('next-steps-heading');
  }

  nextStepsIntro() {
    return this.page.getByTestId('next-steps-intro');
  }

  nextStepsIntroNewTab() {
    return this.page.getByTestId('next-steps-intro-new-tab');
  }

  nextStepsTeaserCard() {
    return this.nextStepSection().getByTestId('teaserCard');
  }

  async clickLink(linkText: string): Promise<Page> {
    const link = this.page.getByRole('link', { name: linkText });
    const [newPage] = await Promise.all([
      this.page.context().waitForEvent('page'),
      link.click(),
    ]);
    await newPage.waitForLoadState('domcontentloaded');
    return newPage;
  }

  get valueIllustrationDateAccordion() {
    return this.page.locator(
      '[data-testid="value-illustration-date-accordion"]',
    );
  }

  async getValueIllustrationDateAccordionText(): Promise<string> {
    return this.valueIllustrationDateAccordion.locator('p').first().innerText();
  }

  async getValueIllustrationDateAccordionText2(): Promise<string> {
    return this.valueIllustrationDateAccordion.locator('p').nth(1).innerText();
  }

  async valueIllustrationDateTitle(): Promise<string> {
    return this.valueIllustrationDateAccordion
      .locator('[data-testid="summary-block-title"]')
      .innerText();
  }

  get sysNewNoBenefitsMessage() {
    return this.page.locator('[data-testid="sys-new-no-benefit-type-message"]');
  }

  get sysNewValuesWarningMessage() {
    return this.page.locator('[data-testid="sys-new-values-warning"]');
  }

  benefitTypeTitle(benefitType: string | RegExp = /.*/) {
    return this.page.locator(
      `[data-testid="benefit-type-title-${benefitType}"]`,
    );
  }
}

export default PensionDetailsPage;
