import { byIso } from 'country-code-lookup';
import { expect, Page } from '@maps/playwright';

import pensionDetailsPage from '../pages/PensionDetailsPage';
import pensionBreakdownPage from '../pages/PensionsBreakdownPage';
import pensionsFoundPage from '../pages/PensionsFoundPage';
import statePensionsDetailsPage from '../pages/StatePensionsDetailsPage';
import { BeDataExtraction } from './beDataExtraction';
import commonHelpers from './commonHelpers';
import { BackendUiAssertion } from './detailTabsBackendUIAssertion';
import { FormattingUtils } from './formatting';
import {
  ArrangementData,
  MatchingPensionArrangement,
} from './pensionCardBackendUIAssertion';
import { RequestHelper } from './request';

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

    const tooltips = await this.getStatePensionTooltips(page);
    if (!this.hasRequiredStatePensionData(data, tooltips)) return;

    await this.verifyStatePensionIntroAndAmounts(page, data, tooltips);
    await this.verifyStatePensionEstimatedIncomeSection(page, data);
    await this.verifyStatePensionForecastStatement(page, data);

    console.log('End of state pension journey');
  }

  private static async getStatePensionTooltips(page: Page) {
    const firstToolTip = await statePensionsDetailsPage.getFirstToolTipIcon(
      page,
    );
    const secondToolTip = await statePensionsDetailsPage.getSecondToolTipIcon(
      page,
    );
    return { firstToolTip, secondToolTip };
  }

  private static hasRequiredStatePensionData(
    data: ArrangementData,
    tooltips: { firstToolTip: string | null; secondToolTip: string | null },
  ) {
    return Boolean(
      tooltips.firstToolTip &&
        tooltips.secondToolTip &&
        data.formattedRetirementDate &&
        data.formattedRetirementDate !== 'Invalid Date' &&
        data.eriMonthlyAmountData,
    );
  }

  private static async verifyStatePensionIntroAndAmounts(
    page: Page,
    data: ArrangementData,
    tooltips: { firstToolTip: string; secondToolTip: string },
  ) {
    const spSubtext = this.buildStatePensionSubtext(data, tooltips);
    const spSubtextText = await statePensionsDetailsPage.getIntroInformation(
      page,
    );
    const expected = this.normalizeSpaces(spSubtext);
    const received = this.normalizeSpaces(spSubtextText ?? '');
    const apGuideText = await statePensionsDetailsPage.getGuideTextOnAPIncome(
      page,
    );
    const eriGuideText = await statePensionsDetailsPage.getGuideTextOnERIIncome(
      page,
    );

    if (!expected && !received) return;
    if (!expected || !received) {
      expect(received).toContain(expected);
      return;
    }
    expect(received).toContain(FormattingUtils.normalizeText(expected));

    const expectedTexts = this.getExpectedStatePensionAmountTexts(data);
    if (apGuideText) {
      expect(
        await statePensionsDetailsPage.getDisplayedAPAmount(page),
      ).toContain(`${expectedTexts.apMonthly} or ${expectedTexts.apAnnual}`);
    }
    if (eriGuideText) {
      expect(
        await statePensionsDetailsPage.getDisplayedERIAmount(page),
      ).toContain(`${expectedTexts.eriMonthly} or ${expectedTexts.eriAnnual}`);
    }
  }

  private static buildStatePensionSubtext(
    data: ArrangementData,
    tooltips: { firstToolTip: string; secondToolTip: string },
  ) {
    return (
      `You will reach State Pension age ${tooltips.firstToolTip} on ${data.formattedRetirementDate}. ` +
      `Your forecast is £${FormattingUtils.formatDisplayAmount(
        data.eriMonthlyAmountData,
      )} a month, based on your National Insurance ${
        tooltips.secondToolTip
      } record.` +
      ` State Pension is paid every 4 weeks rather than the same date each month, so your payment will be lower than the monthly amount.`
    );
  }

  private static normalizeSpaces(text: string) {
    return text.replaceAll(/\s+/g, ' ').trim();
  }

  private static getExpectedStatePensionAmountTexts(data: ArrangementData) {
    return {
      eriMonthly: `£${FormattingUtils.formatDisplayAmount(
        data.eriMonthlyAmountData,
      )} a month`,
      eriAnnual: `£${FormattingUtils.formatDisplayAmount(
        data.eriAnnualAmountData,
      )} a year`,
      apMonthly: `£${FormattingUtils.formatDisplayAmount(
        data.apMonthlyAmountData,
      )} a month`,
      apAnnual: `£${FormattingUtils.formatDisplayAmount(
        data.apAnnualAmountData,
      )} a year`,
    };
  }

  private static async verifyStatePensionEstimatedIncomeSection(
    page: Page,
    data: ArrangementData,
  ) {
    const bar1Label = `Estimate based on your National Insurance record up to ${data.formattedIllustrationDate}`;
    const estimatedIncomeSection = page.locator(
      `div:has(h2:text-is("Estimated income"))`,
    );
    await expect(
      estimatedIncomeSection.locator(':scope > p').first(),
    ).toContainText(bar1Label);
    await this.assertStatePensionProgressBarAmount(
      page,
      'sp-progress-bar-ap',
      data.apMonthlyAmountData,
      data.apAnnualAmountData,
    );
    await this.assertStatePensionProgressBarAmount(
      page,
      'sp-progress-bar-eri',
      data.eriMonthlyAmountData,
      data.eriAnnualAmountData,
    );
  }

  private static async assertStatePensionProgressBarAmount(
    page: Page,
    testId: string,
    monthlyAmount: number | null,
    annualAmount: number | null,
  ) {
    if (monthlyAmount === null) return;
    const expectedMonthlyValueText = `£${monthlyAmount.toLocaleString()} a month`;
    const expectedAnnualValueText = `£${annualAmount?.toLocaleString()} a year`;
    const currencyTextElement = page.getByTestId(testId);
    await expect(currencyTextElement).toBeVisible();
    const normalizedExpected = FormattingUtils.normalizePennies(
      `${expectedMonthlyValueText} or ${expectedAnnualValueText}`,
    );
    await expect
      .poll(async () =>
        FormattingUtils.normalizePennies(
          (await currencyTextElement.innerText()) ?? '',
        ),
      )
      .toBe(normalizedExpected);
  }

  private static async verifyStatePensionForecastStatement(
    page: Page,
    data: ArrangementData,
  ) {
    const forecastStatement =
      await statePensionsDetailsPage.getForecastStatement(page);
    expect(forecastStatement).toContain(
      data.matchingArrangement.statePensionMessageEng,
    );
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
    const apLumpSumAmountData = this.getLumpSumAmount(data, 'AP');
    const eriLumpSumAmountData = this.getLumpSumAmount(data, 'ERI');

    console.log('eri lump sum:', eriLumpSumAmountData);

    const pensionDetailsSubtext =
      await pensionDetailsPage.getPensionDetailsSubtext(page);
    await this.verifyEstimatedIncomeSubtext(
      pensionDetailsSubtext,
      data,
      eriLumpSumAmountData,
    );

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

  private static getLumpSumAmount(
    data: ArrangementData,
    illustrationType: 'AP' | 'ERI',
  ): number | null {
    const match = data.matchingArrangement?.benefitIllustrations
      ?.flatMap((i: any) => i.illustrationComponents)
      ?.find(
        (c: any) =>
          c?.illustrationType === illustrationType &&
          c?.payableDetails?.amountType === 'CSH' &&
          typeof c?.payableDetails?.amount === 'number',
      );
    return match?.payableDetails?.amount ?? null;
  }

  private static async verifyEstimatedIncomeSubtext(
    pensionDetailsSubtext: string,
    data: ArrangementData,
    eriLumpSumAmountData: number | null,
  ) {
    if (!data.hasIncome) return;
    const formattedEriMonthlyAmount = FormattingUtils.formatDisplayAmount(
      data.eriMonthlyAmountData,
    );
    const pensionWithEstimatedIncomeSubtextDc = `You could receive £${formattedEriMonthlyAmount} a month from the first payable date of ${data.formattedRetirementDate}.`;
    const pensionWithEstimatedIncomeSubtextDbBase =
      formattedEriMonthlyAmount !== '--' && formattedEriMonthlyAmount !== null
        ? `You could receive £${FormattingUtils.formatDisplayAmount(
            data.eriMonthlyAmountData,
          )} a month from the first payable date of ${
            data.formattedRetirementDate
          }.`
        : `You could receive £ Unavailable from the first payable date of ${data.formattedRetirementDate}.`;
    if (data.type === 'DC') {
      expect(FormattingUtils.normalizeText(pensionDetailsSubtext)).toContain(
        FormattingUtils.normalizeText(pensionWithEstimatedIncomeSubtextDc),
      );
      return;
    }
    if (data.type !== 'DB') return;
    const formattedEriLumpSumAmount =
      FormattingUtils.formatDisplayAmount(eriLumpSumAmountData);
    const pensionWithEstimatedIncomeSubtextDbLumpSum = `Plus an estimated lump sum payment of £${formattedEriLumpSumAmount}`;
    console.log('lump sum value from BE:', formattedEriLumpSumAmount);
    if (eriLumpSumAmountData === null) return;
    expect(FormattingUtils.normalizeText(pensionDetailsSubtext)).toContain(
      FormattingUtils.normalizeText(pensionWithEstimatedIncomeSubtextDbBase) +
        FormattingUtils.normalizeText(
          pensionWithEstimatedIncomeSubtextDbLumpSum,
        ),
    );
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
    const expectedContactData = this.buildExpectedContactData(data);

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

    await this.verifyContactProviderWebsite(page, expectedContactData.url);
    await this.verifyContactProviderEmail(page, expectedContactData.email);
    await this.verifyContactProviderPhone(page, expectedContactData.phone);
    await this.verifyContactProviderAddress(page, expectedContactData.address);
  }

  private static buildExpectedContactData(data: ArrangementData) {
    const contactMethods =
      data.matchingArrangement.pensionAdministrator.contactMethods ?? [];
    return {
      name: data.expectedProviderName || '--',
      url: this.getValidWebsiteUrl(contactMethods),
      preferred: this.getPreferredContactTypes(contactMethods),
      email: this.getFirstEmail(contactMethods),
      phone: this.getExpectedPhone(contactMethods),
      address: this.getExpectedAddress(contactMethods),
    };
  }

  private static getPreferredContactTypes(contactMethods: any[]) {
    const preferredContacts = contactMethods.filter((c: any) => c.preferred);
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
  }

  private static getValidWebsiteUrl(contactMethods: any[]) {
    const match = contactMethods.find((c: any) => {
      const url = c.contactMethodDetails?.url;
      return url && (url.startsWith('http://') || url.startsWith('https://'));
    });
    return match?.contactMethodDetails?.url ?? '--';
  }

  private static getFirstEmail(contactMethods: any[]) {
    return (
      contactMethods.find((c: any) => c.contactMethodDetails?.email)
        ?.contactMethodDetails?.email ?? '--'
    );
  }

  private static getExpectedPhone(contactMethods: any[]) {
    const usageMap: Record<string, { label: string; order: number }> = {
      M: { label: 'Main telephone', order: 1 },
      S: { label: 'Textphone', order: 2 },
      W: { label: 'Welsh language', order: 3 },
      N: { label: 'Outside UK', order: 4 },
      A: { label: 'WhatsApp', order: 5 },
    };
    const phoneContacts = contactMethods.filter(
      (c: any) => c.contactMethodDetails?.number,
    );
    if (!phoneContacts.length) return '--';
    return phoneContacts
      .flatMap((c: any) => {
        const number = c.contactMethodDetails?.number ?? '';
        const usageCodes = c.contactMethodDetails?.usage ?? [];
        return usageCodes.map((code: string) => {
          const usage = usageMap[code] ?? { label: code, order: 999 };
          return { label: `${usage.label}: ${number}`, order: usage.order };
        });
      })
      .sort((a: any, b: any) => a.order - b.order)
      .map((entry: any) => entry.label)
      .join(', ');
  }

  private static getExpectedAddress(contactMethods: any[]) {
    const addressContact = contactMethods.find(
      (c: any) =>
        c.contactMethodDetails?.postalName || c.contactMethodDetails?.line1,
    );
    if (!addressContact) return '--';
    return [
      addressContact.contactMethodDetails?.postalName,
      addressContact.contactMethodDetails?.line1,
      addressContact.contactMethodDetails?.line2,
      addressContact.contactMethodDetails?.line3,
      addressContact.contactMethodDetails?.postcode,
      byIso(addressContact.contactMethodDetails?.countryCode)?.country,
    ]
      .map((s) => s?.trim())
      .filter(Boolean)
      .join(', ');
  }

  private static stripPreferred(text: string) {
    return text.replaceAll(/\(preferred\)\s*/gi, '');
  }

  private static async verifyContactProviderWebsite(
    page: Page,
    expectedUrl: string,
  ) {
    const getWebsiteLocator = page.getByTestId('dd-contact-website');
    const subTextLocator = page.getByTestId('definition-list-sub-text');
    await subTextLocator.waitFor({ state: 'visible' });
    await subTextLocator.scrollIntoViewIfNeeded();

    if (await getWebsiteLocator.isVisible()) {
      const displayedUrl = await getWebsiteLocator.innerText();
      expect(this.stripPreferred(displayedUrl)).toContain(expectedUrl);
    }
  }

  private static async verifyContactProviderEmail(
    page: Page,
    expectedEmail: string,
  ) {
    const emailLocator = page.getByTestId('dd-contact-email');
    if (await emailLocator.isVisible()) {
      const displayedEmail = await emailLocator.innerText();
      expect(this.stripPreferred(displayedEmail)).toContain(expectedEmail);
    }
  }

  private static async verifyContactProviderPhone(
    page: Page,
    expectedPhone: string,
  ) {
    const phoneLocator = page.getByTestId('dd-contact-telephone');
    if (await phoneLocator.isVisible()) {
      const phoneTexts = await phoneLocator.innerText();
      const normalisedReceivedText = phoneTexts.split('\n\n').join(', ');
      const removePreferedFromStart = normalisedReceivedText
        .replaceAll(/\(preferred\) /gi, '')
        .trim();
      expect(removePreferedFromStart).toContain(expectedPhone);
    }
  }

  private static async verifyContactProviderAddress(
    page: Page,
    expectedAddress: string,
  ) {
    const postalAddressLocator = page.getByTestId('dd-contact-postal');
    if (await postalAddressLocator.isVisible()) {
      const actualAddress = await postalAddressLocator.innerText();
      const normalizedActual =
        FormattingUtils.normalizeForComparison(actualAddress);
      const normalizedExpected =
        FormattingUtils.normalizeForComparison(expectedAddress);
      expect(normalizedActual).toContain(normalizedExpected);
    }
  }

  /**
   * Top-level flow to verify all pensions on the breakdown page and their details pages.
   */
  static async verifyGreenPensions(page: Page, request: any) {
    const categoryResponse = await RequestHelper.getPensionCategory(
      page,
      request,
      'CONFIRMED',
    );
    const categoryJson = await categoryResponse.json();
    const confirmedArrangements = categoryJson?.arrangements ?? [];

    const pensionCards = await pensionBreakdownPage.pensionCards(page);

    for (const pensionCard of pensionCards) {
      const cardData = await BackendUiAssertion.getValidPensionCardData(
        page,
        request,
        pensionCard,
        confirmedArrangements,
      );

      // If this card isn't a valid pension card (no pension type), skip it
      if (!cardData) {
        continue;
      }

      const { schemeNameOnCard, data } = cardData;

      console.log(`Verifying pension ${schemeNameOnCard}`);

      // Verify the pension card using the centralized method
      await MatchingPensionArrangement.verifyPensionCardByType(
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
      await page.getByTestId('back').click();
      await page
        .getByTestId('page-title')
        .filter({ hasText: 'Your pensions' })
        .waitFor({ state: 'visible' });
    }

    console.log('Clicking the back link to go back to pension search page.');
    await commonHelpers.clickHomeLink(page);
    await pensionsFoundPage.waitForPensionsFound(page);
  }
}
