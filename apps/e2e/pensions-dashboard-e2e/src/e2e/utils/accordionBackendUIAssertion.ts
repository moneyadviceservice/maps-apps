import { expect, Locator, Page } from '@maps/playwright';

import { BeDataExtraction } from './beDataExtraction';

export class AccordionBackendUiAssertion {
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

  private static readonly BENEFIT_TYPE_CALCULATION_ACCORDION: Record<
    string,
    string
  > = {
    DC: 'dc-calculation-accordion',
    AVC: 'avc-calculation-accordion',
  };

  private static readonly HYBRID_BENEFIT_TYPE_CALCULATION_ACCORDION: Record<
    string,
    string
  > = {
    AVC: 'avc-calculation-accordion',
    CBL: 'cb-calculation-accordion',
    CBS: 'cb-calculation-accordion',
    CDI: 'cdc-calculation-accordion',
    CDL: 'cdc-calculation-accordion',
    DB: 'db-calculation-accordion',
    DBL: 'db-calculation-accordion',
    DC: 'dc-calculation-accordion',
  };

  private static readonly PENSION_TYPE_CALCULATION_ACCORDION: Record<
    string,
    string
  > = {
    CDC: 'cdc-calculation-accordion',
    CB: 'cb-calculation-accordion',
    DC: 'dc-calculation-accordion',
    AVC: 'avc-calculation-accordion',
  };

  private static readonly ACCORDION_NAMES = [
    'HowThevaluesAreCalaculatedAccordion',
    'featureAccordion',
    'moreDetailsAccordion',
  ] as const;

  private static appendDonutSuffix(
    testId: string,
    chartKind: 'bar' | 'donut',
  ): string {
    return chartKind === 'donut' ? `${testId}-donut` : testId;
  }

  private static isBlankBenefitType(benefitType: unknown): boolean {
    return (
      benefitType === undefined ||
      benefitType === null ||
      (typeof benefitType === 'string' && benefitType.trim() === '')
    );
  }

  private static isFeatureOrMoreDetailsAccordion(
    accordion: string,
  ): accordion is 'featureAccordion' | 'moreDetailsAccordion' {
    return (
      accordion === 'featureAccordion' || accordion === 'moreDetailsAccordion'
    );
  }

  private static detectChartKindFromVisibility(
    barVisible: boolean,
    donutVisible: boolean,
  ): 'bar' | 'donut' {
    if (barVisible) return 'bar';
    if (donutVisible) return 'donut';
    return 'bar';
  }

  private static hybridBenefitTypeToCalcType(
    benefitType: string | undefined,
  ): string {
    if (!benefitType) return 'HYB';
    const map: Record<string, string> = {
      AVC: 'AVC',
      CBL: 'CB',
      CBS: 'CB',
      CDI: 'CDC',
      CDL: 'CDC',
      DB: 'DB',
      DBL: 'DB',
      DC: 'DC',
    };
    return map[benefitType] ?? 'HYB';
  }

  private static benefitTypeFromIllustrationComponents(
    illustration: any,
  ): string | undefined {
    const components = illustration?.illustrationComponents ?? [];
    let eri: any;
    let ap: any;
    for (const c of components) {
      if (c?.illustrationType === 'ERI') eri = c;
      else ap = c;
    }
    const raw = eri?.benefitType ?? ap?.benefitType;
    return typeof raw === 'string' && raw.trim() !== ''
      ? raw.trim()
      : undefined;
  }

  private static isLumpSumIllustration(illustration: any): boolean {
    const pdt = illustration?.payableDetailsType;
    return (
      pdt === 'LUMPSUM' || pdt === 'LUMPSUM-LEGACY' || pdt === 'LUMPSUM-NEW'
    );
  }

