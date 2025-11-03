import { Locator, Page } from '@playwright/test';

import pensionDetailsPage from './PensionDetailsPage';

type PensionBreakdownPage = {
  heading: string;
  summary: string;
  paragraph: string;
  scamsCallout: string;
  statePensionCard: string;
  yourPensionsBreadcrumb: string;
  pensionsFoundBreadcrumb: string;
  pensionBreakdownPageTitleText: string;
  viewPensionCardWithEstimatedIncome(
    page: Page,
    schemeName: any,
  ): Promise<void>;
  pageLoads(page: Page): Promise<void>;
  pensionCards(page: Page): Promise<Locator[]>;
  warningText(pensionCard: Locator): Promise<Locator>;
  administratorName(pensionCard: Locator): Promise<string>;
  estimatedIncome(pensionCard: Locator): Promise<string>;
  pensionCardType(pensionCard: Locator): Promise<string>;
  pensionStatus(pensionCard: Locator): Promise<string | null>;
  getschemeNameOnCard(page: Page, pensionCard: any): Promise<any>;
  clickSeeDetailsButton(page: Page, pensionCard: Locator): Promise<void>;
  employerName(pensionCard: Locator): Promise<string | null>;
  viewDetailsOfPension(page: Page, pensionName: any): Promise<void>;
  assertPensions(page: Page, pensions: any): Promise<void>;
  retirementDate(pensionCard: Locator): Promise<string | null>;
  pensionsNotShowingLinkAccordion(page: Page): Promise<void>;
  getPensionCard(page: Page, schemeName: any): any;
  getEmployerName(page: Page, schemeName: any): any;
  getAdministratorName(page: Page, schemeName: any): any;
  getRetirementDate(page: Page, schemeName: any): any;
  getEstimatedIncome(page: Page, schemeName: any): any;
  getWarningMessage(page: Page, schemeName: any): any;
  getPendingMessage(page: Page, schemeName: any): any;
  getSeeDetailsButton(page: Page, schemeName: any): any;
  getPensionCardType(page: Page, schemeName: any): any;
  getActiveStatus(page: Page, schemeName: any): any;
  getBewareOfScamsText(page: Page): Promise<string>;
  getEstimateTitleText(page: Page): Promise<string>;
  getNotInYourEstimateTitleText(page: Page): Promise<string>;
  getNotIncludedParagraphText(page: Page): Promise<string>;
  getImportantBanner(page: Page): Promise<string>;
  getStatePensionCardType(page: Page): Promise<string>;
  getStatePensionCardHeading(page: Page): Promise<string>;
  getStatePensionDateText(page: Page): Promise<string>;
  navigateToSchemeIncomeAndValuesTab(
    page: Page,
    schemeName: string,
  ): Promise<void>;
};

