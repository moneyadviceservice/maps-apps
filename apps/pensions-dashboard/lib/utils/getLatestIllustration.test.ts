import {
  AmountNotProvidedReason,
  BenefitType,
  CalculationMethod,
  IllustrationType,
  MatchType,
  PensionType,
  RecurringAmountType,
} from '../constants';
import { PensionArrangement } from '../types';
import { getLatestIllustration } from './getLatestIllustration';

/**
 * Creates a mock pension object.
 *
 * @param illustrationComponents - An array of illustration components or an array of payable details.
 * @returns A mock pension object.
 */
const createMockPension = (
  illustrationComponents:
    | {
        illustrationType: IllustrationType;
        payableDetails: {
          payableDate: string;
          reason: AmountNotProvidedReason;
        };
        benefitType: BenefitType;
        calculationMethod: CalculationMethod;
      }[]
    | {
        illustrationType: IllustrationType;
        benefitType: BenefitType;
        calculationMethod: CalculationMethod;
        payableDetails: {
          amountType: RecurringAmountType;
          annualAmount: number;
          monthlyAmount: number;
          lastPaymentDate: undefined;
          payableDate: string;
          increasing: boolean;
        };
      }[],
) => {
  return {
    benefitIllustrations: [
      {
        illustrationDate: '2023-01-01',
        illustrationComponents,
      },
    ],
    externalPensionPolicyId: '',
    externalAssetId: '',
    matchType: MatchType.DEFN,
    schemeName: '',
    contactReference: '',
    pensionType: PensionType.AVC,
    contributionsFromMultipleEmployers: false,
    pensionAdministrator: {
      name: '',
      contactMethods: [],
    },
  };
};

const mulitpleIllustrations = [
  {
    illustrationType: IllustrationType.ERI,
    payableDetails: {
      payableDate: '2023-06-01',
      reason: AmountNotProvidedReason.SML,
    },
    benefitType: BenefitType.AVC,
    calculationMethod: CalculationMethod.BS,
  },
  {
    illustrationType: IllustrationType.ERI,
    payableDetails: {
      payableDate: '2023-05-01',
      reason: AmountNotProvidedReason.SML,
    },
    benefitType: BenefitType.AVC,
    calculationMethod: CalculationMethod.BS,
  },
];

describe('getLatestIllustration', () => {
  test('should return null if there are no benefit illustrations', () => {
    const pension: PensionArrangement = createMockPension([]);
    const result = getLatestIllustration(IllustrationType.ERI, pension);
    expect(result).toBe(undefined);
  });

  test('should return the latest illustration with the earliest payable date', () => {
    const pension: PensionArrangement = createMockPension(
      mulitpleIllustrations,
    );
    const result = getLatestIllustration(IllustrationType.ERI, pension);
    expect(result).toEqual({
      benefitType: BenefitType.AVC,
      calculationMethod: CalculationMethod.BS,
      illustrationType: IllustrationType.ERI,
      payableDetails: {
        payableDate: '2023-05-01',
        reason: AmountNotProvidedReason.SML,
      },
    });
  });

  test('should return null if no illustration matches the given type', () => {
    const pension: PensionArrangement = createMockPension([
      {
        illustrationType: IllustrationType.DB,
        payableDetails: {
          payableDate: '2023-06-01',
          reason: AmountNotProvidedReason.SML,
        },
        benefitType: BenefitType.AVC,
        calculationMethod: CalculationMethod.BS,
      },
    ]);
    const result = getLatestIllustration(IllustrationType.ERI, pension);
    expect(result).toBe(undefined);
  });

  test('should handle multiple illustrations with the same date', () => {
    const pension: PensionArrangement = createMockPension(
      mulitpleIllustrations,
    );
    const result = getLatestIllustration(IllustrationType.ERI, pension);
    expect(result).toEqual({
      benefitType: BenefitType.AVC,
      calculationMethod: CalculationMethod.BS,
      illustrationType: IllustrationType.ERI,
      payableDetails: {
        payableDate: '2023-05-01',
        reason: AmountNotProvidedReason.SML,
      },
    });
  });

  test('should handle illustrations without payable details', () => {
    const pension: PensionArrangement = createMockPension([
      {
        illustrationType: IllustrationType.ERI,
        benefitType: BenefitType.AVC,
        calculationMethod: CalculationMethod.BS,
        payableDetails: {
          amountType: RecurringAmountType.INC,
          annualAmount: 0,
          monthlyAmount: 0,
          lastPaymentDate: undefined,
          payableDate: '',
          increasing: false,
        },
      },
    ]);
    const result = getLatestIllustration(IllustrationType.ERI, pension);
    expect(result).toEqual({
      benefitType: BenefitType.AVC,
      calculationMethod: CalculationMethod.BS,
      illustrationType: IllustrationType.ERI,
      payableDetails: {
        amountType: RecurringAmountType.INC,
        annualAmount: 0,
        increasing: false,
        lastPaymentDate: undefined,
        monthlyAmount: 0,
        payableDate: '',
      },
    });
  });
});
