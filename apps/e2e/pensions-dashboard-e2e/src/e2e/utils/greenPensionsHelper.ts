/* eslint-disable playwright/no-conditional-in-test */
import { byIso } from 'country-code-lookup';
import { expect, Page } from '@maps/playwright';

import pensionDetailsPage from '../pages/PensionDetailsPage';
import pensionBreakdownPage from '../pages/PensionsBreakdownPage';
import statePensionsDetailsPage from '../pages/StatePensionsDetailsPage';
import { getPensionCategory } from './request';
import commonHelpers from './commonHelpers';
import { formatDate } from './dateFormatter';

const normalizeText = (value: string) =>
  value
    .replaceAll('\u00A0', ' ')
    .replaceAll(',', '')
    .replaceAll(/\s+/g, ' ')
    .trim();

type FormatDisplayAmountOptions = {
  currency?: boolean;
  fractionDigits?: number | { min: number; max: number };
};

const formatDisplayAmount = (
  amount: number | null,
  { currency = false, fractionDigits }: FormatDisplayAmountOptions = {},
) => {
  if (amount === null) {
    return '--';
  }

  const resolvedFractionDigits = (() => {
    if (fractionDigits !== undefined) {
      if (typeof fractionDigits === 'number') {
        return { min: fractionDigits, max: fractionDigits };
      }
      return {
        min: fractionDigits.min,
        max: fractionDigits.max,
      };
    }
    const isWholeNumber = Number.isInteger(amount);
    return {
      min: isWholeNumber ? 0 : 2,
      max: isWholeNumber ? 0 : 2,
    };
  })();

  const formatterOptions: Intl.NumberFormatOptions = {
    minimumFractionDigits: resolvedFractionDigits.min,
    maximumFractionDigits: resolvedFractionDigits.max,
  };

  if (currency) {
    formatterOptions.style = 'currency';
    formatterOptions.currency = 'GBP';
  }

  return amount.toLocaleString('en-GB', formatterOptions);
};

const normalizePennies = (s: string) =>
  s.replaceAll(
    /(\d{1,3}(?:,\d{3})*|\d+)(\.\d{1,2})?(?!\d)/g,
    (match: string) => {
      const numericValue = Number(match.replaceAll(',', ''));
      if (Number.isNaN(numericValue)) {
        return match;
      }
      return formatDisplayAmount(numericValue, {
        fractionDigits: { min: 0, max: 1 },
      });
    },
  );

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

// Helper types
type ArrangementData = {
  matchingArrangement: any;
  eriComponent: any;
  apComponent: any;
  illustrationDateData: any;
  pensionTypeData: string;
  pensionStatusData: string;
  expectedProviderName: string;
  expectedReferenceNumber: string;
  expectedEmployerName: string;
  employerStatus: string | null;
  unavailableReason: string;
  payableReason: string;
  apPayableDetails: any;
  eriPayableDetails: any;
  eriMonthlyAmountData: number | null;
  apMonthlyAmountData: number | null;
  eriAnnualAmountData: number | null;
  apAnnualAmountData: number | null;
  dcPotAmountData: number | null;
  formattedRetirementDate: string | undefined;
  expectedStartDate: string;
  formattedApRetirementDate: string;
  formattedIllustrationDate: string;
  illustrationYear: string;
  retirementYear: string;
  estimatedIncomeData: string;
  normalisedEriMonthlyAmountData: string;
  hasIncome: boolean;
  type: string;
};

