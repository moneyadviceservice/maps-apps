import { isCashBalanceLumpSum } from '.';
import { MatchType, PensionType } from '../../constants';
import { PensionArrangement } from '../../types';

const baseArrangement = {
  matchType: MatchType.DEFN,
  pensionType: PensionType.CB,
  detailData: {},
} as PensionArrangement;

describe('isCashBalanceLumpSum', () => {
  it('returns true for a cash balance lump sum', () => {
    expect(
      isCashBalanceLumpSum({
        ...baseArrangement,
        detailData: {
          standardPayment: {
            lumpSumAmount: 10000,
            hasAnyValues: true,
          },
        },
      }),
    ).toBe(true);
  });

  it('returns false when there is a lump sum but it is not a CB pension type', () => {
    expect(
      isCashBalanceLumpSum({
        ...baseArrangement,
        pensionType: PensionType.DB,
        detailData: {
          standardPayment: {
            lumpSumAmount: 10000,
            hasAnyValues: true,
          },
        },
      }),
    ).toBe(false);
  });

  it('returns false when the standard lump sum amount is zero', () => {
    expect(
      isCashBalanceLumpSum({
        ...baseArrangement,
        detailData: {
          standardPayment: {
            lumpSumAmount: 0,
            hasAnyValues: false,
          },
        },
      }),
    ).toBe(false);
  });

  it('returns false when there are no available summary payments', () => {
    expect(isCashBalanceLumpSum(baseArrangement)).toBe(false);
  });
});
