import {
  BenefitType,
  CalculationMethod,
  IllustrationType,
  NO_DATA,
  RecurringAmountType,
  UnavailableReason,
} from '../../constants';
import {
  BenefitIllustration,
  BenefitIllustrationComponent,
  RecurringIncomeDetails,
} from '../../types';
import { processBenefitIllustrations } from './processBenefitIllustrations';

describe('processBenefitIllustrations', () => {
  const createMockBenefitIllustration = (
    components: BenefitIllustrationComponent[],
  ): BenefitIllustration => ({
    illustrationComponents: components,
    illustrationDate: '2023-01-01',
  });

  const createMockComponent = (
    illustrationType: IllustrationType,
    monthlyAmount: number,
    unavailableReason?: UnavailableReason,
  ): BenefitIllustrationComponent => ({
    illustrationType,
    benefitType: BenefitType.DC,
    calculationMethod: CalculationMethod.BS,
    payableDetails: {
      amountType: RecurringAmountType.INC,
      annualAmount: monthlyAmount * 12,
      monthlyAmount,
      payableDate: '2023-01-01',
      increasing: false,
    } as RecurringIncomeDetails,
    unavailableReason,
  });

  describe('when ERI is available', () => {
    it('should return ERI values when available', () => {
      const mockComponents = [createMockComponent(IllustrationType.ERI, 1000)];
      const mockBenefitIllustrations = [
        createMockBenefitIllustration(mockComponents),
      ];

      const result = processBenefitIllustrations(mockBenefitIllustrations);

      expect(result.monthlyAmount).toBe('£1,000');
      expect(result.unavailableCode).toBeUndefined();
      expect(result.illustration).toBe(
        mockBenefitIllustrations[0].illustrationComponents[0],
      );
    });
  });

  describe('when ERI is unavailable with DB code and AP is available', () => {
    it('should return AP values when ERI is unavailable with DB code', () => {
      const mockComponents = [
        createMockComponent(IllustrationType.ERI, 0, UnavailableReason.DB),
        createMockComponent(IllustrationType.AP, 800),
      ];
      const mockBenefitIllustrations = [
        createMockBenefitIllustration(mockComponents),
      ];

      const result = processBenefitIllustrations(mockBenefitIllustrations);

      expect(result.monthlyAmount).toBe('£800');
      expect(result.unavailableCode).toBe(UnavailableReason.DB);
      expect(result.illustration).toBe(
        mockBenefitIllustrations[0].illustrationComponents[1],
      );
    });

    it('should return NO_DATA when ERI is unavailable with DB code but AP amount is 0', () => {
      const mockComponents = [
        createMockComponent(IllustrationType.ERI, 0, UnavailableReason.DB),
        createMockComponent(IllustrationType.AP, 0),
      ];
      const mockBenefitIllustrations = [
        createMockBenefitIllustration(mockComponents),
      ];

      const result = processBenefitIllustrations(mockBenefitIllustrations);

      expect(result.monthlyAmount).toBe(NO_DATA);
      expect(result.unavailableCode).toBe(UnavailableReason.DB);
    });
  });

  describe('when ERI is unavailable with non-DB code', () => {
    it('should return NO_DATA when ERI is unavailable with non-DB code even if AP is available', () => {
      const mockComponents = [
        createMockComponent(IllustrationType.ERI, 0, UnavailableReason.ANO),
        createMockComponent(IllustrationType.AP, 800),
      ];
      const mockBenefitIllustrations = [
        createMockBenefitIllustration(mockComponents),
      ];

      const result = processBenefitIllustrations(mockBenefitIllustrations);

      expect(result.monthlyAmount).toBe(NO_DATA);
      expect(result.unavailableCode).toBe(UnavailableReason.ANO);
    });
  });

  describe('when no benefit illustrations are provided', () => {
    it('should return NO_DATA when benefitIllustrations is undefined', () => {
      const result = processBenefitIllustrations(undefined);

      expect(result.monthlyAmount).toBe(NO_DATA);
      expect(result.unavailableCode).toBeUndefined();
    });

    it('should return NO_DATA when benefitIllustrations is empty array', () => {
      const result = processBenefitIllustrations([]);

      expect(result.monthlyAmount).toBe(NO_DATA);
      expect(result.unavailableCode).toBeUndefined();
    });
  });

  describe('when only AP is available', () => {
    it('should return NO_DATA when only AP is available without ERI', () => {
      const mockComponents = [createMockComponent(IllustrationType.AP, 800)];
      const mockBenefitIllustrations = [
        createMockBenefitIllustration(mockComponents),
      ];

      const result = processBenefitIllustrations(mockBenefitIllustrations);

      expect(result.monthlyAmount).toBe(NO_DATA);
      expect(result.unavailableCode).toBeUndefined();
    });
  });
});
