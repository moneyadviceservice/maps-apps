import currency from 'currency.js';

import { Currency } from '../../components/CompareAccounts/CompareAccounts';

interface CurrencyObject {
  code: string;
  base: number;
  exponent: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isCurrencyObject = (obj: any): obj is CurrencyObject => {
  return (
    obj &&
    typeof obj.code === 'string' &&
    typeof obj.base === 'number' &&
    typeof obj.exponent === 'number'
  );
};

const formatMoney = (
  money: Currency | number | string | null | undefined,
): string => {
  if (money === null || money === undefined) {
    return '';
  }

  if (money instanceof currency) {
    return money.format();
  }

  if (typeof money === 'string' || typeof money === 'number') {
    return currency(money, {
      symbol: '£',
      precision: 2,
    }).format();
  }

  if (
    typeof money === 'object' &&
    money !== null &&
    'amount' in money &&
    'scale' in money
  ) {
    if (isCurrencyObject(money.currency)) {
      const currencyCode = money.currency.code || 'GBP';

      return currency(money.amount / 10 ** money.scale, {
        symbol: currencyCode === 'GBP' ? '£' : currencyCode,
        precision: 2,
      }).format();
    }
  }

  return currency(0, {
    symbol: '£',
    precision: 2,
  }).format();
};

export default formatMoney;
