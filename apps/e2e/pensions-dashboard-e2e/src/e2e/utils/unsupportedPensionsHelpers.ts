import { APIRequestContext, expect, Page } from '@maps/playwright';

import pensionsFoundPage from '../pages/PensionsFoundPage';
import { RequestHelper } from './request';
import commonHelpers from './commonHelpers';

export async function verifyUnsupportedPensions(
  page: Page,
  request: APIRequestContext,
) {
  const response = await RequestHelper.getPensionCategory(
    page,
    request,
    'UNSUPPORTED',
  );
  const responseJson = await response.json();
  const { arrangements } = responseJson;

  // If not on pension-search-results page, click back button to navigate there
  const currentUrl = page.url();
  if (!currentUrl.includes('your-pension-search-results')) {
    await commonHelpers.clickBackLink(page);
    await page.waitForURL(/.*your-pension-search-results/);
  }

  await expect(page).toHaveURL(/.*your-pension-search-results/);
  const urgentCallout = await pensionsFoundPage.linkExpectingOtherPensions(
    page,
  );
  const unsupportedCallout = page.getByTestId(`unsupported-callout`);
  await expect(unsupportedCallout).toBeVisible();
  await expect(unsupportedCallout).toContainText(
    pensionsFoundPage.unsupportedPensionsFound,
  );

  await expect(urgentCallout).toBeVisible();
  expect(arrangements).toHaveLength(1);
  const pension = arrangements[0];
  expect(pension.pensionType).toBe('DB');
  expect(pension.schemeName).toBe('One McCloud Multiplicity Pension Scheme');
  expect(pension.pensionAdministrator.name).toBe('Infinity');
}
