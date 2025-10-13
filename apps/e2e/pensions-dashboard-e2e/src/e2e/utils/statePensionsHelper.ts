import { expect, Page } from '@playwright/test';

import statePensionsDetailsPage from '../pages/StatePensionsDetailsPage';
import { formatDate } from './dateFormatter';

export async function verifyStatePensionDetailsPage(
  page: Page,
  {
    eriPayableDetails,
    apPayableDetails,
    retirementDate,
    statePensionMessageEng,
    pensionRetirementOnPensionsCard,
  }: {
    eriPayableDetails: { monthlyAmount: number; annualAmount: number };
    apPayableDetails: { monthlyAmount: number; annualAmount: number };
    retirementDate: string;
    statePensionMessageEng: string;
    pensionRetirementOnPensionsCard: string;
  },
) {
  // Wait for the details link to be visible and clickable
  const detailsLink = page.getByTestId('details-link');
  await detailsLink.waitFor({ state: 'visible' });
  await expect(detailsLink).toBeEnabled();
  await detailsLink.click({ force: true });

  // Verify transition to details page by checking details link is no longer visible
  await expect(detailsLink).not.toBeVisible({ timeout: 3000 });

  // pensions details page
  await statePensionsDetailsPage.waitForPageTitle(page);

  // verify updated tool tip
  const firstToolTip = await statePensionsDetailsPage.getFirstToolTipIcon(page);
  const monthlyAmountfromIntro =
    await statePensionsDetailsPage.getRetirementMonthlyAmount(page);
  const introText = `You will reach State Pension age ${firstToolTip} on ${pensionRetirementOnPensionsCard}. Your forecast is ${monthlyAmountfromIntro}, based on your National Insurance Show more information record.`;
  const actualIntroText = await statePensionsDetailsPage.getIntroInformation(
    page,
  );
  // Normalize both strings by removing extra whitespace and line breaks
  const normalizedExpected = introText.replace(/\s+/g, ' ').trim();
  const normalizedActual = actualIntroText.replace(/\s+/g, ' ').trim();
  expect(normalizedActual).toContain(normalizedExpected);

  await expect(page.getByTestId('tool-intro')).toBeVisible();

  //compare pension forecast
  const forecastStatement = await statePensionsDetailsPage.getForecastStatement(
    page,
  );
  expect(forecastStatement).toContain(statePensionMessageEng);

  // Verify AP and ERI pension amounts on details page
  const estimatedRetirementDate =
    await statePensionsDetailsPage.getCurrentPayableDate(page);
  const forecastRetirementDate =
    await statePensionsDetailsPage.getRetirementPayableDate(page);

  const customEstimatedRetirementDate = formatDate(
    estimatedRetirementDate ?? '',
    'YYYY-MM-DD',
  );
  const customForecastRetirementDate = formatDate(
    forecastRetirementDate ?? '',
    'YYYY-MM-DD',
  );

  // Verify current amounts
  expect(
    await statePensionsDetailsPage.verifyMonthlyEstimateToday(
      page,
      apPayableDetails.monthlyAmount,
    ),
  ).toBe(true);
  expect(
    await statePensionsDetailsPage.verifyYearlyEstimateToday(
      page,
      apPayableDetails.annualAmount,
    ),
  ).toBe(true);

  // Verify retirement amounts
  expect(
    await statePensionsDetailsPage.verifyMonthlyForecast(
      page,
      eriPayableDetails.monthlyAmount,
    ),
  ).toBe(true);
  expect(
    await statePensionsDetailsPage.verifyYearlyForecast(
      page,
      eriPayableDetails.annualAmount,
    ),
  ).toBe(true);

  expect(customEstimatedRetirementDate).toBe(retirementDate);
  expect(customForecastRetirementDate).toBe(retirementDate);
}
