import { calculateFrequencyAmount } from 'utils/calculations/calculateFrequencyAmount';

import { getHmrcRates } from '../../rates';
import type { Country, TaxYear } from '../../rates/types';
import {
  CombinedStudentLoanRepayment,
  StudentLoanPlanSelection,
  StudentLoanRepayment,
} from './types';

// Calculates an individual's annual student loan repayments
// Note that student loan repayments do not take into account the personal allowance in any way, it's a simple threshold system
export const calculateStudentLoanRepayments = ({
  taxYear,
  country,
  taxableAnnualIncome,
  selectedStudentLoanPlans,
}: {
  taxYear?: TaxYear;
  country?: Country;
  taxableAnnualIncome: number;
  selectedStudentLoanPlans: StudentLoanPlanSelection;
}): number => {
  const {
    STUDENT_LOAN_PLAN_1_YEARLY_THRESHOLD,
    STUDENT_LOAN_PLAN_2_YEARLY_THRESHOLD,
    STUDENT_LOAN_PLAN_4_YEARLY_THRESHOLD,
    STUDENT_LOAN_PLAN_5_YEARLY_THRESHOLD,
    STUDENT_LOAN_POSTGRAD_YEARLY_THRESHOLD,
    STUDENT_LOAN_REPAYMENT_AMOUNT,
    STUDENT_LOAN_REPAYMENT_AMOUNT_POSTGRAD,
  } = getHmrcRates({ taxYear, country });

  const THRESHOLD_VALUES = [
    STUDENT_LOAN_PLAN_1_YEARLY_THRESHOLD,
    STUDENT_LOAN_PLAN_2_YEARLY_THRESHOLD,
    STUDENT_LOAN_PLAN_4_YEARLY_THRESHOLD,
    STUDENT_LOAN_PLAN_5_YEARLY_THRESHOLD,
  ];
  let studentLoanAnnualRepayments = 0;

  // Repayments are a % of income over HMRC-specified thresholds (threshold amount depends on plan number)
  let threshold: number | undefined;

  const isPostgradPlan = selectedStudentLoanPlans[4];

  if (isPostgradPlan) {
    threshold = STUDENT_LOAN_POSTGRAD_YEARLY_THRESHOLD;
  } else {
    let lowest = Number.MAX_VALUE;

    // We only want to apply the lowest threshold
    selectedStudentLoanPlans.map((value, i) => {
      if (value) {
        if (THRESHOLD_VALUES[i] < lowest) lowest = THRESHOLD_VALUES[i];
      }
    });

    threshold = lowest;
  }

  const yearlySalary = taxableAnnualIncome;
  const repaymentAmount = isPostgradPlan
    ? STUDENT_LOAN_REPAYMENT_AMOUNT_POSTGRAD
    : STUDENT_LOAN_REPAYMENT_AMOUNT;

  if (yearlySalary > threshold) {
    studentLoanAnnualRepayments = (yearlySalary - threshold) * repaymentAmount;
  }

  return Math.floor(studentLoanAnnualRepayments);
};

export const calculateCombinedStudentLoanRepayments = ({
  taxYear,
  country,
  daysPerWeek = 5,
  taxableAnnualIncome,
  selectedStudentLoanPlans,
}: {
  taxYear?: TaxYear;
  country?: Country;
  daysPerWeek: number;
  taxableAnnualIncome: number;
  selectedStudentLoanPlans: StudentLoanPlanSelection;
}): CombinedStudentLoanRepayment => {
  const studentLoanPlanRepayments: StudentLoanRepayment = {
    undergrad: {
      selected: false,
      amount: { yearly: 0, monthly: 0, weekly: 0, daily: 0 },
    },
    postgrad: {
      selected: false,
      amount: { yearly: 0, monthly: 0, weekly: 0, daily: 0 },
    },
  };

  if (
    selectedStudentLoanPlans[0] ||
    selectedStudentLoanPlans[1] ||
    selectedStudentLoanPlans[2] ||
    selectedStudentLoanPlans[3]
  ) {
    studentLoanPlanRepayments.undergrad = {
      selected: true,
      amount: calculateFrequencyAmount({
        yearlyAmount: calculateStudentLoanRepayments({
          taxYear,
          country,
          taxableAnnualIncome,
          // We dont pass the postgrad selection here as it will always be the lowest threshold
          selectedStudentLoanPlans: selectedStudentLoanPlans
            .slice(0, -1)
            .concat(false) as StudentLoanPlanSelection,
        }),
        daysPerWeek,
        processor: (amount) => Math.floor(amount), // Round the frequency values down
      }),
    };
  }

  if (selectedStudentLoanPlans[4]) {
    studentLoanPlanRepayments.postgrad = {
      selected: true,
      amount: calculateFrequencyAmount({
        yearlyAmount: calculateStudentLoanRepayments({
          taxYear,
          country,
          taxableAnnualIncome,
          selectedStudentLoanPlans: [false, false, false, false, true],
        }),
        daysPerWeek,
        processor: (amount) => Math.floor(amount), // Round the frequency values down
      }),
    };
  }

  const studentLoanRepaymentsTotal = {
    yearly:
      studentLoanPlanRepayments.undergrad.amount.yearly +
      studentLoanPlanRepayments.postgrad.amount.yearly,
    monthly:
      studentLoanPlanRepayments.undergrad.amount.monthly +
      studentLoanPlanRepayments.postgrad.amount.monthly,
    weekly:
      studentLoanPlanRepayments.undergrad.amount.weekly +
      studentLoanPlanRepayments.postgrad.amount.weekly,
    daily:
      studentLoanPlanRepayments.undergrad.amount.daily +
      studentLoanPlanRepayments.postgrad.amount.daily,
  };

  return {
    repayments: studentLoanPlanRepayments,
    total: studentLoanRepaymentsTotal,
  };
};
