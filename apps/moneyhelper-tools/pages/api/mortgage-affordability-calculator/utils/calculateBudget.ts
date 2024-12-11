import {
  ExpenseFieldKeys,
  IncomeFieldKeys,
} from 'data/mortgage-affordability/step';
import { convertStringToNumber } from 'utils/convertStringToNumber';

const prefix = 'q-';

const generateTotalMonthlyIncome = (formData: Record<string, string>) => {
  let total = 0;
  const monthlyIncomeFields = [
    IncomeFieldKeys.TAKE_HOME,
    IncomeFieldKeys.SEC_TAKE_HOME,
  ];
  monthlyIncomeFields.forEach((key) => {
    total += convertStringToNumber(formData[`${prefix}${key}`]);
  });

  return total;
};

export const calculateBudget = (formData: Record<string, string>) => {
  const monthlyIncome = generateTotalMonthlyIncome(formData);
  let totalMonthlyExpense = 0;
  for (const key of Object.values(ExpenseFieldKeys)) {
    const fieldVal: number = convertStringToNumber(formData[`${prefix}${key}`]);
    totalMonthlyExpense += fieldVal;
  }

  return monthlyIncome >= totalMonthlyExpense;
};
