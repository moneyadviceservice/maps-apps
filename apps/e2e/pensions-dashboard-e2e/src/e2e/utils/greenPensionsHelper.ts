/* eslint-disable playwright/no-conditional-in-test */
import { byIso } from 'country-code-lookup';
import { expect, Page } from '@maps/playwright';

import pensionDetailsPage from '../pages/PensionDetailsPage';
import pensionBreakdownPage from '../pages/PensionsBreakdownPage';
import statePensionsDetailsPage from '../pages/StatePensionsDetailsPage';
import { BeDataExtraction } from './beDataExtraction';
import commonHelpers from './commonHelpers';
import { BackendUiAssertion } from './detailTabsBackendUIAssertion';
import { FormattingUtils } from './formatting';
import { ArrangementData } from './pensionCardBackendUIAssertion';

/**
 * High-level helper class that composes lower-level class-based utilities.
 * Replaces the previous function-based API: verifyStatePensionDetailsPage,
 * verifyDcDbDetailsPage, verifyAboutPensionTab, verifyContactProviderTab,
 * verifyGreenPensions.
 */
export class GreenPensionsHelper {
  //  delegate to BeDataExtraction
  static readonly deriveDbIllustrationData =
    BeDataExtraction.deriveIllustrationData;

  /**
   * Verify State Pension details page UI against the provided ArrangementData.
   */
  static async verifyStatePensionDetailsPage(
    page: Page,
    data: ArrangementData,
  ) {
    const pageTitleText = await pensionDetailsPage.pageTitle(page);
    expect(pageTitleText).toContain(data.matchingArrangement.schemeName);

    const firstToolTip = await statePensionsDetailsPage.getFirstToolTipIcon(
      page,
    );
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
      `You will reach State Pension age ${firstToolTip} on ${
        data.formattedRetirementDate
      }. Your forecast is £${FormattingUtils.formatDisplayAmount(
        data.eriMonthlyAmountData,
      )} a month, based on your National Insurance ${secondToolTip} record.` +
      ` State Pension is paid every 4 weeks rather than the same date each month, so your payment will be lower than the monthly amount.`;
    const spSubtextText = await statePensionsDetailsPage.getIntroInformation(
      page,
    );
    const statePensionSubtextData = spSubtext.replaceAll(/\s+/g, ' ').trim();
    const statePensionSubtextText = (spSubtextText ?? '')
      .replaceAll(/\s+/g, ' ')
      .trim();
    const apGuideText = await statePensionsDetailsPage.getGuideTextOnAPIncome(
      page,
    );
    const eriGuideText = await statePensionsDetailsPage.getGuideTextOnERIIncome(
      page,
    );

    if (!statePensionSubtextData && !statePensionSubtextText) {
      return;
    }
    if (!statePensionSubtextData || !statePensionSubtextText) {
      expect(statePensionSubtextText).toContain(statePensionSubtextData);
      return;
    }

    const expectedEriMonthlyValueText = `£${FormattingUtils.formatDisplayAmount(
      data.eriMonthlyAmountData,
    )} a month`;
    const expectedEriAnnualValueText = `£${FormattingUtils.formatDisplayAmount(
      data.eriAnnualAmountData,
    )} a year`;
    const expectedApMonthlyValueText = `£${FormattingUtils.formatDisplayAmount(
      data.apMonthlyAmountData,
    )} a month`;
    const expectedApAnnualValueText = `£${FormattingUtils.formatDisplayAmount(
      data.apAnnualAmountData,
    )} a year`;
    expect(statePensionSubtextText).toContain(
      FormattingUtils.normalizeText(statePensionSubtextData),
    );
    if (apGuideText) {
      expect(
        await statePensionsDetailsPage.getDisplayedAPAmount(page),
      ).toContain(
        `${expectedApMonthlyValueText} or ${expectedApAnnualValueText}`,
      );
    }
    if (eriGuideText) {
      expect(
        await statePensionsDetailsPage.getDisplayedERIAmount(page),
      ).toContain(
        `${expectedEriMonthlyValueText} or ${expectedEriAnnualValueText}`,
      );
    }

    const bar1Label = `Estimate based on your National Insurance record up to ${data.formattedIllustrationDate}`;
    const estimatedIncomeSubheading = 'Estimated income';
    const estimatedIncomeSection = page.locator(
      `div:has(h2:text-is("${estimatedIncomeSubheading}"))`,
    );

    await expect(
      estimatedIncomeSection.locator(':scope > p').first(),
    ).toContainText(bar1Label);

    if (data.apMonthlyAmountData !== null) {
      const expectedApMonthlyValueText = `£${data.apMonthlyAmountData.toLocaleString()} a month`;
      const expectedApYearlyValueText = `£${data?.apAnnualAmountData?.toLocaleString()} a year`;
      const apCurrencyTextElement = page.getByTestId('sp-progress-bar-ap');
      await expect(apCurrencyTextElement).toBeVisible();
      const normalizedExpectedApText = FormattingUtils.normalizePennies(
        `${expectedApMonthlyValueText} or ${expectedApYearlyValueText}`,
      );
      await expect
        .poll(async () =>
          FormattingUtils.normalizePennies(
            (await apCurrencyTextElement.innerText()) ?? '',
          ),
        )
        .toBe(normalizedExpectedApText);
    }

    if (data.eriMonthlyAmountData !== null) {
      const expectedEriMonthlyValueText = `£${data.eriMonthlyAmountData.toLocaleString()} a month`;
      const expectedEriAnnualValueText = `£${data?.eriAnnualAmountData?.toLocaleString()} a year`;
      const eriCurrencyTextElement = page.getByTestId('sp-progress-bar-eri');
      await expect(eriCurrencyTextElement).toBeVisible();
      const normalizedExpectedEriText = FormattingUtils.normalizePennies(
        `${expectedEriMonthlyValueText} or ${expectedEriAnnualValueText}`,
      );
      await expect
        .poll(async () =>
          FormattingUtils.normalizePennies(
            (await eriCurrencyTextElement.innerText()) ?? '',
          ),
        )
        .toBe(normalizedExpectedEriText);
    }

    const forecastStatement =
      await statePensionsDetailsPage.getForecastStatement(page);
    expect(forecastStatement).toContain(
      data.matchingArrangement.statePensionMessageEng,
    );

    console.log('End of state pension journey');
  }

