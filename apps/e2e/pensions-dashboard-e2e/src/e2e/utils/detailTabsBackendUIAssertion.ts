import { expect, Locator, Page } from '@maps/playwright';

import pensionDetailsPage from '../pages/PensionDetailsPage';
import pensionBreakdownPage from '../pages/PensionsBreakdownPage';
import { AccordionBackendUiAssertion } from './accordionBackendUIAssertion';
import { BeDataExtraction } from './beDataExtraction';
import { FormattingUtils } from './formatting';
import { ArrangementData } from './pensionCardBackendUIAssertion';
import { RequestHelper } from './request';

export class BackendUiAssertion {
  static async expectAccordionsForArrangement(page: Page, arrangement: any) {
    return AccordionBackendUiAssertion.expectAccordionsForArrangement(
      page,
      arrangement,
    );
  }

  static async expectAccordionsVisible(
    page: Page,
    data: any,
    incomeValuesChartKind?: 'bar' | 'donut',
  ) {
    return AccordionBackendUiAssertion.expectAccordionsVisible(
      page,
      data,
      incomeValuesChartKind,
    );
  }

  static async expectAccordionsMatchBackendWarnings(
    page: Page,
    arrangement: any,
    calculationAccordionTestId?: string,
    detailData?: { warnings?: string[] },
    incomeValuesChartKind?: 'bar' | 'donut',
  ) {
    return AccordionBackendUiAssertion.expectAccordionsMatchBackendWarnings(
      page,
      arrangement,
      calculationAccordionTestId,
      detailData,
      incomeValuesChartKind,
    );
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

    const pickedArrangement = await this.pickArrangementForSummaryVerification(
      page,
      request,
      arrangement,
      categoryArrangements,
    );
    arrangement = pickedArrangement.arrangement;
    const arrangementDetailData =
      await BackendUiAssertion.loadArrangementDetailData(
        page,
        request,
        arrangement,
        pickedArrangement.arrangementDetailData,
      );

    const warnings = BeDataExtraction.aggregateIllustrationWarnings(
      arrangementDetailData,
    );

    const pensionCards = await pensionBreakdownPage.pensionCards(page);
    console.info(`Found ${pensionCards.length} pension cards to process`);
    console.info(`Warning codes to verify: ${warnings.join(', ')}`);

    for (const pensionCard of pensionCards) {
      await BackendUiAssertion.verifySummaryTabPensionCardIfEligible(
        page,
        request,
        pensionCard,
        categoryArrangements,
      );
    }
  }

  private static async loadArrangementDetailData(
    page: Page,
    request: any,
    arrangement: any,
    arrangementDetailData?: any,
  ) {
    if (arrangementDetailData) {
      return arrangementDetailData;
    }
    const { pensionSchemeDetailResponse } =
      await BeDataExtraction.extractPensionSchemeDetailData(
        page,
        request,
        arrangement,
      );
    return pensionSchemeDetailResponse.json();
  }

  private static shouldProcessSummaryTabCard(data: any): boolean {
    const matchingArrangement = data.matchingArrangement;
    return (
      Boolean(matchingArrangement?.hasMultipleTranches) &&
      matchingArrangement?.pensionType !== 'SP'
    );
  }

  private static async verifySummaryTabPensionCardIfEligible(
    page: Page,
    request: any,
    pensionCard: any,
    categoryArrangements: any[],
  ) {
    const cardData = await BackendUiAssertion.getValidPensionCardData(
      page,
      request,
      pensionCard,
      categoryArrangements,
    );
    if (!cardData) {
      return;
    }

    const { schemeNameOnCard, data } = cardData;
    const cardIdentifier = `${schemeNameOnCard}_${data.matchingArrangement?.externalAssetId}`;
    console.info(`Examining pension card: ${cardIdentifier}`);

    if (!BackendUiAssertion.shouldProcessSummaryTabCard(data)) {
      console.info(
        `Skipping card - not multiple tranches or is SP type: ${cardIdentifier}`,
      );
      return;
    }

    await BackendUiAssertion.verifySummaryTabCardDetails(
      page,
      request,
      pensionCard,
      data,
      cardIdentifier,
    );
  }

  private static async getConfirmedCategoryArrangements(
    page: Page,
    request: any,
  ) {
    const response = await RequestHelper.getPensionCategory(
      page,
      request,
      'CONFIRMED',
    );
    const responseJson = await response.json();
    return responseJson?.arrangements ?? [];
  }

  private static async pickArrangementForSummaryVerification(
    page: Page,
    request: any,
    arrangement: any,
    categoryArrangements: any[],
  ) {
    let arrangementDetailData: any;
    if (arrangement) {
      return { arrangement, arrangementDetailData };
    }
    for (const candidateArrangement of categoryArrangements) {
      const { pensionSchemeDetailResponse } =
        await BeDataExtraction.extractPensionSchemeDetailData(
          page,
          request,
          candidateArrangement,
        );
      const detailJson = await pensionSchemeDetailResponse.json();
      if (
        BeDataExtraction.aggregateIllustrationWarnings(detailJson).length === 0
      ) {
        continue;
      }
      arrangement = candidateArrangement;
      arrangementDetailData = detailJson;
      break;
    }
    if (!arrangement && categoryArrangements.length > 0) {
      arrangement = categoryArrangements[0];
    }
    if (!arrangement) {
      throw new Error('No arrangements available from backend to verify.');
    }
    return { arrangement, arrangementDetailData };
  }

