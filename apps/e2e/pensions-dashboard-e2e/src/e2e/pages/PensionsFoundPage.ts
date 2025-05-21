import { Page } from '@playwright/test';

type PensionsFoundPage = {
  heading: string;
  headingNoPensions: string;
  seePendingPensionsButton: string;
  seePensionsBreakdownButton: string;
  noPensionsIntro: string;
  noPensionsSubheading: string;
  unsupportedPensionsFound: string;
  clickReviewPensions(page: Page): Promise<void>;
  clickSeePendingPensions(page: Page): Promise<void>;
  clickSeeYourPensions(page: Page): Promise<void>;
  waitForPensionsFound(page: Page): Promise<void>;
  assertPensionsFound(page: Page, pensions: any): Promise<void>;
  assertInvalidPensionsNotVisible(page, pensions): Promise<void>;
  noPensionsFound(page: Page): Promise<void>;
};

const pensionsFoundPage: PensionsFoundPage = {
  heading: `h1:text-is("Pensions found")`,
  headingNoPensions: `h1:text-is("No pensions found")`,
  seePendingPensionsButton: `a[href*="pending-pensions"]`,
  seePensionsBreakdownButton: 'See your pensions',
  noPensionsIntro:
    'We’re still building and improving our service. We’re connecting new pension schemes on a regular basis.',
  noPensionsSubheading: 'What you can do:',
  unsupportedPensionsFound: 'Unsupported pensions found',

  async clickReviewPensions(page): Promise<void> {
    await page.locator(`a:has-text("Get contact details")`).click();
  },

  async clickSeePendingPensions(page): Promise<void> {
    await page.locator(this.seePendingPensionsButton).waitFor();
    await page.locator(this.seePendingPensionsButton).click();
    await page.locator('h1:text-is("Pending pensions")').waitFor();
  },

  async clickSeeYourPensions(page): Promise<void> {
    await page
      .getByRole('link', { name: this.seePensionsBreakdownButton })
      .waitFor();
    await page
      .getByRole('link', { name: this.seePensionsBreakdownButton })
      .click();
    await page.locator(`h1:text-is("Your pensions")`).waitFor();
  },

  async waitForPensionsFound(page): Promise<void> {
    await page.locator(this.heading).waitFor({ timeout: 100000 });
  },

  async assertPensionsFound(page, pensions) {
    const negativeContainer = page.locator(`[data-testid="callout-negative"]`);
    const positiveContainer = page.locator(`[data-testid="callout-positive"]`);
    const warningContainer = page.locator(`[data-testid="callout-warning"]`);

    // Check all pensions
    for (const pension of pensions) {
      let expectedContainer = null;
      let expectedHeader = '';
      let shouldBeDisplayed = true;

      if (
        ['POSS', 'CONT'].includes(pension.matchType) ||
        (pension.matchType === 'DEFN' &&
          ['DC', 'DB', 'SP'].includes(pension.pensionType) &&
          ['MEM'].includes(pension.unavailableReason))
      ) {
        expectedContainer = negativeContainer;
        expectedHeader = 'Pensions that need you to contact the provider';
      } else if (
        (pension.matchType === 'DEFN' &&
          ['DC', 'DB', 'SP'].includes(pension.pensionType) &&
          [null, '', 'DCSM', 'DB', 'PPF', 'DCHA', 'DCHP', 'WU'].includes(
            pension.unavailableReason,
          )) ||
        pension.payableDetails?.reason === 'SML'
      ) {
        expectedContainer = positiveContainer;
        expectedHeader = 'Your pensions';
      } else if (
        ['SYS', 'NEW'].includes(pension.matchType) ||
        (pension.matchType === 'DEFN' &&
          ['DC', 'DB', 'SP'].includes(pension.pensionType) &&
          ['DBC', 'DCC', 'NEW', 'ANO', 'NET', 'TRN'].includes(
            pension.unavailableReason,
          ))
      ) {
        expectedContainer = warningContainer;
        expectedHeader = 'Pending pensions';
      } else if (
        pension.matchType === 'DEFN' &&
        ['AVC', 'CDC', 'HYB', 'CB'].includes(pension.pensionType)
      ) {
        shouldBeDisplayed = false;
      }

      if (shouldBeDisplayed) {
        if (!expectedContainer) {
          throw new Error(
            `ERROR: Pension scheme "${pension.schemeName}" should be displayed but was not found.`,
          );
        }
        // Check if the pension scheme is listed in the expected container
        const matchingItems = expectedContainer.locator(
          `li:has-text("${pension.schemeName}")`,
        );
        const count = await matchingItems.count();

        if (count === 0) {
          throw new Error(
            `No matching items found for pension scheme: "${pension.schemeName}"`,
          );
        }

        await expectedContainer
          .locator(`h4:has-text("${expectedHeader}")`)
          .waitFor({ state: 'visible' });
      } else {
        // Ensure that pensionAdministrator is not displayed anywhere
        const allContainers = [
          negativeContainer,
          positiveContainer,
          warningContainer,
        ];
        for (const container of allContainers) {
          const matchingItems = container.locator(
            `li:has-text("${pension.pensionAdministrator}")`,
          );
          if ((await matchingItems.count()) > 0) {
            throw new Error(
              `ERROR: Pension administrator "${pension.pensionAdministrator}" should not be displayed but was found.`,
            );
          }
        }
      }
    }
  },

  async assertInvalidPensionsNotVisible(page, pensions): Promise<void> {
    const allowedPensionTypes = ['SP', 'DC', 'DB'];

    for (const pension of pensions) {
      const schemeLocator = page.locator(`:has-text("${pension.schemeName}")`);

      if (allowedPensionTypes.includes(pension.pensionType)) {
        // Throw Error if allowed pension is not visible
        if (
          (await schemeLocator.count()) === 0 ||
          !(await schemeLocator.first().isVisible())
        ) {
          throw new Error(
            `ERROR: Pension scheme "${pension.schemeName}" with ALLOWED pensionType "${pension.pensionType}" should be visible but was not found.`,
          );
        } else {
          console.log(
            `Pension scheme "${pension.schemeName}" with allowed pensionType "${pension.pensionType}" is correctly displayed.`,
          );
        }
      } else {
        // Throw Error is disallowed pension is visible
        if (
          (await schemeLocator.count()) > 0 &&
          (await schemeLocator.first().isVisible())
        ) {
          throw new Error(
            `ERROR: Pension scheme "${pension.schemeName}" with DISALLOWED pensionType "${pension.pensionType}" should NOT be visible but was found.`,
          );
        } else {
          console.log(
            `Pension scheme "${pension.schemeName}" with disallowed pensionType "${pension.pensionType}" is NOT displayed (as expected).`,
          );
        }
      }
    }
  },

  async noPensionsFound(page: Page): Promise<void> {
    await page.locator(this.headingNoPensions).waitFor();
  },
};

export default pensionsFoundPage;
