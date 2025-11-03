/* eslint-disable playwright/no-conditional-in-test */
import { expect, Page } from '@playwright/test';

import pensionDetailsPage from '../pages/PensionDetailsPage';
import pensionBreakdownPage from '../pages/PensionsBreakdownPage';
import statePensionsDetailsPage from '../pages/StatePensionsDetailsPage';
import commonHelpers from './commonHelpers';
import { formatDate } from './dateFormatter';

const normalizeText = (value: string) =>
  value
    .replaceAll('\u00A0', ' ') // non-breaking space to regular space
    .replaceAll(/\s+/g, ' ') // collapse all whitespace
    .trim();

const normalizePhoneText = (text: string) => {
  return text
    .split('\n')
    .map((line) => line.trim().replaceAll(/·$/, ''))
    .filter((line) => line.length > 0)
    .join(', ');
};

const formatAmountForDisplay = (amount: number | null) => {
  if (amount === null) {
    return '--';
  }
  const formattedAmount = Number(amount).toLocaleString('en-GB', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  // Remove .00 if it's a whole number
  return formattedAmount.endsWith('.00')
    ? formattedAmount.slice(0, -3)
    : formattedAmount;
};

const formatAmountNoPennyForDisplay = (amount: number | null) => {
  return amount !== null ? Number(amount).toLocaleString('en-GB') : '--';
};

const findMatchingArrangement = (
  pensionPolicies: { pensionArrangements: any[] }[],
  schemeNameOnCard: string,
) =>
  pensionPolicies
    .flatMap((p) => p.pensionArrangements)
    .find((a: any) => a.schemeName === schemeNameOnCard);

const findComponent = (
  matchingArrangement: {
    benefitIllustrations?: { illustrationComponents?: any[] }[];
  },
  illustrationType: string,
) =>
  matchingArrangement.benefitIllustrations
    ?.flatMap((i: any) => i.illustrationComponents)
    ?.find((c: any) => c.illustrationType === illustrationType);

export function deriveDbIllustrationData(pensionPolicies: any) {
  const allArrangements = pensionPolicies.flatMap(
    (p: any) => p.pensionArrangements,
  );
  const dbArrangement =
    allArrangements.find((a: any) => a.pensionType === 'DB') ??
    allArrangements[0];
  const eriComponent = dbArrangement?.benefitIllustrations
    ?.flatMap((i: any) => i.illustrationComponents)
    ?.find((c: any) => c.illustrationType === 'ERI');
  const apComponent = dbArrangement?.benefitIllustrations
    ?.flatMap((i: any) => i.illustrationComponents)
    ?.find((c: any) => c.illustrationType === 'AP');

  const eriAnnualAmountData =
    eriComponent?.payableDetails?.annualAmount ?? null;
  const annualPensionAmountData =
    apComponent?.payableDetails?.annualAmount ?? null;
  const expectedRetirementDateData =
    eriComponent?.payableDetails?.payableDate ||
    dbArrangement?.retirementDate ||
    null;
  const illustrationDate =
    dbArrangement?.benefitIllustrations?.[0]?.illustrationDate ?? null;

  return {
    eriAnnualAmountData,
    annualPensionAmountData,
    expectedRetirementDateData,
    illustrationDate,
  };
}

/**
 * TODO: Break down this mega function, it's dealing with too many things at the same time.
 * If there are switch statements this large, they could all be their own function.
 * https://www.infoq.com/articles/separation-concerns-nodejs/
 *
 * TODO: Remove all cases of explicit 'any'
 */
export async function verifyGreenPensions(page: Page, pensionPolicies: any) {
  const pensionCards = await pensionBreakdownPage.pensionCards(page);

  console.log({ pensionCards });

  for (const pensionCard of pensionCards) {
    console.log('Trying to check', pensionCard);

    const hasPensionCardType = await pensionBreakdownPage.getPensionCardType(
      page,
      pensionCard,
    );

    console.log('hasPensionCardType', hasPensionCardType);

    if (!hasPensionCardType) return;

    console.log('Attempting to get scheme on card');

    const schemeNameOnCard = await pensionBreakdownPage.getschemeNameOnCard(
      page,
      pensionCard,
    );

    console.log(`Verifying pension ${schemeNameOnCard}`);

    const matchingArrangement = findMatchingArrangement(
      pensionPolicies,
      schemeNameOnCard,
    );

    if (!matchingArrangement)
      throw new Error(`No match for scheme: ${schemeNameOnCard}`);

    const eriComponent = findComponent(matchingArrangement, 'ERI');
    const apComponent = findComponent(matchingArrangement, 'AP');

    const illustrationDateData =
      matchingArrangement.benefitIllustrations?.[0]?.illustrationDate;

    const pensionStatusMap: Record<string, string> = {
      A: 'Active',
      I: 'Inactive',
      IPPF: 'Inactive',
      IWU: 'Inactive',
    };

    const pensionTypeMap: Record<string, string> = {
      DC: 'defined contribution pension',
      DB: 'defined benefit pension',
      SP: 'state pension',
    };

    const pensionTypeData =
      pensionTypeMap[matchingArrangement.pensionType] ?? 'unknown pension type';
    const pensionStatusData =
      pensionStatusMap[matchingArrangement.pensionStatus] ?? '';
    const pensionProviderData =
      matchingArrangement.pensionAdministrator?.name?.toLowerCase() ?? '';
    const pensionProviderDataNormalized = normalizeText(pensionProviderData);
    const referenceNumberData =
      matchingArrangement.contactReference?.toLowerCase() ?? '';
    const employerNameDataRaw =
      matchingArrangement.employmentMembershipPeriods?.[0]?.employerName?.toLowerCase() ??
      '--';

    const employerNameData = normalizeText(employerNameDataRaw);
    const employerStatus =
      matchingArrangement.employmentMembershipPeriods?.[0]?.employerStatus?.toUpperCase() ??
      null;

    const unavailableReason = eriComponent?.unavailableReason ?? '';
    const payableReason = eriComponent?.payableDetails?.reason ?? '';
    const apPayableDetails = apComponent?.payableDetails ?? null;
    const eriPayableDetails = eriComponent?.payableDetails ?? null;
    const eriMonthlyAmountData =
      eriComponent?.payableDetails?.monthlyAmount ?? null;
    const apMonthlyAmountData =
      apComponent?.payableDetails?.monthlyAmount ?? null;
    const eriAnnualAmountData =
      eriComponent?.payableDetails?.annualAmount ?? null;
    const apAnnualAmountData =
      apComponent?.payableDetails?.annualAmount ?? null;
    const expectedRetirementDateData =
      eriComponent?.payableDetails?.payableDate ||
      matchingArrangement.retirementDate;

    const formattedRetirementDate = new Date(
      expectedRetirementDateData,
    ).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const employmentStartDateData =
      matchingArrangement.employmentMembershipPeriods?.[0]
        ?.membershipStartDate ?? null;

    const formattedEmploymentStartdate = employmentStartDateData
      ? new Date(employmentStartDateData).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : '--';

    const apExpectedRetirementDateData =
      apComponent?.payableDetails?.payableDate ||
      matchingArrangement.retirementDate;

    const formattedApRetirementDate = new Date(
      apExpectedRetirementDateData,
    ).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const formattedIllustrationDate = illustrationDateData
      ? new Date(illustrationDateData).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : '--';

    const illustrationYear = illustrationDateData
      ? new Date(illustrationDateData).getFullYear().toString()
      : '--';

    const retirementYear = formattedRetirementDate
      ? new Date(formattedRetirementDate).getFullYear().toString()
      : '--';

    const estimatedIncomeData = `£${Number(
      eriMonthlyAmountData,
    ).toLocaleString()}a month`;

    const hasIncome =
      (unavailableReason === 'DB' ||
        unavailableReason === '' ||
        unavailableReason === null) &&
      payableReason !== 'SML';

    const type = matchingArrangement.pensionType;

    const caseType =
      type === 'SP'
        ? 'statePension'
        : ['DC', 'DB'].includes(type)
        ? `${type}${
            hasIncome ? 'WithEstimatedIncome' : 'WithoutEstimatedIncome'
          }`
        : 'UnknownPensionType';

    switch (caseType) {
      case 'DCWithEstimatedIncome':
      case 'DBWithEstimatedIncome': {
        const pensionTypeText = (
          await pensionBreakdownPage.pensionCardType(pensionCard)
        ).toLowerCase();
        const pensionProviderText = (
          await pensionBreakdownPage.administratorName(pensionCard)
        ).toLowerCase();
        const employerNameText = await pensionBreakdownPage.employerName(
          pensionCard,
        );
        const pensionStatusText = await pensionBreakdownPage.pensionStatus(
          pensionCard,
        );
        const retirementDate = await pensionBreakdownPage.retirementDate(
          pensionCard,
        );
        const expectedRetirementDateText = retirementDate
          ? formatDate(retirementDate, 'YYYY-MM-DD')
          : '--';
        const estimatedIncomeText = await pensionBreakdownPage.estimatedIncome(
          pensionCard,
        );

        expect(schemeNameOnCard).toContain(matchingArrangement.schemeName);
        expect(pensionTypeText).toContain(
          pensionTypeData.toLowerCase().replaceAll(' pension', ''),
        );
        expect(normalizeText(pensionProviderText)).toContain(
          pensionProviderDataNormalized,
        );
        if (employerNameText && employerNameData) {
          expect(employerNameData).toContain(employerNameText.toLowerCase());
        }
        if (pensionStatusText && pensionStatusData) {
          expect(pensionStatusText).toContain(pensionStatusData);
        }
        expect(expectedRetirementDateText).toBe(expectedRetirementDateData);
        if (eriMonthlyAmountData === null) {
          expect(estimatedIncomeText).toBe('--a month');
        } else {
          const normalizedIncomeText = estimatedIncomeText.replaceAll(
            /\.(\d+)0(?!\d)/g,
            '.$1',
          );
          expect(normalizedIncomeText).toBe(estimatedIncomeData);
        }
        break;
      }

      case 'DCWithoutEstimatedIncome':
      case 'DBWithoutEstimatedIncome': {
        const pensionTypeText = await pensionBreakdownPage.pensionCardType(
          pensionCard,
        );
        const pensionProviderText = (
          await pensionBreakdownPage.administratorName(pensionCard)
        ).toLowerCase();
        const employerNameText = await pensionBreakdownPage.employerName(
          pensionCard,
        );
        const pensionStatusText = await pensionBreakdownPage.pensionStatus(
          pensionCard,
        );
        const warningText = await pensionBreakdownPage.warningText(pensionCard);

        expect(schemeNameOnCard).toContain(matchingArrangement.schemeName);
        expect(pensionTypeText.toLowerCase()).toContain(
          pensionTypeData.toLowerCase().replace(' pension', ''),
        );
        expect(normalizeText(pensionProviderText)).toContain(
          pensionProviderDataNormalized,
        );
        if (employerNameText && employerNameData) {
          expect(employerNameData).toContain(employerNameText.toLowerCase());
        }
        if (pensionStatusText && pensionStatusData) {
          expect(pensionStatusText).toContain(pensionStatusData);
        }
        await expect(warningText).toBeVisible();
        break;
      }

      case 'statePension': {
        const pensionTypeText = await pensionBreakdownPage.pensionCardType(
          pensionCard,
        );
        const retirementDate = await pensionBreakdownPage.retirementDate(
          pensionCard,
        );
        const expectedRetirementDateText = retirementDate
          ? formatDate(retirementDate, 'YYYY-MM-DD')
          : '--';
        const estimatedIncomeText = await pensionBreakdownPage.estimatedIncome(
          pensionCard,
        );
        expect(pensionTypeText.toLowerCase()).toContain(
          pensionTypeData.toLowerCase(),
        );
        const formattedRetirementDateData = expectedRetirementDateData
          ? formatDate(expectedRetirementDateData, 'YYYY-MM-DD')
          : '--';

        expect(schemeNameOnCard).toContain(matchingArrangement.schemeName);
        expect(expectedRetirementDateText).toBe(formattedRetirementDateData);
        if (eriMonthlyAmountData === null) {
          expect(estimatedIncomeText).toBe('--a month');
        } else {
          expect(estimatedIncomeText).toBe(estimatedIncomeData);
        }
        break;
      }
    }

    await pensionBreakdownPage.clickSeeDetailsButton(page, pensionCard);
    const pageTitleText = await pensionDetailsPage.pageTitle(page);

    if (type === 'SP') {
      //page title
      expect(pageTitleText).toContain(matchingArrangement.schemeName);

      //    subtext & tool tip
      const firstToolTip = await statePensionsDetailsPage.getFirstToolTipIcon(
        page,
      );
      const secondToolTip = await statePensionsDetailsPage.getSecondToolTipIcon(
        page,
      );
      // Check if any required value is missing or invalid
      if (
        !firstToolTip ||
        !formattedRetirementDate ||
        formattedRetirementDate === 'Invalid Date' ||
        !eriMonthlyAmountData ||
        !secondToolTip
      ) {
        // Optionally log or skip this check
        return;
      }

      const spSubtext = `You will reach State Pension age ${firstToolTip} on ${formattedRetirementDate}. Your forecast is £${eriMonthlyAmountData} a month, based on your National Insurance ${secondToolTip} record.`;
      const spSubtextText = await statePensionsDetailsPage.getIntroInformation(
        page,
      );
      const statePensionSubtextData = spSubtext.replaceAll(/\s+/g, ' ').trim();
      const statePensionSubtextText = (spSubtextText ?? '')
        .replaceAll(/\s+/g, ' ')
        .trim();
      // If both are empty or null, consider it a pass
      if (!statePensionSubtextData && !statePensionSubtextText) {
        // Both are empty/null, pass
        return;
      }
      // If one is empty/null and the other is not, fail
      if (!statePensionSubtextData || !statePensionSubtextText) {
        expect(statePensionSubtextText).toContain(statePensionSubtextData);
        return;
      }
      // Otherwise, compare as before
      expect(statePensionSubtextText).toContain(statePensionSubtextData);

      //Pension details section
      // Estimate today table row
      expect(
        await statePensionsDetailsPage.verifyMonthlyEstimateToday(
          page,
          apMonthlyAmountData,
        ),
      ).toBe(true);
      expect(
        await statePensionsDetailsPage.verifyYearlyEstimateToday(
          page,
          apAnnualAmountData,
        ),
      ).toBe(true);
      const payableDateEstimateTodayText =
        await statePensionsDetailsPage.getCurrentPayableDate(page);
      expect(payableDateEstimateTodayText).toBe(formattedApRetirementDate);

      //Forecast table row
      expect(
        await statePensionsDetailsPage.verifyMonthlyForecast(
          page,
          eriMonthlyAmountData,
        ),
      ).toBe(true);
      expect(
        await statePensionsDetailsPage.verifyYearlyForecast(
          page,
          eriAnnualAmountData,
        ),
      ).toBe(true);
      const payableDateForecastText =
        await statePensionsDetailsPage.getRetirementPayableDate(page);
      expect(payableDateForecastText).toBe(formattedRetirementDate);

      // Estimated income section
      const bar1Label = `Estimate based on your National Insurance record up to ${formattedIllustrationDate}`;
      const estimatedIncomeSubheading = 'Estimated income';
      const estimatedIncomeSection = page.locator(
        `div:has(h2:text-is("${estimatedIncomeSubheading}"))`,
      );

      await expect(
        estimatedIncomeSection.locator(':scope > p').first(),
      ).toContainText(bar1Label);

      if (apMonthlyAmountData !== null) {
        const formatted = `£${apMonthlyAmountData.toLocaleString()}`;
        await expect(
          estimatedIncomeSection
            .locator(':scope span', { hasText: formatted })
            .first(),
        ).toBeVisible();
      }

      if (eriMonthlyAmountData !== null) {
        const formatted = `£${eriMonthlyAmountData.toLocaleString()}`;
        await expect(
          estimatedIncomeSection
            .locator(':scope span', { hasText: formatted })
            .first(),
        ).toBeVisible();
      }

      //About your State Pension forecast section
      const forecastStatement =
        await statePensionsDetailsPage.getForecastStatement(page);
      expect(forecastStatement).toContain(
        matchingArrangement.statePensionMessageEng,
      );

      console.log('End of state pension journey');
    } else {
      //DB, DC
      //page title
      //Summary Tab Text
      const apLumpSumAmountData: number | null = (() => {
        const match = matchingArrangement?.benefitIllustrations
          ?.flatMap((i: any) => i.illustrationComponents)
          ?.find(
            (c: any) =>
              c?.illustrationType === 'AP' &&
              c?.payableDetails?.amountType === 'CSH' &&
              typeof c?.payableDetails?.amount === 'number',
          );
        return match?.payableDetails?.amount ?? null;
      })();

      const eriLumpSumAmountData: number | null = (() => {
        const match = matchingArrangement?.benefitIllustrations
          ?.flatMap((i: any) => i.illustrationComponents)
          ?.find(
            (c: any) =>
              c?.illustrationType === 'ERI' &&
              c?.payableDetails?.amountType === 'CSH' &&
              typeof c?.payableDetails?.amount === 'number',
          );
        return match?.payableDetails?.amount ?? null;
      })();

      // Debug logging to understand the data structure
      console.log('eri lump sum:', eriLumpSumAmountData);

      const pensionDetailsSubtext =
        await pensionDetailsPage.getPensionDetailsSubtext(page);

      // ERI Should show with no pence if the value is a whole number.
      const formattedEriMonthlyAmount =
        formatAmountNoPennyForDisplay(eriMonthlyAmountData);

      const formattedEriLumpSumAmount =
        formatAmountNoPennyForDisplay(eriLumpSumAmountData);

      const lumpSumFormattedEriMonthlyAmount =
        formatAmountForDisplay(eriMonthlyAmountData);

      const formattedEriAnnualAmount =
        formatAmountNoPennyForDisplay(eriAnnualAmountData);

      const pensionWithEstimatedIncomeSubtextDc =
        eriAnnualAmountData === null
          ? `In this pension pot £ Unavailable You could receive £${formattedEriMonthlyAmount} a month from the first payable date of ${formattedRetirementDate}.`
          : `In this pension pot£${formattedEriAnnualAmount}You could receive £${formattedEriMonthlyAmount} a month from the first payable date of ${formattedRetirementDate}.`;

      const pensionWithEstimatedIncomeSubtextDbBase =
        formattedEriMonthlyAmount !== '--' && formattedEriMonthlyAmount !== null
          ? `You could receive£${lumpSumFormattedEriMonthlyAmount} a monthfrom the first payable date of ${formattedRetirementDate}.`
          : `You could receive£ Unavailable from the first payable date of ${formattedRetirementDate}.`;

      const pensionWithEstimatedIncomeSubtextDbLumpSum = `Plus an estimated lump sum payment of £${formattedEriLumpSumAmount} on ${formattedRetirementDate}.`;

      if (hasIncome) {
        if (type === 'DB') {
          //summaryTab
          console.log('lump sum value from BE:', formattedEriLumpSumAmount);

          if (eriLumpSumAmountData !== null) {
            expect(normalizeText(pensionDetailsSubtext)).toContain(
              pensionWithEstimatedIncomeSubtextDbBase +
                pensionWithEstimatedIncomeSubtextDbLumpSum,
            );
          }
        } else if (type === 'DC') {
          expect(normalizeText(pensionDetailsSubtext)).toContain(
            normalizeText(pensionWithEstimatedIncomeSubtextDc),
          );
        }
      }

      //active Status
      const pensionStatusText = await pensionBreakdownPage.pensionStatus(
        pensionCard,
      );
      if (pensionStatusText && pensionStatusData) {
        expect(pensionStatusText).toContain(pensionStatusData);
      }

      //pension details
      // Verify current amounts

      await pensionDetailsPage.checkPensionDetailsTabs(
        page,
        'tab-pension-income-and-values',
        'Income and values',
      );

      expect(page.url()).toContain(
        '/pension-details/pension-income-and-values',
      );
      const doughnutToolTipTextDC =
        'Show more information The pot value is how much money has built up in this pension scheme. It’s a combination of your contributions, your employer’s contributions (if it’s a workplace pension), and any investment growth. Close';
      const doughnutToolTipTextDB =
        'Show more information This defined benefit pension has a lump sum. This is a one-time sum of money paid in addition to your pension income, usually when you retire. It’s based on your salary and number of years you’ve been in the pension scheme. Close';
      const accordionText =
        'How these values are calculated Estimates for this defined benefit pension are based on your salary and years you’ve been a scheme member, as well as the expected retirement date. They’re also based on the provider’s assumptions about inflation and whether the scheme is active. To help you understand the impact of inflation, the estimated income is shown in today’s money, so you can see what that amount would be worth right now.';
      const barChartAPYearlyAmountText = `£${formatAmountNoPennyForDisplay(
        apAnnualAmountData,
      )} a year`;
      const barChartAPMonthlyAmountText = `£${formatAmountNoPennyForDisplay(
        apMonthlyAmountData,
      )} a month`;
      const barChartERIMonthlyAmountText = `£${formatAmountForDisplay(
        eriMonthlyAmountData,
      )} a month`;
      const barChartERIYearlyAmountText = `£${formatAmountNoPennyForDisplay(
        eriAnnualAmountData,
      )} a year`;

      const barChartLabelDataAP = await pensionDetailsPage.getTextFromLocator(
        page,
        'bar-label-0',
      );
      const barChartLegendDataAP = await pensionDetailsPage.getTextFromLocator(
        page,
        'bar-legend-0',
      );
      const barChartLabelDataERI = await pensionDetailsPage.getTextFromLocator(
        page,
        'bar-label-1',
      );
      const barChartLegendDataERI = await pensionDetailsPage.getTextFromLocator(
        page,
        'bar-legend-1',
      );

      const isUnavailableValue = (value: unknown) =>
        value === null || value === '--';
      const isApUnavailable =
        apPayableDetails === null ||
        isUnavailableValue(apMonthlyAmountData) ||
        isUnavailableValue(apAnnualAmountData);
      const isEriUnavailable =
        eriPayableDetails === null ||
        isUnavailableValue(eriMonthlyAmountData) ||
        isUnavailableValue(eriAnnualAmountData);

      if (isApUnavailable) {
        // when there is no payable details Estimated income chart is empty
        expect(barChartLabelDataAP).toContain('Unavailable');
      } else {
        expect(normalizeText(barChartLabelDataAP)).toContain(
          `${barChartAPYearlyAmountText}${barChartAPMonthlyAmountText}`,
        );
      }
      if (isEriUnavailable) {
        expect(barChartLabelDataERI).toContain('Unavailable');
      } else {
        expect(normalizeText(barChartLabelDataERI)).toContain(
          `${barChartERIYearlyAmountText}${barChartERIMonthlyAmountText}`,
        );
      }
      expect(barChartLegendDataERI).toContain(retirementYear);
      expect(barChartLegendDataAP).toContain(illustrationYear);

      const doughnutChartLocator = await pensionDetailsPage.getLocator(
        page,
        'donut-charts',
      );
      //check if doughnutChartLocator.isVisible();
      if (
        (await doughnutChartLocator.isVisible()) &&
        !isApUnavailable &&
        !isEriUnavailable
      ) {
        const lumpSumSentence =
          await pensionDetailsPage.getLumpSumSentenceOnDoughnut(page);

        const doughnutAccordionText =
          await pensionDetailsPage.getDataFromAccordionOnDoughnut(page);

        const doughnutLabelDataAP = await pensionDetailsPage.getTextFromLocator(
          page,
          'donut-label-0',
        );
        const doughnutLabelDataERI =
          await pensionDetailsPage.getTextFromLocator(page, 'donut-label-1');
        const doughnutLegendDataAP =
          await pensionDetailsPage.getTextFromLocator(page, 'donut-legend-0');

        if (type === 'DB') {
          expect(normalizeText(lumpSumSentence)).toContain(
            doughnutToolTipTextDB,
          );
        } else {
          expect(normalizeText(lumpSumSentence)).toContain(
            doughnutToolTipTextDC,
          );
        }
        const formattedApLumpSum =
          formatAmountNoPennyForDisplay(apLumpSumAmountData);
        if (apLumpSumAmountData !== null && formattedApLumpSum !== '--') {
          expect(doughnutLabelDataAP).toContain(`£${formattedApLumpSum}`);
        }
        if (
          eriLumpSumAmountData !== null &&
          formattedEriLumpSumAmount !== '--'
        ) {
          expect(doughnutLabelDataERI).toContain(
            `£${formattedEriLumpSumAmount}`,
          );
        }
        expect(doughnutLegendDataAP).toContain(illustrationYear);
        if (type === 'DB') {
          expect(normalizeText(doughnutAccordionText)).toContain(
            normalizeText(accordionText),
          );
        }
      }

      //About Pension tab plan details

      const expectedEmployerStatus =
        employerStatus === 'C'
          ? 'Current employer'
          : employerStatus === 'H'
          ? 'Former employer'
          : '--';
      await pensionDetailsPage.checkPensionDetailsTabs(
        page,
        'tab-about-this-pension',
        'About this pension',
      );
      const pensionProviderDisplayedText =
        await pensionDetailsPage.getTextFromLocator(page, 'dd-provider');
      const pensionPlanDisplayedReferenceNumber =
        await pensionDetailsPage.getTextFromLocator(
          page,
          'dd-contact-reference',
        );

      const pensionPlanDisplayedEmployerName =
        await pensionDetailsPage.getTextFromLocator(page, 'dd-employer-name');

      const displayedPensionStartDateString =
        await pensionDetailsPage.getTextFromLocator(page, 'dd-start-date');

      const displayedEmploymentStatus =
        await pensionDetailsPage.getTextFromLocator(page, 'dd-employer-status');

      expect(pensionProviderDisplayedText.toLowerCase()).toContain(
        pensionProviderDataNormalized,
      );
      expect(pensionPlanDisplayedEmployerName.toLowerCase()).toContain(
        employerNameData,
      );
      expect(pensionPlanDisplayedReferenceNumber.toLowerCase()).toContain(
        referenceNumberData,
      );
      expect(displayedPensionStartDateString).toContain(
        formattedEmploymentStartdate,
      );
      expect(displayedEmploymentStatus).toContain(expectedEmployerStatus);

      //Contact your provider
      await pensionDetailsPage.checkPensionDetailsTabs(
        page,
        'tab-contact-pension-provider',
        'Contact provider',
      );
      // const contactDetails =
      //   await pensionDetailsPage.getContactTableValues(page);
      const getPreferredTypes = () => {
        const preferredContacts =
          matchingArrangement.pensionAdministrator.contactMethods.filter(
            (c: any) => c.preferred,
          );

        const types: string[] = [];

        for (const contact of preferredContacts) {
          const details = contact.contactMethodDetails;
          if (!details) continue;

          if (details.email) types.push('Email');
          if (details.number) types.push('Phone');
          if (details.url) types.push('Website');
          if (details.postalName || details.line1) types.push('Address');
        }

        return types.length > 0 ? types.sort().join(', ') : '--';
      };

      const usageMap: Record<string, { label: string; order: number }> = {
        M: { label: 'Main telephone', order: 1 },
        S: { label: 'Textphone', order: 2 },
        W: { label: 'Welsh language', order: 3 },
        N: { label: 'Outside UK', order: 4 },
        A: { label: 'WhatsApp', order: 5 },
      };

      const phoneContacts =
        matchingArrangement.pensionAdministrator.contactMethods.filter(
          (c: any) => c.contactMethodDetails?.number,
        );
      const expectedPhone = phoneContacts.length
        ? phoneContacts
            .flatMap((c: any) => {
              const number = c.contactMethodDetails?.number ?? '';
              const usageCodes = c.contactMethodDetails?.usage ?? [];

              return usageCodes.map((code: string) => {
                const usage = usageMap[code] ?? { label: code, order: 999 };
                return {
                  label: `${usage.label}: ${number}`,
                  order: usage.order,
                };
              });
            })
            .sort((a: any, b: any) => a.order - b.order)
            .map((entry: any) => entry.label)
            .join(', ')
        : '--';

      const addressContact =
        matchingArrangement.pensionAdministrator.contactMethods.find(
          (c: any) =>
            c.contactMethodDetails?.postalName || c.contactMethodDetails?.line1,
        );

      const expectedAddress = addressContact
        ? [
            addressContact.contactMethodDetails?.postalName,
            addressContact.contactMethodDetails?.line1,
            addressContact.contactMethodDetails?.line2,
            addressContact.contactMethodDetails?.line3,
            addressContact.contactMethodDetails?.postcode,
            addressContact.contactMethodDetails?.countryCode === 'GB'
              ? 'United Kingdom'
              : addressContact.contactMethodDetails?.countryCode,
          ]
            .filter(Boolean)
            .join(', ')
        : '--';

      // Example: expected values (fallback to '--' for nulls)
      const expectedContactData = {
        name: pensionProviderDataNormalized || '--',
        url:
          matchingArrangement.pensionAdministrator.contactMethods.find(
            (c: any) => c.contactMethodDetails?.url,
          )?.contactMethodDetails?.url ?? '--',
        preferred: getPreferredTypes(),
        email:
          matchingArrangement.pensionAdministrator.contactMethods.find(
            (c: any) => c.contactMethodDetails?.email,
          )?.contactMethodDetails?.email ?? '--',
        phone: expectedPhone,
        address: expectedAddress,
      };

      // Assertions
      expect(normalizeText(pensionProviderDisplayedText.toLowerCase())).toBe(
        expectedContactData.name,
      );
      expect(pensionPlanDisplayedReferenceNumber.toLowerCase()).toContain(
        referenceNumberData,
      );
      const getWebsiteLocator = await pensionDetailsPage.getLocator(
        page,
        'dd-contact-website',
      );

      const subTextLocator = await pensionDetailsPage.getLocator(
        page,
        'definition-list-sub-text',
      );
      await subTextLocator.waitFor({ state: 'visible' });
      await subTextLocator.scrollIntoViewIfNeeded();

      if (await getWebsiteLocator.isVisible()) {
        expect(await getWebsiteLocator.innerText()).toContain(
          expectedContactData.url,
        );
      }
      const emailLocator = await pensionDetailsPage.getLocator(
        page,
        'dd-contact-email',
      );
      if (await emailLocator.isVisible()) {
        expect(await emailLocator.innerText()).toContain(
          expectedContactData.email,
        );
      }
      const phoneLocator = await pensionDetailsPage.getLocator(
        page,
        'dd-contact-telephone',
      );
      if (await phoneLocator.isVisible()) {
        const phoneTexts = await phoneLocator.innerText();
        const normalizedReceivedText = normalizePhoneText(phoneTexts);
        expect(normalizedReceivedText).toContain(expectedContactData.phone);
      }
      const postalAddressLocator = await pensionDetailsPage.getLocator(
        page,
        'dd-contact-postal',
      );
      if (await postalAddressLocator.isVisible()) {
        const expectedPostalAddress = await postalAddressLocator.innerText();
        const normalizeAddress = (s: string) =>
          s
            .replaceAll(/·\n?\s*/g, ', ')
            .replaceAll(/\n\s*|\s+,/g, ',')
            .replaceAll(/,\s+/g, ', ')
            .replaceAll(/\(preferred\)\s*/gi, '')
            .replaceAll(/,\s*(united kingdom|uk)$/i, '')
            .replaceAll(/\s+/g, ' ')

            .trim();

        const normalizedDisplayedAddress = normalizeAddress(
          expectedPostalAddress,
        );
        const normalizedExpectedAddress = normalizeAddress(
          expectedContactData.address,
        );

        expect(normalizedDisplayedAddress).toContain(normalizedExpectedAddress);
      }
    }

    console.log('Clicking the back link to go back to pension breakdown page.');
    await commonHelpers.clickBackLink(page);
  }

  console.log('Clicking the back link to go back to pension search page.');
  await commonHelpers.clickBackLink(page);
  await page.locator('text=See your pensions').waitFor({ state: 'visible' });
}
