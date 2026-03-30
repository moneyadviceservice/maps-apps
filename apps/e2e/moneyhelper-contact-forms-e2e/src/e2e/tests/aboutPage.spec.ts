/* eslint-disable playwright/expect-expect */
import { expect, test } from '@playwright/test';

import { FlowName, StepName } from '../lib/constants';
import { EnquiryTypePage } from '../pages/EnquiryTypePage';
import { InsuranceTypePage } from '../pages/InsuranceTypePage';
import { NamePage } from '../pages/NamePage';
let enquiryTypePage: EnquiryTypePage;
let insuranceTypePage: InsuranceTypePage;
let namePage: NamePage;

test.describe('About Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
    enquiryTypePage = new EnquiryTypePage(page);
    insuranceTypePage = new InsuranceTypePage(page);
    namePage = new NamePage(page);
  });

  test('routes via scams flow to the about page, then continues to name', async ({
    page,
  }) => {
    await enquiryTypePage.goToEnquiryType();
    await namePage.goToName(FlowName.SCAMS);

    await expect(page.getByTestId('name-title')).toBeVisible();
  });

  test('routes via insurance travel to the about insurance page where the journey ends', async ({
    page,
  }) => {
    await insuranceTypePage.goToInsuranceType();
    await insuranceTypePage.clickRadio(FlowName.INSURANCE_TRAVEL);
    await insuranceTypePage.submitForm();

    await page.waitForURL(`/en/${StepName.ABOUT_INSURANCE}`, {
      timeout: 20000,
    });

    // Expect
    await expect(page.getByTestId('about-insurance-title')).toBeVisible();
  });
});