  private static hybridIllustrationMatchesChartKind(
    illustration: any,
    chartKind: 'bar' | 'donut',
  ): boolean {
    const hasBar =
      !AccordionBackendUiAssertion.isLumpSumIllustration(illustration);
    const bt =
      AccordionBackendUiAssertion.benefitTypeFromIllustrationComponents(
        illustration,
      );
    const calc = AccordionBackendUiAssertion.hybridBenefitTypeToCalcType(bt);
    const isLump =
      AccordionBackendUiAssertion.isLumpSumIllustration(illustration);
    const shouldHaveDonut =
      isLump || calc === 'DC' || calc === 'AVC' || calc === 'CB';
    if (chartKind === 'bar') return hasBar;
    return shouldHaveDonut;
  }

  private static resolveHybridBenefitTypeForCalculationAccordion(
    data: any,
    chartKind: 'bar' | 'donut',
  ): unknown {
    const fromArrangement = data.benefitType;
    if (typeof fromArrangement === 'string' && fromArrangement.trim() !== '') {
      return fromArrangement;
    }
    const illustrations = data.benefitIllustrations ?? [];
    const matchingIllustration =
      AccordionBackendUiAssertion.findBenefitTypeInIllustrations(
        illustrations,
        chartKind,
      );
    if (matchingIllustration !== undefined) {
      return matchingIllustration;
    }

    return AccordionBackendUiAssertion.findBenefitTypeInIllustrations(
      illustrations,
    );
  }

  private static findBenefitTypeInIllustrations(
    illustrations: any[],
    chartKind?: 'bar' | 'donut',
  ): string | undefined {
    for (const illustration of illustrations) {
      if (
        chartKind !== undefined &&
        !AccordionBackendUiAssertion.hybridIllustrationMatchesChartKind(
          illustration,
          chartKind,
        )
      ) {
        continue;
      }
      const benefitType =
        AccordionBackendUiAssertion.benefitTypeFromIllustrationComponents(
          illustration,
        );
      if (benefitType !== undefined) {
        return benefitType;
      }
    }
    return undefined;
  }

  static async expectAccordionsForArrangement(page: Page, arrangement: any) {
    const illustrationWarnings =
      BeDataExtraction.aggregateIllustrationWarnings(arrangement);
    const {
      apSafeguardedBenefit,
      eriSafeguardedBenefit,
      apSurvivorBenefit,
      eriSurvivorBenefit,
    } = AccordionBackendUiAssertion.extractSafeguardedBenefits(arrangement);
    await AccordionBackendUiAssertion.expectAccordionsVisible(page, {
      illustrationWarnings,
      apSafeguardedBenefit,
      eriSafeguardedBenefit,
      apSurvivorBenefit,
      eriSurvivorBenefit,
      benefitType: arrangement.benefitType,
      pensionType: arrangement.pensionType,
      benefitIllustrations: arrangement.benefitIllustrations,
    });
  }

  static async expectAccordionsVisible(
    page: Page,
    data: any,
    incomeValuesChartKind?: 'bar' | 'donut',
  ) {
    const chartKind =
      incomeValuesChartKind ??
      (await AccordionBackendUiAssertion.detectIncomeValuesChartKindFromUi(
        page,
        data,
      ));
    const finalCalculationAccordionTestId =
      this.resolveCalculationAccordionTestId(data, chartKind);
    const expectedAccordions = this.getUnionExpectedAccordions(data);
    const { barVisible, donutVisible } =
      await AccordionBackendUiAssertion.getIncomeValuesBarDonutAccordionVisibility(
        page,
      );
    const cdcUsesBarCalcWithOptionalDonutFeatureDetails =
      (data?.pensionType === 'CDC' ||
        data?.pensionType === 'CB' ||
        data?.pensionType === 'HYB') &&
      barVisible &&
      donutVisible &&
      chartKind === 'bar';
    await this.assertAccordionVisibility(
      page,
      finalCalculationAccordionTestId,
      expectedAccordions,
      chartKind === 'donut',
      cdcUsesBarCalcWithOptionalDonutFeatureDetails,
      data,
    );
    await AccordionBackendUiAssertion.assertDonutCalculationAccordionWhenRequired(
      page,
      data,
      barVisible,
      donutVisible,
      expectedAccordions,
    );
  }

