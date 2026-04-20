import { expect, Page } from '@maps/playwright';

import pensionDetailsPage from '../pages/PensionDetailsPage';
import pensionBreakdownPage from '../pages/PensionsBreakdownPage';
import { BeDataExtraction } from './beDataExtraction';
import { FormattingUtils } from './formatting';
import {
  ArrangementData,
  MatchingPensionArrangement,
} from './pensionCardBackendUIAssertion';
import { PensionTypeUtils } from './pensionTypeUtils';
import { RequestHelper } from './request';

export class BackendUiAssertion {
  private static readonly MORE_DETAILS_WARNING_CODES = new Set([
    'DEF',
    'TVI',
    'SCP',
    'AVC',
    'PNR',
    'PSO',
    'FAS',
    'CUR',
  ]);

  private static readonly ACCORDION_TEST_IDS = {
    HowThevaluesAreCalaculatedAccordion: 'calculation',
    featureAccordion: 'features',
    moreDetailsAccordion: 'more-details',
  } as const;

  private static readonly ACCORDION_ASSERTION_ORDER = [
    'HowThevaluesAreCalaculatedAccordion',
    'featureAccordion',
    'moreDetailsAccordion',
  ] as const;

  static async expectAccordionsForArrangement(page: Page, arrangement: any) {
    const illustrationWarnings =
      BeDataExtraction.aggregateIllustrationWarnings(arrangement);
    const {
      apSafeguardedBenefit,
      eriSafeguardedBenefit,
      apSurvivorBenefit,
      eriSurvivorBenefit,
    } = BackendUiAssertion.extractSafeguardedBenefits(arrangement);
    await BackendUiAssertion.expectAccordionsVisible(page, {
      illustrationWarnings,
      apSafeguardedBenefit,
      eriSafeguardedBenefit,
      apSurvivorBenefit,
      eriSurvivorBenefit,
      benefitType: arrangement.benefitType,
      pensionType: arrangement.pensionType,
    });
  }

  static async expectAccordionsVisible(page: Page, data: any) {
    const finalCalculationAccordionTestId =
      this.resolveCalculationAccordionTestId(data);
    const expectedAccordions = this.getExpectedAccordions(data);

    for (const accordion of this.ACCORDION_ASSERTION_ORDER) {
      const testId = this.resolveAccordionTestId(
        accordion,
        finalCalculationAccordionTestId,
      );
      await this.assertAccordionVisibility(
        page.getByTestId(testId),
        expectedAccordions.has(accordion),
      );
    }
  }

  static async expectAccordionsMatchBackendWarnings(
    page: Page,
    arrangement: any,
    calculationAccordionTestId: string,
    detailData?: { warnings?: string[] },
  ) {
    const illustrationWarnings = detailData?.warnings
      ? detailData.warnings
      : BeDataExtraction.aggregateIllustrationWarnings(arrangement);
    const {
      apSafeguardedBenefit,
      eriSafeguardedBenefit,
      apSurvivorBenefit,
      eriSurvivorBenefit,
    } = this.extractSafeguardedBenefits(arrangement);
    await this.expectAccordionsVisible(page, {
      illustrationWarnings,
      apSafeguardedBenefit,
      eriSafeguardedBenefit,
      apSurvivorBenefit,
      eriSurvivorBenefit,
      calculationAccordionTestId,
      benefitType: arrangement.benefitType,
      pensionType: arrangement.pensionType,
    });
  }

  private static extractSafeguardedBenefits(arrangement: any) {
    const components = arrangement?.benefitIllustrations?.flatMap(
      (illustration: any) => illustration?.illustrationComponents ?? [],
    );
    const eriComponent = components?.find(
      (component: any) => component?.illustrationType === 'ERI',
    );
    const apComponent = components?.find(
      (component: any) => component?.illustrationType === 'AP',
    );

    return {
      eriSafeguardedBenefit: Boolean(eriComponent?.safeguardedBenefit),
      apSafeguardedBenefit: Boolean(apComponent?.safeguardedBenefit),
      eriSurvivorBenefit: Boolean(eriComponent?.survivorBenefit),
      apSurvivorBenefit: Boolean(apComponent?.survivorBenefit),
    };
  }

  private static resolveCalculationAccordionTestId(data: any): string {
    const calculationAccordionTestId =
      data.calculationAccordionTestId ??
      (data.benefitType === 'DC' || data.benefitType === 'AVC'
        ? 'dc-calculation-accordion'
        : 'db-calculation-accordion');

    return data.pensionType === 'HYB'
      ? 'db-calculation-accordion'
      : calculationAccordionTestId;
  }