// Data extraction helpers
async function fetchArrangementData(
  page: Page,
  request: any,
  schemeNameOnCard: string,
): Promise<ArrangementData> {
  const response = await getPensionCategory(page, request, 'CONFIRMED');
  const responseJson = await response.json();

  const { arrangements = [] } = responseJson ?? {};

  if (!arrangements || arrangements.length === 0) {
    throw new Error(
      `Invalid response for scheme: ${schemeNameOnCard}. Response was null or missing arrangements.`,
    );
  }

  const pensionPolicies = [{ pensionArrangements: arrangements }];
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
  const expectedProviderName = normalizeText(pensionProviderData);
  const expectedReferenceNumber =
    matchingArrangement.contactReference?.toLowerCase() ?? '';
  const employerNameDataRaw =
    matchingArrangement.employmentMembershipPeriods?.[0]?.employerName?.toLowerCase() ??
    '--';

  const expectedEmployerName = normalizeText(employerNameDataRaw);
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
  const apAnnualAmountData = apComponent?.payableDetails?.annualAmount ?? null;
  const dcPotAmountData = apComponent?.dcPot ?? null;
  const expectedRetirementDateData =
    eriComponent?.payableDetails?.payableDate ||
    matchingArrangement.retirementDate;

  const safeDate = (input: any) => {
    const date = new Date(input);
    return Number.isNaN(date.getTime()) ? undefined : date;
  };

  const formattedRetirementDate = safeDate(
    expectedRetirementDateData,
  )?.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const employmentStartDateData =
    matchingArrangement.employmentMembershipPeriods?.[0]?.membershipStartDate ??
    null;

  const expectedStartDate = employmentStartDateData
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
    : '';

  const retirementYear = formattedRetirementDate
    ? new Date(formattedRetirementDate).getFullYear().toString()
    : '';

  const normalisedEriMonthlyAmountData = Number(
    eriMonthlyAmountData,
  ).toLocaleString('en-GB', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  });

  let estimatedIncomeData;
  if (unavailableReason === 'DB') {
    estimatedIncomeData = `£${Number(apMonthlyAmountData).toLocaleString(
      'en-GB',
      { minimumFractionDigits: 0, maximumFractionDigits: 1 },
    )}a month`;
  } else {
    estimatedIncomeData = `£${Number(eriMonthlyAmountData).toLocaleString(
      'en-GB',
      { minimumFractionDigits: 0, maximumFractionDigits: 1 },
    )}a month`;
  }

  const hasIncome =
    (unavailableReason === 'DB' ||
      unavailableReason === '' ||
      unavailableReason === null) &&
    payableReason !== 'SML';

  const type = matchingArrangement.pensionType;

  return {
    matchingArrangement,
    eriComponent,
    apComponent,
    illustrationDateData,
    pensionTypeData,
    pensionStatusData,
    expectedProviderName,
    expectedReferenceNumber,
    expectedEmployerName,
    employerStatus,
    unavailableReason,
    payableReason,
    eriMonthlyAmountData,
    apMonthlyAmountData,
    eriAnnualAmountData,
    apAnnualAmountData,
    dcPotAmountData,
    formattedRetirementDate,
    expectedStartDate,
    formattedApRetirementDate,
    formattedIllustrationDate,
    illustrationYear,
    retirementYear,
    estimatedIncomeData,
    normalisedEriMonthlyAmountData,
    apPayableDetails,
    eriPayableDetails,
    hasIncome,
    type,
  };
}

function getCaseType(type: string, hasIncome: boolean): string {
  if (type === 'SP') return 'statePension';
  if (['DC', 'DB', 'HYB', 'AVC'].includes(type)) {
    return `${type}${
      hasIncome ? 'WithEstimatedIncome' : 'WithoutEstimatedIncome'
    }`;
  }
  return 'UnknownPensionType';
}