  private static async assertDonutCalculationAccordionWhenRequired(
    page: Page,
    data: any,
    barVisible: boolean,
    donutVisible: boolean,
    expectedAccordions: string[],
  ) {
    const shouldAssertDonutCalculationAccordion =
      (data?.pensionType === 'CB' || data?.pensionType === 'HYB') &&
      barVisible &&
      donutVisible &&
      expectedAccordions.includes('HowThevaluesAreCalaculatedAccordion');
    if (!shouldAssertDonutCalculationAccordion) return;

    const donutCalculationAccordionTestId =
      AccordionBackendUiAssertion.resolveCalculationAccordionTestId(
        data,
        'donut',
      );
    await expect(
      page.getByTestId(donutCalculationAccordionTestId),
    ).toBeVisible();
  }

  private static async getIncomeValuesBarDonutAccordionVisibility(
    page: Page,
  ): Promise<{ barVisible: boolean; donutVisible: boolean }> {
    const incomeSection = page
      .locator('section')
      .filter({ has: page.getByTestId('sub-heading') })
      .first();

    const barAccordion = incomeSection.locator(
      '[data-testid$="-calculation-accordion"]',
    );
    const donutAccordion = incomeSection.locator(
      '[data-testid$="-calculation-accordion-donut"]',
    );

    const barVisible = await barAccordion
      .first()
      .isVisible()
      .catch(() => false);
    const donutVisible = await donutAccordion
      .first()
      .isVisible()
      .catch(() => false);
    return { barVisible, donutVisible };
  }

  private static async detectIncomeValuesChartKindFromUi(
    page: Page,
    _data: any,
  ): Promise<'bar' | 'donut'> {
    const { barVisible, donutVisible } =
      await AccordionBackendUiAssertion.getIncomeValuesBarDonutAccordionVisibility(
        page,
      );
    return AccordionBackendUiAssertion.detectChartKindFromVisibility(
      barVisible,
      donutVisible,
    );
  }

  private static resolveCalculationAccordionTestId(
    data: any,
    incomeValuesChartKind: 'bar' | 'donut' = 'bar',
  ): string {
    const explicit = data.calculationAccordionTestId;
    if (explicit !== undefined && explicit !== null && explicit !== '') {
      return explicit;
    }
    if (data.pensionType === 'HYB' || data.pensionType === 'VAR') {
      const hybridBenefitType =
        AccordionBackendUiAssertion.resolveHybridBenefitTypeForCalculationAccordion(
          data,
          incomeValuesChartKind,
        );
      return AccordionBackendUiAssertion.calculationAccordionForHybridBenefit(
        hybridBenefitType,
        incomeValuesChartKind,
      );
    }
    return AccordionBackendUiAssertion.calculationAccordionForNonHybridPension(
      data,
      incomeValuesChartKind,
    );
  }

  private static calculationAccordionForHybridBenefit(
    benefitType: unknown,
    chartKind: 'bar' | 'donut',
  ): string {
    if (AccordionBackendUiAssertion.isBlankBenefitType(benefitType)) {
      return 'hyb-calculation-accordion';
    }
    const base =
      AccordionBackendUiAssertion.HYBRID_BENEFIT_TYPE_CALCULATION_ACCORDION[
        benefitType as string
      ] ?? 'db-calculation-accordion';
    return AccordionBackendUiAssertion.appendDonutSuffix(base, chartKind);
  }

  private static calculationAccordionForNonHybridPension(
    data: any,
    chartKind: 'bar' | 'donut',
  ): string {
    const base =
      AccordionBackendUiAssertion.PENSION_TYPE_CALCULATION_ACCORDION[
        data.pensionType
      ] ??
      AccordionBackendUiAssertion.BENEFIT_TYPE_CALCULATION_ACCORDION[
        data.benefitType
      ] ??
      'db-calculation-accordion';
    return AccordionBackendUiAssertion.appendDonutSuffix(base, chartKind);
  }

  private static getExpectedAccordions(
    data: any,
    incomeValuesChartKind?: 'bar' | 'donut',
  ): string[] {
    const flags = AccordionBackendUiAssertion.getAccordionBenefitFlags(
      data,
      incomeValuesChartKind,
    );
    return AccordionBackendUiAssertion.buildExpectedAccordionsFromFlags(flags);
  }

