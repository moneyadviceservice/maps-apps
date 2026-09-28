import { ENV } from '@env';
import { APIRequestContext, Page } from '@maps/playwright';

import { FormattingUtils } from './formatting';
import { MatchingPensionArrangement } from './pensionCardBackendUIAssertion';
import { RequestHelper } from './request';

export interface PayableDetails {
  amountType?: string | null;
  annualAmount?: number | null;
  payableDate?: string | null;
  monthlyAmount?: number | null;
  [key: string]: unknown;
}

export interface IllustrationComponent {
  illustrationType?: string | null;
  payableDetails?: PayableDetails | null;
  illustrationWarnings?: string[] | null;
  [key: string]: unknown;
}

export interface BenefitIllustration {
  illustrationDate?: string | null;
  illustrationComponents?: Array<IllustrationComponent> | null;
  illustrationCategory?: string | null;
  [key: string]: unknown;
}

export interface DetailData {
  retirementDate?: string | null;
  standardPayment?: {
    monthlyAmount?: number | null;
    payableDate?: string | null;
    benefitType?: string | null;
    hasAnyValues?: boolean | null;
    [key: string]: unknown;
  } | null;
  warnings?: string[] | null;
  incomeAndValues?: {
    standardIncome?: Array<{
      year?: number | null;
      monthlyAmount?: number | null;
      annualAmount?: number | null;
      lumpSumAmount?: number | null;
      [key: string]: unknown;
    }> | null;
    legacyIncome?: Array<{
      year?: number | null;
      monthlyAmount?: number | null;
      annualAmount?: number | null;
      lumpSumAmount?: number | null;
      difference?: number | null;
      [key: string]: unknown;
    }> | null;
    alternativeIncome?: Array<{
      year?: number | null;
      monthlyAmount?: number | null;
      annualAmount?: number | null;
      lumpSumAmount?: number | null;
      difference?: number | null;
      [key: string]: unknown;
    }> | null;
    [key: string]: unknown;
  } | null;
  [key: string]: unknown;
}

export interface Pension {
  externalAssetId?: string | null;
  benefitIllustrations?: Array<BenefitIllustration> | null;
  hasMultipleTranches?: boolean | null;
  hasMultipleIncomeOptions?: boolean | null;
  detailData?: DetailData | null;
  [key: string]: unknown;
}

function getYearFromIso(iso?: string | null): number | undefined {
  if (!iso) return undefined;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.getUTCFullYear();
}

export interface IllustrationMatch {
  pensionIndex: number;
  parentIllustrationIndex: number;
  componentIndex: number;
  parentIllustrationDate?: string | null;
  matchedPayableDate?: string | null;
  component: IllustrationComponent;
}

type PensionOrSingleType = Pension[] | Pension | null | undefined;

export interface IllustrationsData {
  hasMultipleTranches: boolean;
  hasMultipleIncomeOptions: boolean;
  benefitIllustrations: BenefitIllustration[];
  standardBenefitIllustrations: BenefitIllustration[];
  legacyBenefitIllustrations: BenefitIllustration[];
  alternativeBenefitIllustrations: BenefitIllustration[];
}

