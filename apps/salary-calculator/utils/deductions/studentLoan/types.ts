import { FrequencyAmount } from '../../calculations/calculateFrequencyAmount';

export type StudentLoanPlanSelection = [
  boolean, // Plan 1
  boolean, // Plan 2
  boolean, // Plan 4
  boolean, // Plan 5
  boolean, // Postgrad plan
];

export interface StudentLoanRepayment {
  undergrad: {
    selected: boolean;
    amount: FrequencyAmount;
  };
  postgrad: {
    selected: boolean;
    amount: FrequencyAmount;
  };
}

export interface CombinedStudentLoanRepayment {
  repayments: StudentLoanRepayment;
  total: FrequencyAmount;
}
