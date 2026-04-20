import { PensionType } from '../../constants';
import { BuiltIllustration } from '../../types';
import {
  sortAndCombine,
  sortByBarAmountDesc,
  sortByDonutAmountDesc,
} from './sortChartData';

describe('sortByBarAmountDesc', () => {
  it('should sort by bar.eri.annualAmount in descending order', () => {
    const items: BuiltIllustration[] = [
      { bar: { eri: { annualAmount: 1000 } } } as BuiltIllustration,
      { bar: { eri: { annualAmount: 5000 } } } as BuiltIllustration,
      { bar: { eri: { annualAmount: 3000 } } } as BuiltIllustration,
    ];

    const sorted = items.toSorted(sortByBarAmountDesc);

    expect(sorted[0].bar?.eri?.annualAmount).toBe(5000);
    expect(sorted[1].bar?.eri?.annualAmount).toBe(3000);
    expect(sorted[2].bar?.eri?.annualAmount).toBe(1000);
  });

  it('should fall back to bar.ap.annualAmount when eri is not available', () => {
    const items: BuiltIllustration[] = [
      { bar: { ap: { annualAmount: 2000 } } } as BuiltIllustration,
      { bar: { ap: { annualAmount: 6000 } } } as BuiltIllustration,
    ];

    const sorted = items.toSorted(sortByBarAmountDesc);

    expect(sorted[0].bar?.ap?.annualAmount).toBe(6000);
    expect(sorted[1].bar?.ap?.annualAmount).toBe(2000);
  });

  it('should treat missing amounts as 0', () => {
    const items: BuiltIllustration[] = [
      { bar: { eri: { annualAmount: 3000 } } } as BuiltIllustration,
      { bar: {} } as BuiltIllustration,
    ];

    const sorted = items.toSorted(sortByBarAmountDesc);

    expect(sorted[0].bar?.eri?.annualAmount).toBe(3000);
  });
});

describe('sortByDonutAmountDesc', () => {
  it('should sort by donut.eri.amount in descending order', () => {
    const items: BuiltIllustration[] = [
      { donut: { eri: { amount: 1000 } } } as BuiltIllustration,
      { donut: { eri: { amount: 5000 } } } as BuiltIllustration,
      { donut: { eri: { amount: 3000 } } } as BuiltIllustration,
    ];

    const sorted = items.toSorted(sortByDonutAmountDesc);

    expect(sorted[0].donut?.eri?.amount).toBe(5000);
    expect(sorted[1].donut?.eri?.amount).toBe(3000);
    expect(sorted[2].donut?.eri?.amount).toBe(1000);
  });

  it('should fall back to donut.ap.amount when eri is not available', () => {
    const items: BuiltIllustration[] = [
      { donut: { ap: { amount: 2000 } } } as BuiltIllustration,
      { donut: { ap: { amount: 6000 } } } as BuiltIllustration,
    ];

    const sorted = items.toSorted(sortByDonutAmountDesc);

    expect(sorted[0].donut?.ap?.amount).toBe(6000);
    expect(sorted[1].donut?.ap?.amount).toBe(2000);
  });

  it('should treat missing amounts as 0', () => {
    const items: BuiltIllustration[] = [
      { donut: { eri: { amount: 3000 } } } as BuiltIllustration,
      { donut: {} } as BuiltIllustration,
    ];

    const sorted = items.toSorted(sortByDonutAmountDesc);

    expect(sorted[0].donut?.eri?.amount).toBe(3000);
  });
});

