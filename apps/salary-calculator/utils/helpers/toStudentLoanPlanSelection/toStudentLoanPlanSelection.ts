import { StudentLoanPlanSelection } from 'utils/deductions/studentLoan';

import { StudentLoans } from '../../../types';

export function toStudentLoanPlanSelection(
  loans: StudentLoans,
): StudentLoanPlanSelection {
  return [
    loans.plan1 ?? false,
    loans.plan2 ?? false,
    loans.plan4 ?? false,
    loans.plan5 ?? false,
    loans.planPostGrad ?? false,
  ];
}
