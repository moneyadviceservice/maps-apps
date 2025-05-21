import { Page } from '@playwright/test';

type PensionDetailsPage = {
  heading: string;
  summary: string;
  assertHeading(page: Page, schemeName: any): Promise<void>;
  assertPendingPensionDetailsPage(page: Page, pensions: any): Promise<void>;
  tableSectionHeading(pag: Page, tableHeading: any): any;
  tableHeadings(page: Page): any;
  getDataCol1(page: Page, label: string): any;
  getDataCol2(page: Page, label: string): any;
};

const pensionDetailsPage: PensionDetailsPage = {
  heading: 'h1',
  summary: 'tool-intro',

  async assertHeading(page, schemeName): Promise<void> {
    await page
      .locator(`${this.heading}:has-text("${schemeName} summary")`)
      .waitFor();
  },

  tableSectionHeading(page, tableHeading) {
    return page
      .getByTestId('table-section-heading')
      .filter({ hasText: tableHeading });
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
          pension.unavailableReason == 'TRN' ||
          pension.unavailableReason == 'DCHA'),
    );

    for (const pension of pendingPensions) {
      // Pension Summary Heading
      await page.getByTestId(this.summary).waitFor();
      await page
        .locator(`${this.heading}:has-text("${pension.schemeName} summary")`)
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
};

export default pensionDetailsPage;
