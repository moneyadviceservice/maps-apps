import { Page } from '@playwright/test';

type TabName =
  | 'Summary'
  | 'Income & values'
  | 'About this pension'
  | 'Contact provider';

type PensionDetailsPage = {
  heading: string;
  summary: string;
  subHeading: string;
  statePensionTitlePageText: string;
  getSubHeadingText(page: Page): Promise<string>;
  assertHeading(page: Page, schemeName: any): Promise<void>;
  assertHeadingStatePension(page: Page): Promise<void>;
  getLumpSumText(page: Page): Promise<string>;
  assertPendingPensionDetailsPage(page: Page, pensions: any): Promise<void>;
  verifyType(page: Page): Promise<string>;
  verifyStatus(page: Page): Promise<string>;
  verifyIllustrationDate(page: Page): Promise<string>;
  verifyPayableDate(page: Page): Promise<string>;
  verifyReferenceNumber(page: Page): Promise<string>;
  pageTitle(page: Page): Promise<string>;
  getPensionDetailsSubtext(page: Page): Promise<string>;
  getTextFromLocator(page: Page, testId: string): Promise<string>;
  getLumpSumSentenceOnDoughnut(page: Page): Promise<string>;
  getDataFromAccordionOnDoughnut(page: Page): Promise<string>;
  getLocator(page: Page, testId: string): Promise<any>;
  tableSectionHeading(page: Page, tableHeading: any): any;
  tableHeadings(page: Page): any;
  getDataCol1(page: Page, label: string): any;
  getDataCol2(page: Page, label: string): any;
  getDataCol3(page: Page, label: string): any;
  aboutTheseValuesAccordion(page: Page);
  clickTooltip(page: Page, tooltipText: string): Promise<void>;
  selectTab(page: Page, tabName: TabName): Promise<void>;
  verifyExpectedDataIsDisplayedInUi(
    page: Page,
    aboutThisPension: [string, string, string | undefined][],
    heading: string,
  ): Promise<boolean>;
  // getAboutThisPensionSectionField(page: Page, label: string);
  checkPensionDetailsTabs(
    page: Page,
    testId: string,
    heading: string,
  ): Promise<void>;
  verifyCommonHeaderAndIllustrationDate(
    page: Page,
    referenceNumber?: string,
    payableDateERI?: string,
    dataIllustrationDate?: string,
    status?: string,
    type?: string,
  ): Promise<boolean>;
  formatCurrencyStringWithCommas(value: string): Promise<string>;
};

