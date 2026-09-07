import { expect, Locator, Page } from '@playwright/test';

interface SummaryTotalPage {
  getSummaryTotalDL(): Locator;
  getDescriptionSpan(): Locator;
  getDTElements(): Locator;
  getDDElements(): Locator;
  verifySummaryTotalStructure(): Promise<void>;
}

const summaryTotalPage = (page: Page): SummaryTotalPage => {
  return {
    getSummaryTotalDL(): Locator {
      return page.locator(
        'dl[aria-labelledby="summary-total-heading"][aria-describedby="summary-total-description"]',
      );
    },

    getDescriptionSpan(): Locator {
      return page.locator('span#summary-total-description');
    },

    getDTElements(): Locator {
      return page.locator('dl dt');
    },

    getDDElements(): Locator {
      return page.locator('dl dd');
    },

    async verifySummaryTotalStructure(): Promise<void> {
      // Test 1: Verify dl element with aria attributes
      await expect(this.getSummaryTotalDL()).toBeVisible();

      // Test 2: Verify description span
      const descriptionSpan = this.getDescriptionSpan();
      await expect(descriptionSpan).toBeVisible();
      const text = await descriptionSpan.textContent();
      expect(text).toContain('Financial summary');

      // Test 3: Verify dt elements have aria-labels
      const dtElements = this.getDTElements();
      const dtCount = await dtElements.count();
      expect(dtCount).toBeGreaterThanOrEqual(3);

      const firstDT = dtElements.first();
      await expect(firstDT).toHaveAttribute('aria-label', /.+/);

      // Test 4: Verify dd elements have descriptive aria-labels
      const ddElements = this.getDDElements();
      const firstDD = ddElements.first();
      await expect(firstDD).toHaveAttribute('aria-label', /.+/);

      const ariaLabel = await firstDD.getAttribute('aria-label');
      expect(ariaLabel).toMatch(/amount|value|£/i);

      // Test 5: Verify consistent structure
      const ddCount = await ddElements.count();
      expect(ddCount).toBeGreaterThanOrEqual(3);
    },
  };
};

export default summaryTotalPage;