  private static getAccordionBenefitFlags(
    data: any,
    incomeValuesChartKind?: 'bar' | 'donut',
  ) {
    if (
      !AccordionBackendUiAssertion.shouldUseChartKindIllustrations(
        data,
        incomeValuesChartKind,
      )
    ) {
      return AccordionBackendUiAssertion.getAccordionBenefitFlagsFromWarnings(
        data,
      );
    }
    return AccordionBackendUiAssertion.getAccordionBenefitFlagsFromIllustrations(
      data,
      incomeValuesChartKind,
    );
  }

  private static shouldUseChartKindIllustrations(
    data: any,
    incomeValuesChartKind?: 'bar' | 'donut',
  ): incomeValuesChartKind is 'bar' | 'donut' {
    return (
      incomeValuesChartKind !== undefined &&
      (data?.pensionType === 'CB' ||
        data?.pensionType === 'CDC' ||
        data?.pensionType === 'HYB') &&
      (data?.benefitIllustrations?.length ?? 0) > 0
    );
  }

  private static getAccordionBenefitFlagsFromWarnings(data: any) {
    return {
      warningCodes: new Set<string>(data.illustrationWarnings ?? []),
      hasSafeguardedBenefit: Boolean(
        data.eriSafeguardedBenefit || data.apSafeguardedBenefit,
      ),
      hasSurvivorBenefit: Boolean(
        data.eriSurvivorBenefit || data.apSurvivorBenefit,
      ),
    };
  }

  private static getAccordionBenefitFlagsFromIllustrations(
    data: any,
    incomeValuesChartKind: 'bar' | 'donut',
  ) {
    const illustrations = (data.benefitIllustrations as any[]).filter(
      (illustration) =>
        AccordionBackendUiAssertion.hybridIllustrationMatchesChartKind(
          illustration,
          incomeValuesChartKind,
        ),
    );
    const safeguardedFlags =
      AccordionBackendUiAssertion.extractSafeguardedBenefits({
        benefitIllustrations: illustrations,
      });
    return AccordionBackendUiAssertion.toAccordionBenefitFlags(
      illustrations,
      safeguardedFlags,
    );
  }

  private static toAccordionBenefitFlags(
    illustrations: any[],
    safeguardedFlags: ReturnType<
      typeof AccordionBackendUiAssertion.extractSafeguardedBenefits
    >,
  ) {
    return {
      warningCodes: new Set(
        BeDataExtraction.aggregateIllustrationWarnings({
          benefitIllustrations: illustrations,
        }),
      ),
      hasSafeguardedBenefit: Boolean(
        safeguardedFlags.eriSafeguardedBenefit ||
          safeguardedFlags.apSafeguardedBenefit,
      ),
      hasSurvivorBenefit: Boolean(
        safeguardedFlags.eriSurvivorBenefit ||
          safeguardedFlags.apSurvivorBenefit,
      ),
    };
  }

  private static buildExpectedAccordionsFromFlags(flags: {
    warningCodes: Set<string>;
    hasSafeguardedBenefit: boolean;
    hasSurvivorBenefit: boolean;
  }): string[] {
    const shouldShowMoreDetails = Array.from(flags.warningCodes).some(
      (warningCode) =>
        AccordionBackendUiAssertion.MORE_DETAILS_WARNING_CODES.has(warningCode),
    );

    const expectedAccordions = ['HowThevaluesAreCalaculatedAccordion'];
    if (flags.hasSafeguardedBenefit) {
      expectedAccordions.push('featureAccordion');
    }
    if (shouldShowMoreDetails || flags.hasSurvivorBenefit) {
      expectedAccordions.push('moreDetailsAccordion');
    }
    return expectedAccordions;
  }