// Verification helpers for each case type
async function verifyWithEstimatedIncomeCard(
  page: Page,
  pensionCard: any,
  schemeNameOnCard: string,
  data: ArrangementData,
) {
  const pensionTypeText = (
    await pensionBreakdownPage.pensionCardType(pensionCard)
  ).toLowerCase();
  const pensionProviderText = (
    await pensionBreakdownPage.administratorName(pensionCard)
  ).toLowerCase();
  const employerNameText = await pensionBreakdownPage.employerName(pensionCard);
  const pensionStatusText = await pensionBreakdownPage.pensionStatus(
    pensionCard,
  );
  const retirementDate = await pensionBreakdownPage.retirementDate(pensionCard);
  const expectedRetirementDateText = retirementDate
    ? formatDate(retirementDate, 'YYYY-MM-DD')
    : '--';
  const estimatedIncomeText = await pensionBreakdownPage.estimatedIncome(
    pensionCard,
  );

  expect(schemeNameOnCard).toContain(data.matchingArrangement.schemeName);
  expect(pensionTypeText).toContain(
    data.pensionTypeData.toLowerCase().replaceAll(' pension', ''),
  );
  expect(normalizeText(pensionProviderText)).toContain(
    data.expectedProviderName,
  );
  if (employerNameText && data.expectedEmployerName) {
    expect(data.expectedEmployerName).toContain(employerNameText.toLowerCase());
  }
  if (pensionStatusText && data.pensionStatusData) {
    expect(pensionStatusText).toContain(data.pensionStatusData);
  }
  const expectedRetirementDateData =
    data.eriComponent?.payableDetails?.payableDate ||
    data.matchingArrangement.retirementDate;
  expect(expectedRetirementDateText).toBe(expectedRetirementDateData);
  if (data.eriMonthlyAmountData === null) {
    expect(estimatedIncomeText).toBe('--a month');
  } else {
    const normalizedIncomeText = normalizePennies(estimatedIncomeText);
    expect(normalizedIncomeText).toBe(data.estimatedIncomeData);
  }
}

async function verifyWithoutEstimatedIncomeCard(
  page: Page,
  pensionCard: any,
  schemeNameOnCard: string,
  data: ArrangementData,
) {
  const pensionTypeText = await pensionBreakdownPage.pensionCardType(
    pensionCard,
  );
  const pensionProviderText = (
    await pensionBreakdownPage.administratorName(pensionCard)
  ).toLowerCase();
  const employerNameText = await pensionBreakdownPage.employerName(pensionCard);
  const pensionStatusText = await pensionBreakdownPage.pensionStatus(
    pensionCard,
  );
  const warningText = await pensionBreakdownPage.warningText(pensionCard);

  expect(schemeNameOnCard).toContain(data.matchingArrangement.schemeName);
  expect(pensionTypeText.toLowerCase()).toContain(
    data.pensionTypeData.toLowerCase().replace(' pension', ''),
  );
  expect(normalizeText(pensionProviderText)).toContain(
    data.expectedProviderName,
  );
  if (employerNameText && data.expectedEmployerName) {
    expect(data.expectedEmployerName).toContain(employerNameText.toLowerCase());
  }
  if (pensionStatusText && data.pensionStatusData) {
    expect(pensionStatusText).toContain(data.pensionStatusData);
  }
  await expect(warningText).toBeVisible();
}

async function verifyStatePensionCard(
  page: Page,
  pensionCard: any,
  schemeNameOnCard: string,
  data: ArrangementData,
) {
  const pensionTypeText = await pensionBreakdownPage.pensionCardType(
    pensionCard,
  );
  const retirementDate = await pensionBreakdownPage.retirementDate(pensionCard);
  const expectedRetirementDateText = retirementDate
    ? formatDate(retirementDate, 'YYYY-MM-DD')
    : '--';
  const estimatedIncomeText = await pensionBreakdownPage.estimatedIncome(
    pensionCard,
  );
  expect(pensionTypeText.toLowerCase()).toContain(
    data.pensionTypeData.toLowerCase(),
  );
  const formattedRetirementDateData = data.formattedRetirementDate
    ? formatDate(data.formattedRetirementDate, 'YYYY-MM-DD')
    : '--';

  expect(schemeNameOnCard).toContain(data.matchingArrangement.schemeName);
  expect(expectedRetirementDateText).toBe(formattedRetirementDateData);
  if (data.eriMonthlyAmountData == null || data.eriMonthlyAmountData === 0) {
    expect(estimatedIncomeText).toBe('--a month');
  } else {
    const normalizedIncomeText = normalizePennies(estimatedIncomeText);
    expect(normalizedIncomeText).toBe(data.estimatedIncomeData);
  }
}

