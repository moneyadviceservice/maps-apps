import { BenefitType, MatchType, PensionType } from '../../constants';
import { PensionArrangement } from '../../types';
import { hasAvailableSummaryValue } from './hasAvailableSummaryValue';

const baseArrangement = {
  matchType: MatchType.DEFN,
  pensionType: PensionType.DC,
  detailData: {},
} as PensionArrangement;

describe('hasAvailableSummaryValue', () => {
  it('returns true when a standard monthly payment is available', () => {
    expect(
      hasAvailableSummaryValue({
        ...baseArrangement,
        detailData: {
          standardPayment: {
            monthlyAmount: 100,
            hasAnyValues: true,
          },
        },
      }),
    ).toBe(true);
  });

  it('returns true when legacy and alternative monthly payments are available', () => {
    expect(
      hasAvailableSummaryValue({
        ...baseArrangement,
        detailData: {
          legacyPayment: {
            monthlyAmount: 100,
            hasAnyValues: true,
          },
          alternativePayment: {
            monthlyAmount: 200,
            hasAnyValues: true,
          },
        },
      }),
    ).toBe(true);
  });

  it('returns true for a cash balance lump sum', () => {
    expect(
      hasAvailableSummaryValue({
        ...baseArrangement,
        pensionType: PensionType.CB,
        detailData: {
          standardPayment: {
            lumpSumAmount: 10000,
            benefitType: BenefitType.CBL,
            hasAnyValues: true,
          },
        },
      }),
    ).toBe(true);
  });

  it('returns false when there are no available summary payments', () => {
    expect(hasAvailableSummaryValue(baseArrangement)).toBe(false);
  });

  it('returns false when the standard monthly amount is zero', () => {
    expect(
      hasAvailableSummaryValue({
        ...baseArrangement,
        detailData: {
          standardPayment: {
            monthlyAmount: 0,
            hasAnyValues: false,
          },
        },
      }),
    ).toBe(false);
  });

  it('returns false for SYS and NEW matches even when a value is present', () => {
    const arrangement = {
      ...baseArrangement,
      detailData: {
        standardPayment: {
          monthlyAmount: 100,
          hasAnyValues: true,
        },
      },
    };

    expect(
      hasAvailableSummaryValue({
        ...arrangement,
        matchType: MatchType.SYS,
      }),
    ).toBe(false);

    expect(
      hasAvailableSummaryValue({
        ...arrangement,
        matchType: MatchType.NEW,
      }),
    ).toBe(false);
  });
});
