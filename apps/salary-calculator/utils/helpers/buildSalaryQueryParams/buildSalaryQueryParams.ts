import { SalaryFormData } from 'components/SalaryForm';

export const buildSalaryQueryParams = (
  salary: SalaryFormData,
  prefix = '',
): string => {
  const params = [
    `${prefix}grossIncome=${salary.grossIncome}`,
    `${prefix}grossIncomeFrequency=${salary.grossIncomeFrequency}`,
    `${prefix}taxCode=${salary.taxCode}`,
    `${prefix}pensionType=${salary.pensionType}`,
    `${prefix}pensionValue=${salary.pensionValue}`,
    `${prefix}isBlindPerson=${salary.isBlindPerson}`,
    `${prefix}hoursPerWeek=${salary.hoursPerWeek}`,
    `${prefix}daysPerWeek=${salary.daysPerWeek}`,
    `${prefix}plan1=${salary.studentLoans?.plan1 ?? false}`,
    `${prefix}plan2=${salary.studentLoans?.plan2 ?? false}`,
    `${prefix}plan4=${salary.studentLoans?.plan4 ?? false}`,
    `${prefix}plan5=${salary.studentLoans?.plan5 ?? false}`,
    `${prefix}planPostGrad=${salary.studentLoans?.planPostGrad ?? false}`,
    `${prefix}country=${salary.country}`,
    `${prefix}isOverStatePensionAge=${salary.isOverStatePensionAge}`,
  ];

  return params.join('&');
};