// Details page verification helpers
async function verifyStatePensionDetailsPage(
  page: Page,
  data: ArrangementData,
) {
  const pageTitleText = await pensionDetailsPage.pageTitle(page);
  expect(pageTitleText).toContain(data.matchingArrangement.schemeName);

  const firstToolTip = await statePensionsDetailsPage.getFirstToolTipIcon(page);
  const secondToolTip = await statePensionsDetailsPage.getSecondToolTipIcon(
    page,
  );

  if (
    !firstToolTip ||
    !data.formattedRetirementDate ||
    data.formattedRetirementDate === 'Invalid Date' ||
    !data.eriMonthlyAmountData ||
    !secondToolTip
  ) {
    return;
  }

  const spSubtext =
    `You will reach State Pension age ${firstToolTip} on ${data.formattedRetirementDate}. Your forecast is £${data.normalisedEriMonthlyAmountData} a month, based on your National Insurance ${secondToolTip} record.` +
    ` State Pension is paid every 4 weeks rather than the same date each month, so your payment will be lower than the monthly amount.`;
  const spSubtextText = await statePensionsDetailsPage.getIntroInformation(
    page,
  );
  const statePensionSubtextData = spSubtext.replaceAll(/\s+/g, ' ').trim();
  const statePensionSubtextText = (spSubtextText ?? '')
    .replaceAll(/\s+/g, ' ')
    .trim();

  if (!statePensionSubtextData && !statePensionSubtextText) {
    return;
  }
  if (!statePensionSubtextData || !statePensionSubtextText) {
    expect(statePensionSubtextText).toContain(statePensionSubtextData);
    return;
  }

  const normalizedStatePensionSubtextText = normalizePennies(
    statePensionSubtextText,
  );
  expect(normalizeText(normalizedStatePensionSubtextText)).toContain(
    normalizeText(statePensionSubtextData),
  );

  expect(
    await statePensionsDetailsPage.verifyMonthlyEstimateToday(
      page,
      data.apMonthlyAmountData,
    ),
  ).toBe(true);
  expect(
    await statePensionsDetailsPage.verifyYearlyEstimateToday(
      page,
      data.apAnnualAmountData,
    ),
  ).toBe(true);
  const payableDateEstimateTodayText =
    await statePensionsDetailsPage.getCurrentPayableDate(page);
  expect(payableDateEstimateTodayText).toBe(data.formattedApRetirementDate);

  expect(
    await statePensionsDetailsPage.verifyMonthlyForecast(
      page,
      data.eriMonthlyAmountData,
    ),
  ).toBe(true);
  expect(
    await statePensionsDetailsPage.verifyYearlyForecast(
      page,
      data.eriAnnualAmountData,
    ),
  ).toBe(true);
  const payableDateForecastText =
    await statePensionsDetailsPage.getRetirementPayableDate(page);
  expect(payableDateForecastText).toBe(data.formattedRetirementDate);

  const bar1Label = `Estimate based on your National Insurance record up to ${data.formattedIllustrationDate}`;
  const estimatedIncomeSubheading = 'Estimated income';
  const estimatedIncomeSection = page.locator(
    `div:has(h2:text-is("${estimatedIncomeSubheading}"))`,
  );

  await expect(
    estimatedIncomeSection.locator(':scope > p').first(),
  ).toContainText(bar1Label);

  if (data.apMonthlyAmountData !== null) {
    const expectedApValueText = `£${data.apMonthlyAmountData.toLocaleString()} a month`;
    const apCurrencyTextElement = page.getByTestId('sp-progress-bar-ap');
    await expect(apCurrencyTextElement).toBeVisible();
    const normalizedExpectedApText = normalizePennies(expectedApValueText);
    await expect
      .poll(async () =>
        normalizePennies((await apCurrencyTextElement.innerText()) ?? ''),
      )
      .toBe(normalizedExpectedApText);
  }

  if (data.eriMonthlyAmountData !== null) {
    const expectedEriValueText = `£${data.eriMonthlyAmountData.toLocaleString()} a month`;
    const eriCurrencyTextElement = page.getByTestId('sp-progress-bar-eri');
    await expect(eriCurrencyTextElement).toBeVisible();
    const normalizedExpectedEriText = normalizePennies(expectedEriValueText);
    await expect
      .poll(async () =>
        normalizePennies((await eriCurrencyTextElement.innerText()) ?? ''),
      )
      .toBe(normalizedExpectedEriText);
  }

  const forecastStatement = await statePensionsDetailsPage.getForecastStatement(
    page,
  );
  expect(forecastStatement).toContain(
    data.matchingArrangement.statePensionMessageEng,
  );

  console.log('End of state pension journey');
}

