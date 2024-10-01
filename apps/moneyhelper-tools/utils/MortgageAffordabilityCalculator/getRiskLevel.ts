import {
  ExpenseFieldKeys,
  IncomeFieldKeys,
} from 'data/mortgage-affordability/step';
import {
  calculateMonthlyPayment,
  calculateRiskLevel,
  calculateRiskPercentage,
} from './calculateResultValues';
import { ResultFieldKeys } from 'data/mortgage-affordability/results';
import { convertStringToNumber } from 'utils/convertStringToNumber';

export const getRiskLevel = (
  resultData: Record<ResultFieldKeys, string>,
  expenseFields: ExpenseFieldKeys[],
  incomeFields: IncomeFieldKeys[],
  formData: Record<string, string>,
) => {
  const monthlyPayment = calculateMonthlyPayment(
    convertStringToNumber(resultData[ResultFieldKeys.BORROW_AMOUNT]),
    convertStringToNumber(resultData.interest),
    convertStringToNumber(resultData.term),
  );

  const riskPercentage = calculateRiskPercentage(
    expenseFields,
    incomeFields,
    monthlyPayment,
    formData,
  );

  return calculateRiskLevel(riskPercentage);
};
