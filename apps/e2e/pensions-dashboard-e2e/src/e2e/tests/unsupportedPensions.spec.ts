/* eslint-disable playwright/no-focused-test */
import { expect, test } from '@playwright/test';

import {
  supportedUnsupportedPensions,
  unsupportedPensionTypes,
} from '../data/scenarioDetails';
import loadingPage from '../pages/LoadingPage';
import pensionsFoundPage from '../pages/PensionsFoundPage';
import scenarioSelectionPage from '../pages/ScenarioSelectionPage';
import welcomePage from '../pages/WelcomePage';
import commonHelpers from '../utils/commonHelpers';

test.describe('Moneyhelper Pension Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await commonHelpers.navigateToEmulator(page);
  });
  test.afterEach(async ({ page }) => {
    await commonHelpers.logoutOfApplication(page);
  });

  test('Pensions containing supported and unsupported pension types', async ({
    page,
  }) => {
    await scenarioSelectionPage.selectScenario(
      page,
      supportedUnsupportedPensions.option,
    );
    await welcomePage.welcomePageLoads(page);
    await welcomePage.clickWelcomeButton(page);
    await loadingPage.waitForPensionsToLoad(page);
    await pensionsFoundPage.waitForPensionsFound(page);
    await pensionsFoundPage.assertPensionsFound(
      page,
      supportedUnsupportedPensions.pensions,
    );
    await pensionsFoundPage.assertInvalidPensionsNotVisible(
      page,
      supportedUnsupportedPensions.pensions,
    );
    await expect(page.getByTestId('pensions-found')).toContainText(
      'We found one pension',
    );
    await expect(page.getByTestId(`unsupported-callout`)).toContainText(
      pensionsFoundPage.unsupportedPensionsFound,
    );
    await pensionsFoundPage.clickSeeYourPensions(page);
  });

  test('Pensions containing only unsupported pension types', async ({
    page,
  }) => {
    await scenarioSelectionPage.selectScenario(
      page,
      unsupportedPensionTypes.option,
    );
    await welcomePage.welcomePageLoads(page);
    await welcomePage.clickWelcomeButton(page);
    await loadingPage.waitForPensionsToLoad(page);
    await pensionsFoundPage.waitForPensionsFound(page);
    await expect(page.getByTestId('pensions-found')).toBeHidden();
    await expect(page.getByTestId(`unsupported-callout`)).toContainText(
      pensionsFoundPage.unsupportedPensionsFound,
    );
  });
});