  private static getUnionExpectedAccordions(data: any): string[] {
    if (
      (data?.pensionType === 'CB' ||
        data?.pensionType === 'CDC' ||
        data?.pensionType === 'HYB') &&
      (data?.benefitIllustrations?.length ?? 0) > 0
    ) {
      const accordions = [
        ...AccordionBackendUiAssertion.getExpectedAccordions(data, 'bar'),
        ...AccordionBackendUiAssertion.getExpectedAccordions(data, 'donut'),
      ];
      return accordions.filter(
        (accordion, index) => accordions.indexOf(accordion) === index,
      );
    }
    return AccordionBackendUiAssertion.getExpectedAccordions(data);
  }

  private static async assertAccordionVisibility(
    page: Page,
    calculationAccordionTestId: string,
    expectedAccordions: string[],
    useDonutSectionTestIds: boolean,
    cdcBarStackWithDonutLumpPresent: boolean,
    data?: any,
  ) {
    for (const accordion of AccordionBackendUiAssertion.ACCORDION_NAMES) {
      const locator = AccordionBackendUiAssertion.accordionTestLocator(
        page,
        accordion,
        calculationAccordionTestId,
        useDonutSectionTestIds,
        cdcBarStackWithDonutLumpPresent,
      );
      await AccordionBackendUiAssertion.assertSingleAccordionVisibility(
        page,
        accordion,
        expectedAccordions.includes(accordion),
        locator,
        cdcBarStackWithDonutLumpPresent,
        data,
      );
    }
  }

  private static async assertSingleAccordionVisibility(
    page: Page,
    accordion: (typeof AccordionBackendUiAssertion.ACCORDION_NAMES)[number],
    isExpected: boolean,
    locator: Locator,
    cdcBarStackWithDonutLumpPresent: boolean,
    data?: any,
  ) {
    const isDualStackFeatureOrMore =
      cdcBarStackWithDonutLumpPresent &&
      AccordionBackendUiAssertion.isFeatureOrMoreDetailsAccordion(accordion);

    if (isExpected) {
      await AccordionBackendUiAssertion.assertExpectedAccordionVisible(
        page,
        accordion,
        locator,
        isDualStackFeatureOrMore,
        data,
      );
      return;
    }

    if (isDualStackFeatureOrMore) {
      await AccordionBackendUiAssertion.assertUnexpectedDualStackAccordionHidden(
        page,
        accordion,
        data,
      );
      return;
    }

    await expect(locator).toBeHidden();
  }

  private static async assertExpectedAccordionVisible(
    page: Page,
    accordion: (typeof AccordionBackendUiAssertion.ACCORDION_NAMES)[number],
    locator: Locator,
    isDualStackFeatureOrMore: boolean,
    data?: any,
  ) {
    if (
      isDualStackFeatureOrMore &&
      data &&
      AccordionBackendUiAssertion.isFeatureOrMoreDetailsAccordion(accordion)
    ) {
      await AccordionBackendUiAssertion.assertDualStackFeatureOrMoreDetailsVisibility(
        page,
        data,
        accordion,
        true,
      );
      return;
    }
    await expect(locator).toBeVisible();
  }

  private static async assertUnexpectedDualStackAccordionHidden(
    page: Page,
    accordion: 'featureAccordion' | 'moreDetailsAccordion',
    data?: any,
  ) {
    if (data) {
      await AccordionBackendUiAssertion.assertDualStackFeatureOrMoreDetailsVisibility(
        page,
        data,
        accordion,
        false,
      );
      return;
    }
    await AccordionBackendUiAssertion.assertHiddenDualStackWithoutData(
      page,
      accordion,
    );
  }

  private static async assertHiddenDualStackWithoutData(
    page: Page,
    accordion: 'featureAccordion' | 'moreDetailsAccordion',
  ) {
    const testIds =
      accordion === 'featureAccordion'
        ? ['features', 'features-donut']
        : ['more-details', 'more-details-donut'];
    for (const testId of testIds) {
      await expect(page.getByTestId(testId)).toBeHidden();
    }
  }