async function verifyDcDbDetailsPage(
  page: Page,
  pensionCard: any,
  data: ArrangementData,
) {
  const apLumpSumAmountData: number | null = (() => {
    const match = data.matchingArrangement?.benefitIllustrations
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
    const match = data.matchingArrangement?.benefitIllustrations
      ?.flatMap((i: any) => i.illustrationComponents)
      ?.find(
        (c: any) =>
          c?.illustrationType === 'ERI' &&
          c?.payableDetails?.amountType === 'CSH' &&
          typeof c?.payableDetails?.amount === 'number',
      );
    return match?.payableDetails?.amount ?? null;
  })();

  console.log('eri lump sum:', eriLumpSumAmountData);

  const pensionDetailsSubtext =
    await pensionDetailsPage.getPensionDetailsSubtext(page);

  const formattedEriMonthlyAmount = formatDisplayAmount(
    data.eriMonthlyAmountData,
  );
  const formattedEriLumpSumAmount = formatDisplayAmount(eriLumpSumAmountData);
  const lumpSumFormattedEriMonthlyAmount = formatDisplayAmount(
    data.eriMonthlyAmountData,
  );
  const formattedDcPot = formatDisplayAmount(data.dcPotAmountData);

  const pensionWithEstimatedIncomeSubtextDc =
    data.dcPotAmountData === null
      ? `In this pension potUnavailableYou could receive £${formattedEriMonthlyAmount} a month from the first payable date of ${data.formattedRetirementDate}.`
      : `In this pension pot£${formattedDcPot}You could receive £${formattedEriMonthlyAmount} a month from the first payable date of ${data.formattedRetirementDate}.`;

  const pensionWithEstimatedIncomeSubtextDbBase =
    formattedEriMonthlyAmount !== '--' && formattedEriMonthlyAmount !== null
      ? `You could receive£${lumpSumFormattedEriMonthlyAmount} a monthfrom the first payable date of ${data.formattedRetirementDate}.`
      : `You could receive£ Unavailable from the first payable date of ${data.formattedRetirementDate}.`;

  const pensionWithEstimatedIncomeSubtextDbLumpSum = `Plus an estimated lump sum payment of £${formattedEriLumpSumAmount} on ${data.formattedRetirementDate}.`;

  if (data.hasIncome) {
    if (data.type === 'DB') {
      console.log('lump sum value from BE:', formattedEriLumpSumAmount);
      if (eriLumpSumAmountData !== null) {
        expect(normalizeText(pensionDetailsSubtext)).toContain(
          normalizeText(pensionWithEstimatedIncomeSubtextDbBase) +
            normalizeText(pensionWithEstimatedIncomeSubtextDbLumpSum),
        );
      }
    } else if (data.type === 'DC') {
      expect(normalizeText(pensionDetailsSubtext)).toContain(
        normalizeText(pensionWithEstimatedIncomeSubtextDc),
      );
    }
  }

  const pensionStatusText = await pensionBreakdownPage.pensionStatus(
    pensionCard,
  );
  if (pensionStatusText && data.pensionStatusData) {
    expect(pensionStatusText).toContain(data.pensionStatusData);
  }

  await pensionDetailsPage.checkPensionDetailsTabs(
    page,
    'tab-pension-income-and-values',
    'Income and values',
  );

  expect(page.url()).toContain('/pension-details/pension-income-and-values');

  await verifyBarCharts(page, data);
  await verifyDoughnutCharts(
    page,
    data,
    apLumpSumAmountData,
    eriLumpSumAmountData,
  );
  await verifyAboutPensionTab(page, data);
  await verifyContactProviderTab(page, data);
}

