/**
 * End-to-end tests for the Fuel Finder landing page fuel type question.
 *
 * Covers:
 * - ✅ Default pre-selection of Unleaded (E10)
 * - ✅ Selection carried through to the results page and filter panel
 * - ❌ Selection preserved after an invalid location error round-trip
 *
 * Supports multilingual testing for:
 * - English (en)
 * - Welsh (cy)
 */
import { expect, test } from '@lib/test.lib';

function createTests(lang: 'en' | 'cy') {
  test.describe(`Fuel Finder – Fuel Type Question (${lang})`, () => {
    test.beforeEach(async ({ extendedPage, homePage }) => {
      await extendedPage.gotoWithCookies(lang);

      await expect(homePage.postcodeInput).toBeVisible();
    });

    test('pre-selects Unleaded (E10) by default', async ({ homePage }) => {
      await expect(homePage.fuelRadio('E10')).toBeChecked();

      await expect(homePage.fuelRadio('E5')).not.toBeChecked();
      await expect(homePage.fuelRadio('B7_STANDARD')).not.toBeChecked();
      await expect(homePage.fuelRadio('B7_PREMIUM')).not.toBeChecked();

      await expect(homePage.fuelLabel('B7_STANDARD')).toContainText(
        lang === 'cy' ? 'Disel' : 'Diesel',
      );
    });

    test('carries the selected fuel type through to the results page', async ({
      homePage,
      resultsPage,
      resultsFilterPage,
    }) => {
      await homePage.selectFuelType('B7_STANDARD');
      await homePage.submitStaticPostcode();

      await homePage.page.waitForURL(/results/i);
      await expect(homePage.page).toHaveURL(/fuelType=B7_STANDARD/);

      await resultsPage.waitForReady();
      await expect(resultsFilterPage.fuelRadio('B7_STANDARD')).toBeChecked();
    });

    test('keeps the selection after an invalid location error', async ({
      homePage,
      extendedPage,
    }) => {
      await homePage.selectFuelType('B7_STANDARD');
      await homePage.enterPostcode('ZZ1 ZZ1');
      await homePage.clickFindPrices();

      await expect(extendedPage).not.toHaveURL(/results/i);
      await homePage.waitForErrorMessage();

      await expect(homePage.fuelRadio('B7_STANDARD')).toBeChecked();
      await expect(extendedPage).toHaveURL(/fuelType=B7_STANDARD/);
    });
  });
}

/**
 * ✅ Execute for both languages
 */
createTests('en');
createTests('cy');