  private static async assertDualStackFeatureOrMoreDetailsVisibility(
    page: Page,
    data: any,
    accordion: 'featureAccordion' | 'moreDetailsAccordion',
    shouldBeVisible: boolean,
  ) {
    const { barTestId, donutTestId } =
      AccordionBackendUiAssertion.getDualStackAccordionTestIds(accordion);

    await AccordionBackendUiAssertion.assertDualStackChartKindVisibility(
      page,
      data,
      accordion,
      'bar',
      barTestId,
      shouldBeVisible,
    );
    await AccordionBackendUiAssertion.assertDualStackChartKindVisibility(
      page,
      data,
      accordion,
      'donut',
      donutTestId,
      shouldBeVisible,
    );
  }

  private static async assertDualStackChartKindVisibility(
    page: Page,
    data: any,
    accordion: 'featureAccordion' | 'moreDetailsAccordion',
    chartKind: 'bar' | 'donut',
    testId: string,
    shouldBeVisible: boolean,
  ) {
    const chartExpected = AccordionBackendUiAssertion.getExpectedAccordions(
      data,
      chartKind,
    ).includes(accordion);
    const locator = page.getByTestId(testId);
    if (shouldBeVisible && chartExpected) {
      await expect(locator).toBeVisible();
      return;
    }
    await expect(locator).toBeHidden();
  }

  private static getDualStackAccordionTestIds(
    accordion: 'featureAccordion' | 'moreDetailsAccordion',
  ) {
    if (accordion === 'featureAccordion') {
      return { barTestId: 'features', donutTestId: 'features-donut' };
    }
    return { barTestId: 'more-details', donutTestId: 'more-details-donut' };
  }

  private static accordionTestLocator(
    page: Page,
    accordion: string,
    calculationAccordionTestId: string,
    useDonutSectionTestIds: boolean,
    cdcBarStackWithDonutLumpPresent: boolean,
  ): Locator {
    if (accordion === 'HowThevaluesAreCalaculatedAccordion') {
      return page.getByTestId(calculationAccordionTestId);
    }

    if (cdcBarStackWithDonutLumpPresent) {
      if (accordion === 'featureAccordion') {
        return page
          .getByTestId('features')
          .or(page.getByTestId('features-donut'));
      }
      return page
        .getByTestId('more-details')
        .or(page.getByTestId('more-details-donut'));
    }

    if (accordion === 'featureAccordion') {
      return page.getByTestId(
        useDonutSectionTestIds ? 'features-donut' : 'features',
      );
    }
    return page.getByTestId(
      useDonutSectionTestIds ? 'more-details-donut' : 'more-details',
    );
  }

  static async expectAccordionsMatchBackendWarnings(
    page: Page,
    arrangement: any,
    calculationAccordionTestId?: string,
    detailData?: { warnings?: string[] },
    incomeValuesChartKind?: 'bar' | 'donut',
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
    await this.expectAccordionsVisible(
      page,
      {
        illustrationWarnings,
        apSafeguardedBenefit,
        eriSafeguardedBenefit,
        apSurvivorBenefit,
        eriSurvivorBenefit,
        calculationAccordionTestId,
        benefitType: arrangement.benefitType,
        pensionType: arrangement.pensionType,
        benefitIllustrations: arrangement.benefitIllustrations,
      },
      incomeValuesChartKind,
    );
  }

  private static extractSafeguardedBenefits(arrangement: any) {
    const components =
      arrangement?.benefitIllustrations?.flatMap(
        (illustration: any) => illustration?.illustrationComponents ?? [],
      ) ?? [];

    return {
      eriSafeguardedBenefit: components.some(
        (component: any) =>
          component?.illustrationType === 'ERI' &&
          component?.safeguardedBenefit,
      ),
      apSafeguardedBenefit: components.some(
        (component: any) =>
          component?.illustrationType === 'AP' && component?.safeguardedBenefit,
      ),
      eriSurvivorBenefit: components.some(
        (component: any) =>
          component?.illustrationType === 'ERI' && component?.survivorBenefit,
      ),
      apSurvivorBenefit: components.some(
        (component: any) =>
          component?.illustrationType === 'AP' && component?.survivorBenefit,
      ),
    };
  }
}
