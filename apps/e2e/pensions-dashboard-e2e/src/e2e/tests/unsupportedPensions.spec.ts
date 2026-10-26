/* eslint-disable playwright/no-focused-test */
import { expect, test } from '@maps/playwright';

import {
  supportedUnsupportedPensions,
  unsupportedPensionTypes,
} from '../data/scenarioDetails';

test.describe('Moneyhelper Pension Dashboard', () => {
  test.beforeEach(async ({ commonHelpers }) => {
    await commonHelpers.navigateToEmulator('en');
  });

  test.afterEach(async ({ commonHelpers }) => {
    await commonHelpers.logoutOfApplication();
  });

  test('Pensions containing supported and unsupported pension types', async ({
    page,
    commonHelpers,
    loadingPage,
    pensionsFoundPage,
    scenarioSelectionPage,
    welcomePage,
  }) => {
    await scenarioSelectionPage.selectScenarioComposerDev(
      supportedUnsupportedPensions.option,
    );
    await welcomePage.welcomePageLoads();
    await welcomePage.clickWelcomeButton();
    await loadingPage.waitForPensionsToLoad(commonHelpers, 'en');
    await pensionsFoundPage.waitForPensionsFound();
    await pensionsFoundPage.assertPensionsFound(
      page,
      supportedUnsupportedPensions.pensions,
    );
    await pensionsFoundPage.assertInvalidPensionsNotVisible(
      supportedUnsupportedPensions.pensions,
    );
    await expect(page.getByTestId('pensions-found')).toContainText(
      'We found 2 pensions',
    );
    await expect(page.getByTestId(`unsupported-callout`)).toContainText(
      pensionsFoundPage.unsupportedPensionsFound,
    );
    await pensionsFoundPage.clickSeeYourPensions();
  });

  test('Pensions containing only unsupported pension types', async ({
    page,
    commonHelpers,
    loadingPage,
    pensionsFoundPage,
    scenarioSelectionPage,
    welcomePage,
  }) => {
    await scenarioSelectionPage.selectScenarioComposerDev(
      unsupportedPensionTypes.option,
    );
    await welcomePage.welcomePageLoads();
    await welcomePage.clickWelcomeButton();
    await loadingPage.waitForPensionsToLoad(commonHelpers, 'en');
    await pensionsFoundPage.waitForPensionsFound();
    await expect(page.getByTestId('pensions-found')).toBeHidden();
    await expect(page.getByTestId(`unsupported-callout`)).toContainText(
      pensionsFoundPage.unsupportedPensionsFound,
    );
  });
});
