import { PensionType } from '../../constants';
import { PensionArrangement } from '../../types';
import { splitConfirmedPensions } from './splitConfirmedPensions';

describe('splitConfirmedPensions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createMockPension = (
    id: string,
    hasIncome: boolean,
    pensionType: PensionType,
  ) =>
    ({
      externalAssetId: id,
      hasIncome,
      schemeName: `Pension ${id}`,
      pensionType,
      pensionAdministrator: {
        name: `Provider ${id}`,
      },
    } as PensionArrangement);

  const pensionsWithIncome = [
    createMockPension('1', true, PensionType.SP),
    createMockPension('2', true, PensionType.DB),
    createMockPension('3', true, PensionType.DC),
  ];

  const pensionsWithoutIncome = [
    createMockPension('4', false, PensionType.SP),
    createMockPension('5', false, PensionType.DB),
    createMockPension('6', false, PensionType.DC),
  ];

  it('should split pensions into those with income and those without', () => {
    const allPensions = [...pensionsWithIncome, ...pensionsWithoutIncome];

    const result = splitConfirmedPensions(allPensions);

    expect(result.greenPensions).toEqual(pensionsWithIncome);
    expect(result.greenPensionsNoIncome).toEqual(pensionsWithoutIncome);
  });

  it('should handle empty input array', () => {
    const result = splitConfirmedPensions([]);

    expect(result.greenPensions).toEqual([]);
    expect(result.greenPensionsNoIncome).toEqual([]);
  });

  it('should handle array with only pensions with income', () => {
    const result = splitConfirmedPensions(pensionsWithIncome);

    expect(result.greenPensions).toEqual(pensionsWithIncome);
    expect(result.greenPensionsNoIncome).toEqual([]);
  });

  it('should handle array with only pensions without income', () => {
    const result = splitConfirmedPensions(pensionsWithoutIncome);

    expect(result.greenPensions).toEqual([]);
    expect(result.greenPensionsNoIncome).toEqual(pensionsWithoutIncome);
  });

  it('should maintain the sorted order returned by sortPensions', () => {
    const unsortedPensions = [
      createMockPension('3', true, PensionType.DC),
      createMockPension('1', true, PensionType.SP),
      createMockPension('2', true, PensionType.DB),
    ];

    const result = splitConfirmedPensions(unsortedPensions);

    expect(result.greenPensions).toEqual(pensionsWithIncome);
  });
});