describe('sortAndCombine', () => {
  const calcType: PensionType = PensionType.DB;

  it('should separate recurring and lump sum items', () => {
    const items: BuiltIllustration[] = [
      {
        calcType,
        bar: { eri: { annualAmount: 1000, amountType: 'INC' } },
      } as BuiltIllustration,
      {
        calcType,
        donut: { eri: { amount: 2000, amountType: 'CSH' } },
      } as BuiltIllustration,
    ];

    const result = sortAndCombine(items, calcType);

    expect(result).toHaveLength(2);
  });

  it('should filter by calcType', () => {
    const items: BuiltIllustration[] = [
      {
        calcType,
        bar: { eri: { annualAmount: 1000, amountType: 'INC' } },
      } as BuiltIllustration,
      {
        calcType: PensionType.DC,
        bar: { eri: { annualAmount: 2000, amountType: 'INC' } },
      } as BuiltIllustration,
    ];

    const result = sortAndCombine(items, PensionType.DB);

    expect(result).toHaveLength(1);
  });

  it('should sort amountType INC (includes undefined) first', () => {
    const items: BuiltIllustration[] = [
      {
        calcType,
        bar: { eri: { annualAmount: 3000, amountType: 'INCL' } },
      } as BuiltIllustration,
      {
        calcType,
        bar: { eri: { annualAmount: 2000, amountType: 'INCN' } },
      } as BuiltIllustration,
      {
        calcType,
        bar: { eri: { annualAmount: 1000, amountType: 'INC' } },
      } as BuiltIllustration,
    ];

    const result = sortAndCombine(items, calcType);

    expect(result[0].bar?.eri?.annualAmount).toBe(1000);
    expect(result[1].bar?.eri?.annualAmount).toBe(3000);
    expect(result[2].bar?.eri?.annualAmount).toBe(2000);
  });

  it('should group and sort recurring INCL correctly', () => {
    const items: BuiltIllustration[] = [
      {
        calcType,
        bar: { eri: { annualAmount: 1000, amountType: 'INC' } },
      } as BuiltIllustration,
      {
        calcType,
        bar: { eri: { annualAmount: 2000, amountType: 'INCL' } },
      } as BuiltIllustration,
    ];

    const result = sortAndCombine(items, calcType);

    expect(result[0].bar?.eri?.amountType).toBe('INC');
    expect(result[1].bar?.eri?.amountType).toBe('INCL');
  });

  it('should group and sort recurring INCN correctly', () => {
    const items: BuiltIllustration[] = [
      {
        calcType,
        bar: { eri: { annualAmount: 1000, amountType: 'INCN' } },
      } as BuiltIllustration,
    ];

    const result = sortAndCombine(items, calcType);

    expect(result[0].bar?.eri?.amountType).toBe('INCN');
  });

  it('should group and sort lump sum CSH correctly', () => {
    const items: BuiltIllustration[] = [
      {
        calcType,
        donut: { eri: { amount: 2000, amountType: 'CSHL' } },
      } as BuiltIllustration,
      {
        calcType,
        donut: { eri: { amount: 1000, amountType: 'CSH' } },
      } as BuiltIllustration,
    ];

    const result = sortAndCombine(items, calcType);

    expect(result[0].donut?.eri?.amountType).toBe('CSH');
    expect(result[1].donut?.eri?.amountType).toBe('CSHL');
  });

  it('should group and sort lump sum CSHN correctly', () => {
    const items: BuiltIllustration[] = [
      {
        calcType,
        donut: { eri: { amount: 1000, amountType: 'CSHN' } },
      } as BuiltIllustration,
    ];

    const result = sortAndCombine(items, calcType);

    expect(result[0].donut?.eri?.amountType).toBe('CSHN');
  });

  it('should handle ap-based amounts for recurring items', () => {
    const items: BuiltIllustration[] = [
      {
        calcType,
        bar: { ap: { annualAmount: 1000, amountType: 'INC' } },
      } as BuiltIllustration,
      {
        calcType,
        bar: { ap: { annualAmount: 2000, amountType: 'INCL' } },
      } as BuiltIllustration,
    ];

    const result = sortAndCombine(items, calcType);

    expect(result).toHaveLength(2);
  });

  it('should handle ap-based amounts for lump sum items', () => {
    const items: BuiltIllustration[] = [
      {
        calcType,
        donut: { ap: { amount: 1000, amountType: 'CSH' } },
      } as BuiltIllustration,
    ];

    const result = sortAndCombine(items, calcType);

    expect(result).toHaveLength(1);
  });

  it('should return empty array when no items match calcType', () => {
    const items: BuiltIllustration[] = [
      {
        calcType: PensionType.DC,
        bar: { eri: { annualAmount: 1000 } },
      } as BuiltIllustration,
    ];

    const result = sortAndCombine(items, PensionType.DB);

    expect(result).toHaveLength(0);
  });

  it('should maintain correct order across all groups', () => {
    const items: BuiltIllustration[] = [
      {
        calcType,
        bar: { eri: { annualAmount: 500, amountType: 'INCN' } },
      } as BuiltIllustration,
      {
        calcType,
        donut: { eri: { amount: 4000, amountType: 'CSHN' } },
      } as BuiltIllustration,
      {
        calcType,
        bar: { eri: { annualAmount: 1500, amountType: 'INC' } },
      } as BuiltIllustration,
      {
        calcType,
        donut: { eri: { amount: 2000, amountType: 'CSH' } },
      } as BuiltIllustration,
      {
        calcType,
        bar: { eri: { annualAmount: 1000, amountType: 'INCL' } },
      } as BuiltIllustration,
    ];

    const result = sortAndCombine(items, calcType);

    expect(result).toHaveLength(5);
    expect(result[0].bar?.eri?.amountType).toBe('INC');
    expect(result[1].bar?.eri?.amountType).toBe('INCL');
    expect(result[2].bar?.eri?.amountType).toBe('INCN');
    expect(result[3].donut?.eri?.amountType).toBe('CSH');
    expect(result[4].donut?.eri?.amountType).toBe('CSHN');
  });
});