  /**
   * High-level verification for DC/DB details page (composes BackendUiAssertion + other verifiers).
   */
  static async verifyDcDbDetailsPage(
    page: Page,
    request: any,
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

    const formattedEriMonthlyAmount = FormattingUtils.formatDisplayAmount(
      data.eriMonthlyAmountData,
    );
    const formattedEriLumpSumAmount =
      FormattingUtils.formatDisplayAmount(eriLumpSumAmountData);
    const lumpSumFormattedEriMonthlyAmount =
      FormattingUtils.formatDisplayAmount(data.eriMonthlyAmountData);
    const formattedDcPot = FormattingUtils.formatDisplayAmount(
      data.dcPotAmountData,
    );

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
          expect(
            FormattingUtils.normalizeText(pensionDetailsSubtext),
          ).toContain(
            FormattingUtils.normalizeText(
              pensionWithEstimatedIncomeSubtextDbBase,
            ) +
              FormattingUtils.normalizeText(
                pensionWithEstimatedIncomeSubtextDbLumpSum,
              ),
          );
        }
      } else if (data.type === 'DC') {
        expect(FormattingUtils.normalizeText(pensionDetailsSubtext)).toContain(
          FormattingUtils.normalizeText(pensionWithEstimatedIncomeSubtextDc),
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

    await BackendUiAssertion.verifyBarCharts(page, request, data);
    await BackendUiAssertion.verifyDoughnutCharts(
      page,
      data,
      apLumpSumAmountData,
      eriLumpSumAmountData,
    );

    await GreenPensionsHelper.verifyAboutPensionTab(page, data);
    await GreenPensionsHelper.verifyContactProviderTab(page, data);
  }

  /**
   * Verify content of the About this pension tab.
   */
  static async verifyAboutPensionTab(page: Page, data: ArrangementData) {
    await pensionDetailsPage.checkPensionDetailsTabs(
      page,
      'tab-about-this-pension',
      'About this pension',
    );

    const displayedProviderName = await pensionDetailsPage.getTextFromLocator(
      page,
      'dd-provider',
    );
    const displayedReferenceNumber =
      await pensionDetailsPage.getTextFromLocator(page, 'dd-contact-reference');

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

  /**
   * Verify Contact provider tab content and preferred contact formatting.
   */
  static async verifyContactProviderTab(page: Page, data: ArrangementData) {
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
    const displayedReferenceNumber =
      await pensionDetailsPage.getTextFromLocator(page, 'dd-contact-reference');

    expect(
      FormattingUtils.normalizeText(displayedProviderName.toLowerCase()),
    ).toBe(expectedContactData.name);

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
      const normalizedActual =
        FormattingUtils.normalizeForComparison(actualAddress);
      const normalizedExpected = FormattingUtils.normalizeForComparison(
        expectedContactData.address,
      );
      expect(normalizedActual).toContain(normalizedExpected);
    }
  }

  /**
   * Top-level flow to verify all pensions on the breakdown page and their details pages.
   */
  static async verifyGreenPensions(page: Page, request: any) {
    const pensionCards = await pensionBreakdownPage.pensionCards(page);

    for (const pensionCard of pensionCards) {
      const cardData = await BackendUiAssertion.getValidPensionCardData(
        page,
        request,
        pensionCard,
      );

      // If this card isn't a valid pension card (no pension type), skip it
      if (!cardData) {
        continue;
      }

      const { schemeNameOnCard, data } = cardData;

      console.log(`Verifying pension ${schemeNameOnCard}`);

      // Verify the pension card using the centralized method
      await BackendUiAssertion.verifyPensionCardByType(
        page,
        pensionCard,
        schemeNameOnCard,
        data,
      );

      // Navigate back to the pension card to verify details page
      await pensionBreakdownPage.clickSeeDetailsButton(page, pensionCard);

      // Verify the details page
      if (data.type === 'SP') {
        await GreenPensionsHelper.verifyStatePensionDetailsPage(page, data);
      } else {
        await GreenPensionsHelper.verifyDcDbDetailsPage(
          page,
          request,
          pensionCard,
          data,
        );
      }

      console.log(
        'Clicking the back link to go back to pension breakdown page.',
      );
      await commonHelpers.clickBackLink(page);
    }

    console.log('Clicking the back link to go back to pension search page.');
    await commonHelpers.clickBackLink(page);
  }
}