async function verifyBarCharts(page: Page, data: ArrangementData) {
  const barChartAPYearlyAmountText = `£${formatDisplayAmount(
    data.apAnnualAmountData,
  )} a year`;
  const barChartAPMonthlyAmountText = `£${formatDisplayAmount(
    data.apMonthlyAmountData,
  )} a month`;
  const barChartERIMonthlyAmountText = `£${formatDisplayAmount(
    data.eriMonthlyAmountData,
  )} a month`;
  const barChartERIYearlyAmountText = `£${formatDisplayAmount(
    data.eriAnnualAmountData,
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
    data.apPayableDetails === null ||
    isUnavailableValue(data.apMonthlyAmountData) ||
    isUnavailableValue(data.apAnnualAmountData);
  const isEriUnavailable =
    data.eriPayableDetails === null ||
    isUnavailableValue(data.eriMonthlyAmountData) ||
    isUnavailableValue(data.eriAnnualAmountData);

  if (
    isApUnavailable ||
    (data.apAnnualAmountData === 0 && data.apMonthlyAmountData === 0)
  ) {
    expect(barChartLabelDataAP).toContain('Unavailable');
  } else {
    expect(barChartLabelDataAP).toContain(
      `${barChartAPYearlyAmountText}${barChartAPMonthlyAmountText}`,
    );
  }
  if (
    isEriUnavailable ||
    (data.eriAnnualAmountData === 0 && data.eriMonthlyAmountData === 0)
  ) {
    expect(barChartLabelDataERI).toContain('Unavailable');
  } else {
    expect(barChartLabelDataERI).toContain(
      `${barChartERIYearlyAmountText}${barChartERIMonthlyAmountText}`,
    );
  }

  expect(barChartLegendDataAP).toContain(
    'Latest value' + data.illustrationYear,
  );
  expect(barChartLegendDataERI).toContain(
    'Estimate at retirement' + data.retirementYear,
  );
}

async function verifyDoughnutCharts(
  page: Page,
  data: ArrangementData,
  apLumpSumAmountData: number | null,
  eriLumpSumAmountData: number | null,
) {
  const doughnutChartLocator = page.getByTestId('donut-charts');
  const isUnavailableValue = (value: unknown) =>
    value === null || value === '--';
  const isApUnavailable =
    data.apPayableDetails === null ||
    isUnavailableValue(data.apMonthlyAmountData) ||
    isUnavailableValue(data.apAnnualAmountData);
  const isEriUnavailable =
    data.eriPayableDetails === null ||
    isUnavailableValue(data.eriMonthlyAmountData) ||
    isUnavailableValue(data.eriAnnualAmountData);

  if (
    (await doughnutChartLocator.isVisible()) &&
    !isApUnavailable &&
    !isEriUnavailable
  ) {
    const doughnutToolTipTextDC = `Show more information The pot value is how much money has built up in this pension scheme. It’s a combination of your contributions your employer’s contributions (if it’s a workplace pension) and any investment growth. Close`;
    const doughnutToolTipTextDB = `Show more information This pension has a lump sum. This is a one-time sum of money paid in addition to your pension income. It’s based on your salary and number of years you’ve been in the pension scheme. It’s usually tax-free. Close`;
    const accordionText = `How these values are calculated Estimates for this pension are based on your salary and years you’ve been a scheme member as well as the expected retirement date. They’re also based on the provider’s assumptions about inflation and whether the scheme is active. To help you understand the impact of inflation the estimated income is shown in today’s money so you can see what that amount would be worth right now.`;

    const lumpSumSentence =
      await pensionDetailsPage.getLumpSumSentenceOnDoughnut(page);
    const doughnutAccordionText =
      await pensionDetailsPage.getDataFromAccordionOnDoughnut(page);
    const doughnutLabelDataAP = await pensionDetailsPage.getTextFromLocator(
      page,
      'donut-label-0',
    );
    const doughnutLabelDataERI = await pensionDetailsPage.getTextFromLocator(
      page,
      'donut-label-1',
    );
    const doughnutLegendDataAP = await pensionDetailsPage.getTextFromLocator(
      page,
      'donut-legend-0',
    );

    if (data.type === 'DB') {
      expect(normalizeText(lumpSumSentence)).toContain(
        normalizeText(doughnutToolTipTextDB),
      );
    } else {
      expect(normalizeText(lumpSumSentence)).toContain(
        normalizeText(doughnutToolTipTextDC),
      );
    }
    const formattedEriLumpSumAmount = formatDisplayAmount(eriLumpSumAmountData);
    const formattedApLumpSum = formatDisplayAmount(apLumpSumAmountData);
    if (apLumpSumAmountData !== null && formattedApLumpSum !== '--') {
      expect(doughnutLabelDataAP).toContain(`£${formattedApLumpSum}`);
    }
    if (eriLumpSumAmountData !== null && formattedEriLumpSumAmount !== '--') {
      expect(doughnutLabelDataERI).toContain(`£${formattedEriLumpSumAmount}`);
    }
    expect(doughnutLegendDataAP).toContain(data.illustrationYear);
    if (data.type === 'DB') {
      expect(normalizeText(doughnutAccordionText)).toContain(
        normalizeText(accordionText),
      );
    }
  }
}

async function verifyAboutPensionTab(page: Page, data: ArrangementData) {
  await pensionDetailsPage.checkPensionDetailsTabs(
    page,
    'tab-about-this-pension',
    'About this pension',
  );

  const displayedProviderName = await pensionDetailsPage.getTextFromLocator(
    page,
    'dd-provider',
  );
  const displayedReferenceNumber = await pensionDetailsPage.getTextFromLocator(
    page,
    'dd-contact-reference',
  );

  const expectedEmployerStatus =
    data.employerStatus === 'C'
      ? 'Current employer'
      : data.employerStatus === 'H'
      ? 'Former employer'
      : '--';

  const employerChecks = [
    {
      expectedValue: data.expectedEmployerName,
      id: 'dd-employer-name',
    },
    {
      expectedValue: expectedEmployerStatus,
      id: 'dd-employer-status',
    },
    {
      expectedValue: data.expectedStartDate,
      id: 'dd-employment-start-date',
    },
  ];

  for (const { expectedValue, id } of employerChecks) {
    if (expectedValue === '--') {
      await expect(page.getByTestId(id)).toHaveCount(0);
    } else {
      const displayedValue = await pensionDetailsPage.getTextFromLocator(
        page,
        id,
      );
      expect(displayedValue.toLowerCase()).toContain(
        expectedValue.toLowerCase(),
      );
    }
  }

  expect(
    displayedProviderName.toLowerCase(),
    'Checking the pension provider text is correct',
  ).toContain(data.expectedProviderName);

  expect(
    displayedReferenceNumber.toLowerCase(),
    'Checking the pension plan reference number is correct',
  ).toContain(data.expectedReferenceNumber);
}

async function verifyContactProviderTab(page: Page, data: ArrangementData) {
  await pensionDetailsPage.checkPensionDetailsTabs(
    page,
    'tab-contact-pension-provider',
    'Contact provider',
  );

  const getPreferredTypes = () => {
    const preferredContacts =
      data.matchingArrangement.pensionAdministrator.contactMethods.filter(
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
    data.matchingArrangement.pensionAdministrator.contactMethods.filter(
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
    data.matchingArrangement.pensionAdministrator.contactMethods.find(
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
        byIso(addressContact.contactMethodDetails?.countryCode)?.country,
      ]
        .map((s) => s?.trim())
        .filter(Boolean)
        .join(', ')
    : '--';

  const expectedContactData = {
    name: data.expectedProviderName || '--',
    url:
      data.matchingArrangement.pensionAdministrator.contactMethods.find(
        (c: any) => {
          const url = c.contactMethodDetails?.url;
          return (
            url && (url.startsWith('http://') || url.startsWith('https://'))
          );
        },
      )?.contactMethodDetails?.url ?? '--',
    preferred: getPreferredTypes(),
    email:
      data.matchingArrangement.pensionAdministrator.contactMethods.find(
        (c: any) => c.contactMethodDetails?.email,
      )?.contactMethodDetails?.email ?? '--',
    phone: expectedPhone,
    address: expectedAddress,
  };

  const displayedProviderName = await pensionDetailsPage.getTextFromLocator(
    page,
    'dd-provider',
  );
  const displayedReferenceNumber = await pensionDetailsPage.getTextFromLocator(
    page,
    'dd-contact-reference',
  );

  expect(normalizeText(displayedProviderName.toLowerCase())).toBe(
    expectedContactData.name,
  );

  expect(displayedReferenceNumber.toLowerCase()).toContain(
    data.expectedReferenceNumber,
  );

  const getWebsiteLocator = page.getByTestId('dd-contact-website');
  const subTextLocator = page.getByTestId('definition-list-sub-text');
  await subTextLocator.waitFor({ state: 'visible' });
  await subTextLocator.scrollIntoViewIfNeeded();

  if (await getWebsiteLocator.isVisible()) {
    const displayedUrl = await getWebsiteLocator.innerText();
    const removePreferredFromUrl = displayedUrl.replaceAll(
      /\(preferred\)\s*/gi,
      '',
    );
    expect(removePreferredFromUrl).toContain(expectedContactData.url);
  }

  const emailLocator = page.getByTestId('dd-contact-email');
  if (await emailLocator.isVisible()) {
    const displayedEmail = await emailLocator.innerText();
    const removePreferredFromEmail = displayedEmail.replaceAll(
      /\(preferred\)\s*/gi,
      '',
    );
    expect(removePreferredFromEmail).toContain(expectedContactData.email);
  }

  const normaliseText = (str: string) => str.split('\n\n').join(', ');

  const phoneLocator = page.getByTestId('dd-contact-telephone');
  if (await phoneLocator.isVisible()) {
    const phoneTexts = await phoneLocator.innerText();
    const normalisedReceivedText = normaliseText(phoneTexts);
    const removePreferedFromStart = normalisedReceivedText
      .replaceAll(/\(preferred\) /gi, '')
      .trim();
    expect(removePreferedFromStart).toContain(expectedContactData.phone);
  }

  const postalAddressLocator = page.getByTestId('dd-contact-postal');
  if (await postalAddressLocator.isVisible()) {
    const actualAddress = await postalAddressLocator.innerText();
    const normalisedAddress = normaliseText(actualAddress);
    const removePreferedFromStart = normalisedAddress
      .replaceAll(/^\(preferred\)\s*/gi, '')
      .trim();
    expect(removePreferedFromStart).toContain(expectedContactData.address);
  }
}

export async function verifyGreenPensions(page: Page, request: any) {
  const pensionCards = await pensionBreakdownPage.pensionCards(page);

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
    const data = await fetchArrangementData(page, request, schemeNameOnCard);
    const caseType = getCaseType(data.type, data.hasIncome);

    switch (caseType) {
      case 'DCWithEstimatedIncome':
      case 'DBWithEstimatedIncome':
        await verifyWithEstimatedIncomeCard(
          page,
          pensionCard,
          schemeNameOnCard,
          data,
        );
        break;

      case 'DCWithoutEstimatedIncome':
      case 'DBWithoutEstimatedIncome':
        await verifyWithoutEstimatedIncomeCard(
          page,
          pensionCard,
          schemeNameOnCard,
          data,
        );
        break;

      case 'statePension':
        await verifyStatePensionCard(page, pensionCard, schemeNameOnCard, data);
        break;
    }

    await pensionBreakdownPage.clickSeeDetailsButton(page, pensionCard);

    if (data.type === 'SP') {
      await verifyStatePensionDetailsPage(page, data);
    } else {
      await verifyDcDbDetailsPage(page, pensionCard, data);
    }

    console.log('Clicking the back link to go back to pension breakdown page.');
    await commonHelpers.clickBackLink(page);
  }

  console.log('Clicking the back link to go back to pension search page.');
  await commonHelpers.clickBackLink(page);
  await page.locator('text=See your pensions').waitFor({ state: 'visible' });
}