const pensionBreakdownPage: PensionBreakdownPage = {
  heading: `h1:text-is("Your pensions")`,
  summary: 'callout-white',
  paragraph: 'p',
  scamsCallout: 'urgent-callout',
  statePensionCard:
    '[data-testid="information-callout"]:has-text("State Pension")',
  yourPensionsBreadcrumb: `a[href*="your-pensions"]`,
  pensionsFoundBreadcrumb: `a[href*="overview"]`,
  pensionBreakdownPageTitleText: `Your Pension Breakdown - MoneyHelper Pensions Dashboard`,

  async pageLoads(page): Promise<void> {
    await page
      .locator(this.heading)
      .waitFor({ state: 'visible', timeout: 3000 });
  },

  async viewDetailsOfPension(page, schemeName): Promise<void> {
    await page.locator(this.heading).waitFor({ state: 'visible' });
    // Find the pension card that exactly matches the schemeName in its heading or main label
    const pensionCards = page.getByTestId('information-callout');
    const matchingCard = pensionCards.filter({ hasText: schemeName });
    // Optionally, ensure only one card matches
    const count = await matchingCard.count();
    if (count !== 1) {
      throw new Error(
        `Expected exactly one pension card with schemeName '${schemeName}', but found ${count}`,
      );
    }
    await matchingCard.getByTestId('details-link').click();
  },

  async pensionCards(page: Page) {
    return page.locator('[data-testid="information-callout"]').all();
  },

  async warningText(pensionCard): Promise<Locator> {
    return pensionCard.locator(
      '[data-testid="pension-card-unavailable-reason"]',
    );
  },

  async getschemeNameOnCard(page, pensionCard) {
    return pensionCard
      .locator('[data-testid="pension-card-scheme-name"]')
      .textContent();
  },

  async estimatedIncome(pensionCard): Promise<string> {
    return (
      (
        await pensionCard
          .locator('[data-testid="pension-card-monthly-amount"]')
          .textContent()
      )?.trim() ?? ''
    );
  },

  async clickSeeDetailsButton(page, pensionCard): Promise<void> {
    const seeDetailsbutton = pensionCard.locator('text=See details');
    await seeDetailsbutton.click({ force: true });
    await page.waitForTimeout(2000);
    await page.waitForURL(/.*pension-details.*/);
  },

  async administratorName(pensionCard): Promise<string> {
    return (
      (
        await pensionCard
          .locator('[data-testid="pension-card-administrator-name"]')
          .textContent()
      )?.trim() ?? ''
    );
  },

  async employerName(pensionCard): Promise<string | null> {
    const locator = pensionCard.locator(
      '[data-testid="pension-card-employer-name"]',
    );
    return (await locator.count()) > 0
      ? (await locator.textContent())?.trim() ?? ''
      : null;
  },

  async pensionStatus(pensionCard): Promise<string | null> {
    const locator = pensionCard.locator('[data-testid="pension-card-status"]');
    return (await locator.count()) > 0
      ? (await locator.textContent())?.trim() ?? ''
      : null;
  },

  async viewPensionCardWithEstimatedIncome(page, schemeName): Promise<void> {
    const pensionCard = page
      .getByTestId('information-callout')
      .filter({ hasText: schemeName });
    await pensionCard.getByText('Employer').waitFor();
    await pensionCard.getByText('Estimated income').waitFor();
    await pensionCard.getByTestId('details-link').waitFor();
  },

  async assertPensions(page, pensions): Promise<void> {
    await page.locator(this.heading).waitFor();

    const confirmedPensionsSection = page.locator(
      'ul[data-testid="confirmed-pensions"]',
    );
    const noIncomePensionsSection = page.locator(
      'ul[data-testid="confirmed-pensions-no-income"]',
    );

    const confirmedPensions = [];
    const noIncomePensions = [];
    const pensionsToExclude = [];

    for (const pension of pensions) {
      if (
        ['POSS', 'CONT', 'SYS', 'NEW'].includes(pension.matchType) ||
        (pension.matchType === 'DEFN' &&
          ['AVC', 'CDC', 'HYB', 'CB'].includes(pension.pensionType)) ||
        (pension.matchType === 'DEFN' &&
          ['DC', 'DB', 'SP'].includes(pension.pensionType) &&
          ['MEM', 'DBC', 'DCC', 'NEW', 'ANO', 'NET', 'TRN'].includes(
            pension.unavailableReason,
          ))
      ) {
        pensionsToExclude.push(pension);
      } else if (
        pension.matchType === 'DEFN' &&
        ['DC', 'DB', 'SP'].includes(pension.pensionType) &&
        ['', 'DB'].includes(pension.unavailableReason)
      ) {
        confirmedPensions.push(pension);
      } else if (
        pension.matchType === 'DEFN' &&
        (['DCHA', 'DCHP', 'PPF', 'WU'].includes(pension.unavailableReason) ||
          pension.payableDetails?.reason === 'SML')
      ) {
        noIncomePensions.push(pension);
      }
    }

    // Verify that expected confirmed pensions are displayed correctly
    for (const pension of confirmedPensions) {
      const matchingItems = confirmedPensionsSection.locator(
        `li:has-text("${pension.schemeName}")`,
      );
      const count = await matchingItems.count();
      if (count === 0) {
        throw new Error(
          `ERROR: Expected confirmed pension scheme "${pension.schemeName}" not found.`,
        );
      }
    }

    // Verify that expected no-income pensions are displayed correctly
    for (const pension of noIncomePensions) {
      const matchingItems = noIncomePensionsSection.locator(
        `li:has-text("${pension.schemeName}")`,
      );
      const count = await matchingItems.count();
      if (count === 0) {
        throw new Error(
          `ERROR: Expected no-income pension scheme "${pension.schemeName}" not found.`,
        );
      }

      // Test case 40558: Ensure estimated retirement date is displayed for no-income pensions
      const estimatedRetirementDate = matchingItems.locator(
        '[data-testid="pension-card-retirement-date"]',
      );
      await estimatedRetirementDate.waitFor({ state: 'visible' });
    }

    // Verify no unexpected pensions are displayed
    const allDisplayedConfirmed = await confirmedPensionsSection
      .locator('h4')
      .allTextContents();
    const allDisplayedNoIncome = await noIncomePensionsSection
      .locator('h4')
      .allTextContents();

    for (const displayed of allDisplayedConfirmed) {
      if (!confirmedPensions.some((p) => p.schemeName === displayed)) {
        throw new Error(
          `ERROR: Unexpected pension scheme "${displayed}" found in confirmed pensions section.`,
        );
      }
    }

    for (const displayed of allDisplayedNoIncome) {
      if (!noIncomePensions.some((p) => p.schemeName === displayed)) {
        throw new Error(
          `ERROR: Unexpected pension scheme "${displayed}" found in no-income pensions section.`,
        );
      }
    }

    // Ensure that pensions that should not be displayed are not present
    for (const pension of pensionsToExclude) {
      const confirmedCheck = await confirmedPensionsSection
        .locator(`li:has-text("${pension.schemeName}")`)
        .count();
      const noIncomeCheck = await noIncomePensionsSection
        .locator(`li:has-text("${pension.schemeName}")`)
        .count();
      if (confirmedCheck > 0 || noIncomeCheck > 0) {
        throw new Error(
          `ERROR: Pension scheme "${pension.schemeName}" should not be displayed but was found.`,
        );
      }
    }

    // Hide headings if no pensions exist in respective categories
    if (confirmedPensions.length === 0) {
      await confirmedPensionsSection.evaluate(
        (node) => (node.style.display = 'none'),
      );
    }
    if (noIncomePensions.length === 0) {
      await noIncomePensionsSection.evaluate(
        (node) => (node.style.display = 'none'),
      );
    }
  },

  async pensionCardType(pensionCard): Promise<string> {
    return (
      (
        await pensionCard
          .locator('[data-testid="pension-card-type"]')
          .textContent()
      )?.trim() ?? ''
    );
  },

  async retirementDate(pensionCard): Promise<string | null> {
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
  },

  async pensionsNotShowingLinkAccordion(page): Promise<void> {
    await page
      .locator(`[data-testid="paragraph"] > a:text-is("Pensions not showing")`)
      .click();
  },

  getPensionCard(page, schemeName) {
    return page
      .getByTestId('information-callout')
      .filter({ hasText: schemeName });
  },

  getEmployerName(page, schemeName) {
    return this.getPensionCard(page, schemeName).getByTestId(
      'pension-card-employer-name',
    );
  },

  getPensionCardType(page, schemeName) {
    return this.getPensionCard(page, schemeName).getByTestId(
      'pension-card-type',
    );
  },

  getActiveStatus(page, schemeName) {
    return this.getPensionCard(page, schemeName).getByTestId(
      'pension-card-status',
    );
  },

  getAdministratorName(page, schemeName) {
    return this.getPensionCard(page, schemeName).getByTestId(
      'pension-card-administrator-name',
    );
  },

  getRetirementDate(page, schemeName) {
    return this.getPensionCard(page, schemeName).getByTestId(
      'pension-card-retirement-date',
    );
  },

  getEstimatedIncome(page, schemeName) {
    return this.getPensionCard(page, schemeName).getByTestId(
      'pension-card-monthly-amount',
    );
  },
  getSeeDetailsButton(page, schemeName) {
    return this.getPensionCard(page, schemeName).getByTestId('details-link');
  },
  getWarningMessage(page, schemeName) {
    return this.getPensionCard(page, schemeName).getByTestId(
      'pension-card-unavailable-reason',
    );
  },
  getPendingMessage(page, schemeName) {
    return this.getPensionCard(page, schemeName).getByTestId(
      'pension-card-expected-income',
    );
  },

  async getBewareOfScamsText(page: Page): Promise<string> {
    const bewareOfScamsText = await page
      .getByTestId(this.scamsCallout)
      .innerText();
    return bewareOfScamsText.replace(/\s+/g, ' ').trim();
  },

  async getEstimateTitleText(page: Page): Promise<string> {
    const estimateTitleText = await page
      .getByRole('heading', { name: /Pensions in your estimate/i })
      .innerText();
    return estimateTitleText.replace(/\s+/g, ' ').trim();
  },

  async getNotInYourEstimateTitleText(page: Page): Promise<string> {
    const notIncludedInYourEstimateTitleText = await page
      .getByRole('heading', { name: /Not in your estimate/i })
      .innerText();
    return notIncludedInYourEstimateTitleText.replace(/\s+/g, ' ').trim();
  },

  async getNotIncludedParagraphText(page: Page): Promise<string> {
    const notIncludedLinkLocator = page.getByRole('link', {
      name: 'not included',
    });

    const paragraphLocator = page
      .locator(this.paragraph)
      .filter({ has: notIncludedLinkLocator });

    const textContent = await paragraphLocator.textContent();

    return textContent.replace(/\s+/g, ' ').trim();
  },

  async getImportantBanner(page: Page): Promise<string> {
    const importantHeadingLocator = page.getByTestId('callout-negative');
    const importantHeading = await importantHeadingLocator.innerText();
    return importantHeading.replace(/\s+/g, ' ').trim();
  },

  async getStatePensionCardType(page: Page): Promise<string> {
    // Locates the smaller 'State Pension' text inside the card type area (h3)
    const cardLocator = page.locator(this.statePensionCard);
    const headingText = await cardLocator
      .locator('h3:has-text("State Pension")')
      .innerText();
    return headingText.replace(/\s+/g, ' ').trim();
  },

  async getStatePensionCardHeading(page: Page): Promise<string> {
    // Locates the main 'State Pension' heading text (h4)
    const cardLocator = page.locator(this.statePensionCard);
    const headingText = await cardLocator
      .locator('h4:has-text("State Pension")')
      .innerText();
    return headingText.replace(/\s+/g, ' ').trim();
  },

  async getStatePensionDateText(page: Page): Promise<string> {
    // Locates the date using its unique data-testid within the card
    const cardLocator = page.locator(this.statePensionCard);
    const dateText = await cardLocator
      .locator(this.paragraph)
      .getByText('State Pension date')
      .innerText();
    return dateText.replace(/\s+/g, ' ').trim();
  },

  async navigateToSchemeIncomeAndValuesTab(page: Page, schemeName: string) {
    await pensionBreakdownPage.viewDetailsOfPension(page, schemeName);
    await pensionDetailsPage.assertHeading(page, schemeName);
    await pensionDetailsPage.checkPensionDetailsTabs(
      page,
      'tab-pension-income-and-values',
      'Income and values',
    );
  },
};
export default pensionBreakdownPage;