  private static getExpectedAccordions(data: any): Set<string> {
    const expectedAccordions = new Set<string>([
      'HowThevaluesAreCalaculatedAccordion',
    ]);

    if (this.hasSafeguardedBenefit(data)) {
      expectedAccordions.add('featureAccordion');
    }
    if (this.shouldShowMoreDetailsAccordion(data)) {
      expectedAccordions.add('moreDetailsAccordion');
    }

    return expectedAccordions;
  }

  private static hasSafeguardedBenefit(data: any): boolean {
    return Boolean(data.eriSafeguardedBenefit || data.apSafeguardedBenefit);
  }

  private static hasSurvivorBenefit(data: any): boolean {
    return Boolean(data.eriSurvivorBenefit || data.apSurvivorBenefit);
  }

  private static shouldShowMoreDetailsAccordion(data: any): boolean {
    return (
      this.hasRelevantWarningCode(data.illustrationWarnings ?? []) ||
      this.hasSurvivorBenefit(data)
    );
  }

  private static hasRelevantWarningCode(warnings: string[]): boolean {
    return warnings.some((warningCode) =>
      BackendUiAssertion.MORE_DETAILS_WARNING_CODES.has(warningCode),
    );
  }

  private static resolveAccordionTestId(
    accordion: (typeof BackendUiAssertion.ACCORDION_ASSERTION_ORDER)[number],
    finalCalculationAccordionTestId: string,
  ): string {
    return accordion === 'HowThevaluesAreCalaculatedAccordion'
      ? finalCalculationAccordionTestId
      : this.ACCORDION_TEST_IDS[accordion];
  }

  private static async assertAccordionVisibility(
    locator: ReturnType<Page['getByTestId']>,
    shouldBeVisible: boolean,
  ) {
    if (shouldBeVisible) {
      await expect(locator).toBeVisible();
      return;
    }

    await expect(locator).toBeHidden();
  }

  static async getValidPensionCardData(
    page: Page,
    request: any,
    pensionCard: any,
    arrangementsOverride?: any[],
  ): Promise<{ schemeNameOnCard: string; data: any } | null> {
    const hasPensionCardType = await pensionBreakdownPage.getPensionCardType(
      page,
      pensionCard,
    );

    if (!hasPensionCardType) {
      return null;
    }

    const schemeNameOnCard = await pensionBreakdownPage.getschemeNameOnCard(
      page,
      pensionCard,
    );

    const data = await BeDataExtraction.fetchArrangementData(
      page,
      request,
      schemeNameOnCard,
      arrangementsOverride,
    );

    return { schemeNameOnCard, data };
  }

  static async verifySummaryTab(page: Page, request: any, arrangement?: any) {
    const categoryArrangements = await this.getConfirmedCategoryArrangements(
      page,
      request,
    );
    const arrangementContext = await this.resolveSummaryArrangementContext(
      page,
      request,
      categoryArrangements,
      arrangement,
    );
    const warnings = BeDataExtraction.aggregateIllustrationWarnings(
      arrangementContext.arrangementDetailData,
    );

    const pensionCards = await pensionBreakdownPage.pensionCards(page);
    console.info(`Found ${pensionCards.length} pension cards to process`);
    console.info(`Warning codes to verify: ${warnings.join(', ')}`);

    for (const pensionCard of pensionCards) {
      const cardData = await this.getValidPensionCardData(
        page,
        request,
        pensionCard,
        categoryArrangements,
      );
      if (!cardData || this.shouldSkipSummaryCard(cardData)) continue;
      await this.verifySummaryCard(page, pensionCard, cardData);
    }
  }

  private static async getConfirmedCategoryArrangements(
    page: Page,
    request: any,
  ): Promise<any[]> {
    const response = await RequestHelper.getPensionCategory(
      page,
      request,
      'CONFIRMED',
    );
    const responseJson = await response.json();
    return responseJson?.arrangements ?? [];
  }

  private static async resolveSummaryArrangementContext(
    page: Page,
    request: any,
    categoryArrangements: any[],
    arrangement?: any,
  ): Promise<{ arrangement: any; arrangementDetailData: any }> {
    if (arrangement) {
      return {
        arrangement,
        arrangementDetailData: await this.getArrangementDetailData(
          page,
          request,
          arrangement,
        ),
      };
    }

    const arrangementWithWarnings = await this.findArrangementWithWarnings(
      page,
      request,
      categoryArrangements,
    );
    if (arrangementWithWarnings) return arrangementWithWarnings;

    const fallbackArrangement = categoryArrangements[0];
    if (!fallbackArrangement) {
      throw new Error('No arrangements available from backend to verify.');
    }

    return {
      arrangement: fallbackArrangement,
      arrangementDetailData: await this.getArrangementDetailData(
        page,
        request,
        fallbackArrangement,
      ),
    };
  }

