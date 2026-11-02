import { FormData } from '../../../../types/forms';

// key is split into 2 - an input and select ${key}-i ${key}-s
export const calculateCurrencyPerMonth = (
  key: string,
  formData: FormData,
  amount: string,
  months: number,
  defaultSelectValue?: string | number,
) => {
  const selectKey = `${key.slice(0, -2)}-s`; // remove -i for input and add -s for select
  const selectedDays = Number(formData[selectKey] ?? defaultSelectValue);
  const monthlyAmount = (Number(amount) / selectedDays) * 30;
  const totalAmount = monthlyAmount * Number(months);

  return `${totalAmount}`;
};