export class BeDataExtraction {
  static getIllustrationComponentsWithMetadata(
    pensionsOrSingle: PensionOrSingleType,
    opts?: {
      pensionIndex?: number;
      illustrationIndex?: number;
      illustrationType?: string;
      payableDate?: string;
      payableYear?: number;
      preferPayableDate?: boolean;
    },
  ): IllustrationMatch[] {
    if (!pensionsOrSingle) return [];

    const pensions: Pension[] = Array.isArray(pensionsOrSingle)
      ? pensionsOrSingle
      : [pensionsOrSingle];

    const results: IllustrationMatch[] = [];
    const preferPayableDate = opts?.preferPayableDate !== false;

    const iteratePensions = (
      callback: (p: Pension, pIndex: number) => void,
    ) => {
      if (typeof opts?.pensionIndex === 'number') {
        const pi = opts.pensionIndex;
        if (pi >= 0 && pi < pensions.length) callback(pensions[pi], pi);
        return;
      }
      for (let i = 0; i < pensions.length; i++) {
        const p = pensions[i];
        if (p) callback(p, i);
      }
    };

    iteratePensions((pension, pensionIndex) => {
      const illustrations = pension?.benefitIllustrations ?? [];

      const iterateIllustrations = (
        cb: (ill: BenefitIllustration, illIndex: number) => void,
      ) => {
        if (typeof opts?.illustrationIndex === 'number') {
          const ii = opts.illustrationIndex;
          if (ii >= 0 && ii < illustrations.length) cb(illustrations[ii], ii);
          return;
        }
        for (let i = 0; i < illustrations.length; i++) {
          const ill = illustrations[i];
          if (ill) cb(ill, i);
        }
      };

      iterateIllustrations((ill, illIndex) => {
        this.collectMatchesForIllustration({
          results,
          ill,
          illIndex,
          pensionIndex,
          opts,
          preferPayableDate,
        });
      });
    });

    return results;
  }

  private static collectMatchesForIllustration({
    results,
    ill,
    illIndex,
    pensionIndex,
    opts,
    preferPayableDate,
  }: {
    results: IllustrationMatch[];
    ill: BenefitIllustration;
    illIndex: number;
    pensionIndex: number;
    opts?: {
      illustrationType?: string;
      payableDate?: string;
      payableYear?: number;
    };
    preferPayableDate: boolean;
  }) {
    const comps = ill?.illustrationComponents ?? [];
    for (let compIndex = 0; compIndex < comps.length; compIndex++) {
      const comp = comps[compIndex];
      if (!comp) continue;
      if (
        opts?.illustrationType &&
        comp.illustrationType !== opts.illustrationType
      ) {
        continue;
      }
      const chosenDate = this.resolveChosenDate(ill, comp, preferPayableDate);
      const match: IllustrationMatch = {
        pensionIndex,
        parentIllustrationIndex: illIndex,
        componentIndex: compIndex,
        parentIllustrationDate: ill?.illustrationDate ?? null,
        matchedPayableDate: chosenDate ?? null,
        component: comp,
      };
      this.pushMatchByDateFilter(results, match, chosenDate, opts);
    }
  }

  private static resolveChosenDate(
    ill: BenefitIllustration,
    comp: IllustrationComponent,
    preferPayableDate: boolean,
  ) {
    const compPd = comp.payableDetails?.payableDate ?? null;
    const illDate = ill?.illustrationDate ?? null;
    return preferPayableDate ? compPd ?? illDate : illDate ?? compPd;
  }

  private static pushMatchByDateFilter(
    results: IllustrationMatch[],
    match: IllustrationMatch,
    chosenDate: string | null,
    opts?: { payableDate?: string; payableYear?: number },
  ) {
    if (opts?.payableDate) {
      if (chosenDate === opts.payableDate) results.push(match);
      return;
    }
    if (typeof opts?.payableYear === 'number') {
      const year = getYearFromIso(chosenDate ?? undefined);
      if (year === opts.payableYear) results.push(match);
      return;
    }
    results.push(match);
  }

  /**
   * Get warnings for a pension (by pensionIndex). If pensionIndex omitted, returns warnings for the first pension found.
   */
  static getWarnings(
    pensionsOrSingle: PensionOrSingleType,
    pensionIndex?: number,
  ): string[] {
    if (!pensionsOrSingle) return [];
    const pensions: Pension[] = Array.isArray(pensionsOrSingle)
      ? pensionsOrSingle
      : [pensionsOrSingle];
    const p =
      typeof pensionIndex === 'number' ? pensions[pensionIndex] : pensions[0];
    const warnings: string[] = [];
    for (const illustration of p?.benefitIllustrations ?? []) {
      for (const component of illustration.illustrationComponents ?? []) {
        if (component.illustrationWarnings) {
          warnings.push(...component.illustrationWarnings);
        }
      }
    }
    return warnings;
  }

