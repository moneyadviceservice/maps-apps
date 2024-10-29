import { calculateTotal } from './calculateTotal';
import { SummaryItem } from 'components/TabSummaryWidget';

describe('calculateTotal', () => {
  it('should correctly add values for items with calc type "add"', () => {
    const summaryItems: SummaryItem[] = [
      { value: 10, calc: 'add', label: '', unit: '' },
      { value: 20, calc: 'add', label: '', unit: '' },
      { value: 5, calc: 'add', label: '', unit: '' },
    ];

    const result = calculateTotal(summaryItems);

    // Total = 10 + 20 + 5 = 35
    expect(result).toBe(35);
  });

  it('should correctly subtract values for items with calc type "sub"', () => {
    const summaryItems: SummaryItem[] = [
      { value: 30, calc: 'add', label: '', unit: '' },
      { value: 15, calc: 'sub', label: '', unit: '' },
      { value: 5, calc: 'sub', label: '', unit: '' },
    ];

    const result = calculateTotal(summaryItems);

    // Total = 30 - 15 - 5 = 10
    expect(result).toBe(10);
  });

  it('should ignore items with calc type "exclude"', () => {
    const summaryItems: SummaryItem[] = [
      { value: 10, calc: 'add', label: '', unit: '' },
      { value: 20, calc: 'exclude', label: '', unit: '' },
      { value: 5, calc: 'add', label: '', unit: '' },
    ];

    const result = calculateTotal(summaryItems);

    // Total = 10 + 5 = 15 (20 is excluded)
    expect(result).toBe(15);
  });

  it('should not affect total for items with calc type "result"', () => {
    const summaryItems: SummaryItem[] = [
      { value: 10, calc: 'add', label: '', unit: '' },
      { value: 5, calc: 'result', label: '', unit: '' },
      { value: 20, calc: 'add', label: '', unit: '' },
    ];

    const result = calculateTotal(summaryItems);

    // Total = 10 + 20 = 30 (5 is ignored)
    expect(result).toBe(30);
  });

  it('should handle unknown calc types by excluding them from the total', () => {
    const summaryItems: SummaryItem[] = [
      { value: 10, calc: 'add', label: '', unit: '' },
      { value: 15, calc: undefined, label: '', unit: '' },
      { value: 5, calc: 'add', label: '', unit: '' },
    ];

    const result = calculateTotal(summaryItems);

    // Total = 10 + 5 = 15 (15 is ignored because calc type is unknown)
    expect(result).toBe(15);
  });

  it('should handle an empty array', () => {
    const summaryItems: SummaryItem[] = [];

    const result = calculateTotal(summaryItems);

    // Total = 0 (empty array)
    expect(result).toBe(0);
  });
});
