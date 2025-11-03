/* eslint-disable playwright/no-focused-test */
/* eslint-disable playwright/no-networkidle */
import { expect, test } from '@playwright/test';

import { zTestAllDetails } from '../data/scenarioDetails';
import loadingPage from '../pages/LoadingPage';
import pensionsFoundPage from '../pages/PensionsFoundPage';
import scenarioSelectionPage from '../pages/ScenarioSelectionPage';
import supportPages from '../pages/SupportPages';
import welcomePage from '../pages/WelcomePage';
import commonHelpers from '../utils/commonHelpers';

test.describe('Moneyhelper Pension Dashboard Support Pages', () => {
  const URL: { [key in string]: string } = {
    explore: '/en/support/explore-the-pensions-dashboard',
    understand: '/en/support/understand-your-pensions',
    report: '/en/support/report-a-technical-problem',
  };

  const heading: { [key in string]: string } = {
    explore: 'Explore the Pensions Dashboard',
    understand: 'Understand your pensions',
    report: 'Report a technical problem',
  };

  test.beforeEach(async ({ page }) => {
    await commonHelpers.navigateToEmulator(page);
    await scenarioSelectionPage.selectScenarioComposerDev(
      page,
      zTestAllDetails.option,
    );
    await welcomePage.welcomePageLoads(page);
    await welcomePage.clickWelcomeButton(page);
    await loadingPage.waitForPensionsToLoad(page);
    await pensionsFoundPage.waitForPensionsFound(page);
  });

  test('Support pages', async ({ page }) => {
    // understand > explore > report > explore > explore
    await supportPages.findLinkAndSelect(page, heading.understand);
    expect(page.url()).toContain(URL.understand);
    await supportPages.findLinkAndSelect(page, heading.explore);
    expect(page.url()).toContain(URL.explore);
    await supportPages.findLinkAndSelect(page, heading.report);
    expect(page.url()).toContain(URL.report);
    await supportPages.findLinkAndSelect(page, heading.explore);
    expect(page.url()).toContain(URL.explore);
    await supportPages.findBackButtonAndSelect(page, heading.explore);
    expect(page.url()).toContain(URL.explore);

    // // understand > report > understand > understand
    await supportPages.findLinkAndSelect(page, heading.understand);
    expect(page.url()).toContain(URL.understand);
    await supportPages.findLinkAndSelect(page, heading.report);
    expect(page.url()).toContain(URL.report);
    await supportPages.findLinkAndSelect(page, heading.understand);
    expect(page.url()).toContain(URL.understand);
    await supportPages.findBackButtonAndSelect(page, heading.understand);
    expect(page.url()).toContain(URL.understand);
  });
});
