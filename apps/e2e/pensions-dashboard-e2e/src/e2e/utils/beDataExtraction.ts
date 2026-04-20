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
    [key: string]: unknown;
  } | null;
  [key: string]: unknown;
}

export interface Pension {
  externalAssetId?: string | null;
  benefitIllustrations?: Array<BenefitIllustration> | null;
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

export class BeDataExtraction {
  private static toPensionsArray(
    pensionsOrSingle: PensionOrSingleType,
  ): Pension[] {
    if (!pensionsOrSingle) return [];
    return Array.isArray(pensionsOrSingle)
      ? pensionsOrSingle
      : [pensionsOrSingle];
  }

  private static getIndexedItems<T>(
    items: Array<T | null | undefined>,
    targetIndex?: number,
  ): Array<{ item: T; index: number }> {
    if (typeof targetIndex === 'number') {
      if (targetIndex < 0 || targetIndex >= items.length) return [];
      const item = items[targetIndex];
      return item ? [{ item, index: targetIndex }] : [];
    }

    const indexed: Array<{ item: T; index: number }> = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item) indexed.push({ item, index: i });
    }
    return indexed;
  }

  private static toIllustrationMatch(
    pensionIndex: number,
    parentIllustrationIndex: number,
    componentIndex: number,
    parentIllustrationDate: string | null,
    matchedPayableDate: string | null,
    component: IllustrationComponent,
  ): IllustrationMatch {
    return {
      pensionIndex,
      parentIllustrationIndex,
      componentIndex,
      parentIllustrationDate,
      matchedPayableDate,
      component,
    };
  }

  private static shouldIncludeByDate(
    chosenDate: string | null,
    opts?: {
      payableDate?: string;
      payableYear?: number;
    },
  ): boolean {
    if (opts?.payableDate) return chosenDate === opts.payableDate;
    if (typeof opts?.payableYear === 'number') {
      return getYearFromIso(chosenDate ?? undefined) === opts.payableYear;
    }
    return true;
  }

  private static appendIllustrationMatches(
    results: IllustrationMatch[],
    pensionIndex: number,
    ill: BenefitIllustration,
    illIndex: number,
    opts:
      | {
          illustrationType?: string;
          payableDate?: string;
          payableYear?: number;
          preferPayableDate?: boolean;
        }
      | undefined,
    preferPayableDate: boolean,
  ): void {
    const comps = ill?.illustrationComponents ?? [];
    const selectedComponents = this.getIndexedItems(comps);
    for (const componentEntry of selectedComponents) {
      const comp = componentEntry.item;
      const compIndex = componentEntry.index;
      if (!this.matchesIllustrationType(comp, opts?.illustrationType)) continue;

      const illDate = ill?.illustrationDate ?? null;
      const chosenDate = this.getChosenIllustrationDate(
        comp,
        illDate,
        preferPayableDate,
      );
      if (!this.shouldIncludeByDate(chosenDate, opts)) continue;

      results.push(
        this.toIllustrationMatch(
          pensionIndex,
          illIndex,
          compIndex,
          illDate ?? null,
          chosenDate ?? null,
          comp,
        ),
      );
    }
  }

  private static matchesIllustrationType(
    component: IllustrationComponent,
    illustrationType?: string,
  ): boolean {
    if (!illustrationType) return true;
    return component.illustrationType === illustrationType;
  }

  private static getChosenIllustrationDate(
    component: IllustrationComponent,
    illustrationDate: string | null,
    preferPayableDate: boolean,
  ): string | null {
    const payableDate = component.payableDetails?.payableDate ?? null;
    return preferPayableDate
      ? payableDate ?? illustrationDate
      : illustrationDate ?? payableDate;
  }

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
    const pensions = this.toPensionsArray(pensionsOrSingle);
    if (!pensions.length) return [];
    const results: IllustrationMatch[] = [];
    const preferPayableDate = opts?.preferPayableDate !== false;
    const selectedPensions = this.getIndexedItems(pensions, opts?.pensionIndex);
    for (const pensionEntry of selectedPensions) {
      const pension = pensionEntry.item;
      const pensionIndex = pensionEntry.index;
      const illustrations = pension?.benefitIllustrations ?? [];
      const selectedIllustrations = this.getIndexedItems(
        illustrations,
        opts?.illustrationIndex,
      );

      for (const illustrationEntry of selectedIllustrations) {
        const ill = illustrationEntry.item;
        const illIndex = illustrationEntry.index;
        this.appendIllustrationMatches(
          results,
          pensionIndex,
          ill,
          illIndex,
          opts,
          preferPayableDate,
        );
      }
    }

    return results;
  }

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
    return p?.detailData?.incomeAndValues?.standardIncome ?? [];
  }

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

  private static toPoliciesArray(pensionPolicies: any): any[] {
    if (pensionPolicies == null) return [];
    return Array.isArray(pensionPolicies) ? pensionPolicies : [pensionPolicies];
  }

  private static flattenArrangements(policiesArray: any[]): any[] {
    return policiesArray.reduce((acc: any[], p: any) => {
      const arrangements = p?.pensionArrangements ?? [];
      return acc.concat(
        Array.isArray(arrangements) ? arrangements : [arrangements],
      );
    }, []);
  }

  private static pickPensionArrangement(allArrangements: any[]): any {
    const validPensionTypes = ['DB', 'DC', 'AVC', 'HYB', 'SP'];
    return (
      allArrangements.find((a: any) =>
        validPensionTypes.includes(a?.pensionType),
      ) ?? allArrangements[0]
    );
  }

  private static findIllustrationComponentByType(
    pensionArrangement: any,
    illustrationType: string,
  ): any {
    return pensionArrangement?.benefitIllustrations
      ?.reduce(
        (acc: any[], i: any) => acc.concat(i?.illustrationComponents ?? []),
        [],
      )
      ?.find((c: any) => c?.illustrationType === illustrationType);
  }

  static deriveIllustrationData(pensionPolicies: any) {
    const policiesArray = this.toPoliciesArray(pensionPolicies);

    console.info(
      'deriveIllustrationData input:',
      JSON.stringify(pensionPolicies, null, 2),
    );
    const allArrangements = this.flattenArrangements(policiesArray);
    const pensionArrangement = this.pickPensionArrangement(allArrangements);
    const eriComponent = this.findIllustrationComponentByType(
      pensionArrangement,
      'ERI',
    );
    const apComponent = this.findIllustrationComponentByType(
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
    this.assertArrangements(arrangements, schemeNameOnCard);
    const matchingArrangement = this.getMatchingArrangement(
      arrangements,
      schemeNameOnCard,
    );
    const eriComponent = MatchingPensionArrangement.findComponent(
      matchingArrangement,
      'ERI',
    );
    const apComponent = MatchingPensionArrangement.findComponent(
      matchingArrangement,
      'AP',
    );
    return this.buildArrangementDataResponse(
      matchingArrangement,
      eriComponent,
      apComponent,
    );
  }

  private static async resolveArrangements(
    page: any,
    request: any,
    arrangementsOverride?: any[],
  ): Promise<any[]> {
    if (arrangementsOverride) return arrangementsOverride ?? [];
    const response = await RequestHelper.getPensionCategory(
      page,
      request,
      'CONFIRMED',
    );
    const responseJson = await response.json();
    return responseJson?.arrangements ?? [];
  }

  private static assertArrangements(
    arrangements: any[],
    schemeNameOnCard: string,
  ): void {
    if (!arrangements || arrangements.length === 0) {
      throw new Error(
        `Invalid response for scheme: ${schemeNameOnCard}. Response was null or missing arrangements.`,
      );
    }
  }

  private static getMatchingArrangement(
    arrangements: any[],
    schemeNameOnCard: string,
  ): any {
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

  private static toLocaleDate(input: any): string {
    return new Date(input).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  private static toLocaleDateIfValid(input: any): string | undefined {
    const date = new Date(input);
    if (Number.isNaN(date.getTime())) return undefined;
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  private static toTwoDpMonthlyAmount(value: unknown): string {
    return `£${Number(value).toLocaleString('en-GB', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}a month`;
  }

  private static getPensionStatusMap(): Record<string, string> {
    return {
      A: 'Active',
      I: 'Inactive',
      IPPF: 'Inactive',
      IWU: 'Inactive',
    };
  }

  private static getPensionTypeMap(): Record<string, string> {
    return {
      DC: 'defined contribution pension',
      DB: 'defined benefit pension',
      SP: 'state pension',
      AVC: 'additional voluntary contribution pension',
      HYB: 'hybrid pension',
    };
  }

  private static buildArrangementIdentityData(
    matchingArrangement: any,
    employmentMembership: any,
  ): {
    pensionTypeData: string;
    pensionStatusData: string;
    expectedProviderName: string;
    expectedReferenceNumber: string;
    expectedEmployerName: string;
    employerStatus: string | null;
    type: any;
  } {
    const pensionStatusMap = this.getPensionStatusMap();
    const pensionTypeMap = this.getPensionTypeMap();
    const pensionProviderData =
      matchingArrangement.pensionAdministrator?.name?.toLowerCase() ?? '';
    const employerNameDataRaw =
      employmentMembership?.employerName?.toLowerCase() ?? '--';

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
        employmentMembership?.employerStatus?.toUpperCase() ?? null,
      type: matchingArrangement.pensionType,
    };
  }

  private static buildArrangementBenefitData(
    matchingArrangement: any,
    eriComponent: any,
    apComponent: any,
  ): {
    illustrationDateData: any;
    unavailableReason: string;
    payableReason: string;
    eriMonthlyAmountData: number | null;
    apMonthlyAmountData: number | null;
    eriAnnualAmountData: number | null;
    apAnnualAmountData: number | null;
    dcPotAmountData: any;
    apPayableDetails: any;
    eriPayableDetails: any;
    eriSafeguardedBenefit: boolean;
    eriSurvivorBenefit: boolean;
    apSafeguardedBenefit: boolean;
    apSurvivorBenefit: boolean;
  } {
    const amountData = this.getArrangementAmountData(eriComponent, apComponent);
    const benefitFlags = this.getArrangementBenefitFlags(
      eriComponent,
      apComponent,
    );

    return {
      illustrationDateData:
        matchingArrangement.benefitIllustrations?.[0]?.illustrationDate,
      unavailableReason: eriComponent?.unavailableReason ?? '',
      payableReason: eriComponent?.payableDetails?.reason ?? '',
      ...amountData,
      apPayableDetails: apComponent?.payableDetails ?? null,
      eriPayableDetails: eriComponent?.payableDetails ?? null,
      ...benefitFlags,
    };
  }

  private static getArrangementAmountData(
    eriComponent: any,
    apComponent: any,
  ): {
    eriMonthlyAmountData: number | null;
    apMonthlyAmountData: number | null;
    eriAnnualAmountData: number | null;
    apAnnualAmountData: number | null;
    dcPotAmountData: any;
  } {
    return {
      eriMonthlyAmountData: eriComponent?.payableDetails?.monthlyAmount ?? null,
      apMonthlyAmountData: apComponent?.payableDetails?.monthlyAmount ?? null,
      eriAnnualAmountData: eriComponent?.payableDetails?.annualAmount ?? null,
      apAnnualAmountData: apComponent?.payableDetails?.annualAmount ?? null,
      dcPotAmountData: apComponent?.dcPot ?? null,
    };
  }

  private static getArrangementBenefitFlags(
    eriComponent: any,
    apComponent: any,
  ): {
    eriSafeguardedBenefit: boolean;
    eriSurvivorBenefit: boolean;
    apSafeguardedBenefit: boolean;
    apSurvivorBenefit: boolean;
  } {
    return {
      eriSafeguardedBenefit: eriComponent?.safeguardedBenefit ?? false,
      eriSurvivorBenefit: eriComponent?.survivorBenefit ?? false,
      apSafeguardedBenefit: apComponent?.safeguardedBenefit ?? false,
      apSurvivorBenefit: apComponent?.survivorBenefit ?? false,
    };
  }

  private static buildArrangementDateData(
    matchingArrangement: any,
    employmentMembership: any,
    eriComponent: any,
    apComponent: any,
  ): {
    formattedRetirementDate: string | undefined;
    expectedStartDate: string;
    formattedApRetirementDate: string;
    formattedIllustrationDate: string;
    illustrationYear: string;
    retirementYear: string;
    estimatedIncomeData: string;
    normalisedEriMonthlyAmountData: string;
    hasIncome: boolean;
  } {
    const illustrationDateData =
      matchingArrangement.benefitIllustrations?.[0]?.illustrationDate;
    const unavailableReason = eriComponent?.unavailableReason ?? '';
    const payableReason = eriComponent?.payableDetails?.reason ?? '';
    const eriMonthlyAmountData =
      eriComponent?.payableDetails?.monthlyAmount ?? null;
    const apMonthlyAmountData =
      apComponent?.payableDetails?.monthlyAmount ?? null;
    const expectedRetirementDateData =
      eriComponent?.payableDetails?.payableDate ||
      matchingArrangement.retirementDate;
    const formattedRetirementDate = this.toLocaleDateIfValid(
      expectedRetirementDateData,
    );
    const apExpectedRetirementDateData =
      apComponent?.payableDetails?.payableDate ||
      matchingArrangement.retirementDate;
    const formattedDateValues = this.getFormattedArrangementDates(
      employmentMembership,
      illustrationDateData,
      formattedRetirementDate,
      apExpectedRetirementDateData,
    );

    return {
      formattedRetirementDate,
      ...formattedDateValues,
      estimatedIncomeData: this.toTwoDpMonthlyAmount(
        unavailableReason === 'DB' ? apMonthlyAmountData : eriMonthlyAmountData,
      ),
      normalisedEriMonthlyAmountData: Number(
        eriMonthlyAmountData,
      ).toLocaleString('en-GB', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 1,
      }),
      hasIncome:
        (unavailableReason === 'DB' ||
          unavailableReason === '' ||
          unavailableReason === null) &&
        payableReason !== 'SML',
    };
  }

  private static getFormattedArrangementDates(
    employmentMembership: any,
    illustrationDateData: any,
    formattedRetirementDate: string | undefined,
    apExpectedRetirementDateData: any,
  ): {
    expectedStartDate: string;
    formattedApRetirementDate: string;
    formattedIllustrationDate: string;
    illustrationYear: string;
    retirementYear: string;
  } {
    const employmentStartDateData =
      employmentMembership?.membershipStartDate ?? null;

    return {
      expectedStartDate: employmentStartDateData
        ? this.toLocaleDate(employmentStartDateData)
        : '--',
      formattedApRetirementDate: this.toLocaleDate(
        apExpectedRetirementDateData,
      ),
      formattedIllustrationDate: illustrationDateData
        ? this.toLocaleDate(illustrationDateData)
        : '--',
      illustrationYear: illustrationDateData
        ? new Date(illustrationDateData).getFullYear().toString()
        : '',
      retirementYear: formattedRetirementDate
        ? new Date(formattedRetirementDate).getFullYear().toString()
        : '',
    };
  }

  private static buildArrangementDataResponse(
    matchingArrangement: any,
    eriComponent: any,
    apComponent: any,
  ): any {
    const employmentMembership =
      matchingArrangement.employmentMembershipPeriods?.[0] ?? null;
    const identityData = this.buildArrangementIdentityData(
      matchingArrangement,
      employmentMembership,
    );
    const benefitData = this.buildArrangementBenefitData(
      matchingArrangement,
      eriComponent,
      apComponent,
    );
    const dateData = this.buildArrangementDateData(
      matchingArrangement,
      employmentMembership,
      eriComponent,
      apComponent,
    );

    return {
      matchingArrangement,
      eriComponent,
      apComponent,
      ...benefitData,
      ...identityData,
      ...dateData,
    };
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
