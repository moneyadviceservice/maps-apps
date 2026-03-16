import { DineroSnapshot } from 'dinero.js';

import { formatCurrency } from '@maps-react/pension-tools/utils/formatCurrency';

interface CurrencyObject {
  code: string;
  base: number;
  exponent: number;
}

interface Currency {
  amount: number;
  currency: CurrencyObject | string;
  scale: number;
}

type FeeType = DineroSnapshot<number> | string | null;

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
  money: Currency | FeeType | number | string | null | undefined,
): string => {
  if (money == null) return ''; // handles null and undefined

  // number or numeric string
  const numericValue =
    typeof money === 'number' || typeof money === 'string'
      ? Number(money)
      : undefined;

  if (numericValue !== undefined) {
    return Number.isFinite(numericValue)
      ? formatCurrency(numericValue)
      : formatCurrency(0);
  }

  // Dinero-like object
  if (
    typeof money === 'object' &&
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
      return formatCurrency(0); // invalid currency object
    }

    const value = money.amount / 10 ** money.scale;
    const formatted = formatCurrency(value);

    if (currencyCode !== 'GBP') {
      return formatted.replace('£', currencyCode);
    }

    return formatted;
  }

  // fallback
  return formatCurrency(0);
};

export default formatMoney;
