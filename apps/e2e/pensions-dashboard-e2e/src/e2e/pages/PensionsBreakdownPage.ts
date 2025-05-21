import { Page } from '@playwright/test';

type PensionBreakdownPage = {
  heading: string;
  summary: string;
  yourPensionsBreadcrumb: string;
  pensionsFoundBreadcrumb: string;
  viewPensionCardWithEstimatedIncome(
    page: Page,
    schemeName: any,
  ): Promise<void>;
  pageLoads(page: Page): Promise<void>;
  viewDetailsOfPension(page: Page, pensionName: any): Promise<void>;
  assertPensions(page: Page, pensions: any): Promise<void>;
  helpAndSupportLinkAccordion(page: Page): Promise<void>;
  getPensionCard(page: Page, schemeName: any): any;
  getEmployerName(page: Page, schemeName: any): any;
  getAdministratorName(page: Page, schemeName: any): any;
  getRetirementDate(page: Page, schemeName: any): any;
  getEstimatedIncome(page: Page, schemeName: any): any;
  getWarningMessage(page: Page, schemeName: any): any;
  getSeeDetailsButton(page: Page, schemeName: any): any;
  getPensionCardType(page: Page, schemeName: any): any;
  getActiveStatus(page: Page, schemeName: any): any;
};

const pensionBreakdownPage: PensionBreakdownPage = {
  heading: `h1:text-is("Your pensions")`,
  summary: 'callout-white',
  yourPensionsBreadcrumb: `a[href*="your-pensions"]`,
  pensionsFoundBreadcrumb: `a[href*="overview"]`,

  async pageLoads(page): Promise<void> {
    await page.locator(this.heading).waitFor();
  },

  async viewDetailsOfPension(page, pensionName): Promise<void> {
    await page.locator(this.heading).waitFor();
    const pensionCards = page.getByTestId('information-callout');
    await pensionCards.nth(0).waitFor();
    await pensionCards
      .filter({ hasText: pensionName })
      .getByTestId('details-link')
      .click();
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

  async helpAndSupportLinkAccordion(page): Promise<void> {
    await page
      .locator(`[data-testid="paragraph"] > a:text-is("Help and support")`)
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
};
export default pensionBreakdownPage;