  /**
   * Get standardIncome array for a pension (by pensionIndex). Safe defaults.
   */
  static getStandardIncome(
    pensionsOrSingle: PensionOrSingleType,
    pensionIndex?: number,
  ): Array<{
    year?: number | null;
    monthlyAmount?: number | null;
    annualAmount?: number | null;
    lumpSumAmount?: number | null;
  }> {
    if (!pensionsOrSingle) return [];
    const pensions: Pension[] = Array.isArray(pensionsOrSingle)
      ? pensionsOrSingle
      : [pensionsOrSingle];
    const p =
      typeof pensionIndex === 'number' ? pensions[pensionIndex] : pensions[0];
    const incomeAndValues = p?.detailData?.incomeAndValues;
    const standardIncome = incomeAndValues?.standardIncome ?? [];
    const hasMultipleIncomeOptions = p?.hasMultipleIncomeOptions === true;

    if (!hasMultipleIncomeOptions) {
      return standardIncome;
    }

    // McCloud payloads provide legacy/alternative arrays instead of standardIncome.
    // Keep this helper resilient by returning a flattened, year-sorted view.
    const legacyIncome = incomeAndValues?.legacyIncome ?? [];
    const alternativeIncome = incomeAndValues?.alternativeIncome ?? [];
    return [...legacyIncome, ...alternativeIncome].toSorted(
      (a, b) => Number(a?.year ?? 0) - Number(b?.year ?? 0),
    );
  }

  /**
   * Get income illustration data for single/multiple/McCloud pensions.
   * Returns safe defaults for all fields.
   */
  static getIllustrationsData(
    pensionsOrSingle: PensionOrSingleType,
    pensionIndex?: number,
  ): IllustrationsData {
    if (!pensionsOrSingle) {
      return {
        hasMultipleTranches: false,
        hasMultipleIncomeOptions: false,
        benefitIllustrations: [],
        standardBenefitIllustrations: [],
        legacyBenefitIllustrations: [],
        alternativeBenefitIllustrations: [],
      };
    }

    const pensions: Pension[] = Array.isArray(pensionsOrSingle)
      ? pensionsOrSingle
      : [pensionsOrSingle];
    const p =
      typeof pensionIndex === 'number' ? pensions[pensionIndex] : pensions[0];
    const benefitIllustrations = p?.benefitIllustrations ?? [];
    const hasMultipleIncomeOptions = p?.hasMultipleIncomeOptions === true;
    const hasMultipleTranches = p?.hasMultipleTranches === true;
    const payableDetailsTypeOf = (illustration: BenefitIllustration) =>
      String((illustration as any)?.payableDetailsType ?? '').toUpperCase();
    const isLegacyIllustration = (illustration: BenefitIllustration) =>
      payableDetailsTypeOf(illustration).includes('LEGACY');
    const isAlternativeIllustration = (illustration: BenefitIllustration) =>
      payableDetailsTypeOf(illustration).includes('NEW');
    const isStandardIllustration = (illustration: BenefitIllustration) => {
      const type = payableDetailsTypeOf(illustration);
      return !type.includes('LEGACY') && !type.includes('NEW');
    };

    // Keep non McCloud illustrations (e.g. RECURRING, LUMPSUM, NONE) available
    // even when hasMultipleIncomeOptions=true, because hybrid payloads can include both.
    const legacyBenefitIllustrations = hasMultipleIncomeOptions
      ? benefitIllustrations.filter(isLegacyIllustration)
      : [];
    const alternativeBenefitIllustrations = hasMultipleIncomeOptions
      ? benefitIllustrations.filter(isAlternativeIllustration)
      : [];
    const standardBenefitIllustrations = hasMultipleIncomeOptions
      ? benefitIllustrations.filter(isStandardIllustration)
      : benefitIllustrations;

    return {
      hasMultipleTranches,
      hasMultipleIncomeOptions,
      benefitIllustrations,
      standardBenefitIllustrations,
      legacyBenefitIllustrations,
      alternativeBenefitIllustrations,
    };
  }