  private static async findArrangementWithWarnings(
    page: Page,
    request: any,
    categoryArrangements: any[],
  ): Promise<{ arrangement: any; arrangementDetailData: any } | null> {
    for (const candidateArrangement of categoryArrangements) {
      const detailJson = await this.getArrangementDetailData(
        page,
        request,
        candidateArrangement,
      );
      if (
        BeDataExtraction.aggregateIllustrationWarnings(detailJson).length > 0
      ) {
        return {
          arrangement: candidateArrangement,
          arrangementDetailData: detailJson,
        };
      }
    }

    return null;
  }

  private static async getArrangementDetailData(
    page: Page,
    request: any,
    arrangement: any,
  ) {
    const { pensionSchemeDetailResponse } =
      await BeDataExtraction.extractPensionSchemeDetailData(
        page,
        request,
        arrangement,
      );
    return pensionSchemeDetailResponse.json();
  }

  private static shouldSkipSummaryCard(cardData: {
    schemeNameOnCard: string;
    data: any;
  }): boolean {
    const cardIdentifier = this.getCardIdentifier(cardData);
    console.info(`Examining pension card: ${cardIdentifier}`);

    if (
      cardData.data.matchingArrangement?.hasMultipleTranches &&
      cardData.data.matchingArrangement?.pensionType !== 'SP'
    ) {
      return false;
    }

    console.info(
      `Skipping card - not multiple tranches or is SP type: ${cardIdentifier}`,
    );
    return true;
  }

  private static getCardIdentifier(cardData: {
    schemeNameOnCard: string;
    data: any;
  }): string {
    return `${cardData.schemeNameOnCard}_${cardData.data.matchingArrangement?.externalAssetId}`;
  }

  private static async verifySummaryCard(
    page: Page,
    pensionCard: any,
    cardData: { schemeNameOnCard: string; data: any },
  ) {
    const cardIdentifier = this.getCardIdentifier(cardData);
    await pensionBreakdownPage.clickSeeDetailsButton(page, pensionCard);

    const warningElements = page.getByTestId(/warning-title-/);
    console.info('Warning elements:', warningElements);

    const summaryTabText = page.getByTestId('pension-detail-intro');
    await summaryTabText.waitFor({ state: 'visible' });

    const standardPayment = this.getRequiredStandardPayment(
      cardData.data,
      cardIdentifier,
    );
    const summaryTextContent = await this.getNormalizedText(summaryTabText);

    this.assertStandardPaymentContent(summaryTextContent, standardPayment);
    await this.assertVisibleWarnings(page, warningElements, cardIdentifier);
  }

  private static getRequiredStandardPayment(data: any, cardIdentifier: string) {
    const standardPayment =
      data.matchingArrangement?.detailData?.standardPayment;
    if (!standardPayment) {
      throw new Error(
        `Missing detailData.standardPayment for arrangement ${cardIdentifier}`,
      );
    }
    return standardPayment;
  }

  private static async getNormalizedText(
    locator: ReturnType<Page['getByTestId']>,
  ) {
    return FormattingUtils.normalizeText(await locator.innerText());
  }

  private static assertStandardPaymentContent(
    summaryTextContent: string,
    standardPayment: any,
  ) {
    const expectedFragments =
      this.getSummaryStandardPaymentFragments(standardPayment);
    for (const expectedFragment of expectedFragments) {
      expect(summaryTextContent).toContain(expectedFragment);
    }
  }

  private static getSummaryStandardPaymentFragments(
    standardPayment: any,
  ): string[] {
    const expectedFragments: string[] = [];

    if (typeof standardPayment.monthlyAmount === 'number') {
      expectedFragments.push(
        `£${FormattingUtils.formatDisplayAmount(
          standardPayment.monthlyAmount,
        )}`,
      );
    }

    if (standardPayment.payableDate) {
      expectedFragments.push(
        this.formatDateForSummaryTab(standardPayment.payableDate),
      );
    }

    if (
      typeof standardPayment.lumpSumAmount === 'number' &&
      standardPayment.lumpSumAmount > 0 &&
      standardPayment.lumpSumPayableDate
    ) {
      expectedFragments.push(
        `£${FormattingUtils.formatDisplayAmount(
          standardPayment.lumpSumAmount,
        )}`,
        this.formatDateForSummaryTab(standardPayment.lumpSumPayableDate),
      );
    }

    return expectedFragments;
  }

