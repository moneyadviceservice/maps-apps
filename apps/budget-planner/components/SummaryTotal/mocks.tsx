import NumberFormat from '@maps-react/common/components/NumberFormat';

export const background = 'bg-green-700';
interface Item {
  label: string;
  value: JSX.Element;
  isEstimate: boolean;
}

const createItem = (
  label: string,
  value: number,
  direction?: 'increase' | 'decrease',
  isEstimate = false,
): Item => ({
  label,
  value: (
    <NumberFormat
      prefix="£"
      renderText={(value) => <b>{value}</b>}
      value={value}
      direction={direction}
    />
  ),
  isEstimate,
});

export const items: Item[] = [
  createItem('Income', 1000),
  createItem('Spending', 200),
];

export const itemsNeutral: Item[] = [
  createItem('Income', 1000),
  createItem('Spending', 1000),
];

export const itemsNegative: Item[] = [
  createItem('Income', 1000),
  createItem('Spending', Math.abs(-1200)),
];

export const itemsIncrease: Item[] = [
  createItem('Your income', 1400),
  createItem('Your budget now', 1100),
  createItem('Your new budget', 1100, 'increase'),
];

export const itemsDecrease: Item[] = [
  createItem('Your income', 1400),
  createItem('Your budget now', 1100),
  createItem('Your new budget', 980, 'decrease'),
];

export const itemsWithEstimate: Item[] = [
  createItem('Estimated Income', 1000, undefined, true),
  createItem('Estimated Spending', 200, undefined, true),
];
