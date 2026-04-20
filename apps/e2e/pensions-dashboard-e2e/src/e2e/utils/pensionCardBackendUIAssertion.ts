import { expect, Page } from '@maps/playwright';

import pensionBreakdownPage from '../pages/PensionsBreakdownPage';
import { formatDate } from './dateFormatter';
import { FormattingUtils } from './formatting';

/**
 * Shared type
 */
export type ArrangementData = {
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
  detailData?: { warnings?: string[] };
};

export class MatchingPensionArrangement {
  private static assertPensionTypeMatches(
    pensionTypeText: string,
    data: ArrangementData,
  ) {
    const expectedLongLabel = data.pensionTypeData
      .toLowerCase()
      .replaceAll(' pension', '')
      .trim();
    const expectedShortCode = (data.type ?? '').toLowerCase().trim();
    const expectedCandidates = [expectedLongLabel, expectedShortCode].filter(
      Boolean,
    );

    expect(
      expectedCandidates.some((expectedType) =>
        pensionTypeText.toLowerCase().includes(expectedType),
      ),
      `Expected pension type "${pensionTypeText}" to include one of: ${expectedCandidates.join(
        ', ',
      )}`,
    ).toBe(true);
  }

  static findMatchingArrangement(
    pensionPolicies: { pensionArrangements: any[] }[],
    schemeNameOnCard: string,
  ) {
    return pensionPolicies
      .flatMap((p) => p.pensionArrangements)
      .find((a: any) => a.schemeName === schemeNameOnCard);
  }

  static findComponent(
    matchingArrangement: {
      benefitIllustrations?: { illustrationComponents?: any[] }[];
    },
    illustrationType: string,
  ) {
    return matchingArrangement.benefitIllustrations
      ?.flatMap((i: any) => i.illustrationComponents)
      ?.find((c: any) => c.illustrationType === illustrationType);
  }

  static formatDisplayAmount(amount: number | null): string {
    return FormattingUtils.formatDisplayAmount(amount);
  }

  static findEarliestDate(
    ...dates: (string | undefined | null)[]
  ): string | undefined {
    const validDates = dates
      .filter((date) => date && date.trim() !== '')
      .map((date) => new Date(date))
      .filter((date) => !Number.isNaN(date.getTime()));

    if (validDates.length === 0) {
      return undefined;
    }

    return validDates
      .reduce((earliest, current) => (current < earliest ? current : earliest))
      .toISOString()
      .split('T')[0];
  }

  private static async getCommonCardText(pensionCard: any) {
    return {
      pensionTypeText: await pensionBreakdownPage.pensionCardType(pensionCard),
      pensionProviderText: (
        await pensionBreakdownPage.administratorName(pensionCard)
      ).toLowerCase(),
      employerNameText: await pensionBreakdownPage.employerName(pensionCard),
      pensionStatusText: await pensionBreakdownPage.pensionStatus(pensionCard),
    };
  }

  private static assertCommonCardDetails(
    schemeNameOnCard: string,
    data: ArrangementData,
    cardText: {
      pensionTypeText: string;
      pensionProviderText: string;
      employerNameText: string;
      pensionStatusText: string;
    },
  ) {
    expect(schemeNameOnCard).toContain(data.matchingArrangement.schemeName);
    this.assertPensionTypeMatches(cardText.pensionTypeText, data);
    expect(
      FormattingUtils.normalizeText(cardText.pensionProviderText),
    ).toContain(data.expectedProviderName);
    this.assertEmployerName(
      cardText.employerNameText,
      data.expectedEmployerName,
    );
    this.assertPensionStatus(
      cardText.pensionStatusText,
      data.pensionStatusData,
    );
  }

  private static assertEmployerName(
    employerNameText: string,
    expectedEmployerName: string,
  ) {
    if (employerNameText && expectedEmployerName) {
      expect(expectedEmployerName).toContain(employerNameText.toLowerCase());
    }
  }

  private static assertPensionStatus(
    pensionStatusText: string,
    expectedPensionStatus: string,
  ) {
    if (pensionStatusText && expectedPensionStatus) {
      expect(pensionStatusText).toContain(expectedPensionStatus);
    }
  }

  private static async getRetirementDateText(
    pensionCard: any,
  ): Promise<string> {
    const retirementDate = await pensionBreakdownPage.retirementDate(
      pensionCard,
    );
    return retirementDate ? formatDate(retirementDate, 'YYYY-MM-DD') : '--';
  }