  private static async verifySummaryTabCardDetails(
    page: Page,
    request: any,
    pensionCard: any,
    data: ArrangementData,
    cardIdentifier: string,
  ) {
    await pensionBreakdownPage.clickSeeDetailsButton(page, pensionCard);
    const warningElements = page.getByTestId(/warning-title-/);
    console.info('Warning elements:', warningElements);
    const summaryTabText = page.getByTestId('pension-detail-intro');
    await summaryTabText.waitFor({ state: 'visible' });
    await BackendUiAssertion.verifySummaryStatementOnSummaryTab(
      page,
      data,
      request,
    );

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

  /**
   * Verifies bar chart labels, legends and values.
   * please note the following
   * INCL - Recurring-Legacy
   * INCN - Recurring-Alternative(New)
   * CSHL - Lumpsum - Legacy
   * CSHN - Lumpsum - Alternative(New)
   */
  static async verifyBarCharts(
    page: Page,
    request: any,
    data: ArrangementData,
  ) {
    const context = this.getChartContext(data);
    if (
      context.illustrationsData.hasMultipleTranches ||
      context.pensionType === 'VAR' ||
      context.illustrationsData.benefitIllustrations.length > 1
    ) {
      await this.verifyMultiTrancheBarCharts(page, context);
      return;
    }
    if (
      !BackendUiAssertion.arrangementHasRecurringBarIllustrations(
        data.matchingArrangement,
      )
    ) {
      await this.verifyAccordionsWhenDisplayed(page, request, data);
      return;
    }
    await this.verifyLegacyBarCharts(page, request, data);
  }

  private static async verifyMultiTrancheBarCharts(page: Page, context: any) {
    if (context.illustrationsData.hasMultipleIncomeOptions) {
      await this.verifyMcCloudBarCharts(page, context);
      return;
    }
    for (const incomeEntry of context.standardIncomeData) {
      const year = Number(incomeEntry.year);
      const hasRecurring = this.hasAnyPayableDetailsTypeForYear(
        context.illustrationsData.standardBenefitIllustrations,
        year,
        ['RECURRING'],
      );
      await this.verifyBarChartForYear(
        page,
        year,
        incomeEntry,
        context.pensionType,
        undefined,
        hasRecurring,
      );
    }
  }

  private static async verifyMcCloudBarCharts(page: Page, context: any) {
    await this.verifyMcCloudBarForType(
      page,
      context.legacyIncomeData,
      context.illustrationsData.legacyBenefitIllustrations,
      context.pensionType,
      'RECURRING-LEGACY',
      'legacy',
    );
    await this.verifyMcCloudBarForType(
      page,
      context.alternativeIncomeData,
      context.illustrationsData.alternativeBenefitIllustrations,
      context.pensionType,
      'RECURRING-NEW',
      'alternative',
    );
    await this.assertMcCloudOrderAcrossYears(
      page,
      context.legacyIncomeData,
      context.alternativeIncomeData,
      'bar',
    );
  }

  private static async verifyMcCloudBarForType(
    page: Page,
    incomes: any[],
    illustrations: any[],
    pensionType: string,
    payableDetailsType: string,
    mccloudType: 'legacy' | 'alternative',
  ) {
    for (const incomeEntry of incomes) {
      const year = Number(incomeEntry.year);
      const hasRecurring = this.hasPayableDetailsTypeForYear(
        illustrations,
        year,
        payableDetailsType,
      );
      await this.verifyBarChartForYear(
        page,
        year,
        incomeEntry,
        pensionType,
        mccloudType,
        hasRecurring,
      );
    }
  }

  private static async verifyLegacyBarCharts(
    page: Page,
    request: any,
    data: ArrangementData,
  ) {
    const barChartsLocator = page.getByTestId('bar-charts');
    if (!(await barChartsLocator.isVisible().catch(() => false))) {
      await this.verifyAccordionsWhenDisplayed(page, request, data);
      return;
    }

    const expectedBarTexts = this.getExpectedLegacyBarTexts(data);

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
    const barChartLegeERIDataText = page
      .locator('[data-testid="bar-legend-1"]')
      .first();
    await barChartLegeERIDataText.waitFor({ state: 'visible' });

    const barChartLegendERIDataText = await barChartLegeERIDataText.innerText();

    let barChartLabelDataERIDataYear: string | undefined;
    if (data.eriPayableDetails) {
      const barChartLabelDataERIDataYearLocator = page
        .locator('[data-testid="bar-legend-1"] strong')
        .first();
      await barChartLabelDataERIDataYearLocator.waitFor({ state: 'visible' });
      barChartLabelDataERIDataYear =
        await barChartLabelDataERIDataYearLocator.innerText();
    }
    this.assertLegacyBarLabel(
      barChartLabelDataAP,
      data.apPayableDetails,
      data.apAnnualAmountData,
      data.apMonthlyAmountData,
      `${expectedBarTexts.apYearly}${expectedBarTexts.apMonthly}`,
    );
    this.assertLegacyBarLabel(
      barChartLabelDataERI,
      data.eriPayableDetails,
      data.eriAnnualAmountData,
      data.eriMonthlyAmountData,
      `${expectedBarTexts.eriYearly}${expectedBarTexts.eriMonthly}`,
    );

    await this.verifyAccordionsWhenDisplayed(page, request, data);

    expect(barChartLegendDataAP).toContain(
      'Latest value' + data.illustrationYear,
    );
    expect(barChartLegendERIDataText).toContain(
      //'Estimate at retirement',
      'Estimate at retirement',
    );
    if (barChartLabelDataERIDataYear) {
      expect(barChartLabelDataERIDataYear).toContain(data.retirementYear);
    }
  }

  private static getExpectedLegacyBarTexts(data: ArrangementData) {
    return {
      apYearly: `£${FormattingUtils.formatDisplayAmount(
        data.apAnnualAmountData,
      )} a year`,
      apMonthly: `£${FormattingUtils.formatDisplayAmount(
        data.apMonthlyAmountData,
      )} a month`,
      eriYearly: `£${FormattingUtils.formatDisplayAmount(
        data.eriAnnualAmountData,
      )} a year`,
      eriMonthly: `£${FormattingUtils.formatDisplayAmount(
        data.eriMonthlyAmountData,
      )} a month`,
    };
  }

  private static assertLegacyBarLabel(
    labelText: string,
    payableDetails: any,
    annualAmount: unknown,
    monthlyAmount: unknown,
    expectedText: string,
  ) {
    const isUnavailableValue = (value: unknown) =>
      value === null || value === '--';
    const isUnavailable =
      payableDetails === null ||
      isUnavailableValue(monthlyAmount) ||
      isUnavailableValue(annualAmount) ||
      (annualAmount === 0 && monthlyAmount === 0);
    if (isUnavailable) {
      expect(labelText).toContain('Unavailable');
      return;
    }
    expect(labelText).toContain(expectedText);
  }

  private static async verifyAccordionsWhenDisplayed(
    page: Page,
    request: any,
    data: ArrangementData,
  ) {
    const displayedAccordionText =
      await pensionDetailsPage.getDataFromAccordion(page);
    if (!displayedAccordionText) return;
    let detailData: { warnings?: string[] } | undefined;
    try {
      const { pensionSchemeDetailResponse } =
        await BeDataExtraction.extractPensionSchemeDetailData(
          page,
          request,
          data.matchingArrangement,
        );
      const detailJson = await pensionSchemeDetailResponse.json();
      detailData = detailJson?.detailData ?? detailJson;
    } catch (error) {
      console.warn(
        `Failed to fetch pension detail data for accordion verification:`,
        error,
      );
    }
    await AccordionBackendUiAssertion.expectAccordionsMatchBackendWarnings(
      page,
      data.matchingArrangement,
      undefined,
      detailData,
    );
  }

  static async verifyDoughnutCharts(
    page: Page,
    data: any,
    apLumpSumAmountData: number | null,
    eriLumpSumAmountData: number | null,
  ) {
    const context = this.getChartContext(data);
    if (
      context.illustrationsData.hasMultipleTranches ||
      context.pensionType === 'VAR' ||
      context.illustrationsData.benefitIllustrations.length > 1
    ) {
      await this.verifyMultiTrancheDoughnutCharts(page, context);
      return;
    }
    await this.verifyLegacyDoughnutCharts(
      page,
      data,
      apLumpSumAmountData,
      eriLumpSumAmountData,
    );
  }

  private static getChartContext(data: ArrangementData) {
    return {
      illustrationsData: BeDataExtraction.getIllustrationsData(
        data.matchingArrangement,
      ),
      pensionType: data.matchingArrangement?.pensionType ?? data.type ?? 'DB',
      standardIncomeData: BeDataExtraction.getStandardIncome(
        data.matchingArrangement,
      )
        .filter((entry: any) => Number.isFinite(entry?.year))
        .toSorted((a: any, b: any) => Number(a.year) - Number(b.year)),
      legacyIncomeData: (
        data.matchingArrangement?.detailData?.incomeAndValues?.legacyIncome ??
        []
      )
        .filter((entry: any) => Number.isFinite(entry?.year))
        .toSorted((a: any, b: any) => Number(a.year) - Number(b.year)),
      alternativeIncomeData: (
        data.matchingArrangement?.detailData?.incomeAndValues
          ?.alternativeIncome ?? []
      )
        .filter((entry: any) => Number.isFinite(entry?.year))
        .toSorted((a: any, b: any) => Number(a.year) - Number(b.year)),
    };
  }

  private static async verifyMultiTrancheDoughnutCharts(
    page: Page,
    context: any,
  ) {
    if (context.illustrationsData.hasMultipleIncomeOptions) {
      await this.verifyMcCloudDoughnutForType(
        page,
        context.legacyIncomeData,
        context.illustrationsData.legacyBenefitIllustrations,
        context.pensionType,
        'LUMPSUM-LEGACY',
        'legacy',
      );
      await this.verifyMcCloudDoughnutForType(
        page,
        context.alternativeIncomeData,
        context.illustrationsData.alternativeBenefitIllustrations,
        context.pensionType,
        'LUMPSUM-NEW',
        'alternative',
      );
      await this.assertMcCloudOrderAcrossYears(
        page,
        context.legacyIncomeData,
        context.alternativeIncomeData,
        'donut',
      );
      return;
    }
    for (const incomeEntry of context.standardIncomeData) {
      const year = Number(incomeEntry.year);
      const hasLumpSum = this.hasAnyPayableDetailsTypeForYear(
        context.illustrationsData.standardBenefitIllustrations,
        year,
        ['LUMPSUM'],
      );
      await this.verifyDoughnutChartForYear(
        page,
        year,
        incomeEntry,
        context.pensionType,
        undefined,
        hasLumpSum,
      );
    }
  }

  private static async verifyMcCloudDoughnutForType(
    page: Page,
    incomes: any[],
    illustrations: any[],
    pensionType: string,
    payableDetailsType: string,
    mccloudType: 'legacy' | 'alternative',
  ) {
    for (const incomeEntry of incomes) {
      const year = Number(incomeEntry.year);
      const hasLumpSum = this.hasPayableDetailsTypeForYear(
        illustrations,
        year,
        payableDetailsType,
      );
      await this.verifyDoughnutChartForYear(
        page,
        year,
        incomeEntry,
        pensionType,
        mccloudType,
        hasLumpSum,
      );
    }
  }

  private static async assertMcCloudOrderAcrossYears(
    page: Page,
    legacyIncomeData: any[],
    alternativeIncomeData: any[],
    chartKind: 'bar' | 'donut',
  ) {
    const years = new Set<number>([
      ...legacyIncomeData.map((entry: any) => Number(entry?.year)),
      ...alternativeIncomeData.map((entry: any) => Number(entry?.year)),
    ]);
    for (const year of years) {
      if (!Number.isFinite(year)) continue;
      await this.assertMcCloudOrderForYear(page, year, chartKind);
    }
  }

  private static async assertMcCloudOrderForYear(
    page: Page,
    year: number,
    chartKind: 'bar' | 'donut',
  ) {
    const yearSection = page.getByTestId(`year-${year}`);
    const cards = yearSection.locator(
      `[data-testid^="${year}-"][data-testid*="-${chartKind}-"]`,
    );
    if ((await cards.count()) < 2) return;

    const legacyCard = cards
      .filter({
        has: yearSection
          .getByTestId('mccloud-heading')
          .filter({ hasText: 'legacy option' }),
      })
      .first();
    const alternativeCard = cards
      .filter({
        has: yearSection
          .getByTestId('mccloud-heading')
          .filter({ hasText: 'alternative option' }),
      })
      .first();

    if (
      (await legacyCard.count()) === 0 ||
      (await alternativeCard.count()) === 0
    ) {
      return;
    }

    const cardKindsInDomOrder = await cards.evaluateAll((elements) =>
      elements.map((el) => {
        const text = (el.textContent ?? '').toLowerCase();
        if (text.includes('legacy option')) return 'legacy';
        if (text.includes('alternative option')) return 'alternative';
        return 'other';
      }),
    );
    const legacyIndex = cardKindsInDomOrder.indexOf('legacy');
    const alternativeIndex = cardKindsInDomOrder.indexOf('alternative');
    expect(
      legacyIndex,
      `Expected legacy ${chartKind} card for year ${year} to appear before alternative. DOM order: ${cardKindsInDomOrder.join(
        ', ',
      )}`,
    ).toBeGreaterThanOrEqual(0);
    expect(
      alternativeIndex,
      `Expected alternative ${chartKind} card for year ${year} to be present. DOM order: ${cardKindsInDomOrder.join(
        ', ',
      )}`,
    ).toBeGreaterThanOrEqual(0);
    expect(
      legacyIndex,
      `Expected legacy ${chartKind} card for year ${year} to appear before alternative. DOM order: ${cardKindsInDomOrder.join(
        ', ',
      )}`,
    ).toBeLessThan(alternativeIndex);
  }

  private static async verifyLegacyDoughnutCharts(
    page: Page,
    data: any,
    apLumpSumAmountData: number | null,
    eriLumpSumAmountData: number | null,
  ) {
    const doughnutChartLocator = page.getByTestId('donut-charts');
    const isApUnavailable = BackendUiAssertion.isPayableDetailsUnavailable(
      data.apPayableDetails,
      data.apMonthlyAmountData,
      data.apAnnualAmountData,
    );
    const isEriUnavailable = BackendUiAssertion.isPayableDetailsUnavailable(
      data.eriPayableDetails,
      data.eriMonthlyAmountData,
      data.eriAnnualAmountData,
    );
    const isDoughnutVisible = await doughnutChartLocator.isVisible();
    if (!isDoughnutVisible || isApUnavailable || isEriUnavailable) {
      return;
    }

    await this.assertLegacyDoughnutLabels(
      page,
      apLumpSumAmountData,
      eriLumpSumAmountData,
    );
    const doughnutLegendDataAP = await pensionDetailsPage.getTextFromLocator(
      page,
      'donut-legend-0',
    );
    expect(doughnutLegendDataAP).toContain(data.illustrationYear);
  }

  private static isPayableDetailsUnavailable(
    payableDetails: unknown,
    monthlyAmount: unknown,
    annualAmount: unknown,
  ): boolean {
    const isUnavailableValue = (value: unknown) =>
      value === null || value === '--';
    return (
      payableDetails === null ||
      isUnavailableValue(monthlyAmount) ||
      isUnavailableValue(annualAmount)
    );
  }

  private static async assertLegacyDoughnutLabels(
    page: Page,
    apLumpSumAmountData: number | null,
    eriLumpSumAmountData: number | null,
  ) {
    const doughnutLabelDataAP = await pensionDetailsPage.getTextFromLocator(
      page,
      'donut-label-0',
    );
    const doughnutLabelDataERI = await pensionDetailsPage.getTextFromLocator(
      page,
      'donut-label-1',
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
  }

  static async verifyTimelineOnIncomeTab(
    page: Page,
    pensionData: any,
    _pensionType: string,
  ) {
    const hasMultipleIncomeOptions =
      pensionData?.hasMultipleIncomeOptions === true;
    const standardIncomeData: any[] = BeDataExtraction.getStandardIncome(
      pensionData,
    )
      .filter((entry: any) => Number.isFinite(entry?.year))
      .toSorted((a: any, b: any) => Number(a.year) - Number(b.year));

    if (hasMultipleIncomeOptions) {
      const legacyIncomeData: any[] = (
        pensionData?.detailData?.incomeAndValues?.legacyIncome ?? []
      )
        .filter((entry: any) => Number.isFinite(entry?.year))
        .toSorted((a: any, b: any) => Number(a.year) - Number(b.year));
      const alternativeIncomeData: any[] = (
        pensionData?.detailData?.incomeAndValues?.alternativeIncome ?? []
      )
        .filter((entry: any) => Number.isFinite(entry?.year))
        .toSorted((a: any, b: any) => Number(a.year) - Number(b.year));

      await this.verifyTimelineEntries(
        page,
        legacyIncomeData,
        page.getByTestId('income-values-legacy-list'),
      );
      await this.verifyTimelineEntries(
        page,
        alternativeIncomeData,
        page.getByTestId('income-values-alternative-list'),
      );
      return;
    }

    await this.verifyTimelineEntries(page, standardIncomeData);
  }

  private static async verifyTimelineEntries(
    page: Page,
    incomeData: any[],
    scope?: Locator,
  ) {
    const root: Page | Locator = scope ?? page;

    for (let index = 0; index < incomeData.length; index++) {
      const incomeEntry = incomeData[index];
      const year = Number(incomeEntry.year);
      const incomeItemLocator = root.getByTestId(`income-item-${year}`);

      await expect(incomeItemLocator).toBeVisible();
      await this.assertIncomeItemAmounts(
        root,
        incomeEntry,
        year,
        incomeItemLocator,
      );
      await this.assertIncomeDifference(incomeItemLocator, incomeEntry, index);
    }
  }

  private static async assertIncomeItemAmounts(
    root: Page | Locator,
    incomeEntry: any,
    year: number,
    incomeItemLocator: Locator,
  ) {
    if (incomeEntry.monthlyAmount != null) {
      const expectedMonthlyText = `£${FormattingUtils.formatDisplayAmount(
        incomeEntry.monthlyAmount,
      )} a month`;
      await expect(incomeItemLocator).toContainText(expectedMonthlyText);
    }

    const legacyIncomeTextLocator = root.locator(
      `[data-testid="income-text-${year}"]`,
    );
    if ((await legacyIncomeTextLocator.count()) === 0) return;

    if (incomeEntry.annualAmount != null) {
      const expectedYearlyText = `£${FormattingUtils.formatDisplayAmount(
        incomeEntry.annualAmount,
      )} a year`;
      await expect(legacyIncomeTextLocator).toContainText(expectedYearlyText);
    }
    if (incomeEntry.monthlyAmount != null) {
      const expectedMonthlyText = `£${FormattingUtils.formatDisplayAmount(
        incomeEntry.monthlyAmount,
      )} a month`;
      await expect(legacyIncomeTextLocator).toContainText(expectedMonthlyText);
    }
  }

  private static async assertIncomeDifference(
    incomeItemLocator: Locator,
    incomeEntry: any,
    index: number,
  ) {
    if (index <= 0) return;
    const beDifference = incomeEntry.difference;
    const differenceLocator =
      incomeItemLocator.getByTestId('income-difference');
    if (typeof beDifference !== 'number' || beDifference === 0) {
      await expect(differenceLocator).toHaveCount(0);
      return;
    }
    const expectedDirection = beDifference > 0 ? 'increase of' : 'decrease of';
    const expectedDifferenceText = `${expectedDirection} £${FormattingUtils.formatDisplayAmount(
      Math.abs(beDifference),
    )}`;
    await expect(differenceLocator).toBeVisible();
    await expect(differenceLocator).toContainText(expectedDifferenceText);
    await expect(differenceLocator).toHaveClass(
      beDifference > 0 ? /text-green-700/ : /text-red-700/,
    );
  }

  static async verifyChartsOnIncomeTab(
    page: Page,
    pensionData: any,
    pensionType: string,
  ) {
    const illustrationsData =
      BeDataExtraction.getIllustrationsData(pensionData);
    const hasMultipleIncomeOptions = illustrationsData.hasMultipleIncomeOptions;
    const standardIncomeData: any[] = BeDataExtraction.getStandardIncome(
      pensionData,
    )
      .filter((entry: any) => Number.isFinite(entry?.year))
      .toSorted((a: any, b: any) => Number(a.year) - Number(b.year));

    if (hasMultipleIncomeOptions) {
      const legacyIncomeData: any[] = (
        pensionData?.detailData?.incomeAndValues?.legacyIncome ?? []
      )
        .filter((entry: any) => Number.isFinite(entry?.year))
        .toSorted((a: any, b: any) => Number(a.year) - Number(b.year));
      const alternativeIncomeData: any[] = (
        pensionData?.detailData?.incomeAndValues?.alternativeIncome ?? []
      )
        .filter((entry: any) => Number.isFinite(entry?.year))
        .toSorted((a: any, b: any) => Number(a.year) - Number(b.year));

      for (const incomeEntry of legacyIncomeData) {
        const year = Number(incomeEntry.year);
        const hasLegacyRecurring = this.hasPayableDetailsTypeForYear(
          illustrationsData.legacyBenefitIllustrations,
          year,
          'RECURRING-LEGACY',
        );
        const hasLegacyLumpSum = this.hasPayableDetailsTypeForYear(
          illustrationsData.legacyBenefitIllustrations,
          year,
          'LUMPSUM-LEGACY',
        );

        await this.verifyBarChartForYear(
          page,
          year,
          incomeEntry,
          pensionType,
          'legacy',
          hasLegacyRecurring,
        );

        await this.verifyDoughnutChartForYear(
          page,
          year,
          incomeEntry,
          pensionType,
          'legacy',
          hasLegacyLumpSum,
        );
      }

      for (const incomeEntry of alternativeIncomeData) {
        const year = Number(incomeEntry.year);
        const hasAlternativeRecurring = this.hasPayableDetailsTypeForYear(
          illustrationsData.alternativeBenefitIllustrations,
          year,
          'RECURRING-NEW',
        );
        const hasAlternativeLumpSum = this.hasPayableDetailsTypeForYear(
          illustrationsData.alternativeBenefitIllustrations,
          year,
          'LUMPSUM-NEW',
        );

        await this.verifyBarChartForYear(
          page,
          year,
          incomeEntry,
          pensionType,
          'alternative',
          hasAlternativeRecurring,
        );

        await this.verifyDoughnutChartForYear(
          page,
          year,
          incomeEntry,
          pensionType,
          'alternative',
          hasAlternativeLumpSum,
        );
      }
      return;
    }

    for (const incomeEntry of standardIncomeData) {
      const year = Number(incomeEntry.year);
      const hasRecurring = this.hasAnyPayableDetailsTypeForYear(
        illustrationsData.standardBenefitIllustrations,
        year,
        ['RECURRING'],
      );
      await this.verifyBarChartForYear(
        page,
        year,
        incomeEntry,
        pensionType,
        undefined,
        hasRecurring,
      );
      await this.verifyDoughnutChartForYear(
        page,
        year,
        incomeEntry,
        pensionType,
      );
    }
  }

  private static arrangementHasRecurringBarIllustrations(
    arrangement: any,
  ): boolean {
    return (arrangement?.benefitIllustrations ?? []).some(
      (illustration: any) => {
        const type = String(
          illustration?.payableDetailsType ?? '',
        ).toUpperCase();
        return type.startsWith('RECURRING');
      },
    );
  }

  private static hasPayableDetailsTypeForYear(
    illustrations: any[],
    year: number,
    payableDetailsType: string,
  ): boolean {
    return illustrations.some((illustration) => {
      const type = String(illustration?.payableDetailsType ?? '').toUpperCase();
      if (type !== payableDetailsType) return false;
      const matchedComponent = (
        illustration?.illustrationComponents ?? []
      ).find(
        (component: any) =>
          Number(
            new Date(
              component?.payableDetails?.payableDate ?? '',
            ).getUTCFullYear(),
          ) === year,
      );
      return Boolean(matchedComponent);
    });
  }

  private static hasAnyPayableDetailsTypeForYear(
    illustrations: any[],
    year: number,
    payableDetailsTypePrefixes: string[],
  ): boolean {
    return illustrations.some((illustration) => {
      const type = String(illustration?.payableDetailsType ?? '').toUpperCase();
      if (
        !payableDetailsTypePrefixes.some((prefix) => type.startsWith(prefix))
      ) {
        return false;
      }
      const matchedComponent = (
        illustration?.illustrationComponents ?? []
      ).find(
        (component: any) =>
          Number(
            new Date(
              component?.payableDetails?.payableDate ?? '',
            ).getUTCFullYear(),
          ) === year,
      );
      return Boolean(matchedComponent);
    });
  }

  private static async verifyBarChartForYear(
    page: Page,
    year: number,
    incomeEntry: any,
    _pensionType: string,
    mccloudType?: 'legacy' | 'alternative',
    expectedByPayableDetailsType?: boolean,
  ) {
    const yearSection = page.getByTestId(`year-${year}`);
    const scopedYearlyBarCards = this.getScopedYearlyBarCards(
      yearSection,
      year,
      mccloudType,
    );
    const hasExpectedBar = this.hasExpectedBar(
      incomeEntry,
      expectedByPayableDetailsType,
    );
    const legacyBarChart = page.locator(`[data-testid="bar-chart-${year}"]`);
    const hasYearlyBar = (await scopedYearlyBarCards.count()) > 0;
    const hasLegacyBar = (await legacyBarChart.count()) > 0;

    if (!hasExpectedBar) {
      await expect(scopedYearlyBarCards).toHaveCount(0);
      return;
    }

    await expect(yearSection).toBeVisible();
    if (!hasYearlyBar && !hasLegacyBar) {
      await expect(page.getByTestId('bar-charts')).toBeVisible();
      return;
    }

    const barChartLocator = hasYearlyBar
      ? scopedYearlyBarCards.first()
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

  private static getScopedYearlyBarCards(
    yearSection: Locator,
    year: number,
    mccloudType?: 'legacy' | 'alternative',
  ) {
    const yearlyBarCards = yearSection.locator(
      `[data-testid^="${year}-"][data-testid*="-bar-"]`,
    );
    if (!mccloudType) return yearlyBarCards;
    return yearlyBarCards.filter({
      has: yearSection
        .getByTestId('mccloud-heading')
        .filter({ hasText: `${mccloudType} option` }),
    });
  }

  private static hasExpectedBar(
    incomeEntry: any,
    expectedByPayableDetailsType?: boolean,
  ): boolean {
    const hasExpectedByValues =
      incomeEntry?.annualAmount != null || incomeEntry?.monthlyAmount != null;
    if (typeof expectedByPayableDetailsType !== 'boolean') {
      return hasExpectedByValues;
    }
    return expectedByPayableDetailsType && hasExpectedByValues;
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
    _pensionType: string,
    mccloudType?: 'legacy' | 'alternative',
    expectedByPayableDetailsType?: boolean,
  ) {
    const yearSection = page.getByTestId(`year-${year}`);
    const scopedYearlyDoughnutCards = this.getScopedYearlyDoughnutCards(
      yearSection,
      year,
      mccloudType,
    );
    const expectedAmount = this.getExpectedDoughnutAmount(incomeEntry);
    const hasExpectedDoughnut = this.hasExpectedDoughnut(
      expectedAmount,
      expectedByPayableDetailsType,
    );
    const hasYearlyDoughnut = (await scopedYearlyDoughnutCards.count()) > 0;

    if (!hasExpectedDoughnut) {
      await expect(scopedYearlyDoughnutCards).toHaveCount(0);
      return;
    }

    await expect(yearSection).toBeVisible();
    if (!hasYearlyDoughnut) {
      await expect(page.getByTestId('donut-charts')).toBeVisible();
      return;
    }

    const yearlyDoughnut = scopedYearlyDoughnutCards.first();
    await expect(yearlyDoughnut).toBeVisible();
    const expectedAmountText = `£${FormattingUtils.formatDisplayAmount(
      expectedAmount,
    )}`;
    await expect(
      yearlyDoughnut.locator('[data-testid^="donut-label-"]').first(),
    ).toContainText(expectedAmountText);
  }

  private static getScopedYearlyDoughnutCards(
    yearSection: Locator,
    year: number,
    mccloudType?: 'legacy' | 'alternative',
  ) {
    const yearlyDoughnutCards = yearSection.locator(
      `[data-testid^="${year}-"][data-testid*="-donut-"]`,
    );
    if (!mccloudType) return yearlyDoughnutCards;
    return yearlyDoughnutCards.filter({
      has: yearSection
        .getByTestId('mccloud-heading')
        .filter({ hasText: `${mccloudType} option` }),
    });
  }

  private static getExpectedDoughnutAmount(incomeEntry: any): number | null {
    const lumpSumAmount =
      typeof incomeEntry?.lumpSumAmount === 'number'
        ? incomeEntry.lumpSumAmount
        : 0;
    const potValue = this.extractEntryPotValue(incomeEntry);
    if (lumpSumAmount > 0) return lumpSumAmount;
    if ((potValue ?? 0) > 0) return potValue;
    return null;
  }

  private static hasExpectedDoughnut(
    expectedAmount: number | null,
    expectedByPayableDetailsType?: boolean,
  ): boolean {
    const hasExpectedByValues = expectedAmount !== null;
    if (typeof expectedByPayableDetailsType !== 'boolean') {
      return hasExpectedByValues;
    }
    return expectedByPayableDetailsType && hasExpectedByValues;
  }

  static async verifySummaryStatementOnSummaryTab(
    page: Page,
    data: ArrangementData,
    request: any,
  ) {
    const introText = await this.getNormalizedSummaryIntroText(page);
    const arrangement = this.getRequiredMatchingArrangement(data);
    const detailData = await this.fetchAndValidatePensionDetailData(
      page,
      request,
      arrangement,
    );
    const normalizedIntro = FormattingUtils.normalizeForComparison(introText);
    if (arrangement.hasMultipleIncomeOptions === true) {
      this.assertPaymentInSummaryIntro(
        normalizedIntro,
        introText,
        detailData?.legacyPayment,
        'legacyPayment',
      );
      this.assertPaymentInSummaryIntro(
        normalizedIntro,
        introText,
        detailData?.alternativePayment,
        'alternativePayment',
      );
      return;
    }
    this.assertStandardPaymentInSummaryIntro(
      normalizedIntro,
      introText,
      detailData,
    );
  }

  private static async getNormalizedSummaryIntroText(page: Page) {
    const summaryTabIntroStatement = page.locator(
      '[data-testid="pension-detail-intro"]',
    );
    await summaryTabIntroStatement.waitFor();
    const introText = await summaryTabIntroStatement.innerText();
    return FormattingUtils.normalizeText(
      introText.replaceAll(/\r?\n|\u2028|\u2029/g, ' '),
    ).replaceAll(/£\s+/g, '£');
  }

  private static getRequiredMatchingArrangement(data: ArrangementData) {
    if (!data?.matchingArrangement) {
      throw new Error(
        'verifyPensionSummaryTab requires data.matchingArrangement to be present',
      );
    }
    return data.matchingArrangement;
  }

  private static async fetchAndValidatePensionDetailData(
    page: Page,
    request: any,
    arrangement: any,
  ) {
    const externalAssetId = arrangement.externalAssetId;
    if (!externalAssetId) {
      throw new Error(
        'matchingArrangement.externalAssetId is required to fetch pension detail',
      );
    }
    const pensionDetailResponse = await RequestHelper.getPensionSchemeDetail(
      page,
      request,
      externalAssetId,
      arrangement,
    );
    const pensionDetailJson = await pensionDetailResponse.json();
    const pensionDetail = Array.isArray(pensionDetailJson)
      ? this.getFirstPensionDetail(pensionDetailJson)
      : pensionDetailJson;
    const detailData = pensionDetail?.detailData ?? pensionDetail;
    this.assertFetchedPensionDetailMatchesRequest(
      detailData,
      pensionDetail,
      externalAssetId,
      arrangement.schemeName ?? '',
    );
    return detailData;
  }

  private static getFirstPensionDetail(pensionDetailJson: any[]) {
    if (pensionDetailJson.length === 0) {
      throw new Error('Pension detail response is an empty array');
    }
    return pensionDetailJson[0];
  }

  private static assertFetchedPensionDetailMatchesRequest(
    detailData: any,
    pensionDetail: any,
    externalAssetId: string,
    pensionSchemeName: string,
  ) {
    this.assertExternalAssetIdMatches(
      detailData,
      pensionDetail,
      externalAssetId,
    );
    this.assertSchemeNameMatches(detailData, pensionDetail, pensionSchemeName);
  }

  private static assertExternalAssetIdMatches(
    detailData: any,
    pensionDetail: any,
    externalAssetId: string,
  ) {
    const responseExternalAssetId =
      detailData.externalAssetId ?? pensionDetail?.externalAssetId;
    if (
      !responseExternalAssetId ||
      String(responseExternalAssetId) === String(externalAssetId)
    ) {
      return;
    }
    throw new Error(
      `Pension detail mismatch: requested externalAssetId "${externalAssetId}" but received "${responseExternalAssetId}"`,
    );
  }

  private static assertSchemeNameMatches(
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
    if (normalizedRequestedScheme === normalizedResponseScheme) return;
    throw new Error(
      `Pension detail mismatch: requested scheme "${pensionSchemeName}" but received "${responseSchemeName}"`,
    );
  }

  private static assertContainsSummaryIntroText(
    normalizedIntro: string,
    introText: string,
    textToFind: string,
    fieldName: string,
  ) {
    const normalizedExpected =
      FormattingUtils.normalizeForComparison(textToFind);
    expect(
      normalizedIntro,
      `Expected intro to include ${fieldName}. Intro text: "${introText}"`,
    ).toContain(normalizedExpected);
  }

  private static normalizeDateText(date: string) {
    return new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  private static assertPaymentInSummaryIntro(
    normalizedIntro: string,
    introText: string,
    payment: any,
    paymentName: 'legacyPayment' | 'alternativePayment',
  ) {
    if (!payment || typeof payment.monthlyAmount !== 'number') {
      throw new Error(
        `detailData.${paymentName}.monthlyAmount missing from pension scheme detail response`,
      );
    }
    this.assertContainsSummaryIntroText(
      normalizedIntro,
      introText,
      `£${FormattingUtils.formatDisplayAmount(payment.monthlyAmount)} a month`,
      `${paymentName}.monthlyAmount`,
    );
    if (typeof payment.lumpSumAmount === 'number') {
      this.assertContainsSummaryIntroText(
        normalizedIntro,
        introText,
        `£${FormattingUtils.formatDisplayAmount(payment.lumpSumAmount)}`,
        `${paymentName}.lumpSumAmount`,
      );
    }
    if (payment.payableDate) {
      this.assertContainsSummaryIntroText(
        normalizedIntro,
        introText,
        this.normalizeDateText(payment.payableDate),
        `${paymentName}.payableDate`,
      );
    }
  }

  private static assertStandardPaymentInSummaryIntro(
    normalizedIntro: string,
    introText: string,
    detailData: any,
  ) {
    if (!detailData?.standardPayment) {
      throw new TypeError(
        'detailData.standardPayment missing from pension scheme detail response',
      );
    }
    const expectedMonthlyAmount = detailData.standardPayment.monthlyAmount;
    if (typeof expectedMonthlyAmount !== 'number') {
      throw new TypeError(
        'detailData.standardPayment.monthlyAmount missing from pension scheme detail response',
      );
    }
    this.assertContainsSummaryIntroText(
      normalizedIntro,
      introText,
      `£${FormattingUtils.formatDisplayAmount(expectedMonthlyAmount)} a month`,
      'standardPayment.monthlyAmount',
    );
    if (detailData.standardPayment.payableDate) {
      this.assertContainsSummaryIntroText(
        normalizedIntro,
        introText,
        this.normalizeDateText(detailData.standardPayment.payableDate),
        'standardPayment.payableDate',
      );
    }
  }

  static async verifySummarySatetmentOnSummaryTab(
    page: Page,
    data: ArrangementData,
    request: any,
  ) {
    await BackendUiAssertion.verifySummaryStatementOnSummaryTab(
      page,
      data,
      request,
    );
  }

  //Asserts the message when NO pensionType or benefitType exists.
  static async verifySysNewNoBenefitTypeMessage(page: Page, matchType: string) {
    const incomeAndValuesMessage = await page
      .getByTestId('sys-new-no-benefit-type-message')
      .innerText();

    const expectedMessages: Record<string, string> = {
      NEW: 'This is a new pension. Your provider needs more time to send us data.',
      SYS: "There's an issue with the data from your pension provider. You do not need to take any action at this point.",
    };

    const expectedMessage = expectedMessages[matchType];
    if (expectedMessage) {
      expect(incomeAndValuesMessage.trim()).toEqual(expectedMessage);
    }
  }
  //Asserts the warning banner and benefit type header when pensionType or benefitType IS present.
  static async verifySysNewIncomeAndValuesTabWithBenefits(page: Page) {
    const incomeAndValuesWarning = await page
      .getByTestId('sys-new-values-warning')
      .innerText();

    const expectedWarningText =
      'Any information you see might be incorrect. Do not rely on any values until this pension has been confirmed.';

    expect(incomeAndValuesWarning.trim()).toEqual(expectedWarningText);
  }
  //Asserts the displayed header title on the Income and Values tab based on the benefitType extracted from benefitIllustrations.
  static async verifyBenefitTypeTitleOnIncomeTab(
    page: Page,
    matchingArrangement: any,
  ) {
    //  Extract benefitType from illustrationComponents
    const benefitType = matchingArrangement.benefitIllustrations
      ?.flatMap((bi: any) => bi.illustrationComponents ?? [])
      ?.find((ic: any) => Boolean(ic.benefitType))?.benefitType;

    if (!benefitType) {
      console.log('No benefitType found on arrangement, skipping title check.');
      return;
    }

    // Map benefitType code to expected UI display string
    const expectedTitleMap: Record<string, string> = {
      DB: 'Defined benefit',
      DC: 'Defined contribution',
    };

    const expectedTitle = expectedTitleMap[benefitType];

    if (!expectedTitle) {
      throw new Error(`Unexpected benefitType: "${benefitType}"`);
    }

    //  Locate title element on UI and assert inner text match
    const titleLocator = page.getByTestId(
      `benefit-type-title-${benefitType.toLowerCase()}`,
    );

    const actualTitleText = await titleLocator.innerText();
    expect(actualTitleText.trim()).toContain(expectedTitle);
  }
  //Verifies the unavailable summary header and content message on the Summary tab for SYS and NEW matchType pensions.
  static async verifySysNewSummaryTabUnavailableMessage(
    page: Page,
    matchType: string,
  ) {
    const expectedMessageSys =
      "There's an issue with the data from your pension provider. You do not need to take any action at this point.";
    const expectedMessageNew =
      'This is a new pension. Your provider needs more time to send us data.';

    const summaryContent = await page
      .getByTestId('summary-content')
      .innerText();

    if (matchType === 'SYS') {
      expect(summaryContent.trim()).toBe(expectedMessageSys);
    } else if (matchType === 'NEW') {
      expect(summaryContent.trim()).toBe(expectedMessageNew);
    }
  }

  static async verifyPensionTypeUnknownPensionCard(
    page: Page,
    pensionCard: any,
  ) {
    const pensionCardTypeText = await pensionCard
      .getByTestId('pension-card-type')
      .innerText();
    expect(pensionCardTypeText.trim()).toEqual('Pension type unknown');
  }
}