  /**
   * Get standardPayment object for a pension (by pensionIndex).
   */
  static getStandardPayment(
    pensionsOrSingle: PensionOrSingleType,
    pensionIndex?: number,
  ): DetailData['standardPayment'] | null {
    if (!pensionsOrSingle) return null;
    const pensions: Pension[] = Array.isArray(pensionsOrSingle)
      ? pensionsOrSingle
      : [pensionsOrSingle];
    const p =
      typeof pensionIndex === 'number' ? pensions[pensionIndex] : pensions[0];
    return p?.detailData?.standardPayment ?? null;
  }

  static deriveIllustrationData(pensionPolicies: any) {
    const policiesArray = this.asArray(pensionPolicies);
    console.info(
      'deriveIllustrationData input:',
      JSON.stringify(pensionPolicies, null, 2),
    );
    const pensionArrangement = this.pickPensionArrangement(policiesArray);
    const eriComponent = this.findIllustrationComponent(
      pensionArrangement,
      'ERI',
    );
    const apComponent = this.findIllustrationComponent(
      pensionArrangement,
      'AP',
    );

    const eriAnnualAmountData =
      eriComponent?.payableDetails?.annualAmount ?? null;
    const annualApPensionAmountData =
      apComponent?.payableDetails?.annualAmount ?? null;
    const expectedRetirementDateData =
      eriComponent?.payableDetails?.payableDate ||
      pensionArrangement?.retirementDate ||
      null;
    const illustrationDate =
      pensionArrangement?.benefitIllustrations?.[0]?.illustrationDate ?? null;

    return {
      eriAnnualAmountData,
      annualApPensionAmountData,
      expectedRetirementDateData,
      payableDate: {
        eri: eriComponent?.payableDetails?.payableDate ?? null,
        ap: apComponent?.payableDetails?.payableDate ?? null,
      },
      illustrationDate,
    };
  }

  private static asArray(input: any): any[] {
    if (input == null) return [];
    return Array.isArray(input) ? input : [input];
  }

  private static pickPensionArrangement(policiesArray: any[]) {
    const allArrangements = policiesArray.reduce((acc: any[], p: any) => {
      const arrangements = p?.pensionArrangements ?? [];
      return acc.concat(
        Array.isArray(arrangements) ? arrangements : [arrangements],
      );
    }, []);
    const validPensionTypes = ['AVC', 'CDC', 'DB', 'DC', 'HYB', 'SP'];
    return (
      allArrangements.find((a: any) =>
        validPensionTypes.includes(a?.pensionType),
      ) ?? allArrangements[0]
    );
  }

  private static findIllustrationComponent(
    arrangement: any,
    illustrationType: string,
  ) {
    const components =
      arrangement?.benefitIllustrations?.reduce(
        (acc: any[], i: any) => acc.concat(i?.illustrationComponents ?? []),
        [],
      ) ?? [];
    return components.find(
      (c: any) => c?.illustrationType === illustrationType,
    );
  }

  static async fetchArrangementData(
    page: any,
    request: any,
    schemeNameOnCard: string,
    arrangementsOverride?: any[],
  ): Promise<any> {
    const arrangements = await this.resolveArrangements(
      page,
      request,
      arrangementsOverride,
    );
    if (!arrangements || arrangements.length === 0) {
      throw new Error(
        `Invalid response for scheme: ${schemeNameOnCard}. Response was null or missing arrangements.`,
      );
    }
    const matchingArrangement = this.resolveMatchingArrangement(
      arrangements,
      schemeNameOnCard,
    );
    return this.buildArrangementDataFromMatch(matchingArrangement);
  }

