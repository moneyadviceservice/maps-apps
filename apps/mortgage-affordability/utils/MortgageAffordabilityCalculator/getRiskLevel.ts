import { ResultFieldKeys } from 'data/mortgage-affordability/results';
import {
  ExpenseFieldKeys,
  IncomeFieldKeys,
} from 'data/mortgage-affordability/step';

import { convertStringToNumber } from '@maps-react/pension-tools/utils/convertStringToNumber';

import {
  calculateMonthlyPayment,
  calculateRiskLevel,
  calculateRiskPercentage,
} from './calculateResultValues';

export const getRiskLevel = (
  resultData: Record<ResultFieldKeys, string>,
  expenseFields: ExpenseFieldKeys[],
  incomeFields: IncomeFieldKeys[],
  formData: Record<string, string>,
) => {
  const monthlyPayment = calculateMonthlyPayment(
    convertStringToNumber(resultData[ResultFieldKeys.BORROW_AMOUNT]),
    convertStringToNumber(resultData[ResultFieldKeys.INTEREST]),
    convertStringToNumber(resultData[ResultFieldKeys.TERM]),
  );

  const riskPercentage = calculateRiskPercentage(
    expenseFields,
    incomeFields,
    monthlyPayment,
    formData,
  );

  return calculateRiskLevel(Math.min(100, riskPercentage));
};
