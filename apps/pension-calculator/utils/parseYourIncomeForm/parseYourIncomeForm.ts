import { parseFrequency } from 'data/frequency';
import {
  defaultYourIncomeData,
  emptyOtherIncomeRow,
  MAX_OTHER_INCOME_ROWS,
  type OtherIncomeRow,
  type YourIncomeData,
} from 'types/income';
import { asString } from 'utils/formValue';
import {
  GROSS_PAY_FREQUENCY_ID,
  GROSS_PAY_ID,
  OTHER_INCOME_COUNT_NAME,
  otherIncomeAmountId,
  otherIncomeFrequencyId,
  otherIncomeNameId,
} from 'utils/incomeFieldIds';

const isStructuredIncomeBody = (
  body: Record<string, unknown>,
): body is YourIncomeData & Record<string, unknown> =>
  Array.isArray(body.otherIncome);

export const parseYourIncomeForm = (
  body: Record<string, unknown>,
): YourIncomeData => {
  if (isStructuredIncomeBody(body)) {
    const otherIncome = body.otherIncome
      .slice(0, MAX_OTHER_INCOME_ROWS)
      .map((row) => ({
        name: asString(row?.name),
        amount: asString(row?.amount),
        frequency: parseFrequency(asString(row?.frequency)),
      }));

    return {
      grossPay: asString(body.grossPay),
      grossPayFrequency: parseFrequency(asString(body.grossPayFrequency)),
      otherIncome:
        otherIncome.length > 0 ? otherIncome : [emptyOtherIncomeRow()],
    };
  }

  const count = Math.min(
    Math.max(Number(asString(body[OTHER_INCOME_COUNT_NAME])) || 1, 1),
    MAX_OTHER_INCOME_ROWS,
  );

  const otherIncome: OtherIncomeRow[] = [];
  for (let index = 0; index < count; index += 1) {
    otherIncome.push({
      name: asString(body[otherIncomeNameId(index)]),
      amount: asString(body[otherIncomeAmountId(index)]),
      frequency: parseFrequency(asString(body[otherIncomeFrequencyId(index)])),
    });
  }

  return {
    grossPay: asString(body[GROSS_PAY_ID]),
    grossPayFrequency: parseFrequency(asString(body[GROSS_PAY_FREQUENCY_ID])),
    otherIncome,
  };
};

export const ensureYourIncomeDefaults = (
  data?: YourIncomeData | null,
): YourIncomeData => {
  if (!data) {
    return defaultYourIncomeData();
  }

  return {
    grossPay: data.grossPay ?? '',
    grossPayFrequency: parseFrequency(data.grossPayFrequency),
    otherIncome:
      data.otherIncome?.length > 0
        ? data.otherIncome.map((row) => ({
            name: row.name ?? '',
            amount: row.amount ?? '',
            frequency: parseFrequency(row.frequency),
          }))
        : [emptyOtherIncomeRow()],
  };
};
