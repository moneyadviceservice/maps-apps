import { SummaryItem } from '../../../../components/TabSummaryWidget';

export const calculateTotal = (summaryItems: SummaryItem[]): number => {
  return summaryItems.reduce((total, item) => {
    switch (item.calc) {
      case 'add':
        return total + item.value;
      case 'sub':
        return total - item.value;
      case 'exclude':
        return total;
      case 'result':
        return total;
      default:
        return total;
    }
  }, 0);
};
