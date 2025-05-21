import { Page } from '@playwright/test';

type PensionsThatNeedAction = {
  heading: string;
  assertPensionsThatNeedAction(page: Page, pensions: any): Promise<void>;
  navigateBack(page: Page): Promise<void>;
};

const pensionsThatNeedAction: PensionsThatNeedAction = {
  heading: `h1:has-text("Pensions that need action")`,

  async assertPensionsThatNeedAction(page: Page, pensions: any): Promise<void> {
    await page.waitForSelector(this.heading);
    const pensionCards = page.getByTestId('information-callout');
    let index = 0;
    await pensionCards.nth(index).waitFor();

    // requires updating when data mapping completed
    const possPensions = pensions.filter(
      (pension) =>
        ['CONT', 'POSS'].includes(pension.matchType) ||
        (pension.matchType === 'DEFN' &&
          ['MEM'].includes(pension.unavailableReason)),
    );

    for (const pension of possPensions) {
      const summaryBlockTitle = pensionCards
        .nth(index)
        .getByTestId('summary-block-title');
      await summaryBlockTitle.waitFor();
      await summaryBlockTitle.click();

      const contactDetails = pensionCards
        .nth(index)
        .getByTestId('expandable-section');
      await contactDetails.waitFor();

      await pensionCards
        .filter({ hasText: pension.schemeName })
        .locator(`:has-text("${pension.referenceNumber}")`)
        .waitFor({ state: 'visible' });

      await pensionCards
        .filter({ hasText: pension.schemeName })
        .locator(`:has-text("${pension.pensionAdministrator}")`)
        .first()
        .waitFor({ state: 'visible' });
      index++;
    }
  },

  async navigateBack(page: Page): Promise<void> {
    await page.locator('a[data-testid="back"]').click();
  },
};
export default pensionsThatNeedAction;