  private static async resolveArrangements(
    page: any,
    request: any,
    arrangementsOverride?: any[],
  ) {
    if (arrangementsOverride) return arrangementsOverride;
    const response = await RequestHelper.getPensionCategory(
      page,
      request,
      'CONFIRMED',
    );
    const responseJson = await response.json();
    return responseJson?.arrangements ?? [];
  }

  private static resolveMatchingArrangement(
    arrangements: any[],
    schemeNameOnCard: string,
  ) {
    const pensionPolicies = [{ pensionArrangements: arrangements }];
    const matchingArrangement =
      MatchingPensionArrangement.findMatchingArrangement(
        pensionPolicies,
        schemeNameOnCard,
      );
    if (!matchingArrangement)
      throw new Error(`No match for scheme: ${schemeNameOnCard}`);
    return matchingArrangement;
  }

  private static buildArrangementDataFromMatch(matchingArrangement: any) {
    const eriComponent = MatchingPensionArrangement.findComponent(
      matchingArrangement,
      'ERI',
    );
    const apComponent = MatchingPensionArrangement.findComponent(
      matchingArrangement,
      'AP',
    );
    const illustrationDateData =
      matchingArrangement.benefitIllustrations?.[0]?.illustrationDate;
    const arrangementTextData =
      this.getArrangementTextData(matchingArrangement);
    const arrangementComponentData = this.getArrangementComponentData(
      matchingArrangement,
      eriComponent,
      apComponent,
    );
    const arrangementDateData = this.getArrangementDateData(
      matchingArrangement,
      eriComponent,
      apComponent,
      illustrationDateData,
    );
    const isCashBalanceLumpSum = this.isCashBalanceLumpSum(matchingArrangement);
    const cardEstimatedAmountData = isCashBalanceLumpSum
      ? matchingArrangement.cardData?.lumpSumAmount ?? null
      : null;
    const estimatedIncomeData = this.getEstimatedIncomeData(
      arrangementComponentData.unavailableReason,
      arrangementComponentData.apMonthlyAmountData,
      arrangementComponentData.eriMonthlyAmountData,
      isCashBalanceLumpSum,
      cardEstimatedAmountData,
    );
    const hasIncome = this.resolveArrangementHasIncome(
      matchingArrangement,
      arrangementComponentData.unavailableReason,
      arrangementComponentData.apUnavailableReason,
      arrangementComponentData.payableReason,
    );
    const type = matchingArrangement.pensionType;

    return {
      matchingArrangement,
      eriComponent,
      apComponent,
      illustrationDateData,
      ...arrangementTextData,
      ...arrangementComponentData,
      ...arrangementDateData,
      estimatedIncomeData,
      isCashBalanceLumpSum,
      cardEstimatedAmountData,
      hasIncome,
      type,
    };
  }

  private static getArrangementTextData(matchingArrangement: any) {
    const pensionStatusMap: Record<string, string> = {
      A: 'Active',
      I: 'Inactive',
      IPPF: 'Inactive',
      IWU: 'Inactive',
    };
    const pensionTypeMap: Record<string, string> = {
      AVC: 'additional voluntary contribution pension',
      CB: 'cash balance',
      CDC: 'collective defined contribution',
      DB: 'defined benefit pension',
      DC: 'defined contribution pension',
      HYB: 'hybrid pension',
      SP: 'state pension',
      VAR: 'combination',
    };
    const pensionProviderData =
      matchingArrangement.pensionAdministrator?.name?.toLowerCase() ?? '';
    const employerNameDataRaw =
      matchingArrangement.employmentMembershipPeriods?.[0]?.employerName?.toLowerCase() ??
      '--';
    return {
      pensionTypeData:
        pensionTypeMap[matchingArrangement.pensionType] ??
        'unknown pension type',
      pensionStatusData:
        pensionStatusMap[matchingArrangement.pensionStatus] ?? '',
      expectedProviderName: FormattingUtils.normalizeText(pensionProviderData),
      expectedReferenceNumber:
        matchingArrangement.contactReference?.toLowerCase() ?? '',
      expectedEmployerName: FormattingUtils.normalizeText(employerNameDataRaw),
      employerStatus:
        matchingArrangement.employmentMembershipPeriods?.[0]?.employerStatus?.toUpperCase() ??
        null,
    };
  }

