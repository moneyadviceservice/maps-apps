/**
 * End-to-end tests for Fuel Finder postcode search functionality.
 *
 * Covers:
 * - ✅ Valid postcode submissions and navigation to results page
 * - ❌ Invalid postcode validation with same-page error handling
 * - ⚠️ Edge-case inputs to ensure robust handling
 *
 * Supports multilingual testing for:
 * - English (en)
 * - Welsh (cy)
 *
 * Uses Page Object Model (POM) for maintainability and cleaner test structure.
 */
import { expect, test } from '@lib/test.lib';

import { invalidCases } from '../data/invalidPostcodes';
import { postcodes } from '../data/postcodes';

/**
 * ✅ VALID DATA
 */
const validCases = [...Object.entries(postcodes.valid)].sort(([a], [b]) =>
  a.localeCompare(b),
);

/**
 * ✅ EDGE DATA
 */
const edgeCases = [...Object.entries(postcodes.edge)].sort(([a], [b]) =>
  a.localeCompare(b),
);

/**
 * ✅ INVALID DATA
 */
const invalidSamePage = invalidCases.filter((t) => t.shouldStayOnPage);

/**
 * Generates postcode search tests for a given language.
 */
function createTests(lang: 'en' | 'cy') {
  test.describe(`Fuel Finder – Postcode Search (${lang})`, () => {
    test.beforeEach(async ({ extendedPage, homePage }) => {
      await extendedPage.gotoWithCookies(lang);

      await expect(homePage.postcodeInput).toBeVisible();
    });

    //
    // ✅ VALID TESTS
    //
    for (const [label, code] of validCases) {
      test(`valid: ${label}`, async ({ homePage, resultsPage }) => {
        await homePage.submitPostcode(code);

        await homePage.page.waitForURL(/results/i);

        await resultsPage.waitForReady();
        await expect(resultsPage.page).toHaveURL(/results/i);
      });
    }

    //
    // ❌ INVALID TESTS
    for (const testCase of invalidSamePage) {
      test(`invalid: ${testCase.label} → error`, async ({
        homePage,
        extendedPage,
      }) => {
        await homePage.enterPostcode(testCase.code);

        await homePage.clickFindPrices();

        await expect(extendedPage).not.toHaveURL(/results/i);

        const expected = testCase.errorMessage?.[lang];

        const error = await homePage.waitForErrorMessage();

        expect(
          expected,
          `Missing expected error message for test case: ${testCase.label}`,
        ).toBeDefined();

        const expectedText: string = expected;

        await expect(error).toContainText(expectedText);
      });
    }

    //
    // ⚠️ EDGE TESTS
    //
    for (const [label, code] of edgeCases) {
      test(`edge: ${label}`, async ({ homePage, resultsPage }) => {
        await homePage.submitPostcode(code.trim());

        await homePage.page.waitForURL(/results/i);

        await resultsPage.waitForReady();
        await expect(resultsPage.page).toHaveURL(/results/i);
      });
    }
  });
}

/**
 * ✅ Execute for both languages
 */
createTests('en');
createTests('cy');
