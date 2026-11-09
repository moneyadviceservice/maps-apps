import { LumpSumAmountType, RecurringAmountType } from '../../constants';
import { BuiltIllustration } from '../../types';
import { getChartMcCloudVariables } from './getChartMcCloudVariables';

describe('getChartMcCloudVariables', () => {
  const mockIllustration = (
    overrides?: Partial<BuiltIllustration>,
  ): BuiltIllustration =>
    ({
      donut: {
        eri: { amountType: LumpSumAmountType.CSHL },
        ap: { amountType: LumpSumAmountType.CSHL },
      },
      bar: {
        eri: { amountType: RecurringAmountType.INCL },
        ap: { amountType: RecurringAmountType.INCL },
      },
      ...overrides,
    } as BuiltIllustration);

  it('should identify donut legacy', () => {
    const item = mockIllustration({
      donut: {
        eri: { amountType: LumpSumAmountType.CSHL },
        ap: { amountType: LumpSumAmountType.CSHL },
      },
    } as BuiltIllustration);
    const result = getChartMcCloudVariables(item, 'donut');
    expect(result).toEqual({
      isMcCloud: true,
      isLegacy: true,
      isAlternative: false,
    });
  });

  it('should identify donut alternative', () => {
    const item = mockIllustration({
      donut: {
        eri: { amountType: LumpSumAmountType.CSHN },
        ap: { amountType: LumpSumAmountType.CSHN },
      },
    } as BuiltIllustration);
    const result = getChartMcCloudVariables(item, 'donut');
    expect(result).toEqual({
      isMcCloud: true,
      isLegacy: false,
      isAlternative: true,
    });
  });

  it('should identify bar legacy ', () => {
    const item = mockIllustration({
      bar: {
        eri: { amountType: RecurringAmountType.INCL },
        ap: { amountType: RecurringAmountType.INCL },
      },
    } as BuiltIllustration);
    const result = getChartMcCloudVariables(item, 'bar');
    expect(result).toEqual({
      isMcCloud: true,
      isLegacy: true,
      isAlternative: false,
    });
  });

  it('should identify bar alternative', () => {
    const item = mockIllustration({
      bar: {
        eri: { amountType: RecurringAmountType.INCN },
        ap: { amountType: RecurringAmountType.INCN },
      },
    } as BuiltIllustration);
    const result = getChartMcCloudVariables(item, 'bar');
    expect(result).toEqual({
      isMcCloud: true,
      isLegacy: false,
      isAlternative: true,
    });
  });

  describe('no mcCloud amounts', () => {
    it('should return false for all flags when no McCloud types found', () => {
      const item = mockIllustration({
        donut: {
          eri: { amountType: LumpSumAmountType.CSH },
          ap: { amountType: LumpSumAmountType.CSH },
        },
        bar: {
          eri: { amountType: RecurringAmountType.INC },
          ap: { amountType: RecurringAmountType.INC },
        },
      } as BuiltIllustration);
      const result = getChartMcCloudVariables(item, 'donut');
      expect(result).toEqual({
        isMcCloud: false,
        isLegacy: false,
        isAlternative: false,
      });
    });
  });
});
