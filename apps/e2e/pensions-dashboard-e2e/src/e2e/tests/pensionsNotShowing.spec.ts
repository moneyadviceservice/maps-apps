import { expect, test } from '@playwright/test';
import pensionsNotShowingPage from '../pages/PensionsNotShowingPage';
import commonHelpers from '../utils/commonHelpers';

const pageHeading = 'Pensions not showing';
const pensionsNotShowingSummary =
  'We’re still building and improving our service. We’re connecting new pension schemes on a regular basis.';
const pensionsNotShowingSubheading = 'What you can do:';
const textOnPage1 = 'Check back later to see if your pensions are showing.';
const textOnPage2 =
  'Let us know your National Insurance number (NINO) if you haven’t already. You’ll have to return to the start and sign in again with GOV.UK One Login.';
const textOnPage3 =
  'If your State Pension is not showing and you think you’re entitled to one, ';
const textOnPage4 =
  'If you know the name of your employer(s) or pension provider(s), contact them directly.';
const linkText =
  'check your details using your State Pension forecast  (opens in a new window) ';

test.describe('User views content on Pensions not Showing Page', () => {
  test.beforeEach(async ({ page }) => {
    await commonHelpers.navigateToStartPage(page);
  });

  test('Verify Content on Pensions not showing page', async ({ page }) => {
    await page.goto('/en/pensions-not-showing');
    await pensionsNotShowingPage.pageLoads(page);
    await expect(page.getByTestId('page-title')).toContainText(pageHeading);
    await expect(page.getByTestId('tool-intro')).toContainText(
      pensionsNotShowingSummary,
    );
    await expect(
      page.locator(`h2:text-is("${pensionsNotShowingSubheading}")`),
    ).toBeVisible();
    await expect(page.locator('li > p').first()).toContainText(textOnPage1);
    await expect(page.locator('li > p').nth(1)).toContainText(textOnPage2);
    await expect(page.locator('li > p').nth(2)).toContainText(textOnPage3);
    await expect(page.locator('li > p').nth(3)).toContainText(textOnPage4);
    await expect(page.locator('li > p > a')).toContainText(linkText);
  });
});