  private static formatDateForSummaryTab(input: string): string {
    return new Date(input).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    });
  }

  private static async assertVisibleWarnings(
    page: Page,
    warningElements: ReturnType<Page['getByTestId']>,
    cardIdentifier: string,
  ) {
    const warningContainer = page.getByTestId('warnings');
    if (!(await warningContainer.isVisible())) return;

    const warningElementCount = await warningElements.count();
    console.info(
      `Warning element count for ${cardIdentifier}:`,
      warningElementCount,
    );

    for (const warningElement of await warningElements.all()) {
      await expect(warningElement).toBeVisible();
    }
  }

  static async verifyBarCharts(
    page: Page,
    request: any,
    data: ArrangementData,
  ) {
    const barChartUiData = await this.getBarChartUiData(page, data);

    this.assertBarChartLabel(
      barChartUiData.barChartLabelDataAP,
      data.apAnnualAmountData,
      data.apMonthlyAmountData,
      data.apPayableDetails,
    );
    this.assertBarChartLabel(
      barChartUiData.barChartLabelDataERI,
      data.eriAnnualAmountData,
      data.eriMonthlyAmountData,
      data.eriPayableDetails,
    );

    await this.verifyBarChartAccordions(page, request, data);
    this.assertBarChartLegends(barChartUiData, data);
  }

  private static async getBarChartUiData(page: Page, data: ArrangementData) {
    const barChartLegendEriLocator = page
      .locator('[data-testid="bar-legend-1"]')
      .first();
    await barChartLegendEriLocator.waitFor({ state: 'visible' });

    return {
      barChartLabelDataAP: await pensionDetailsPage.getTextFromLocator(
        page,
        'bar-label-0',
      ),
      barChartLegendDataAP: await pensionDetailsPage.getTextFromLocator(
        page,
        'bar-legend-0',
      ),
      barChartLabelDataERI: await pensionDetailsPage.getTextFromLocator(
        page,
        'bar-label-1',
      ),
      barChartLegendERIDataText: await barChartLegendEriLocator.innerText(),
      barChartLabelDataERIDataYear: await this.getEriLegendYear(page, data),
    };
  }

  private static async getEriLegendYear(
    page: Page,
    data: ArrangementData,
  ): Promise<string | undefined> {
    if (!data.eriPayableDetails) return undefined;

    const barChartLabelDataERIDataYearLocator = page
      .locator('[data-testid="bar-legend-1"] strong')
      .first();
    await barChartLabelDataERIDataYearLocator.waitFor({ state: 'visible' });
    return barChartLabelDataERIDataYearLocator.innerText();
  }

  private static assertBarChartLabel(
    actualLabel: string,
    annualAmount: unknown,
    monthlyAmount: unknown,
    payableDetails: unknown,
  ) {
    const expectedLabel = this.getExpectedBarChartLabel(
      annualAmount,
      monthlyAmount,
      payableDetails,
    );
    expect(actualLabel).toContain(expectedLabel);
  }

  private static getExpectedBarChartLabel(
    annualAmount: unknown,
    monthlyAmount: unknown,
    payableDetails: unknown,
  ): string {
    if (
      this.isUnavailableAmountState(annualAmount, monthlyAmount, payableDetails)
    ) {
      return 'Unavailable';
    }

    return this.formatBarChartAmountText(annualAmount, monthlyAmount);
  }

  private static isUnavailableAmountState(
    annualAmount: unknown,
    monthlyAmount: unknown,
    payableDetails: unknown,
  ): boolean {
    return (
      payableDetails === null ||
      this.isUnavailableValue(monthlyAmount) ||
      this.isUnavailableValue(annualAmount) ||
      (annualAmount === 0 && monthlyAmount === 0)
    );
  }

  private static isUnavailableValue(value: unknown): boolean {
    return value === null || value === '--';
  }

  private static formatBarChartAmountText(
    annualAmount: unknown,
    monthlyAmount: unknown,
  ): string {
    return `£${FormattingUtils.formatDisplayAmount(
      this.toDisplayAmount(annualAmount),
    )} a year£${FormattingUtils.formatDisplayAmount(
      this.toDisplayAmount(monthlyAmount),
    )} a month`;
  }

  private static toDisplayAmount(value: unknown): number | null {
    return typeof value === 'number' ? value : null;
  }

  private static async verifyBarChartAccordions(
    page: Page,
    request: any,
    data: ArrangementData,
  ) {
    const displayedAccordionText =
      await pensionDetailsPage.getDataFromAccordion(page);
    if (!displayedAccordionText) return;

    const detailData = await this.tryGetDetailWarningsForAccordion(
      page,
      request,
      data.matchingArrangement,
    );
    await this.expectAccordionsMatchBackendWarnings(
      page,
      data.matchingArrangement,
      this.getCalculationAccordionTestIdForBarChart(data),
      detailData,
    );
  }

  private static async tryGetDetailWarningsForAccordion(
    page: Page,
    request: any,
    arrangement: any,
  ): Promise<{ warnings?: string[] } | undefined> {
    try {
      const { pensionSchemeDetailResponse } =
        await BeDataExtraction.extractPensionSchemeDetailData(
          page,
          request,
          arrangement,
        );
      const detailJson = await pensionSchemeDetailResponse.json();
      return detailJson?.detailData ?? detailJson;
    } catch (error) {
      console.warn(
        `Failed to fetch pension detail data for accordion verification:`,
        error,
      );
      return undefined;
    }
  }

  private static getCalculationAccordionTestIdForBarChart(
    data: ArrangementData,
  ): string {
    return (data.matchingArrangement.benefitType &&
      data.matchingArrangement.benefitType !== 'DB') ||
      (data.type && data.type !== 'DB')
      ? 'dc-calculation-accordion'
      : 'db-calculation-accordion';
  }

  private static assertBarChartLegends(
    barChartUiData: {
      barChartLegendDataAP: string;
      barChartLegendERIDataText: string;
      barChartLabelDataERIDataYear?: string;
    },
    data: ArrangementData,
  ) {
    expect(barChartUiData.barChartLegendDataAP).toContain(
      'Latest value' + data.illustrationYear,
    );
    expect(barChartUiData.barChartLegendERIDataText).toContain(
      'Estimate at retirement',
    );
    if (barChartUiData.barChartLabelDataERIDataYear) {
      expect(barChartUiData.barChartLabelDataERIDataYear).toContain(
        data.retirementYear,
      );
    }
  }

  /**
   * Verifies doughnut chart related UI and content.
   */
  static async verifyDoughnutCharts(
    page: Page,
    data: any,
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
      const formattedEriLumpSumAmount =
        FormattingUtils.formatDisplayAmount(eriLumpSumAmountData);
      const formattedApLumpSum =
        FormattingUtils.formatDisplayAmount(apLumpSumAmountData);

      if (apLumpSumAmountData !== null && formattedApLumpSum !== '--') {
        expect(doughnutLabelDataAP).toContain(`£${formattedApLumpSum}`);
      }
      if (eriLumpSumAmountData !== null && formattedEriLumpSumAmount !== '--') {
        expect(doughnutLabelDataERI).toContain(`£${formattedEriLumpSumAmount}`);
      }

      expect(doughnutLegendDataAP).toContain(data.illustrationYear);
    }
  }

  static async verifyPensionCardByType(
    page: Page,
    pensionCard: any,
    schemeNameOnCard: string,
    data: ArrangementData,
  ) {
    const caseType = PensionTypeUtils.getCaseType(data.type, data.hasIncome);

    switch (caseType) {
      case 'DCWithEstimatedIncome':
      case 'DBWithEstimatedIncome':
      case 'AVCWithEstimatedIncome':
      case 'HYBWithEstimatedIncome':
        await MatchingPensionArrangement.verifyWithEstimatedIncomeCard(
          page,
          pensionCard,
          schemeNameOnCard,
          data,
        );
        break;

      case 'DCWithoutEstimatedIncome':
      case 'DBWithoutEstimatedIncome':
      case 'AVCWithoutEstimatedIncome':
      case 'HYBWithoutEstimatedIncome':
        await MatchingPensionArrangement.verifyWithoutEstimatedIncomeCard(
          page,
          pensionCard,
          schemeNameOnCard,
          data,
        );
        break;
      case 'statePension':
        await MatchingPensionArrangement.verifyStatePensionCard(
          page,
          pensionCard,
          schemeNameOnCard,
          data,
        );
        break;
      default:
        throw new Error(
          'No relevant option availabe. check your pension type and try again',
        );
    }
  }

  static async verifyIncomeAndValuesSection(
    page: Page,
    pensionData: any,
    pensionType: string,
  ) {
    const standardIncomeData = this.getSortedStandardIncome(pensionData);

    for (let index = 0; index < standardIncomeData.length; index++) {
      await this.verifyIncomeAndValuesEntry(
        page,
        standardIncomeData,
        index,
        pensionType,
      );
    }
  }

  private static getSortedStandardIncome(pensionData: any): any[] {
    return BeDataExtraction.getStandardIncome(pensionData)
      .filter((entry: any) => Number.isFinite(entry?.year))
      .toSorted((a: any, b: any) => Number(a.year) - Number(b.year));
  }

  private static async verifyIncomeAndValuesEntry(
    page: Page,
    standardIncomeData: any[],
    index: number,
    pensionType: string,
  ) {
    const incomeEntry = standardIncomeData[index];
    const year = Number(incomeEntry.year);
    const incomeItemLocator = page.getByTestId(`income-item-${year}`);

    await expect(incomeItemLocator).toBeVisible();
    await this.assertIncomeItemText(page, year, incomeEntry, incomeItemLocator);
    await this.assertIncomeDifference(
      incomeItemLocator,
      incomeEntry,
      standardIncomeData[index - 1],
    );
    await this.verifyBarChartForYear(page, year, incomeEntry, pensionType);
    await this.verifyDoughnutChartForYear(page, year, incomeEntry, pensionType);
  }

  private static async assertIncomeItemText(
    page: Page,
    year: number,
    incomeEntry: any,
    incomeItemLocator: ReturnType<Page['getByTestId']>,
  ) {
    const monthlyText = this.formatMonthlyAmountText(incomeEntry.monthlyAmount);
    if (monthlyText) {
      await expect(incomeItemLocator).toContainText(monthlyText);
    }

    await this.assertLegacyIncomeText(page, year, incomeEntry);
  }

  private static async assertLegacyIncomeText(
    page: Page,
    year: number,
    incomeEntry: any,
  ) {
    const legacyIncomeTextLocator = page.locator(
      `[data-testid="income-text-${year}"]`,
    );
    if ((await legacyIncomeTextLocator.count()) === 0) return;

    const expectedTexts = [
      this.formatAnnualAmountText(incomeEntry.annualAmount),
      this.formatMonthlyAmountText(incomeEntry.monthlyAmount),
    ].filter(Boolean);

    for (const expectedText of expectedTexts) {
      await expect(legacyIncomeTextLocator).toContainText(expectedText);
    }
  }

  private static formatAnnualAmountText(value: unknown): string | null {
    if (value == null) return null;
    return `£${FormattingUtils.formatDisplayAmount(
      this.toDisplayAmount(value),
    )} a year`;
  }

  private static formatMonthlyAmountText(value: unknown): string | null {
    if (value == null) return null;
    return `£${FormattingUtils.formatDisplayAmount(
      this.toDisplayAmount(value),
    )} a month`;
  }

  private static async assertIncomeDifference(
    incomeItemLocator: ReturnType<Page['getByTestId']>,
    incomeEntry: any,
    previousIncomeEntry?: any,
  ) {
    const differenceLocator =
      incomeItemLocator.getByTestId('income-difference');
    const beDifference = this.getIncomeDifference(
      incomeEntry,
      previousIncomeEntry,
    );

    if (typeof beDifference === 'number' && beDifference !== 0) {
      await expect(differenceLocator).toBeVisible();
      await expect(differenceLocator).toContainText(
        this.formatDifferenceText(beDifference),
      );
      return;
    }

    await expect(differenceLocator).toHaveCount(0);
  }

  private static getIncomeDifference(
    incomeEntry: any,
    previousIncomeEntry?: any,
  ): number | undefined {
    if (typeof incomeEntry?.difference === 'number') {
      return incomeEntry.difference;
    }

    return typeof incomeEntry?.monthlyAmount === 'number' &&
      typeof previousIncomeEntry?.monthlyAmount === 'number'
      ? incomeEntry.monthlyAmount - previousIncomeEntry.monthlyAmount
      : undefined;
  }

  private static formatDifferenceText(beDifference: number): string {
    const expectedDirection = beDifference > 0 ? 'increase of' : 'decrease of';
    return `${expectedDirection} £${FormattingUtils.formatDisplayAmount(
      Math.abs(beDifference),
    )}`;
  }

  private static async verifyBarChartForYear(
    page: Page,
    year: number,
    incomeEntry: any,
    pensionType: string,
  ) {
    const normalizedPensionType = pensionType.toLowerCase();
    const yearSection = page.getByTestId(`year-${year}`);
    const yearlyBarCard = yearSection.locator(
      `[data-testid^="${year}-${normalizedPensionType}-bar-"]`,
    );
    const legacyBarChart = page.locator(`[data-testid="bar-chart-${year}"]`);
    const hasYearSpecificBar = (await yearlyBarCard.count()) > 0;
    const hasLegacyBar = (await legacyBarChart.count()) > 0;

    if (!hasYearSpecificBar && !hasLegacyBar) return;

    const barChartLocator = hasYearSpecificBar
      ? yearlyBarCard.first()
      : legacyBarChart;
    await expect(barChartLocator).toBeVisible();

    if (incomeEntry.annualAmount != null && incomeEntry.monthlyAmount != null) {
      const expectedYearlyAmount = `£${FormattingUtils.formatDisplayAmount(
        incomeEntry.annualAmount,
      )} a year`;
      const expectedMonthlyAmount = `£${FormattingUtils.formatDisplayAmount(
        incomeEntry.monthlyAmount,
      )} a month`;

      const barLabel = await barChartLocator
        .locator('[data-testid^="bar-label"]')
        .first()
        .innerText();
      expect(barLabel).toContain(expectedYearlyAmount);
      expect(barLabel).toContain(expectedMonthlyAmount);
    }
  }

  private static extractEntryPotValue(incomeEntry: any): number | null {
    const candidateKeys = [
      'potValue',
      'potValueAmount',
      'dcPotAmount',
      'estimatedPotValue',
    ];
    for (const key of candidateKeys) {
      const value = incomeEntry?.[key];
      if (typeof value === 'number') {
        return value;
      }
    }
    return null;
  }

  private static async verifyDoughnutChartForYear(
    page: Page,
    year: number,
    incomeEntry: any,
    pensionType: string,
  ) {
    const normalizedPensionType = pensionType.toLowerCase();
    const yearSection = page.getByTestId(`year-${year}`);
    const yearlyDoughnutCards = yearSection.locator(
      `[data-testid^="${year}-${normalizedPensionType}-donut-"]`,
    );
    const hasYearlyDoughnut = (await yearlyDoughnutCards.count()) > 0;

    const lumpSumAmount =
      typeof incomeEntry?.lumpSumAmount === 'number'
        ? incomeEntry.lumpSumAmount
        : 0;
    const potValue = this.extractEntryPotValue(incomeEntry);
    const hasExpectedDoughnut =
      normalizedPensionType === 'db' ? lumpSumAmount > 0 : (potValue ?? 0) > 0;

    if (hasExpectedDoughnut) {
      await expect(yearSection).toBeVisible();
      if (hasYearlyDoughnut) {
        const yearlyDoughnut = yearlyDoughnutCards.first();
        await expect(yearlyDoughnut).toBeVisible();
        const expectedAmount =
          normalizedPensionType === 'db' ? lumpSumAmount : potValue ?? 0;
        const expectedAmountText = `£${FormattingUtils.formatDisplayAmount(
          expectedAmount,
        )}`;
        await expect(
          yearlyDoughnut.locator('[data-testid^="donut-label-"]').first(),
        ).toContainText(expectedAmountText);
      } else {
        // Backward compatibility path when yearly donut cards are not available.
        await expect(page.getByTestId('donut-charts')).toBeVisible();
      }
    } else {
      await expect(yearlyDoughnutCards).toHaveCount(0);
    }
  }

  static async verifySummarySatetmentOnSummaryTab(
    page: Page,
    data: ArrangementData,
    request: any,
  ) {
    const introText = await this.getNormalizedSummaryIntroText(page);
    this.assertSummaryIntroHasExtractableValues(introText);

    const matchingArrangement = this.getRequiredMatchingArrangement(data);
    const pensionDetail = await this.getPensionDetailForSummaryStatement(
      page,
      request,
      matchingArrangement,
    );
    const detailData = this.getRequiredSummaryDetailData(
      pensionDetail,
      matchingArrangement.externalAssetId,
      matchingArrangement.schemeName ?? '',
    );

    this.assertSummaryStatementText(introText, detailData.standardPayment);
  }

  private static async getNormalizedSummaryIntroText(
    page: Page,
  ): Promise<string> {
    const summaryTabIntroStatement = page.locator(
      '[data-testid="pension-detail-intro"]',
    );
    await summaryTabIntroStatement.waitFor();
    const introText = await summaryTabIntroStatement.innerText();

    return FormattingUtils.normalizeText(
      introText.replaceAll(/\r?\n|\u2028|\u2029/g, ' '),
    ).replaceAll(/£\s+/g, '£');
  }

  private static assertSummaryIntroHasExtractableValues(introText: string) {
    if (!this.extractAmountFromSummaryIntro(introText)) {
      throw new Error(
        `Unable to extract amount from intro text. Intro text was: "${introText}"`,
      );
    }
    if (!this.extractDateFromSummaryIntro(introText)) {
      throw new Error(
        `Unable to extract date from intro text. Intro text was: "${introText}"`,
      );
    }
  }

  private static extractAmountFromSummaryIntro(
    introText: string,
  ): string | null {
    return /£[\d,]+(?:\.\d{1,2})?/.exec(introText)?.[0] ?? null;
  }

  private static extractDateFromSummaryIntro(introText: string): string | null {
    return /\d{1,2}\s+[A-Za-z]+\s+\d{4}/.exec(introText)?.[0] ?? null;
  }

  private static getRequiredMatchingArrangement(data: ArrangementData) {
    if (!data?.matchingArrangement) {
      throw new Error(
        'verifyPensionSummaryTab requires data.matchingArrangement to be present',
      );
    }

    const externalAssetId = data.matchingArrangement.externalAssetId;
    if (!externalAssetId) {
      throw new Error(
        'matchingArrangement.externalAssetId is required to fetch pension detail',
      );
    }

    return data.matchingArrangement;
  }

  private static async getPensionDetailForSummaryStatement(
    page: Page,
    request: any,
    matchingArrangement: ArrangementData['matchingArrangement'],
  ) {
    const pensionDetailResponse = await RequestHelper.getPensionSchemeDetail(
      page,
      request,
      matchingArrangement.externalAssetId,
    );
    const pensionDetailJson = await pensionDetailResponse.json();
    return this.unwrapPensionDetailResponse(pensionDetailJson);
  }

  private static unwrapPensionDetailResponse(pensionDetailJson: any) {
    if (!Array.isArray(pensionDetailJson)) return pensionDetailJson;
    if (pensionDetailJson.length === 0) {
      throw new Error('Pension detail response is an empty array');
    }
    return pensionDetailJson[0];
  }

  private static getRequiredSummaryDetailData(
    pensionDetail: any,
    externalAssetId: string,
    pensionSchemeName: string,
  ) {
    const detailData = pensionDetail?.detailData ?? pensionDetail;
    if (!detailData?.standardPayment) {
      throw new Error(
        'detailData.standardPayment missing from pension scheme detail response',
      );
    }

    this.assertSummaryDetailMatchesRequest(
      detailData,
      pensionDetail,
      externalAssetId,
      pensionSchemeName,
    );

    return detailData;
  }

  private static assertSummaryDetailMatchesRequest(
    detailData: any,
    pensionDetail: any,
    externalAssetId: string,
    pensionSchemeName: string,
  ) {
    this.assertSummaryDetailExternalAssetId(
      detailData,
      pensionDetail,
      externalAssetId,
    );
    this.assertSummaryDetailSchemeName(
      detailData,
      pensionDetail,
      pensionSchemeName,
    );
  }

  private static assertSummaryDetailExternalAssetId(
    detailData: any,
    pensionDetail: any,
    externalAssetId: string,
  ) {
    const responseExternalAssetId =
      detailData.externalAssetId ?? pensionDetail?.externalAssetId;
    if (
      responseExternalAssetId &&
      String(responseExternalAssetId) !== String(externalAssetId)
    ) {
      throw new Error(
        `Pension detail mismatch: requested externalAssetId "${externalAssetId}" but received "${responseExternalAssetId}"`,
      );
    }
  }

  private static assertSummaryDetailSchemeName(
    detailData: any,
    pensionDetail: any,
    pensionSchemeName: string,
  ) {
    const responseSchemeName =
      detailData.schemeName ??
      detailData.pensionSchemeName ??
      pensionDetail?.schemeName ??
      pensionDetail?.pensionSchemeName;
    if (!pensionSchemeName || !responseSchemeName) return;

    const normalizedRequestedScheme =
      FormattingUtils.normalizeForComparison(pensionSchemeName);
    const normalizedResponseScheme = FormattingUtils.normalizeForComparison(
      String(responseSchemeName),
    );

    if (normalizedRequestedScheme !== normalizedResponseScheme) {
      throw new Error(
        `Pension detail mismatch: requested scheme "${pensionSchemeName}" but received "${responseSchemeName}"`,
      );
    }
  }

  private static assertSummaryStatementText(
    introText: string,
    standardPayment: any,
  ) {
    const normalizedIntro = FormattingUtils.normalizeForComparison(introText);
    const expectedTexts = [
      `£${FormattingUtils.formatDisplayAmount(
        standardPayment.monthlyAmount,
      )} a month`,
      standardPayment.payableDate
        ? new Date(standardPayment.payableDate).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })
        : '',
    ];

    for (const expectedText of expectedTexts) {
      expect(normalizedIntro).toContain(
        FormattingUtils.normalizeForComparison(expectedText),
      );
    }
  }
}