  private static parseDate(value?: string | null): Date | null {
    if (!value) return null;
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  private static isEarlierDate(
    leftDate?: string | null,
    rightDate?: string | null,
  ): boolean {
    const parsedLeftDate = this.parseDate(leftDate);
    const parsedRightDate = this.parseDate(rightDate);
    return Boolean(
      parsedLeftDate && parsedRightDate && parsedLeftDate < parsedRightDate,
    );
  }

  private static getEarlierDate(
    leftDate?: string | null,
    rightDate?: string | null,
  ): string | null | undefined {
    const parsedLeftDate = this.parseDate(leftDate);
    const parsedRightDate = this.parseDate(rightDate);
    if (!parsedLeftDate) return rightDate;
    if (!parsedRightDate) return leftDate;
    return parsedLeftDate < parsedRightDate ? leftDate : rightDate;
  }

  private static getExpectedRetirementDateData(data: ArrangementData) {
    const eriPayableDate = data.eriComponent?.payableDetails?.payableDate;
    const apPayableDate = data.apComponent?.payableDetails?.payableDate;
    const cardRetirementDate =
      data.matchingArrangement.cardData?.retirementDate;

    if (data.matchingArrangement.hasMultipleTranches) {
      return cardRetirementDate;
    }
    if (eriPayableDate) {
      return this.getEarlierDate(eriPayableDate, cardRetirementDate);
    }
    if (this.isEarlierDate(apPayableDate, cardRetirementDate)) {
      return apPayableDate;
    }

    return cardRetirementDate;
  }

  private static async getEstimatedIncomeText(
    pensionCard: any,
  ): Promise<string> {
    return pensionBreakdownPage.estimatedIncome(pensionCard);
  }

  private static assertEstimatedIncomeForCard(
    estimatedIncomeText: string,
    data: ArrangementData,
  ) {
    if (data.matchingArrangement.hasMultipleTranches) {
      expect(estimatedIncomeText).toBe('See details');
      return;
    }
    if (data.eriMonthlyAmountData === null) {
      expect(estimatedIncomeText).toBe('--a month');
      return;
    }

    this.assertNormalizedEstimatedIncome(estimatedIncomeText, data);
  }

  private static assertNormalizedEstimatedIncome(
    estimatedIncomeText: string,
    data: ArrangementData,
  ) {
    const normalizedIncomeText =
      FormattingUtils.normalizePennies(estimatedIncomeText);
    const isPlaceholderIncome = normalizedIncomeText.includes('--');
    const isExpectedZeroIncome = data.estimatedIncomeData === '£0.00a month';

    if (isPlaceholderIncome && isExpectedZeroIncome) {
      expect(normalizedIncomeText).toBe('--a month');
      return;
    }

    expect(normalizedIncomeText).toBe(data.estimatedIncomeData);
  }

  private static assertStatePensionType(
    pensionTypeText: string,
    data: ArrangementData,
  ) {
    expect(pensionTypeText.toLowerCase()).toContain(
      data.pensionTypeData.toLowerCase(),
    );
  }

  private static getFormattedRetirementDateData(data: ArrangementData): string {
    return data.formattedRetirementDate
      ? formatDate(data.formattedRetirementDate, 'YYYY-MM-DD')
      : '--';
  }

  private static assertStatePensionEstimatedIncome(
    estimatedIncomeText: string,
    data: ArrangementData,
  ) {
    if (data.eriMonthlyAmountData == null || data.eriMonthlyAmountData === 0) {
      expect(estimatedIncomeText).toBe('--a month');
      return;
    }

    const normalizedIncomeText =
      FormattingUtils.normalizePennies(estimatedIncomeText);
    expect(normalizedIncomeText).toBe(data.estimatedIncomeData);
  }

  static async verifyWithEstimatedIncomeCard(
    page: Page,
    pensionCard: any,
    schemeNameOnCard: string,
    data: ArrangementData,
  ) {
    const cardText = await this.getCommonCardText(pensionCard);
    const expectedRetirementDateText = await this.getRetirementDateText(
      pensionCard,
    );
    const estimatedIncomeText = await this.getEstimatedIncomeText(pensionCard);

    cardText.pensionTypeText = cardText.pensionTypeText.toLowerCase();
    this.assertCommonCardDetails(schemeNameOnCard, data, cardText);
    expect(expectedRetirementDateText).toBe(
      this.getExpectedRetirementDateData(data),
    );
    this.assertEstimatedIncomeForCard(estimatedIncomeText, data);
  }

  static async verifyWithoutEstimatedIncomeCard(
    page: Page,
    pensionCard: any,
    schemeNameOnCard: string,
    data: ArrangementData,
  ) {
    const cardText = await this.getCommonCardText(pensionCard);
    this.assertCommonCardDetails(schemeNameOnCard, data, cardText);
  }

  static async verifyStatePensionCard(
    page: Page,
    pensionCard: any,
    schemeNameOnCard: string,
    data: ArrangementData,
  ) {
    const pensionTypeText = await pensionBreakdownPage.pensionCardType(
      pensionCard,
    );
    const expectedRetirementDateText = await this.getRetirementDateText(
      pensionCard,
    );
    const estimatedIncomeText = await this.getEstimatedIncomeText(pensionCard);

    this.assertStatePensionType(pensionTypeText, data);
    expect(schemeNameOnCard).toContain(data.matchingArrangement.schemeName);
    expect(expectedRetirementDateText).toBe(
      this.getFormattedRetirementDateData(data),
    );
    this.assertStatePensionEstimatedIncome(estimatedIncomeText, data);
  }
}