  private static getArrangementComponentData(
    _matchingArrangement: any,
    eriComponent: any,
    apComponent: any,
  ) {
    const payableData = this.getPayableAmountData(eriComponent, apComponent);
    return {
      ...this.getBenefitFlags(eriComponent, apComponent),
      ...payableData,
      normalisedEriMonthlyAmountData: Number(
        payableData.eriMonthlyAmountData,
      ).toLocaleString('en-GB', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 1,
      }),
    };
  }

  private static getBenefitFlags(eriComponent: any, apComponent: any) {
    return {
      unavailableReason: eriComponent?.unavailableReason ?? '',
      apUnavailableReason: apComponent?.unavailableReason ?? '',
      payableReason: eriComponent?.payableDetails?.reason ?? '',
      eriSafeguardedBenefit: eriComponent?.safeguardedBenefit ?? false,
      eriSurvivorBenefit: eriComponent?.survivorBenefit ?? false,
      apSafeguardedBenefit: apComponent?.safeguardedBenefit ?? false,
      apSurvivorBenefit: apComponent?.survivorBenefit ?? false,
    };
  }

  private static getPayableAmountData(eriComponent: any, apComponent: any) {
    return {
      apPayableDetails: apComponent?.payableDetails ?? null,
      eriPayableDetails: eriComponent?.payableDetails ?? null,
      eriMonthlyAmountData: eriComponent?.payableDetails?.monthlyAmount ?? null,
      apMonthlyAmountData: apComponent?.payableDetails?.monthlyAmount ?? null,
      eriAnnualAmountData: eriComponent?.payableDetails?.annualAmount ?? null,
      apAnnualAmountData: apComponent?.payableDetails?.annualAmount ?? null,
      dcPotAmountData: apComponent?.dcPot ?? null,
    };
  }

  private static safeDate(input: any) {
    const date = new Date(input);
    return Number.isNaN(date.getTime()) ? undefined : date;
  }

  private static formatDate(input: any, fallback = '--') {
    const date = this.safeDate(input);
    if (!date) return fallback;
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  private static getArrangementDateData(
    matchingArrangement: any,
    eriComponent: any,
    apComponent: any,
    illustrationDateData: any,
  ) {
    const expectedRetirementDateData =
      eriComponent?.payableDetails?.payableDate ||
      matchingArrangement.retirementDate;
    const formattedRetirementDate = this.formatDate(
      expectedRetirementDateData,
      '',
    );
    const employmentStartDateData =
      matchingArrangement.employmentMembershipPeriods?.[0]
        ?.membershipStartDate ?? null;
    const apExpectedRetirementDateData =
      apComponent?.payableDetails?.payableDate ||
      matchingArrangement.retirementDate;
    return {
      formattedRetirementDate,
      expectedStartDate: employmentStartDateData
        ? this.formatDate(employmentStartDateData)
        : '--',
      formattedApRetirementDate: this.formatDate(apExpectedRetirementDateData),
      formattedIllustrationDate: illustrationDateData
        ? this.formatDate(illustrationDateData)
        : '--',
      illustrationYear: illustrationDateData
        ? new Date(illustrationDateData).getFullYear().toString()
        : '',
      retirementYear: formattedRetirementDate
        ? new Date(formattedRetirementDate).getFullYear().toString()
        : '',
    };
  }

  private static isCashBalanceLumpSum(matchingArrangement: any): boolean {
    const cardData = matchingArrangement?.cardData;
    return (
      matchingArrangement?.pensionType === 'CB' &&
      cardData?.benefitType === 'CBL' &&
      typeof cardData?.lumpSumAmount === 'number' &&
      cardData.lumpSumAmount > 0
    );
  }

  private static getEstimatedIncomeData(
    unavailableReason: string | null,
    apMonthlyAmountData: unknown,
    eriMonthlyAmountData: unknown,
    isCashBalanceLumpSum = false,
    cardEstimatedAmountData: number | null = null,
  ) {
    if (isCashBalanceLumpSum) {
      if (cardEstimatedAmountData === null) {
        return '--';
      }
      return `£${FormattingUtils.formatDisplayAmount(cardEstimatedAmountData)}`;
    }

    const amount =
      unavailableReason === 'DB' ? apMonthlyAmountData : eriMonthlyAmountData;
    return `£${Number(amount).toLocaleString('en-GB', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}a month`;
  }

  private static resolveArrangementHasIncome(
    matchingArrangement: any,
    eriUnavailableReason: string | null,
    apUnavailableReason: string | null,
    payableReason: string | null,
  ): boolean {
    if (
      this.isConfirmedCategoryArrangement(matchingArrangement) &&
      this.confirmedPensionMonthlyEstimateUnavailable(
        eriUnavailableReason,
        apUnavailableReason,
      )
    ) {
      return false;
    }
    if (typeof matchingArrangement?.hasIncome === 'boolean') {
      return matchingArrangement.hasIncome;
    }
    return this.getHasIncome(eriUnavailableReason, payableReason);
  }

  /** Green “confirmed” pensions from the category endpoint (or legacy fixtures with no category set). */
  private static isConfirmedCategoryArrangement(arrangement: any): boolean {
    const category = arrangement?.pensionCategory ?? arrangement?.category;
    return category === undefined || category === 'CONFIRMED';
  }

  /** ERI has no monthly row except `DB` (then AP applies); AP unavailable blocks that fallback. */
  private static confirmedPensionMonthlyEstimateUnavailable(
    eriUnavailableReason: string | null | undefined,
    apUnavailableReason: string | null | undefined,
  ): boolean {
    const eri = (eriUnavailableReason ?? '').trim();
    const ap = (apUnavailableReason ?? '').trim();
    if (eri !== '' && eri !== 'DB') return true;
    return eri === 'DB' && ap !== '';
  }

  private static getHasIncome(
    unavailableReason: string | null,
    payableReason: string | null,
  ) {
    return (
      (unavailableReason === 'DB' ||
        unavailableReason === '' ||
        unavailableReason === null) &&
      payableReason !== 'SML'
    );
  }

  static aggregateIllustrationWarnings(arrangement: any): string[] {
    const warnings: string[] = [];
    for (const illustration of arrangement.benefitIllustrations ?? []) {
      for (const component of illustration.illustrationComponents ?? []) {
        if (component.illustrationWarnings) {
          warnings.push(...component.illustrationWarnings);
        }
      }
    }
    return warnings;
  }

  static async extractPensionSchemeDetailData(
    page: Page,
    request: APIRequestContext,
    response: any,
  ): Promise<any> {
    const externalAssetId = response.externalAssetId;

    // Extract the same session ID that was used for getPensionCategory
    const testUserSessionId = await RequestHelper['getSessionIdFromCookie'](
      page,
    );

    const pensionDataUrl = `${ENV.PDP_API_URL}/pension-detail/${externalAssetId}`;
    const pensionSchemeDetailResponse = await request.get(pensionDataUrl, {
      headers: {
        userSessionId: testUserSessionId,
        mhpdCorrelationId: testUserSessionId,
      },
    });

    if (pensionSchemeDetailResponse.status() !== 200) {
      throw new Error(
        `GET request failed for get pension detail for a pension scheme with external asset ID ${externalAssetId} with status ${pensionSchemeDetailResponse.status()}`,
      );
    }

    return {
      externalAssetId,
      pensionSchemeDetailResponse,
    };
  }
}
