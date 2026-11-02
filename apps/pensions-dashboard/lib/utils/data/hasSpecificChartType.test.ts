import { PensionType } from '../../constants';
import { PensionArrangement } from '../../types';
import { hasSpecificChartType } from './hasSpecificChartType';

describe('hasSpecificChartType', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('returns true if at least one illustration component matches the target chartType', () => {
    const data = {
      pensionType: PensionType.HYB,
      benefitIllustrations: [
        {
          illustrationComponents: [
            { benefitType: 'DC' },
            { benefitType: 'DC' },
          ],
        },
        {
          illustrationComponents: [
            { benefitType: 'DB' },
            { benefitType: 'DB' },
          ],
        },
      ],
    } as PensionArrangement;

    const result = hasSpecificChartType(data, PensionType.DC);
    expect(result).toBe(true);
  });

  it('returns true if the fallback getCalculationType matches the target chartType', () => {
    const data = {
      pensionType: PensionType.DC,
      benefitIllustrations: undefined,
    } as PensionArrangement;

    const result = hasSpecificChartType(data, PensionType.DC);

    expect(result).toBe(true);
  });

  it('returns true and falls back to pensionType if illustrationComponents is undefined inside an illustration', () => {
    const data = {
      pensionType: PensionType.DC,
      benefitIllustrations: [{}],
    } as PensionArrangement;

    const result = hasSpecificChartType(data, PensionType.DC);
    expect(result).toBe(true);
  });

  it('returns false if no illustration components match the target chartType', () => {
    const data = {
      pensionType: PensionType.DB,
      benefitIllustrations: [
        {
          illustrationComponents: [{ benefitType: 'DBL' }],
        },
        {
          illustrationComponents: [{ benefitType: 'DB' }],
        },
      ],
    } as PensionArrangement;

    const result = hasSpecificChartType(data, PensionType.DC);
    expect(result).toBe(false);
  });

  it('returns false if the fallback getCalculationType does not match the target chartType', () => {
    const data = {
      pensionType: PensionType.DB,
      benefitIllustrations: undefined,
    } as PensionArrangement;

    const result = hasSpecificChartType(data, PensionType.DC);

    expect(result).toBe(false);
  });

  it('returns false if no pension type or benefit types', () => {
    const data = {
      pensionType: undefined,
      benefitIllustrations: undefined,
    } as PensionArrangement;

    const result = hasSpecificChartType(data, PensionType.DC);

    expect(result).toBe(false);
  });
});