const pensionDetailsPage: PensionDetailsPage = {
  heading: 'h1',
  summary: 'tool-intro',
  subHeading: 'sub-heading',
  statePensionTitlePageText: 'State Pension - MoneyHelper Pensions Dashboard',

  async getSubHeadingText(page: Page) {
    return await page.getByTestId(this.subHeading).textContent();
  },

  async assertHeading(page, schemeName): Promise<void> {
    await page
      .locator(`${this.heading}:has-text("${schemeName}")`)
      .waitFor({ state: 'visible', timeout: 4000 });
  },

  async assertHeadingStatePension(page): Promise<void> {
    await page.locator(`${this.heading}:has-text("State Pension")`).waitFor();
  },

  async pageTitle(page: Page): Promise<string> {
    return (
      (
        await page.locator('[data-testid="page-title"]').textContent()
      )?.trim() ?? ''
    );
  },

  async getPensionDetailsSubtext(page: Page): Promise<string> {
    return this.getTextFromLocator(page, 'pension-detail-intro');
  },

  async getTextFromLocator(page: Page, testId: string): Promise<string> {
    await page.getByTestId(testId).waitFor({ state: 'visible' });
    const text = await page.getByTestId(testId).textContent();
    return text?.trim() ?? '--';
  },

  async getLocator(page: Page, testId: string): Promise<any> {
    // Most callers pass a Playwright testId value. Use getByTestId for robustness.
    return page.getByTestId(testId);
  },

  async getLumpSumSentenceOnDoughnut(page: Page): Promise<string> {
    const tooTipiconOnDoughnut = page.getByTestId('tooltip').nth(1);
    await tooTipiconOnDoughnut.click();
    return tooTipiconOnDoughnut.innerText();
  },

  async getDataFromAccordionOnDoughnut(page: Page): Promise<string> {
    const accordionLocator = page.getByTestId('expandable-section').nth(1);
    if (!(await accordionLocator.isVisible())) {
      return '';
    }
    await accordionLocator.click();
    return accordionLocator.innerText();
  },

  tableSectionHeading(page, tableHeading) {
    return page
      .getByTestId('table-section-heading')
      .filter({ hasText: tableHeading });
  },

  async getLumpSumText(page: Page): Promise<string> {
    const lumpSumStatement = await page
      .locator('[data-testid="detail-summary-intro"]')
      .innerText();
    return lumpSumStatement;
  },

  async assertPendingPensionDetailsPage(page, pensions): Promise<void> {
    const pendingPensions = pensions.filter(
      (pension) =>
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
      await page
        .locator(`${this.heading}:has-text("${pension.schemeName}")`)
        .waitFor();
      break;
    }
  },

  tableHeadings(page: Page) {
    return page.locator(`[data-testid="table-section-content"] thead th`);
  },

  getDataCol1(page: Page, label: string) {
    return page
      .locator('[data-testid="table-section-content"] tbody tr')
      .filter({ has: page.locator('td').first().filter({ hasText: label }) })
      .locator('td')
      .nth(1);
  },

  getDataCol2(page: Page, label: string) {
    return page
      .locator('[data-testid="table-section-content"] tbody tr')
      .filter({ has: page.locator('td').first().filter({ hasText: label }) })
      .locator('td')
      .nth(2);
  },

  getDataCol3(page: Page, label: string) {
    return page
      .locator('[data-testid="table-section-content"] tbody tr')
      .filter({ has: page.locator('td').first().filter({ hasText: label }) })
      .locator('td')
      .nth(3);
  },

  aboutTheseValuesAccordion(page) {
    return page.getByTestId('expandable-section');
  },

  async clickTooltip(page: Page, tooltipText: string) {
    //TODO Try and find an alternative method to the hard wait we are deploying in this function
    /**
     * Normally we would not accept a explicit timeout as it's bad practice.
     * If the tooltip is clicked to quickly, the tooltip occassionally doesn't load.
     * This is a matter of milliseconds, something that would not impact the end user.
     */

    // eslint-disable-next-line playwright/no-wait-for-timeout
    await page.waitForTimeout(300);
    await page.locator(`p:has-text("${tooltipText}") label`).click();
  },

  /**
   * Selects a tab on the page by clicking its visible tab header and verifies the tab's header is displayed.
   *
   * Summary page and contact does not have a header, so is not asserted upon execution.
   */
  async selectTab(page: Page, tabName: TabName) {
    const possibleHeaders: Partial<Record<TabName, string>> = {
      'Income & values': 'Income and values',
      'About this pension': 'About this pension',
    };
    const expectedHeader = possibleHeaders[tabName] ?? null;

    const targetTab = page
      .locator('[data-testid^="tab-"]:visible')
      .filter({ hasText: tabName });
    await targetTab.click();

    // Some pages don't have headers, will only check if there's a record in possibleHeaders.
    if (!expectedHeader) return;
    await page
      .locator(`h2:has-text('${expectedHeader}')`)
      .waitFor({ state: 'visible' });
  },

  async checkPensionDetailsTabs(page: Page, testId: string, heading: string) {
    await page.getByTestId(testId).first().click();
    await page
      .locator(`h2:has-text('${heading}')`)
      .waitFor({ state: 'visible' });
  },

  async verifyExpectedDataIsDisplayedInUi(
    page: Page,
    SectionName: [string, string, string | undefined][],
    heading: string,
  ): Promise<boolean> {
    const Section = page
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
  },

  async verifyCommonHeaderAndIllustrationDate(
    page: Page,
    referenceNumber?: string,
    payableDateERI?: string,
    dataIllustrationDate?: string,
    status?: string,
    type?: string,
  ): Promise<boolean> {
    // Plan reference number
    let referenceNumberCheck = true;
    if (referenceNumber !== undefined) {
      const referenceText = await page
        .getByTestId('reference-number')
        .innerText();
      referenceNumberCheck =
        referenceNumber !== undefined &&
        referenceText.includes(`Plan reference number: ${referenceNumber}`);
    }
    // Retirement date
    let retirementDateCheck = true;
    if (payableDateERI !== undefined) {
      const retirementDateTextRaw = await page
        .getByTestId('retirement-date')
        .innerText();
      const retirementDateText = retirementDateTextRaw
        .replace(/\s+/g, ' ')
        .trim();
      retirementDateCheck = retirementDateText.includes(
        `Retirement date Show more information : ${payableDateERI}`,
      );
    }
    // Status check (optional)
    let statusCheck = true;
    if (status) {
      const statusText = await page.getByTestId('pension-status').innerText();
      statusCheck = statusText.includes(status);
    }
    // Type check (optional)
    let typeCheck = true;
    if (type) {
      const typeText = await page
        .getByTestId('pension-detail-type')
        .innerText();
      typeCheck = typeText.includes(type);
    }
    // Information last updated (optional)
    let informationLastUpdatedCheck = true;
    if (dataIllustrationDate !== undefined) {
      const informationText = await page
        .locator(
          'p[data-testid="paragraph"]:has-text("Information last update")',
        )
        .innerText();
      const informationLastUpdatedText = informationText
        .replace(/\s+/g, ' ')
        .trim();
      informationLastUpdatedCheck = informationLastUpdatedText.includes(
        `Information last updated: ${dataIllustrationDate} Show more information`,
      );
    }
    // Retirement date tooltip text (optional)
    let retirementDateToolTipCheck = true;
    if (payableDateERI !== undefined) {
      const retirementTooltipText = await page
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
      const informationTooltipText = await page
        .locator(
          'p:has-text("Information last updated") span[data-testid="tooltip-content"]',
        )
        .innerText();
      const informationLastUpdatedToolTipText = informationTooltipText
        .replace(/\s+/g, ' ')
        .trim();
      informationLastUpdatedTooltipCheck =
        informationLastUpdatedToolTipText.includes(
          `This is the date the pension provider calculated your estimated income.`,
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
  },

  async verifyReferenceNumber(page: Page): Promise<string> {
    await page.getByTestId('reference-number').waitFor({ state: 'visible' });
    const referenceNumber = await page
      .getByTestId('reference-number')
      .innerText();
    return referenceNumber;
  },

  async verifyPayableDate(page: Page): Promise<string> {
    const payableDate = await page.getByTestId('retirement-date').innerText();
    return payableDate;
  },

  async verifyIllustrationDate(page: Page): Promise<string> {
    const illustrationDate = await page
      .locator('p[data-testid="paragraph"]:has-text("Information last update")')
      .innerText();
    return illustrationDate;
  },

  async verifyStatus(page: Page): Promise<string> {
    const status = await page.getByTestId('status').innerText();
    return status;
  },

  async verifyType(page: Page): Promise<string> {
    const type = await page.getByTestId('type').innerText();
    return type;
  },

  async formatCurrencyStringWithCommas(value): Promise<string> {
    // Extract the currency symbol and numeric part
    const symbol = value[0]; // "£"
    const number = parseInt(value.slice(1), 10);

    // Format the number with commas
    const formatted = number.toLocaleString();

    // Combine and return
    const result = symbol + formatted;

    return result;
  },
};

export default pensionDetailsPage;
