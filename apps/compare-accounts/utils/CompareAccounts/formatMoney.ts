import currency from 'currency.js';
import { DineroSnapshot } from 'dinero.js';

interface Currency {
  amount: number;
  currency: CurrencyObject | string;
  scale: number;
}

interface CurrencyObject {
  code: string;
  base: number;
  exponent: number;
}

type FeeType = DineroSnapshot<number> | string | null;
type CurrencyInstance = ReturnType<typeof currency>;

const isCurrencyObject = (obj: unknown): obj is CurrencyObject => {
  return (
    Boolean(obj) &&
    typeof obj === 'object' &&
    obj !== null &&
    'code' in obj &&
    'base' in obj &&
    'exponent' in obj &&
    typeof (obj as CurrencyObject).code === 'string' &&
    typeof (obj as CurrencyObject).base === 'number' &&
    typeof (obj as CurrencyObject).exponent === 'number'
  );
};

const formatMoney = (
  money:
    | Currency
    | CurrencyInstance
    | FeeType
    | number
    | string
    | null
    | undefined,
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
    'scale' in money &&
    'currency' in money
  ) {
    let currencyCode: string;

    if (typeof money.currency === 'string') {
      currencyCode = money.currency || 'GBP';
    } else if (isCurrencyObject(money.currency)) {
      currencyCode = money.currency.code || 'GBP';
    } else {
      return currency(0, {
        symbol: '£',
        precision: 2,
      }).format();
    }

    return currency(money.amount / 10 ** money.scale, {
      symbol: currencyCode === 'GBP' ? '£' : currencyCode,
      precision: 2,
    }).format();
  }

  return currency(0, {
    symbol: '£',
    precision: 2,
  }).format();
};

export default formatMoney;
